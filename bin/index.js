#!/usr/bin/env node
const fs = require("fs");
const chokidar = require("chokidar")
const liveServer = require("live-server")
const { buildSync, build } = require("esbuild")
const alias = require("esbuild-plugin-alias")
const { JSDOM } = require('jsdom');
const myFetch = require('node-fetch')
const { findJavascriptFiles } = require("../lib/htmlParse");
const { exit } = require("process");
const htmlFile = process.argv[2]
if (!htmlFile) new Error("Must include a Html File")
const html = fs.readFileSync(htmlFile)
process.env.NODE_ENV !== 'test_build' && fs.copyFileSync(htmlFile, `dist/${htmlFile}`)

const jsFiles = findJavascriptFiles(html)
const runBuilder = async () => {
      const builder = await build({
            bundle: true,
            loader: { '.js': 'jsx' },
            define: { "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development") },
            entryPoints: jsFiles,
            incremental: process.env.NODE_ENV !== "production",
            watch: false,
            minify: process.env.NODE_ENV === "production",
            outfile: `dist/index.js`,
            plugins: process.env.NODE_ENV !== "production" && [
                  alias({
                        "butter-react": "G:\\project\\Reacty-Workspace\\butter-react\\index.js",
                        "butter-bundler": "G:\\project\\Reacty-Workspace\\butter-bundler\\index.js",
                        "butter-styled": `G:\\project\\Reacty-Workspace\\butter-styled\\index.js`,
                        'butter-uuid': "G:\\project\\Reacty-Workspace\\butter-uuid\\index.js"
                  })
            ] || []
      })
      return builder
}
const buildSynced = async () => {
      const result = buildSync({
            bundle: true,
            loader: { '.js': 'jsx' },
            define: { "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development") },
            entryPoints: jsFiles,
            minify: false,
            outdir: `dist`,
            write: false,
      })
      return new TextDecoder("utf-8").decode(result.outputFiles[0].contents);
}

const startLiveServer = async (open = true) => {
      liveServer.start({
            open,
            port: +process.env.PORT || 80,
            root: "./dist/",
      })
}

const developeServer = async (open = true) => {
      const builder = await runBuilder()
      chokidar
            .watch("src/**/*.{js,jsx,ts,tsx}", {
                  interval: 0,
            })
            .on("all", () => {
                  builder.rebuild()
            })
      startLiveServer(open);
      return;
}

const developeStatic = async () => {
      var fetches = 0
      var errors = []
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
      const serverFetch = async (...args) => {
            fetches++;
            var response = { json: () => { } }
            try {
                  response = await myFetch(...args)
                  fetches--
            } catch (err) {
                  fetches--
                  errors.push({ err, args });
            }
            return response

      }
      const javascript = await buildSynced()
      JSDOM.fromFile(htmlFile, {
            resources: "usable", pretendToBeVisual: true
      }).then((dom) => {
            const { document } = dom.window
            dom.window.addEventListener('load', function () {
                  const window = undefined;
                  eval(javascript)
                  setInterval(() => {
                        if (fetches == 0) {
                              if (errors.length > 0)
                                    console.log(errors)
                              fs.writeFileSync("dist/index.html", document.querySelector("html").outerHTML)
                              fs.writeFileSync("dist/index.js", javascript)
                              exit("exiting")
                        }
                  }, 100);
            })
      }).catch((error) => console.log(error))
}

switch (process.env.NODE_ENV) {
      case "development":
            developeServer()
            break;
      case "no-static":
            runBuilder()
            break;
      case "static":
            developeStatic()
            break;
      case "test_build":
            startLiveServer()
            break;
      default:
}





