const createError = require('./lib/index')
const fs = require('fs')

fs.readFile('foo.txt', function (err, buf) {
  if (err) {
    if (err.code === 'ENOENT') {
      var httpError = createError(404, err)
    } else {
      var httpError = createError(500, err)
    }
    throw httpError
  }
})
// var err = createError(404, 'This video does not exist!')
// throw err