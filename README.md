# runner


### usage
Run the command from your npm project.
```
npm install sepalang/runner
```

Then write an async await function to execute sequentially.
```js
const runner = require('runner'); //or import runner form 'runner';

runner(async ()=>{
  await step1();
  
  let result = await step2();
  
  if(result){
    await hook(result);
  }
  
  return await step3();
})
.catch(()=>{
  // catch block;
  process.exit(1);
})
.then(()=>{
  // finally block
  process.exit(0);
});

```