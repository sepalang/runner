const path = require("path")

const deprecatedHelper = (fn, name, use)=>{
  let touched = false;
  return (...args)=>{
    if(!touched){
      touched = true;
      console.log(`${name || fn.name} is deprecated.` + use ? `use ${use}` : '');
    }
    return fn(...args);
  }
};

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
  };
  
  
  const dircd = (relative, baseDir)=>baseCd(relative, baseDir, fileDir)
  const cwdcd = (relative, baseDir)=>baseCd(relative, baseDir, processDir)
  
  const timeout = (fn, time)=>{
    return new Promise((resolve)=>{
      return typeof fn === "number" ? setTimeout(()=>resolve(time), fn) : setTimeout(()=>resolve(typeof fn === "function" ? fn() : fn), time)
    })
  }
  
  const parse = path.parse
  const layer = path.relative
  const join = path.join
  
  // deprecated
  const cd = deprecatedHelper(dircd, "dircd", "{ dircd }")
  const cwcd = deprecatedHelper(cwdcd, "cwdcd", "{ cwdcd }")
  const pathResolve = deprecatedHelper(path.resolve, "pathResolve", "{ require('path').resolve }")
  const pathParse = deprecatedHelper(path.parse, "pathParse", "{ parse }")
  const pathJoin = deprecatedHelper(path.join, "pathJoin", "{ join }")
  const pathRelative = deprecatedHelper(path.relative, "pathRelative", "{ layer }")
  
  return { 
    dircd, cwdcd, timeout, parse, layer, join, 
    cd, cwcd, pathResolve, pathParse, pathJoin, pathRelative 
  }
}
