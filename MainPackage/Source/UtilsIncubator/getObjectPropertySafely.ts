import type { ArbitraryObject } from "@yamato-daiwa/es-extensions";
import {
  isUndefined,
  isString,
  splitString,
  isArbitraryObject
} from "@yamato-daiwa/es-extensions";


export default function getObjectPropertySafely(
  targetObject: unknown,
  dotSeparatedOrArrayedPathToTargetProperty: Array<string> | string
): unknown {

  if (!isArbitraryObject(targetObject)) {
    return;
  }


  let targetPropertyFullQualifiedNameSegments: Array<string>;

  if (isString(dotSeparatedOrArrayedPathToTargetProperty)) {
    targetPropertyFullQualifiedNameSegments = splitString(dotSeparatedOrArrayedPathToTargetProperty, ".");
  } else {
    targetPropertyFullQualifiedNameSegments = dotSeparatedOrArrayedPathToTargetProperty;
  }

  if (targetPropertyFullQualifiedNameSegments.length === 0) {
    return;
  }


  let objectOfCurrentDepthLevel: ArbitraryObject = targetObject;

  for (let depthLevel: number = 1; depthLevel <= targetPropertyFullQualifiedNameSegments.length; depthLevel++) {

    const isLastDepthLevel: boolean = depthLevel === targetPropertyFullQualifiedNameSegments.length;
    const valueOfNextDepthLevel: unknown = objectOfCurrentDepthLevel[targetPropertyFullQualifiedNameSegments[depthLevel - 1]];

    if (isLastDepthLevel) {
      return valueOfNextDepthLevel;
    } else if (isArbitraryObject(valueOfNextDepthLevel)) {
      objectOfCurrentDepthLevel = valueOfNextDepthLevel;
    } else if (valueOfNextDepthLevel === null) {
      return null;
    } else if (isUndefined(valueOfNextDepthLevel)) {
      return;
    }
  }


  /* eslint-disable no-useless-return */
  return;
}
