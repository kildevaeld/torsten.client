

var Client = require('./lib').TorstenClient;

let client = new Client({
    endpoint: "http://localhost:3000"
});

client.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI5MDlkMzdhNC1kMTI4LTRmOGQtYjFlMS0wYWVmMWY2MGEwMzUiLCJnaWQiOlsiMGY1MDJkZWYtMzE5Yy00ODE1LTg1ZjUtMGFhMDBhMGQ1MTFiIiwiMTM2YTAzYzUtZDcyNi00Y2I5LWI3M2YtZTYyODFjMjM0YmJhIl0sImlhdCI6MTQ3NDY2NzUwM30.GVBlmmMChsrSh7taECOenQAlI69bG-dT51dUIsFaq7s"
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