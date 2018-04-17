module.exports.task = function(asyncFn){
  return Promise
  .resolve(asyncFn())
  .catch((e)=>{
    console.error(e);
    process.exit(1);
  })
  .then(()=>{
    console.log("finallly");
    process.exit(0);
  });
};

module.exports.exec = function exec(command,path){
  new Promise((resolve,reject)=>{
    const { spawn } = require("child_process");
    const app = spawn('node', ['./node_modules/.bin/npm', 'i', 'electron']);

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