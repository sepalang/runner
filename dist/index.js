const spawn = require("cross-spawn")
const npmPath = require("npm-path")

const run = function run (commands, options){
  
  const argvs    = Array.isArray(commands) ? commands : commands.trim().split(/\s/)
  const unixLike = process.platform !== 'win32'
  
  if(unixLike === true){
    argvs.unshift('-c')
    argvs.unshift('sh')
  } else {
    argvs.unshift('/c')
    argvs.unshift(process.env.comspec || 'cmd')
  }
  
  return new Promise((resolve, reject)=>{
    
    const execute = argvs.shift()
    
    if(typeof options === "object"){
      if(options.env){
        const level2Opt = options
        const level3Opt = { env: Object.assign(process.env, options.env) }
        options = {
          env    : process.env,
          capture: false,
          ...level2Opt,
          ...level3Opt
        }
      }
    } else if(typeof options === "string"){
      options = {
        cwd    : options,
        env    : process.env,
        capture: false
      }
    } else {
      options = {
        env    : process.env,
        capture: false
      }
    }
    
    const captureMode = options.capture === true
    npmPath(options)
    
    let stdoutOutput = null
    let stderrOutput = null
    
    let outevt = (data)=>{
      const content = data.toString().replace(/\n$/, '')
      stdoutOutput.push(content)
    }
    
    let errevt = (data)=>{
      const content = data.toString().replace(/\n$/, '')
      stderrOutput.push(content)
    }
    
    if(captureMode){
      stdoutOutput = []
      stderrOutput = []
      options.stdio = [
        process.stdin,
        null,
        null
      ]
    } else {
      options.stdio = [
        process.stdin,
        process.stdout,
        process.stderr
      ]
    }
    
    const [shOpt, ...shRun] = argvs
    const shOptRun          = [shOpt, `${shRun.join(' ')}`]
    const application = spawn(execute, shOptRun, options)
    
    if(captureMode){
      application.stdout.on('data', outevt)
      application.stderr.on('data', errevt)
    }
    
    application.on('exit', ()=>{
      //exit
    })
    
    application.on('close', (code)=>{
      if(captureMode){
        application.stdout.removeListener('data', outevt)
        application.stderr.removeListener('data', errevt)
      }
      if(code === 0){
        resolve({ code, stdout: stdoutOutput, stderr: stderrOutput })
      } else {
        //eslint-disable-next-line prefer-promise-reject-errors
        reject({ code, stdout: stdoutOutput, stderr: stderrOutput })
      }
    })
    
  })
}

module.exports = function (asyncFn){
  // console.log("🏃 Runner 🏃")
  const fileDir = process.argv[1]
  const processDir  = process.cwd();
  
  return (new Promise(resolve=>{
    const runnerUtils = require("./runner-utils")({ fileDir, processDir })

    // eslint-disable-next-line no-unused-vars, handle-callback-err
    npmPath((err, $PATH)=>{
      const runActions = { run, ...runnerUtils, npmPath: $PATH }
      resolve(asyncFn(runActions))
    })
    
  }))
  .then(e=>{
    // console.log("👏 Oh yeah, Running was successful. 👏")
    return Promise.resolve(e)
  })
  .catch(e=>{
    // console.log("💥🏃 Opps, Runner has stopped working.")
    console.log(e)
    return Promise.reject(e)
  })
}
