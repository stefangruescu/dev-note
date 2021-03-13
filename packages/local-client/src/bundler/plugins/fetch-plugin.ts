import * as esbuild from "esbuild-wasm";
import localForage from "localforage";
import axios from "axios";

const fileCache = localForage.createInstance({
  name: "filecache",
});

export const fetchPlugin = (inputCode: string) => {
  return {
    name: "fetch-plugin",
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
          loader: "jsx",
          contents: inputCode,
        };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        // Check to see if we have already fetched this file
        // and if it is in the cache
        const cachedRes = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );

        // if it is ,return it asap
        if (cachedRes) {
          return cachedRes;
        }
      });

      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);

        // there can be imported css files and they need to be bundled in a different file that the js one

        const escaped = data
          .replace(/\n/g, "") // new lines removed
          .replace(/"/g, '\\"') // double quotes escaped
          .replace(/'/g, "\\'"); // single quotes escaped
        const contents = `
                  const style = document.createElement('style');
                  style.innerText = '${escaped}';
                  document.head.appendChild(style);
              `;

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents,
          resolveDir: new URL("./", request.responseURL).pathname,
        };
        // store response in cache
        await fileCache.setItem(args.path, result);

        return result;
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: data,
          resolveDir: new URL("./", request.responseURL).pathname,
        };
        // store response in cache
        await fileCache.setItem(args.path, result);

        return result;
      });
    },
  };
};
