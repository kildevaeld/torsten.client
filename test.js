const fs = require('fs')

var Client = require('./lib').TorstenClient;

let client = new Client({
	endpoint: "http://localhost:4000",
	token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImFiYzRmNmJkYWQzM2Q3NGY4ZjRhZjUzOTZhMWRmNjZmYmM5NTI2MjBlYmRhM2FlNDAzNmZkNDU0MTg3OGFmYWEiLCJ1aWQiOiJmODk1NmFjOS00OWM4LTQxYzgtOWY1OS0xYWJkNzMwMjdiNGYifQ.u2EqSaIO43fqOc1G7Hr-cB8L9X1feIbk9M8UlTru0PM'
});

client.list('/images').catch(e => {
	console.log('error', e)
}).then(l => {
	console.log(l)
})

//var v = fs.createReadStream('/Users/rasmus/Desktop/fleamarket.jpg')

var out = fs.createWriteStream('image.jpg')

/*client.create("/test.jpg", v)
.then(() => {
	console.log('done')
})*/
client.statById('19934992-8645-40ea-a787-167793b42662')
.then( state => {
	return client.open(state)
}).then( stream => {
	stream.pipe(out)
})
/*client.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI5MDlkMzdhNC1kMTI4LTRmOGQtYjFlMS0wYWVmMWY2MGEwMzUiLCJnaWQiOlsiMGY1MDJkZWYtMzE5Yy00ODE1LTg1ZjUtMGFhMDBhMGQ1MTFiIiwiMTM2YTAzYzUtZDcyNi00Y2I5LWI3M2YtZTYyODFjMjM0YmJhIl0sImlhdCI6MTQ3NDgyMzExMX0.XDVoZ8j5sY-pyUZJpj7ynfRYTuaGvwSpFAhyf1tIUR4"
client.list('/').then((list) => {
    console.log(list)
}).catch(e => {
    console.log('error', e)
})

client.statById('0116f0c6-3825-421d-8626-9bf41377f585')
.then( c => {
	console.log('Hello', c)
}).catch(console.error)*/

/*
let stream = fs.createReadStream('tsconfig.json')

client.create('/tsconfig13.json', stream, {
	mode: 256|32,
	meta: {
		cropping: {
			x: 102,
			y: 220
		},
		image: 1220
	}
}).then( m => {
	console.log(m)
}).catch(console.error)*/

/*client.stat('/images/f5dbde7b8f5204c4b51f317580fc9b554c48fbb2.jpg')
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
    
})*/