const runner = require('../dist');

runner(async ({ exec })=>{  
  let stdout;
  ({ stdout } = await exec("ls -a",{print:false}));
  console.log("stdout 1",stdout);
  
  ({ stdout } = await exec(["ls", "-a"],{print:false}));
  console.log("stdout 2",stdout);
})
.catch((e)=>{
  // catch block;
  process.exit(1);
})
.then(()=>{
  // finally block
  process.exit(0);
});