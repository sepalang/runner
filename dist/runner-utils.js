const path = require("path")
const promptsUtil = require("prompts")
const { isPlainObject, asArray } = require("./lite-nody")

/*
const deprecatedHelper = (fn, name, use)=>{
  let touched = false
  return (...args)=>{
    if(!touched){
      touched = true
      console.log(`@sepalang/runner :: ${name || fn.name} is deprecated.` + (use ? `use ${use}` : ''))
    }
    return fn(...args)
  }
}
*/

module.exports = function ({ fileDir, processDir }){
  
  const baseCd = (relative, baseDir, hiddenBaseDir)=>{
    baseDir = baseDir || hiddenBaseDir
    const parsedPath = path.parse(baseDir)
    // TODO : find better way for real file
    const isBasePathOfFile = !!parsedPath['ext']
    
    if(!relative || relative === "."){
      return baseDir
    } else if(isBasePathOfFile === true){
      return path.join(baseDir, "../", relative)
    } else {
      return path.join(baseDir, relative)
    }
  }
  
  
  const cd = (relative, baseDir)=>baseCd(relative, baseDir, fileDir)
  const dircd = (relative)=>baseCd(relative, fileDir)
  const cwdcd = (relative)=>baseCd(relative, processDir)
  
  const timeout = (fn, time)=>{
    return new Promise((resolve)=>{
      return typeof fn === "number" ? setTimeout(()=>resolve(time), fn) : setTimeout(()=>resolve(typeof fn === "function" ? fn() : fn), time)
    })
  }
  
  const parse = path.parse
  const layer = path.relative
  const join = path.join
  const echo = (...args)=>{ console.log(...args) }
  const prompt = async (option, { onSubmit } = {})=>{
    const baseOptions = Array.from(asArray(option)).map((param)=>{
      let option = null
      
      if(typeof param === "string"){
        param = {
          type   : "text",
          name   : "result",
          message: param
        }
      }
      
      if(isPlainObject(param)){
        param = Object.assign({}, param)
        !param.type && (param.type = "text")
        !param.name && (param.name = "result")
        option = param
      }
      
      return option
    }).filter(Boolean)
    
    const promptOption = baseOptions[0]
    
    if(!promptOption){
      throw new Error("Required prompt parameter option")
    }
    
    const { result } = await promptsUtil(
      promptOption,
      {
        onSubmit,
        onCancel: ()=>{
          process.exit(1)
        }
      }
    )
    return result
  }
  
  return { 
    dircd, cwdcd, timeout, parse, layer, join, cd, echo, prompt
  }
}
