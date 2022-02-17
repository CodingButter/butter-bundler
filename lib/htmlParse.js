const { JSDOM } = require("jsdom")

const findJavascriptFiles = (html) => {
      const { window: { document } } = new JSDOM(html);
      return Array.from(document.querySelectorAll("script")).map(({ src }) => src);
}

module.exports = {
      findJavascriptFiles
}