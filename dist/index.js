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
          env:process.env,
          print:true
        },
        options,
        {
          env:Object.assign(process.env,options.env),
          stdio: [
            process.stdin
          ]
        })
      }
      options = options;
    } else if(options === "string") {
      options = {
        cwd:options,
        env:process.env,
        print:true,
        stdio: [
          process.stdin
        ]
      }
    } else {
      options = {
        env:process.env,
        print:true,
        stdio: [
          process.stdin
        ]
      };
    }
    
    npmPath(options);
    
    const [shOpt, ...shRun] = argvs;
    const shOptRun          = [shOpt, `${shRun.join(' ')}`];
    const application = spawn(execute, shOptRun, options);
    const allowPrint  = options.print !== false;
    let stdout;
    let stderr;
    
    const indata = (c)=>{
      application.stdin.write(c);
    };
    
    const outdata = (data) => {
      stdout = data.toString();
      if(allowPrint === false) return;
      process.stdout.write(data);
    };
      
    const errdata = (data) => {
      stderr = data.toString();
      if(allowPrint === false) return;
      process.stderr.write(data);
    };
    
    application.stdout.on('data', outdata);
    application.stderr.on('data', errdata);
    
    application.on('exit', (code) => {
      //child process closed
    });
    
    application.on('close', (code) => {
      application.stdout.removeListener('data', outdata);
      application.stderr.removeListener('data', errdata);
      
      if(code === 0){
        resolve({ code, stdout, stderr });
      } else {
        reject({ code, stdout, stderr });
      }
    });
    
  });
};

const find = function(relative="."){
  return !relative || relative === "." ? process.argv[1] : path.resolve(path.resolve(process.argv[1],"../"),relative);
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