declare module "*.renderer.pug" {
  const renderer: (templateVariables: unknown) => string;
  export default renderer;
}

declare module "*.pug" {
  const HTML_Template: string;
  export default HTML_Template;
}
