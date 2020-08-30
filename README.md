[![CircleCI](https://circleci.com/gh/sepalang/runner/tree/master.svg?style=shield)](https://circleci.com/gh/sepalang/runner/tree/master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/36b7164939d746e99394686e9dbdc9b5)](https://www.codacy.com/app/labeldock/runner?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=sepalang/runner&amp;utm_campaign=Badge_Grade)
[![Greenkeeper badge](https://badges.greenkeeper.io/sepalang/runner.svg)](https://greenkeeper.io/)

# 🏃 runner
It was created to make child processes easier.

### usage
Run the command from your npm project.
```
npm install @sepalang/runner
```

Then write an async await function to execute sequentially.
```js
const runner = require("@sepalang/runner"); //or import runner form "runner";

// Generate processors sequentially.
runner(async ({ run })=>{

  // Sequential execution using await
  await run("pwd"); // /Users/user/runner/test
  
  // Can run vim.
  await run("vim");
  
  // Can run npm.
  await run("npm run-script");
  

  let stdout;
  ({ stdout } = await run("pwd",{ capture:true }));
  console.log(stdout); // ['/Users/user/runner/test']
  
  ({ stdout } = await run("ls -a",{ capture:true }));
  console.log(stdout); // [ '.\n..\ntest-vim.js\ntest1.js\ntest2.js\ntest3.js' ]
  
})

// Provides frequently used parameters when executing a process.
runner(async ({ pwd, cwd, fwd, timeoutPromise })=>{

  console.log("cwd", cwd); // /Users/user/runner
  console.log("pwd", pwd); // /Users/user/runner/test
  console.log("fwd", fwd); // /Users/user/runner/test/test.js
  
  //wait 3000ms
  await timeoutPromise(3000);  
  await timeoutPromise(()=>{
    //wait 3000ms
  },3000);

})

// Provide input.
runner(async ({ prompt, select })=>{
  //prompt
  const anyKey = await prompt("Please enter any key")
  echo(`You entered is '${anyKey}'.`)
  
  const yn = await prompt({
    message: "Please enter y or n.",
    validate: (input)=>["y","n"].includes(input) ? true : "Be sure to enter y or n."
  })
  echo(`You entered is ${yn}`)


  //select
  const options = [
    {label:"foo", value:"SELECTED_FOO", description: "I'm FOO"},
    {label:"bar", value:"SELECTED_BAR", description: "I'm BAR"},
  ]

  const selectSingle = await select({
    message: "selectSingle",
    options,
  })
  console.log("selectSingle", selectSingle) // ['SELECTED_FOO']

  const selectMultiple = await select({
    message: "selectMultiple",
    multiple: true,
    options,
  })
  console.log("selectMultiple", selectMultiple) // ['SELECTED_FOO', 'SELECTED_BAR']

})

// Works as a Promise Base.
runner(()=>{})
.then(()=>{
  // finally block
  process.exit(0);
})
.catch((e)=>{
  // catch block;
  process.exit(1);
});

```

### cmd
```
runner ./other/cwd/path npm start
```
