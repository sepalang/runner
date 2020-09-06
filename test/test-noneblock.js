const runner = require("../dist");

Promise.resolve().then(async ()=>{
  const runnerParams = await runner()
  console.log(runnerParams)
})
