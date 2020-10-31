const spawn = require("cross-spawn")
const npmPath = require("npm-path")
const pkgDir = require('pkg-dir')
const { Transform } = require('stream')

const run = function run (commands, config){
  
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
    
    if(typeof config === "object"){
      if(config.env){
        const level2Opt = config
        const level3Opt = { env: Object.assign(process.env, config.env) }
        config = {
          env    : process.env,
          capture: false,
          silent: false,
          ...level2Opt,
          ...level3Opt
        }
      }
    } else if(typeof config === "string"){
      config = {
        cwd    : config,
        env    : process.env,
        capture: false,
        silent: false,
      }
    } else {
      config = {
        env    : process.env,
        capture: false,
        silent: false,
      }
    }
    
    const captureMode = config.capture === true
    const silentMode = config.silent === true
    npmPath(config)
    
    let stdoutOutput = null
    let stderrOutput = null
    let stdoutCaptureStream = null
    let stderrCaptureStream = null
    
    let handleCaptureOut = (data)=>{
      const content = data.toString()
      content.split("\n").forEach((chars, index)=>{
        if(index === 0){
          if(stdoutOutput.length === 0){
            stdoutOutput.push(chars)
          } else {
            stdoutOutput[stdoutOutput.length - 1] += chars
          }
        } else {
          stdoutOutput.push(chars)
        }
      })
    }
    
    let handleCaptureErr = (data)=>{
      const content = data.toString()
      content.split("\n").forEach((chars, index)=>{
        if(index === 0){
          if(stderrOutput.length === 0){
            stderrOutput.push(chars)
          } else {
            stderrOutput[stderrOutput.length - 1] += chars
          }
        } else {
          stderrOutput.push(chars)
        }
      })
    }
    
    if(captureMode){
      stdoutOutput = []
      stderrOutput = []
      config.stdio = [
        process.stdin,
        null,
        null
      ]
    } else {
      config.stdio = [
        process.stdin,
        process.stdout,
        process.stderr
      ]
    }
    
    const [shOpt, ...shRun] = argvs
    const shOptRun          = [shOpt, `${shRun.join(' ')}`]
    const application       = spawn(execute, shOptRun, config)
    
    if(captureMode){
      stdoutCaptureStream = new Transform({
        // eslint-disable-next-line no-unused-vars
        transform (chunk, encoding, callback){
          handleCaptureOut(chunk)
          this.push(chunk)
          callback()
        }
      })
      stderrCaptureStream = new Transform({
        // eslint-disable-next-line no-unused-vars
        transform (chunk, encoding, callback){
          handleCaptureErr(chunk)
          this.push(chunk)
          callback()
        }
      })

      const capturePipeOut = application.stdout.pipe(stdoutCaptureStream)
      const capturePipeErr = application.stderr.pipe(stderrCaptureStream)

      if(silentMode !== true){
        capturePipeOut.pipe(process.stdout)
        capturePipeErr.pipe(process.stderr)
      }
    }
    
    application.on('exit', ()=>{
      //exit
    })
    
    application.on('close', (code)=>{
      if(captureMode){
        stdoutCaptureStream.close && stdoutCaptureStream.close()
        stderrCaptureStream.close && stderrCaptureStream.close()
      }

      // Remove useless last cursor
      stdoutOutput && stdoutOutput[stdoutOutput.length - 1] === '' && stdoutOutput.pop();
      stderrOutput && stderrOutput[stderrOutput.length - 1] === '' && stderrOutput.pop();

      if(code === 0){
        resolve({ code, stdout: stdoutOutput, stderr: stderrOutput })
      } else {
        const error = new Error("Runner has stopped working.")
        error.code = code
        error.stdout = stdoutOutput
        error.stderr = stderrOutput
        reject(error)
      }
    })
    
  })
}

function runner(asyncFn){
  // console.log("🏃 Runner 🏃")
  const fileDir = process.argv[1]
  const processDir  = process.cwd()
  
  return (new Promise(resolve=>{
    // eslint-disable-next-line no-unused-vars, handle-callback-err
    npmPath(async (err, npmPath)=>{
      const pacakgePath = await pkgDir(processDir)
      const baseconfig = { run, npmPath, pacakgePath }
      const runnerUtils = require("./runner-utils")({ fileDir, processDir })
      const runnerParams = { ...baseconfig, ...runnerUtils }
      resolve(typeof asyncFn === "function" ? asyncFn(runnerParams) : runnerParams)
    })
  }))
  .then(e=>{
    // console.log("👏 Oh yeah, Running was successful. 👏")
    return Promise.resolve(e)
  })
  .catch(e=>{
    // console.log("💥🏃 Opps, Runner has stopped working.")
    return Promise.reject(e)
  })
}

module.exports = runner
