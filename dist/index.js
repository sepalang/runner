const { spawn } = require("child_process");
const path = require("path");

const exec = function exec(commands,options){
  
  const argvs = Array.isArray(commands) ? commands : commands.trim().split(/\s/);
  
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
          env:Object.assign(process.env,options.env)
        })
      }
      options = options;
    } else if(options === "string") {
      options = {
        cwd:options,
        env:process.env,
        print:true
      }
    } else {
      options = {
        env:process.env,
        print:true
      };
    }
    
    const application = spawn(execute, argvs, options);
    const allowPrint = options.print !== false;
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
    //next feature. It still has tmux (stdio) and vim (resize) issues.
    //if(allowPrint){
    //  process.stdin.setRawMode(true);
    //  process.stdin.on('data', indata);
    //}
    
    application.stdout.on('data', outdata);
    application.stderr.on('data', errdata);
    
    application.on('close', (code) => {
      //next feature
      //if(allowPrint){
      //  process.stdin.setRawMode(false);
      //  process.stdin.removeListener('data', indata);
      //}
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
  return Promise
  .resolve(asyncFn({ exec, find, timeout, pathResolve:path.resolve, pathParase:path.parse }))
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