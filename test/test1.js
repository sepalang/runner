const runner = require("../dist");

runner(async ({ run })=>{  
  let stdout;
  
  console.log("run test 1");
  await run("pwd");
  
  
  console.log("run test 2");
  ({ stdout } = await run("pwd"));
  console.log("test 2 result -- \n",stdout);
  
  
  console.log("run test 3");
  ({ stdout } = await run(["ls", "-a"],{print:false}));
  console.log("test 3 result -- \n",stdout);
  
  
  console.log("run test 4");
  await run(["npm-path"]);
  

  console.log("run test 5");
  await run(["npm run-script"]);
})
.catch((e)=>{
  // catch block;
  process.exit(1);
})
.then(()=>{
  // finally block
  process.exit(0);
});