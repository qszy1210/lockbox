// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
}

const crypto = require('crypto');
const key = '0132456789abcdef'
const iv = 'fedcba9876543210'

function cipher(str, key, iv) {
    try {
        const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
        return cipher.update(str, 'utf8', 'hex') + cipher.final('hex');
    } catch (err) {
        console.log('加密失败');
        return err.message || err;
    }
}

function decipher(str, key, iv) {
    try {
        const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
        return decipher.update(str, 'hex', 'utf8') + decipher.final('utf8');
    } catch (err) {
        console.log('解密失败');
        return err.message || err;
    }
}


function enWrapper(filename, password) {
    const key = crypto.scryptSync(password, 'salt', 16);
    const fs = require('fs');
    const json = fs.readFileSync(filename)
    const cipherStr = cipher(json, key, iv);
    replaceText('lock-box-en', cipherStr)
    return cipherStr
}

function deWrapper(cipherStr, password) {
    const key = crypto.scryptSync(password, 'salt', 16);
    const decipherStr = decipher(cipherStr, key, iv);
    replaceText('lock-box-de', decipherStr)
}

function elementChange(id, event, callback) {
    const el = document.getElementById(id)
    el.addEventListener(event,callback)
}

elementChange('code', 'blur', function(){
    const key = document.getElementById('code').value
    enWrapper('./box/lock.json', key)
})

const cipherStr = enWrapper('./box/lock.json', '123')

deWrapper(cipherStr, '123')

// const path = require('path');
// const fs = require('fs');
// const json = fs.readFileSync(path.resolve('./box/lock.json'))
//     const cipherStr = cipher(json, key, iv);
//     replaceText('lock-box-en', cipherStr)