const statuses = require('statuses')

module.exports = function (...args) {
  let err = args[1]
  if(typeof Number(args[0]) !== 'number') {
    throw new TypeError('args[0] must be a statu code')
  }
  if(typeof err === 'string') {
    return module.exports[args[0]](err)
  } else if (err instanceof Error) {
    Object.setPrototypeOf(err, module.exports.httpError)
    Error.captureStackTrace(err, module.exports)
    Object.defineProperties(err, {
      'name': {
        value: module.exports[args[0]].prototype.status
      }
    })
    return err
  }
}

module.exports.httpError = (function(){
  function httpError () {
    throw new TypeError("can not create an abstract class")
  } 
  //这里模拟实现c++中的基类或者说抽象类的概念
  inherit(httpError, Error)
  return httpError
})()

initAllMethods()

function inherit(tar, superConstruct) {
  // let tmpObj = new superConstruct()
  // tar.prototype = tmpObj
  let tmpFunc = function () {}
  tmpFunc.prototype = superConstruct.prototype
  let a = new tmpFunc()
  //直接new superConstruct会带有构造函数中初始化的参数，
  //这样做就可以直接只提取__proto__
  tar.prototype = a
  tar.prototype.constructor = tar
}

function initAllMethods() {
  let num,
    mes
  statuses.codes.forEach(element => {
    num = Number(element)
    mes = statuses[num]
    if(!isError(num)) {
      return 
    }
    createErrorConstructor(num, mes)
  })
}

function createErrorConstructor(num, mes) {
  let reg = /Error$/i
  if(!reg.test(mes)){
    mes += 'Error'
  }
  mes = mes.replace(' ','').replace(/[0-9\-]*/g, '')

  function ErrorConstructor(des) {
    if(!(this instanceof ErrorConstructor)) {
      return new ErrorConstructor(des)
    }

    Error.captureStackTrace(this, module.exports)

    Object.defineProperties(this, {
      'name' : {
        value: this.status
      },
      'message' : {
        value: des
      }
    })
  }

  setContructorName(ErrorConstructor, mes)  
  inherit(ErrorConstructor, module.exports.httpError)
  ErrorConstructor.prototype.code = num
  ErrorConstructor.prototype.status = mes

  module.exports[num] = ErrorConstructor
  module.exports[mes] = ErrorConstructor
  return ErrorConstructor
}

function isError(num) {
  return num >= 400 
}

function setContructorName(ErrorConstructor, mes) {
  let des = Object.getOwnPropertyDescriptor(ErrorConstructor, 'name')
    
  if (des.configurable) {
    Object.defineProperty(ErrorConstructor, 'name', {value:mes})
  }
}

