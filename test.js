

var Client = require('./lib').TorstenClient;

let client = new Client({
    endpoint: "http://localhost:3000"
});

client.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI5MDlkMzdhNC1kMTI4LTRmOGQtYjFlMS0wYWVmMWY2MGEwMzUiLCJnaWQiOiIwZjUwMmRlZi0zMTljLTQ4MTUtODVmNS0wYWEwMGEwZDUxMWIiLCJpYXQiOjE0NzQ2NTgyMjB9.1vVC1eqXmTMP6k_erzMOAQIF_N3aiqm6PKk6BIqOVeI"
client.list('/images').then((list) => {
    console.log(list)
}).catch(e => {
    console.log(e)
})