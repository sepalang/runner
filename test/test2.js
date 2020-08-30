const runner = require("../dist");

runner(async ({ cwd, pwd, fwd })=>{
  const expectedCwd = process.cwd()
  const expectedPwd = __dirname
  const expectedFwd = __filename

  if(expectedCwd !== cwd){
    throw new Error(`Expected cwd result is different { ${expectedCwd} !== ${cwd} }`)
  }

  if(expectedPwd !== pwd){
    throw new Error(`Expected pwd result is different { ${expectedPwd} !== ${pwd} }`)
  }

  if(expectedFwd !== fwd){
    throw new Error(`Expected fwd result is different { ${expectedFwd} !== ${fwd} }`)
  }
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
