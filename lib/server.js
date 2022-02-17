const liveServer = require("liveserver")
liveServer.start({
      // Opens the local server on start.
      open: true,
      // Uses `PORT=...` or 8080 as a fallback.
      port: +process.env.PORT || 8080,
      // Uses `public` as the local server folder.
      root: "dist",
})