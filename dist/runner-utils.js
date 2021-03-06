const path = require("path")
const fs = require("fs")
const promptsUtil = require("prompts")
const { isPlainObject, asArray, doit } = require("./lite-nody")

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
  
  const fwd = fileDir
  const cwd = processDir
  const pwd = fs.lstatSync(fileDir).isDirectory() ? fileDir : path.resolve(fileDir,".."); 

  const timeoutPromise = (fn, time)=>{
    return new Promise((resolve)=>{
      return typeof fn === "number" ? setTimeout(()=>resolve(time), fn) : setTimeout(()=>resolve(typeof fn === "function" ? fn() : fn), time)
    })
  }
  
  function basePromptConfig(param, { baseType="text", baseName="result" } = {}){
    const promptParams = doit(function(){
      if(typeof param === "string"){
        return {
          type   : baseType,
          name   : baseName,
          message: param
        }
      } else if(isPlainObject(param)){
        return Object.assign({
          type   : baseType,
          name   : baseName
        }, param)
      } else {
        return null
      }
    })

    if(!promptParams){
      throw new Error("Required prompt parameter option")
    }

    if(typeof promptParams.message !== "string"){
      throw new Error("Prompt message is required.")
    }

    if(promptParams.type === "list"){
      if(typeof promptParams.separator !== "string"){
        promptParams.separator = ","
      }
    }

    if(promptParams.options){
      promptParams.choices = promptParams.options.map(function(option){
        return {
          title:option.label,
          value:option.value,
          description:option.description,
          disabled:option.disabled
        }
      }).filter(Boolean)
    }

    if(baseType === "select"){
      const { hint, multiple } = promptParams

      if(!hint){
        promptParams.hint = '- Space to select. Return to submit'
      }

      if(multiple === true){
        promptParams.type = "multiselect"  
      }

    }

    return promptParams
  }

  const confirm = async (option)=>{
    const promptParams = basePromptConfig(option, { baseType:"toggle" })

    const { result } = await promptsUtil(
      {
        type : promptParams.type,
        name : promptParams.name,
        message : promptParams.message,
        initial : typeof promptParams.initial === "boolean" ? promptParams.initial : true,
        active: 'Y',
        inactive: 'N',
      },
      {
        onSubmit: ()=>{
          //TDDO option:{on:{submit}}
        },
        onCancel: ()=>{
          process.exit(1)
        }
      }
    )

    return result
  }

  const prompt = async (option)=>{
    const promptParams = basePromptConfig(option, { baseType:"text" })
    const noTrim = option.noTrim === true
    const { result } = await promptsUtil(
      {
        type : promptParams.type,
        name : promptParams.name,
        message : promptParams.message,
        separator : promptParams.separator,
        initial : promptParams.initial,
        validate : (input)=>{
          if(typeof promptParams.validate !== "function"){
            return true
          }
          if(promptParams.type === "list"){
            const arrayInput = input.split(promptParams.separator)
            if(noTrim === false){
              promptParams.validate(arrayInput.filter((value)=>(value.trim() !== "")))
            }
            return promptParams.validate(arrayInput) 
          }
          return (noTrim === false && typeof input === "string") ? promptParams.validate(input.trim()) : promptParams.validate(input)
        },
      },
      {
        onSubmit: ()=>{
          //TDDO option:{on:{submit}}
        },
        onCancel: ()=>{
          process.exit(1)
        }
      }
    )
    
    return doit(function(){
      if(promptParams.type === "list"){
        return noTrim === false ? result.filter((value)=>(value.trim() !== "")) : result
      } else {
        return (noTrim === false && typeof result === "string") ?  result.trim() : result
      }
    })
  }

  const select = async (option)=>{
    const promptParams = basePromptConfig(option, { baseType:"select" })
    
    const { result } = await promptsUtil(
      {
        type : promptParams.type,
        name : promptParams.name,
        message : promptParams.message,
        choices : promptParams.choices,
        initial : promptParams.initial,
      },
      {
        onSubmit: ()=>{
          //TDDO option:{on:{submit}}
        },
        onCancel: ()=>{
          process.exit(1)
        }
      }
    )
    return asArray(result)
  }
  
  return { 
    timeoutPromise, 
    confirm,
    prompt,
    select,
    path,
    cwd,
    fwd,
    pwd
  }
}
