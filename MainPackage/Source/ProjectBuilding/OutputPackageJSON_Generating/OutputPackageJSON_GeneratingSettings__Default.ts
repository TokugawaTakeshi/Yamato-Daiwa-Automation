import OperationingSystem from "os";
import { LineSeparators } from "@yamato-daiwa/es-extensions";


const OutputPackageJSON_GeneratingSettings__Normalized: Readonly<{
  indentString: string;
  linesSeparator: LineSeparators;
}> = {
  indentString: "  ",
  linesSeparator: OperationingSystem.EOL === "\n" ? LineSeparators.lineFeed : LineSeparators.carriageReturnAndLineFeed
};


export default OutputPackageJSON_GeneratingSettings__Normalized;
