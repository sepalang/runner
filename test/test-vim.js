const runner = require("../dist");

runner(async ({ run })=>{  
  const result = await run("vim ./test-vim.js");
  console.log("vim stdout",result);
})
.catch((e)=>{
  // catch block;
  process.exit(1);
})
.then(()=>{
  // finally block
  process.exit(0);
});
