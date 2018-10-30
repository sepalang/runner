const path = require("path")
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
  
  const find = (a,b)=>{
    console.log("@sepalang/runner::find is deprecated .. use cd");
    return baseCd(a,b);
  }
  
  const cd = (relative, baseDir)=>baseCd(relative, baseDir, fileDir)
  const cwcd = (relative, baseDir)=>baseCd(relative, baseDir, processDir)
  
  
  const timeout = (fn, time)=>{
    return new Promise((resolve)=>{
      return typeof fn === "number" ? setTimeout(()=>resolve(time), fn) : setTimeout(()=>resolve(typeof fn === "function" ? fn() : fn), time)
    })
  }
  
  const pathResolve = path.resolve
  const pathParse = path.parse
  const pathJoin = path.join
  const pathRelative = path.relative
  
  return { find, cd, cwcd, timeout, pathResolve, pathParse, pathJoin, pathRelative }
  
}
