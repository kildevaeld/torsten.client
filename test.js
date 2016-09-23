const fs = require('fs')

var Client = require('./lib').TorstenClient;

let client = new Client({
    endpoint: "http://localhost:3000"
});

client.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI1MmRmNDg3MS1kMjRjLTQ0NTUtOTMzMy00MDUwZjIwN2RhMTciLCJnaWQiOlsiZGUxODRjNmItMjM5YS00ZmEwLThhYWEtYWY1MjA0NjUxZGZkIiwiZGQwNzIzZDQtYWY5Ny00NTUxLTkwZjEtYTI2NDdiZmM2YjJmIl0sImlhdCI6MTQ3NDY2OTI1OH0.cNnL5tXZuiNhvGke2njF6SxGe6lNhd6R4NRh2h0_FPU"
client.list('/images').then((list) => {
    //console.log(list)
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