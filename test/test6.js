const runner = require("../dist");

runner(async ({ confirm })=>{
  const confirmResult = await confirm(`Can you confirm?`)
  console.log("confirmResult", confirmResult)
})
.then(()=>{
  // finally block
  process.exit(0);
})
.catch((e)=>{
  console.log(e)
  // catch block;
  process.exit(1);
})
