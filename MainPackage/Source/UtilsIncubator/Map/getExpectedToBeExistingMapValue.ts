import { isUndefined, Logger, UnexpectedEventError } from "@yamato-daiwa/es-extensions";


export default function getExpectedToBeExistingMapValue<Key, Value>(
  targetMap: ReadonlyMap<Key, Value>, targetKey: Key
): Value {

  const targetValue: Value | undefined = targetMap.get(targetKey);

  if (isUndefined(targetValue)) {
    Logger.throwErrorAndLog({
      errorInstance: new UnexpectedEventError(
        `Contrary to expectations, there is no pair with key "${ String(targetKey) }" in target map.`
      ),
      title: UnexpectedEventError.localization.defaultTitle,
      occurrenceLocation: "getExpectedToBeExistingMapValue(targetMap, targetKey)"
    });
  }


  return targetValue;

}
