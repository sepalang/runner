const isAbsoluteNaN = function (it){
  // eslint-disable-next-line no-self-compare
  return it !== it && typeof it === "number"
}

const isNone = function (data){
  return isAbsoluteNaN(data) || data === undefined || data === null
}

const isPlainObject = data=>typeof data === "object" && data.constructor === Object

const asArray = function (data, defaultArray = undefined){
  if(Array.isArray(data)){
    return data
  }
  if(isNone(data)){
    return Array.isArray(defaultArray) ? defaultArray
      : isNone(defaultArray) ? [] : [defaultArray]
  }
  if(typeof data === "object" && typeof data.toArray === "function"){
    return data.toArray()
  }
  return [data]
}

const toArray = function (data, option){
  if(typeof data === "undefined" || data === null || isAbsoluteNaN(data)) return []
  if(Array.isArray(data)) return Array.prototype.slice.call(data)
  if(typeof data === "object" && typeof data.toArray === "function") return data.toArray()
  if(typeof data === "string" && typeof option === "string") return data.split(option)
  return [data]
}


const doit = function(fn, args){
  return typeof fn === 'function' ? fn(...asArray(args)) : undefined
}


module.exports = { isAbsoluteNaN, isNone, isPlainObject, asArray, toArray, doit }
