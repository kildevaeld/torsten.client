const fs = require('fs')

var Client = require('./lib').TorstenClient;

let client = new Client({
    endpoint: "http://localhost:3000"
});

client.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIzZTQxODM3NC1mYjhiLTRjYTQtOGI4MC1iNGM0MmZhNGQwMjkiLCJnaWQiOlsiOWVmYjVmMjMtMTlmMC00ZjYzLTgwMTUtYzY2NWZlNzRiMDQxIiwiN2JiZTI4OTktNTVkZS00NDk1LTllZjItZWYxYjkyYzVkMWNhIl0sImlhdCI6MTQ3NDc0Mzc1N30.2m_-NnZ01W-AoYY1z8OPVw-0z9MslJwQG_5nTHVx0Vk"
client.list('/images').then((list) => {
    console.log(list)
}).catch(e => {
    console.log(e)
})

client.stat('/images/f5dbde7b8f5204c4b51f317580fc9b554c48fbb2.jpg')
.then((image) => {
    console.log(image)
}).catch(e => {
    console.error(e.json)
})

client.open('/images/f5dbde7b8f5204c4b51f317580fc9b554c48fbb2.jpg')
.then( b => {
   let ws = fs.createWriteStream('image.jpg');
    b.pipe(ws)
}).then( stream => {
    
})