const runner = require("../dist");

runner(async ({ prompt, echo })=>{
  
  const a = await prompt("Please enter any key")
  echo(`You entered is '${a}'.`)
  
  const b = await prompt({
    message: "Please enter y or n.",
    validate: (input)=>["y","n"].includes(input) ? true : "Be sure to enter y or n."
  })
  echo(`You entered is ${b}`)
  
});