const fs = require("fs")
const bundleStore = {}
const getDependencies = (splitlines, currentDir) => {
      const deplines = splitlines.filter((line) => line.indexOf("import") !== -1 && line.indexOf("from") !== -1);
      return deplines.map(line => {
            var imports = line.match(/from \"(.*)\"/)[1]
            if (imports.indexOf("../") !== -1) {
                  const backs = imports.split("../").length - 1
                  imports = `${currentDir.slice(0, -backs).join('/')}/${imports.replace(/\.\.\//g, "")}`
            }
            else if (imports.indexOf("./") != -1) imports = `${currentDir.join("/")}/${imports.replace("./", "")}`
            const exposes = line.match(/import (.*) from/)[1]
            return {
                  imports,
                  exposes
            }
      })
}

const getExports = (splitlines) => {
      const exports = { "returns": [] }
      const exportLines = splitlines.filter((line) => line.indexOf("export ") !== -1)
      exportLines.forEach(line => {
            line = line.replace(";", "").trim();
            if (line.indexOf("default") != -1) exports.default = line.match(/default (.*)$/)[1]
            else exports.returns.push(line.match(/export (.*?) (.*?) =/)[2].trim())
      })
      return exports
}

const bundle = (jsFile, parentDir) => {

      parentDir = parentDir || "";
      var pathArray = jsFile.split("/")
      var filePath = pathArray.slice(0, -1)
      const structure = { dir: filePath }
      structure.module_name = pathArray[pathArray.length - 1].replace(".js", "")
      if (structure.module_name.indexOf("index") != -1) structure.module_name = filePath[filePath.length - 1]
      if (bundleStore[structure.module_name]) return;
      const jsString = fs.readFileSync(jsFile, { encoding: 'utf-8' })
      const splitlines = jsString.split(/(\r\n|\r|\n)/gm).filter((line) => line !== "" && line.indexOf('\n') === -1)
      structure.deps = getDependencies(splitlines, filePath);
      structure.exports = getExports(splitlines);
      bundleStore[structure.module_name] = structure;
      const returnString = buildReturnString(structure.exports)
      structure.deps.forEach((dep) => bundle(dep.imports, structure.dir))
}

module.exports = {
      bundle
}