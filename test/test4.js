const runner = require("../dist");

runner(async ({ prompt })=>{
  const promptString = await prompt(`prompt(:string)`)
  console.log("promptString", promptString)

  const promptMessage = await prompt({ message:`prompt({ message:string })` })
  console.log("promptMessage", promptMessage)
  
  const yn = await prompt({
    message: "Please enter y or n.",
    validate: (input)=>["y","n"].includes(input) ? true : "Be sure to enter y or n."
  })
  console.log("yn", yn)
  
  const trimList = await prompt({
    message:`prompt({type:string="list", message:string})`,
    type:"list",
  })
  console.log("trimList", trimList)

  const trimSep = await prompt({
    message:`prompt({type:string="list", separator:string="|"})`,
    type:"list",
    separator:"|",
  })

  const noTrimList = await prompt({
    message:`prompt({type:string="list", message:string, noTrim:true })`,
    type:"list",
    noTrim: true,
  })
  console.log("noTrimList", noTrimList)
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
