const runner = require('../dist');

runner(async ({ exec })=>{
  const { stdout:pwdout } = await exec("pwd");
  const { stdout:lsout } = await exec("ls -a");
  
  console.log("PWD -\n",pwdout);
  console.log("LS  -\n",lsout)
})
.catch((e)=>{
  // catch block;
  process.exit(1);
})
.then(()=>{
  // finally block
  process.exit(0);
});