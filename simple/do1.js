const fs = require('fs')

const {encode, decode} = require('./util')

// console.log('argu', process.argv)
const password = process.argv && process.argv[2]

const p = new Promise(rel=>{
    encode('abcdef', password, rel)
})

// encode('abcde', '123')

// p.then(function(){
//     const encrypted = fs.readFileSync('./t1')
//     // console.log(encrypted)

//     decode(encrypted.toString(), password)
// })
