// the files module takes care of basic file management

const fs = require('fs')
const path = require('path')

module.exports = {
  getCurrentWorkingDirectory: () => {
    return path.basename(process.cwd())
  },

  directoryExists: (filePath) => {
    return fs.existsSync(filePath)
  }
}