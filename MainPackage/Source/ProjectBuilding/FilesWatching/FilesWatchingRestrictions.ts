/* eslint-disable no-inline-comments, @stylistic/no-multi-spaces -- Will comment with which technology each exclusion related. */


/* [ Theory ] All directories and files which names started form dot will be ignored by Chokidar. */
export default {
  relativePathsOfExcludeFiles: [
    "package-lock.json",  // NPM
    "yarn.lock"           // Yarn, the third-party package manager
  ],
  relativePathsOfExcludeDirectories: [
    "bin",          // .NET
    "node_modules", // Node.js
    "obj"           // .NET
  ]
};
