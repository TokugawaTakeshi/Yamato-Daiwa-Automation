import { ImprovedPath } from "@yamato-daiwa/es-extensions-nodejs";


export default abstract class InternalAssets {

  public static readonly ASSETS_DIRECTORY_ROOT_ABSOLUTE_PATH: string = ImprovedPath.
      joinPathSegments([ __dirname, "Assets" ], { alwaysForwardSlashSeparators: true });

  public static readonly LOADING_SCREEN_HTML_FILE_FOR_PROCESSING_ON_DEMAND_MODE_ABSOLUTE_PATH: string = ImprovedPath.
      joinPathSegments(
        [ InternalAssets.ASSETS_DIRECTORY_ROOT_ABSOLUTE_PATH, "LoadingScreenForProcessingOnDemandMode.html" ],
        { alwaysForwardSlashSeparators: true }
      );

}
