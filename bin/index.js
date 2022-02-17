const fs = require("fs");
const chokidar = require("chokidar")
const liveServer = require("live-server")
const { build } = require("esbuild")
const alias = require("esbuild-plugin-alias")
const { findJavascriptFiles } = require("../lib/htmlParse");
const htmlFile = process.argv[2].indexOf(".js") == -1 ? process.argv[2] : process.arv[3]
if (!htmlFile) new Error("Must include a Html File")
const html = fs.readFileSync(htmlFile)
fs.copyFileSync(htmlFile, `dist/${htmlFile}`)
const jsFiles = findJavascriptFiles(html)
const runBuilder = () => {
      const builder = build({
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
const developeServer = async () => {
      // `esbuild` bundler for JavaScript / TypeScript.
      const builder = await runBuilder()
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
}
if (process.env.NODE_ENV !== "production") developeServer()
else runBuilder()






