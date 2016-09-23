

var Client = require('./lib').TorstenClient;

let client = new Client({
    endpoint: "http://localhost:3000"
});

client.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJnaWQiOiJhMjQxYWQ4NS1iMDM2LTQ5YTQtYmIzNi0yNjVkYzM1OGU4ZTEiLCJ1aWQiOiJjYzcwMGQ4Ni04YmMzLTRjODAtOGQxZS1lMDg3MjdkZTE0OWYifQ.dDlnxtNVBFegJLNExsmyej8oKl76Why8eso-MGbg5PE"
client.list('/croppings').then((list) => {
    console.log(list)
}).catch(e => {
    console.log(e)
})