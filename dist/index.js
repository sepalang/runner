const { spawn } = require("child_process");
const path = require("path");

const exec = function exec(commands,options){
  return new Promise((resolve,reject)=>{
    const argvs = commands.trim().split(/\s/);
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
      allowPrint && process.stdout.write(data);
    };
      
    const errdata = (data) => {
      stderr = data.toString();
      allowPrint && process.stderr.write(data);
    };
    
    //if(allowPrint){
    //  process.stdin.setRawMode(true);
    //  process.stdin.on('data', indata);
    //}
    application.stdout.on('data', outdata);
    application.stderr.on('data', errdata);
    
    application.on('close', (code) => {
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

const find = function(relative="./"){
  return path.resolve(process.argv[1],relative);
}

module.exports = function(asyncFn){
  // console.log("🏃 Runner 🏃")
  return Promise
  .resolve(asyncFn({ exec, find, resolver:path.resolve, parser:path.parse }))
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