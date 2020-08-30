const runner = require("../dist");

runner(async ({ run })=>{  
  let stdout;
  let code;
  
  console.log("run test 1");
  await run("pwd");
  
  
  console.log("run test 2");
  ({ stdout } = await run("pwd",{ capture:true }));
  console.log("test 2 => ",stdout);
  
  
  console.log("run test 3");
  ({ stdout } = await run(["ls", "-a"],{ capture:true }));
  console.log("test 3 result -- \n",stdout);
  
  
  console.log("run test 4");
  await run(["npm-path"]);
  
  
  console.log("run test 5");
  await run(["npm run-script"]);
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
