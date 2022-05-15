namespace WebpackSpecialist {

  /* [ Reference ] https://webpack.js.org/configuration/mode/#usage */
  export enum BuildingModes {
    development = "development",
    production = "production",
    none = "none"
  }

  // TODO Проверь ещё раз
  /* [ Reference ] https://webpack.js.org/configuration/devtool/ */
  export enum BuildInSourceMapsTypes {
    eval = "eval",
    evalCheapSourceMap = "eval-cheap-source-map",
    evalCheapModuleSourceMap = "eval-cheap-module-source-map",
    evalSourceMap = "eval-source-map",
    evalNoSourcesSourceMap = "eval-nosources-source-map",
    evalNoSourcesCheapSourceMap = "eval-nosources-cheap-source-map",
    evalNoSourcesCheapModuleSourceMap = "eval-nosources-cheap-module-source-map",
    cheapSourceMap = "cheap-source-map",
    cheapModuleSourceMap = "cheap-module-source-map",
    inlineCheapSourceMap = "inline-cheap-source-map",
    inlineCheapModuleSourceMap = "inline-cheap-module-source-map",
    inlineSourceMap = "inline-source-map",
    inlineNoSourcesSourceMap = "inline-nosources-source-map",
    inlineNosourcesCheapSourceMap = "inline-nosources-cheap-source-map",
    inlineNoSourcesCheapModuleSourceMap = "inline-nosources-cheap-module-source-map",
    sourceMap = "source-map",
    hiddenSourceMap = "hidden-source-map",
    hiddenNoSourcesSourceMap = "hidden-nosources-source-map",
    hiddenNoSourcesCheapSourceMap = "hidden-nosources-cheap-source-map",
    hiddenNoSourcesCheapModuleSourceMap = "hidden-nosources-cheap-module-source-map",
    hiddenCheapSourceMap = "hidden-cheap-source-map",
    hiddenCheapModuleSourceMap = "hidden-cheap-module-source-map",
    noSourcesSourceMap = "nosources-source-map",
    noSourcesCheapSourceMap = "nosources-cheap-source-map",
    noSourcesCheapModuleSourceMap = "nosources-cheap-module-source-map"
  }

  /* [ Reference ] https://webpack.js.org/configuration/target/ */
  export enum BuildingTargets {
    webBrowser = "web",
    webWorker = "webworker"
  }
}


export default WebpackSpecialist;
