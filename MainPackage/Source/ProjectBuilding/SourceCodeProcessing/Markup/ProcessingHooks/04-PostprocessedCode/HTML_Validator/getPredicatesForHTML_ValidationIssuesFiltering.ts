import type HTML_Validator from "html-validator";


export default function getPredicatesForHTML_ValidationIssuesFiltering():
  Array<(HTML_ValidationIssue: HTML_Validator.ValidationMessageObject) => boolean> {
  return [
    (HTML_ValidationIssue: HTML_Validator.ValidationMessageObject): boolean =>
        HTML_ValidationIssue.message === "Attribute “webkitdirectory” not allowed on element “input” at this point."
  ];
}
