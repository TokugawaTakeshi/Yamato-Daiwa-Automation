import Path from "path";


export default function isSubdirectory(
  {
    whichPath,
    ofWhichPath
  }: Readonly<{
    whichPath: string;
    ofWhichPath: string;
  }>
): boolean {
  const relativePath: string = Path.relative(ofWhichPath, whichPath);
  return relativePath.length > 0 && !relativePath.startsWith("..") && !Path.isAbsolute(relativePath);
}
