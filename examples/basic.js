import { Zone } from "../libs/zone.js";
function myAsyncFunction(message){
    console.log(`####Sync Invoke:  ${message}`);
    Promise.resolve().then(()=>{
        console.log(`###Async Invoke: ${message}`)        
    })
}

function testcase(){
    console.log('############Run WithOut Zone##############')
    console.log(`######start message1`);
    myAsyncFunction('message1');
    console.log(`######end message1`);
    console.log(`######start message2`);
    myAsyncFunction('message2');
    console.log(`######end message2`);
}

function testInZone(){
    console.log('##############Run In Zone#########################')
    const zone1=Zone.current.fork('message1',{
        beforeInvoke:()=>{console.log('start of message1')},
        afterInvoke:()=>{console.log('end of message1')}
    });
    const zone2=Zone.current.fork('message2',{
        beforeInvoke:()=>{console.log('start of message2')},
        afterInvoke:()=>{console.log('end of message2')}
    });



    // this is the main test logic
    zone1.run(myAsyncFunction.bind(undefined,'message1'));
    zone2.run(myAsyncFunction.bind(undefined,'message2'));
}


testcase();

setTimeout(testInZone);

// this is the output:


// ############Run WithOut Zone##############
// ######start message1
// ####Sync Invoke:  message1
// ######end message1
// ######start message2
// ####Sync Invoke:  message2
// ######end message2
// ###Async Invoke: message1
// ###Async Invoke: message2
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