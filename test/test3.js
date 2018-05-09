const runner = require("../dist");

runner(async ({ timeout })=>{
  console.log("0ms");
  
  await timeout(3000);
  console.log("3000ms");
  
  await timeout(3000);
  console.log("6000ms");
  
  await timeout(()=>{
    console.log("9000ms");
  },3000);
})
.catch((e)=>{
  // catch block;
  process.exit(1);
})
.then(()=>{
  // finally block
  process.exit(0);
});