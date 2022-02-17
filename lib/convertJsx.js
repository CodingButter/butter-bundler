const jsxToJson = require('simplified-jsx-to-json');

const findJSX = (str) => {
      const jsx = str.match(/(return) \<(.*)\>/g)
      console.log(jsx)
}

module.exports = {
      findJSX
}