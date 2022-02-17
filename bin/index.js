#!/usr/bin/env node
const fs = require("fs");
const chokidar = require("chokidar")
const liveServer = require("live-server")
const { build } = require("esbuild")
const alias = require("esbuild-plugin-alias")
const { findJavascriptFiles } = require("../lib/htmlParse");
const htmlFile = process.argv[2]
if (!htmlFile) new Error("Must include a Html File")
const html = fs.readFileSync(htmlFile)
fs.copyFileSync(htmlFile, `dist/${htmlFile}`)
const jsFiles = findJavascriptFiles(html)
      ; (async () => {
            // `esbuild` bundler for JavaScript / TypeScript.
            const builder = await build({

                  bundle: true,
                  loader: { '.js': 'jsx' },
                  define: { "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development") },
                  entryPoints: jsFiles,
                  incremental: true,
                  //minify: process.env.NODE_ENV === "production",
                  //minify: true,
                  outfile: `dist/index.js`,
                  plugins: [
                        alias({
                              'reacty': 'G:/project/Reacty-Workspace/reacty',
                        })
                  ]
            })
            chokidar
                  .watch("src/**/*.{js,jsx,ts,tsx}", {
                        interval: 0, // No delay
                  })
                  .on("all", () => {
                        builder.rebuild()
                  })
            // `liveServer` local server for hot reload.
            liveServer.start({
                  // Opens the local server on start.
                  open: true,
                  // Uses `PORT=...` or 8080 as a fallback.
                  port: +process.env.PORT || 8080,
                  // Uses `public` as the local server folder.
                  root: "./dist/",
            })
      })()







