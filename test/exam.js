const runner = require("../dist");

runner(async ({ run })=>{
  const r = await run("docker ps", { capture:true })
  console.log("r", r)
})