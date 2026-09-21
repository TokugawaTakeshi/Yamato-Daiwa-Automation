import FileSystem from "fs";
import PromisfiedFileSystem from "fs/promises";
import { ImprovedFileSystem, ImprovedPath, isErrnoException } from "@yamato-daiwa/es-extensions-nodejs";

/* [ Feature ] Unline existing method of `ImprovedFileSystem`, supports `NodeJS.ArrayBufferView`. */

export default function writeFileToPossiblyNotExistingDirectory(
  compoundParameter: Readonly<{
    filePath: string;
    content: string | NodeJS.ArrayBufferView;
    synchronously: true;
  }>
): void;

export default function writeFileToPossiblyNotExistingDirectory(
  compoundParameter: Readonly<{
    filePath: string;
    content: string | NodeJS.ArrayBufferView;
    synchronously: false;
  }>
): Promise<void>;

export default function writeFileToPossiblyNotExistingDirectory(
  {
    filePath,
    content,
    synchronously
  }: Readonly<{
    filePath: string;
    content: string | NodeJS.ArrayBufferView;
    synchronously: boolean;
  }>
): Promise<void> | void {

  if (synchronously) {

    try {

      FileSystem.writeFileSync(filePath, content);

    } catch (error: unknown) {

      if (isErrnoException(error) && error.code === "ENOENT") {

        ImprovedFileSystem.createDirectory({
          targetPath: ImprovedPath.extractDirectoryFromFilePath({
            targetPath: filePath,
            ambiguitiesResolution: {
              mustConsiderLastSegmentWithoutDotsAsFileNameWithoutExtension: true,
              mustConsiderLastSegmentWithNonLeadingDotAsDirectory: false,
              mustConsiderLastSegmentStartingWithDotAsDirectory: false
            }
          }),
          synchronously: true,
          mustThrowErrorIfTargetDirectoryExists: true
        });

        FileSystem.writeFileSync(filePath, content);

      }

    }

    return;

  }


  return PromisfiedFileSystem.
      writeFile(filePath, content).
      catch(async (error: unknown): Promise<void> => {

        if (isErrnoException(error) && error.code === "ENOENT") {

          ImprovedFileSystem.createDirectory({
            targetPath: ImprovedPath.extractDirectoryFromFilePath({
              targetPath: filePath,
              ambiguitiesResolution: {
                mustConsiderLastSegmentWithoutDotsAsFileNameWithoutExtension: true,
                mustConsiderLastSegmentWithNonLeadingDotAsDirectory: false,
                mustConsiderLastSegmentStartingWithDotAsDirectory: false
              }
            }),
            synchronously: true,
            mustThrowErrorIfTargetDirectoryExists: true
          });

          return PromisfiedFileSystem.writeFile(filePath, content);

        }


        throw error;

      });

}
