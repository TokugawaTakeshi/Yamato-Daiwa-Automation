import FileSystem from "fs";
import Path from "path";
import { ImprovedGlob, ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";


export default abstract class ESLintLinterSpecialist {

  private static readonly IGNORING_DIRECTIVES_DEFAULT_FILE_NAME_WITH_EXTENSION: string = ".eslintignore";


  public static getGlobSelectorsOfExcludedFiles(
    compoundParameter: Readonly<{
      consumingProjectRootDirectoryAbsolutePath: string;
      mustSkipNodeModulesDirectory: boolean;
    }>
  ): Array<string> {
    return [
      ...ESLintLinterSpecialist.getGlobSelectorsOfExcludedFilesFromIgnoringDirectiveFile(compoundParameter)
    ];
  }


  private static getGlobSelectorsOfExcludedFilesFromIgnoringDirectiveFile(
    {
      consumingProjectRootDirectoryAbsolutePath,
      mustSkipNodeModulesDirectory
    }: Readonly<{
      consumingProjectRootDirectoryAbsolutePath: string;
      mustSkipNodeModulesDirectory: boolean;
    }>
  ): Array<string> {
    return FileSystem.
        readFileSync(
          Path.join(process.cwd(), ESLintLinterSpecialist.IGNORING_DIRECTIVES_DEFAULT_FILE_NAME_WITH_EXTENSION), "utf8"
        ).
        split(/\r?\n/u).
        filter((line: string): boolean => (/\w/u).test(line)).
        filter((line: string): boolean => !(mustSkipNodeModulesDirectory && line.includes("node_modules"))).
        map(
          (relativePathBasedGlob: string): string => (
            Path.parse(relativePathBasedGlob).ext.length === 0 ?
                ImprovedGlob.buildExcludingOfDirectoryWithSubdirectoriesGlobSelector(
                  ImprovedPath.joinPathSegments(
                    [ consumingProjectRootDirectoryAbsolutePath, relativePathBasedGlob ],
                    { alwaysForwardSlashSeparators: true }
                  )
                ) :
                ImprovedGlob.includingGlobSelectorToExcludingOne(
                  ImprovedPath.joinPathSegments(
                    [ consumingProjectRootDirectoryAbsolutePath, relativePathBasedGlob ],
                    { alwaysForwardSlashSeparators: true }
                  )
                )
          )
    );
  }

}
