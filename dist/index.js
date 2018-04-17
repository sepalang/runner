const path = require("path");

const exec = function exec(command,path){
  new Promise((resolve,reject)=>{
    const commands =  command.trim().split(/\s/);
    
    const { spawn } = require("child_process");
    const app = spawn(commands.shift(), commands, {
      
    });

    app.stdout.on('data', (data) => {
      console.log(`${data}`);
    });

    app.stderr.on('data', (data) => {
      console.log(`${data}`);
    });

    app.on('close', (code) => {
      console.log(`${code}`);
      if(code === 0){
        resolve(code);
      } else {
        reject(code);
      }
    });
  });
};

const test = function(a){
  return path.resolve(__dirname,a);
}

module.exports = function(asyncFn){
  return Promise
  .resolve(asyncFn({ exec, test, resolver:path.resolve, parser:path.parse }))
  .catch((e)=>{
    console.error(e);
    process.exit(1);
  })
  .then(()=>{
    console.log("finallly");
    process.exit(0);
  });
};