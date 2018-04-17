const runner = require('../dist');

runner(async ({ exec })=>{
  await exec("pwd");
  await exec("ls");
})
.catch((e)=>{
  // catch block;
  console.log("reason\n",e)
  process.exit(1);
})
.then(()=>{
  // finally block
  process.exit(0);
});