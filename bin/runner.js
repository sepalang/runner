#!/usr/bin/env node
const runner = require("../dist");
const path = require("path");
const argv = process.argv.slice(2);

runner(async ({ run })=>{
  if(!argv.length) throw new Error("The parameters are required for the Runner to run.");
  const hasCwd  = /^(\.\/|\.\.\/)/.test(argv[0]);
  const cwd     = hasCwd ? path.resolve(process.cwd(), argv[0]) : process.cwd();
  const command = hasCwd ? argv.slice(1) : argv;
  return await run(command,cwd);
})
.catch((e)=>{
  process.exit(1);
})
.then(()=>{
  process.exit(0);
});