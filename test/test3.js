const runner = require("../dist");

runner(async ({ timeoutPromise })=>{
  console.log("0ms");
  
  await timeoutPromise(3000);
  console.log("3000ms");
  
  await timeoutPromise(3000);
  console.log("6000ms");
  
  await timeoutPromise(()=>{
    console.log("9000ms");
  },3000);
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
