//加密
function encode(str, password, resolve) {
    const crypto = require('crypto');
    const algorithm = 'aes-192-cbc';
    const fs = require('fs')
    // const password = 'Password used to generate key';

    const key = crypto.scryptSync(password, 'salt', 24)

    const iv = key.toString('hex').slice(0,16) //Buffer.alloc(16, 0);

    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = '';
    cipher.on('readable', () => {
        let chunk;
        while (null !== (chunk = cipher.read())) {
            encrypted += chunk.toString('hex');
        }
    });
    cipher.on('end', () => {
        console.log(encrypted);
        // Prints: e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa
        fs.writeFileSync('./t1', encrypted)
        // fs.close(fd)
        resolve && resolve()
    });

    cipher.write(str);
    cipher.end();
}



function decode(encrypted, password, resolve) {
    const crypto = require('crypto');
    const algorithm = 'aes-192-cbc';
    const key = crypto.scryptSync(password, 'salt', 24)

    const iv = key.toString('hex').slice(0,16) //Buffer.alloc(16, 0);

    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    let decrypted = '';
    decipher.on('readable', () => {
        while (null !== (chunk = decipher.read())) {
            decrypted += chunk.toString('utf8');
        }
    });
    decipher.on('end', () => {
        console.log(decrypted);
        // 打印: 要加密的数据
        const fs = require('fs')
        fs.writeFileSync('./decode', decrypted)
        // setTimeout(function(){
        //     // fs.unlinkSync('./decode')
        // }, 3000)
        resolve && resolve()
    });

    // 使用相同的算法、密钥和 iv 进行加密。
    decipher.write(encrypted, 'hex');
    decipher.end();
}

module.exports = {
    encode,
    decode
}