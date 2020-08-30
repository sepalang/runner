const runner = require("../dist");

runner(async ({ select })=>{

  const options = [
    {label:"foo", value:"SELECTED_FOO", description: "I'm FOO"},
    {label:"bar", value:"SELECTED_BAR", description: "I'm BAR"},
  ]


  const selectSingle = await select({
    message: "selectSingle",
    options,
  })
  console.log("selectSingle", selectSingle)


  const selectMultiple = await select({
    message: "selectMultiple",
    multiple: true,
    options,
  })
  console.log("selectMultiple", selectMultiple)
  
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
