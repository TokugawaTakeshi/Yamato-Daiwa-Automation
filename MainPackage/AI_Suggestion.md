I'll look at the package, Webpack and TypeScript config, and where imagemin is used before suggesting anything.

I've finished investigating. Below is the cause and the fix I suggest. I haven't changed any code.

## Cause

The trigger is a top-level `await` inside `gulp-imagemin@9.2.0` itself. Being ESM-only is not the problem. These lines are at the end of `node_modules/gulp-imagemin/index.js`:

```js
export const gifsicle = await exposePlugin('gifsicle');
export const mozjpeg  = await exposePlugin('mozjpeg');
export const optipng  = await exposePlugin('optipng');
export const svgo     = await exposePlugin('svgo');
```

The chain on the consuming project's side:

1. **TypeScript layer:** `tsconfig.json` uses `module: "nodenext"` and `package.json` has no `"type"`, so `Source/**/*.ts` compiles as CommonJS. `import gulpImagemin from "gulp-imagemin"` becomes a `require`.
2. **Webpack layer:** `webpack-node-externals` marks the package as a `commonjs` external, so `EntryPoint.js` contains `e.exports=require("gulp-imagemin")`.
3. **Node layer:** Node 24 can `require()` an ESM module, but only one with no top-level `await` anywhere in its graph. That is exactly `ERR_REQUIRE_ASYNC_MODULE`.

I tested the other packages with a plain CommonJS `require()` on your Node v24.19.0. All of them load fine: `imagemin`, `imagemin-pngquant@10`, `imagemin-mozjpeg`, `imagemin-svgo`, `imagemin-gifsicle`, `imagemin-optipng` and `gulp-plugin-extras`. **`gulp-imagemin` is the only one that can't be loaded with `require()`.**

You're also right that `"type": "module"` would not help. It would break `@yamato-daiwa/automation`'s own build, and it doesn't address the real problem anyway.

## Solution A (recommended): keep Comm

onJS, load `gulp-imagemin` with a native `import()`

A native dynamic `import()` works from a CommonJS file even when the target uses top-level `await`. Each layer needs one change:

| Layer | Change |
|---|---|
| **Source** | In `ImagesProcessor.ts`, replace the static `import gulpImagemin from "gulp-imagemin"` with `await import("gulp-imagemin")`. With `module: "nodenext"`, TypeScript leaves a dynamic `import()` as is even in CommonJS output. |
| **Webpack** | Add an explicit external with the `import` type, placed before `NodeExternalsPlugin(...)`: `externals: [ { "gulp-imagemin": "import gulp-imagemin" }, NodeExternalsPlugin({...}) ]`. Without this, Webpack rewrites `import()` into `Promise.resolve().then(() => require(...))` and the error comes back. With it, `EntryPoint.js` keeps a real `import("gulp-imagemin")`. |
| **package.json** | No change to `"type"`. |

The import is async, but the pipeline is built synchronously in `ProjectBuilder.ts:133`. To handle that:

- Add a static method such as `ImagesProcessor.loadESM_Dependencies(): Promise<void>` that awaits the import and stores the module in a static field.
- Run it as a small async Gulp task in the `Gulp.series` right before `provideImagesProcessingIfMust` (or once at startup).
- `gulpImagemin(...)` is only called inside the function that `processAssets` returns, which runs at task time. By then the field is filled, so the pipeline and the incremental-rebuild watcher code stay as they are.

## Solution B: drop `gulp-imagemin` and write a small transform on `imagemin`

The core packages are already installed as `gulp-imagemin`'s dependencies and load synchronously. That means a small object-mode transform over `imagemin.buffer(file.contents, { plugins: [ mozjpeg(), gifsicle(), svgo(), pngQuant() ] })` removes the problem entirely. You get no async loading and no Webpack special case, and `gulp-imagemin` is about 90 lines anyway. The cost is maintaining that small wrapper yourself.

## Changes needed with either solution

- **API change in v9:** `gulpImagemin.mozjpeg / .gifsicle / .svgo` are no longer properties of the default export. In v9 they are named exports (`mozjpeg`, `gifsicle`, `svgo`). With Solution B you'd import `imagemin-mozjpeg` and the others directly.
- **Types:** `gulp-imagemin@9` ships no `.d.ts` file, and `@types/gulp-imagemin@8.0.6` describes the v8 API. You can then remove the `@ts-ignore` at `ImagesProcessor.ts:242`, but you'll probably need a small local declaration instead.
- **Stale bundle:** the current `EntryPoint.js` still embeds `"gulp-imagemin":"7.1.0"` / `"imagemin-pngquant":"9.0.2"` (it bundles `package.json` data). It wasn't rebuilt after the upgrade, so check the consuming project only after a fresh build.

I'd pick **A** if you want to stay on the official plugin, or **B** if you'd rather not have async loading in the build pipeline. Tell me which one and I'll implement it.
