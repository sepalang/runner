const runner = require("../dist");

runner(async ({ run })=>{  
  await run("vim ./test-vim.js");
})
.catch((e)=>{
  // catch block;
  process.exit(1);
})
.then(()=>{
  // finally block
  process.exit(0);
});
