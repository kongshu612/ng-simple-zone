# Motivation
In Angular, Zonejs is the basement.Angular depends on it to figure out if any changes made by user and if the framework needs to do the ChangeDetection. We do see a lot of documents and blogs to discuss about the under logic and how it works. But, these are just human langulages. I want to use js code which is less than 40 lines to show you what zone can do. it is simple and straitforward. So, I built this repo. Hope it can help you to understand the Zone and js

# Why do we need Zone?
zone help us to track the function exection. it can help us to execute some code before or after the function exection. If all our code is **Synchronous**, a simple `Function.bind/apply`can help. But, we may have the **Asynchronous** logic. So Zone help us to resolve this issue. it make the **Asynchronous call** works like **Synchronous**

# How does Zone track the **Asynchronous** exection?
- Wrap, Actually Zone replace all the Asynchronous call. So from some sense, all our code becomes the Synchronous call.

# Example
- for the code bellow, if we execute it, we will see the logs bellow
```js
function myAsyncFunction(message){
    console.log(`####Sync Invoke:  ${message}`);
    Promise.resolve().then(()=>{
        console.log(`###Async Invoke: ${message}`)        
    })
    console.log(`######end ${message}`)
}
function testcase(){
    console.log('############Run WithOut Zone##############')
    myAsyncFunction('message1');
    myAsyncFunction('message2');
}

// ############Run WithOut Zone##############
// ####start message1
// ####Sync Invoke:  message1
// ####end message1
// ####start message2
// ####Sync Invoke:  message2
// ####end message2
// ###Async Invoke: message1
// ###Async Invoke: message2
```

for the async execution, we will lose the context. But if we check the execution under zone
```js
function testInZone(){
    console.log('##############Run In Zone#########################')
    const zone1=Zone.current.fork('message1',{
        beforeInvoke:()=>{console.log('start of message1: ')},
        afterInvoke:()=>{console.log('end of message1: ')}
    });
    const zone2=Zone.current.fork('message2',{
        beforeInvoke:()=>{console.log('start of message2: ')},
        afterInvoke:()=>{console.log('end of message2: ')}
    });



    // this is the main test logic
    zone1.run(myAsyncFunction.bind(undefined,'message1'));
    zone2.run(myAsyncFunction.bind(undefined,'message2'));
}

// ##############Run In Zone#########################
// start of message1
// ####Sync Invoke:  message1
// end of message1
// start of message2
// ####Sync Invoke:  message2
// end of message2
// start of message1
// ###Async Invoke: message1
// end of message1
// start of message2
// ###Async Invoke: message2
// end of message2
```
we will see that the async part is running in the same context as the sync part


