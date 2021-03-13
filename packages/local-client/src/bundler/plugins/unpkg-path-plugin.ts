import * as esbuild from "esbuild-wasm";

export const unpkgPathPlugin = () => {
  // se returneaza un obiect cu 2 proprietati ,o proprietate name si o functie setup
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      // functia asta suprascrie comportamentul lui esbuild de a cauta unde e fisierul index.js al package-ului
      //e apelata automat de esbuild cu parametrul build
      //build rep procesul de bundling
      // daca sunt gasite import-uri esbuild va repeta pasul de onResolve si onBuild

      // Handle root entry file of 'index.js'
      build.onResolve({ filter: /(^index\.js$)/ }, () => {
        return { path: "index.js", namespace: "a" };
      });

      // Handle relative paths in a module
      build.onResolve({ filter: /^\.+\// }, async (args: any) => {
        return {
          namespace: "a",
          path: new URL(args.path, "https://unpkg.com" + args.resolveDir + "/")
            .href,
        };
      });

      // Handle main file of a module
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        return {
          namespace: "a",
          path: `https://unpkg.com/${args.path}`,
        };
      });
    },
  };
};
