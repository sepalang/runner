#!/usr/bin/env node

const { spawn } = require("child_process");
const npmPath   = require("npm-path");
const path      = require("path");

const run = function run(commands,options){
  
  const argvs    = Array.isArray(commands) ? commands : commands.trim().split(/\s/);
  const unixLike = process.platform !== 'win32';
  
  if (unixLike === true) {
    argvs.unshift('-c');
    argvs.unshift('sh');
  } else {
    argvs.unshift('/c');
    argvs.unshift(process.env.comspec || 'cmd');
  }
  
  return new Promise((resolve,reject)=>{
    
    const execute = argvs.shift();

    if(typeof options === "object"){
      if(options.env){
        Object.assign({
          env    : process.env,
          capture: false
        },
        options,
        {
          env  : Object.assign(process.env,options.env)
        })
      }
      options = options;
    } else if(options === "string") {
      options = {
        cwd    : options,
        env    : process.env,
        capture: false
      }
    } else {
      options = {
        env    : process.env,
        capture: false
      };
    }
    
    const captureMode = options.capture === true;
    npmPath(options);
    
    let stdoutOutput = null;
    let stderrOutput = null;
    
    let outevt = (data)=>{
      const content = data.toString().replace(/\n$/,'');
      stdoutOutput.push(content);
    }
    
    let errevt = (data)=>{
      const content = data.toString().replace(/\n$/,'');
      stderrOutput.push(content);
    }
    
    if(captureMode){
      stdoutOutput = [];
      stderrOutput = [];
      options.stdio = [
        process.stdin,
        null,
        null
      ];
    } else {
      options.stdio = [
        process.stdin,
        process.stdout,
        process.stderr
      ];
    }
    
    const [shOpt, ...shRun] = argvs;
    const shOptRun          = [shOpt, `${shRun.join(' ')}`];
    const application = spawn(execute, shOptRun, options);
    
    if(captureMode){
      application.stdout.on('data', outevt);
      application.stderr.on('data', errevt);
    }
    
    application.on('exit', (code) => {
      //exit
    });
    
    application.on('close', (code) => {
      if(captureMode){
        application.stdout.removeListener('data', outevt);
        application.stderr.removeListener('data', errevt);
      }
      if(code === 0){
        resolve({ code, stdout:stdoutOutput, stderr:stderrOutput });
      } else {
        reject({ code, stdout:stdoutOutput, stderr:stderrOutput });
      }
    });
    
  });
};

const find = function(relative, baseDir){
  const usePathParam = typeof baseDir === "string";
  baseDir = usePathParam ? baseDir : process.argv[1];
  
  if(!relative || relative === "."){
    return baseDir;
  } else if(usePathParam === true) {
    return path.resolve(baseDir, relative);
  } else {
    return path.resolve(path.resolve(baseDir,"../"), relative);
  }
}

const timeout = function (fn, time) {
  if (typeof fn === "number") {
    return new Promise((resolve)=>setTimeout(()=>resolve(time), fn));
  } else {
    return new Promise((resolve)=>setTimeout(()=>resolve(typeof fn === "function" ? fn() : fn), time));
  }
}

module.exports = function(asyncFn){
  // console.log("🏃 Runner 🏃")
  return (new Promise(resolve=>{
    npmPath((err,$PATH)=>{
      resolve(asyncFn({ run, find, timeout, pathResolve:path.resolve, pathParase:path.parse }));
    });
  }))
  .then(e=>{
    // console.log("👏 Oh yeah, Running was successful. 👏")
    return Promise.resolve(e);
  })
  .catch(e=>{
    console.log("💥🏃 Opps, Runner has stopped working.");
    console.log(e);
    return Promise.reject(e);
  });
};