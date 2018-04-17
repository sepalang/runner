<img class="badge-img" src="https://img.shields.io/badge/build-faild-red.svg?longCache=true" alt="red">
# runner


### usage
Run the command from your npm project.
```
npm install sepalang/runner
```

Then write an async await function to execute sequentially.
```js
const runner = require('runner'); //or import runner form 'runner';

runner(asnyc ()=>{
  await step1();
  
  let result = await step2();
  
  if(result)
  await hook(result);
})
.catch(()=>{
  
})