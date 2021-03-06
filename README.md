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


#### block run

```js
const runner = require("@sepalang/runner"); //or import runner form "runner";

// Generate processors sequentially.
runner(async ({ run })=>{

  // Sequential execution using await
  await run("pwd");
  // /Users/user/runner/test

  // Can run vim.
  await run("vim");
  
  // Can run npm.
  await run("npm run-script");
  

  let stdout;
  const { stdout } = await run("pwd",{ capture:true }));
  // /Users/user/runner/test
  console.log({stdout}) // {stdout:['/Users/user/runner/test']}

  ({ stdout } = await run("ls -a",{ capture:true, silent:true }));
  console.log(stdout); // [ 'test-vim.js','ntest1.js','test3.js' ]
  
})
```

#### block utils
```js
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
```

#### confirm
```js
runner(async ({ confirm })=>{
  const isOk = await confirm("Are you sure?")
});
```

#### prompt
```js
runner(async ({ prompt })=>{
  //prompt
  const anyKey = await prompt("Please enter any key")
  console.log(`You entered is '${anyKey}'.`)
  
  const yn = await prompt({
    message: "Please enter y or n.",
    validate: (input)=>["y","n"].includes(input) ? true : "Be sure to enter y or n."
  })
  console.log(`You entered is ${yn}`)

  const keywords = await prompt({
    type: "list",
    message: "Enter keywords."
  }) // 1,2,3,4,5,
  console.log(`You entered is ${keywords}`) // ['1','2','3','4','5']
})
```

#### select

```js
// Provide input.
runner(async ({ select })=>{
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
```

#### inline run
```js

// Load parameters outside the block
async function asyncBlock(){
  const { run } = await runner()
  await run("pwd");
}

```

#### with process
```js
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
runner npm start
runner ./other/cwd/path npm start
```


### Updated

#### 0.13.1
- Fixed a problem in which the `silent` option did not work properly.

#### 0.13.0
- The stdout of the `capture` option was truncated in versions `0.12.x` and below. This bug has been fixed.