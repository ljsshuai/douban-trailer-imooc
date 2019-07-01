const {readFile}=require('fs')
const EventEmitter = require('events');

class EE extends EventEmitter {}

const yy =new EE()

yy.on('event',()=>{
    console.log('粗大事了!')
})

setTimeout(()=>{

},0)