import PugLint = require("../index");

export = ConfigFile;


declare class ConfigFile {
  static load(config?: unknown, cwd?: string): PugLint.Config | undefined;
}
