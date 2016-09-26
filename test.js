const fs = require('fs')

var Client = require('./lib').TorstenClient;

let client = new Client({
    endpoint: "http://localhost:4000"
});

client.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI5MDlkMzdhNC1kMTI4LTRmOGQtYjFlMS0wYWVmMWY2MGEwMzUiLCJnaWQiOlsiMGY1MDJkZWYtMzE5Yy00ODE1LTg1ZjUtMGFhMDBhMGQ1MTFiIiwiMTM2YTAzYzUtZDcyNi00Y2I5LWI3M2YtZTYyODFjMjM0YmJhIl0sImlhdCI6MTQ3NDgyMzExMX0.XDVoZ8j5sY-pyUZJpj7ynfRYTuaGvwSpFAhyf1tIUR4"
client.list('/').then((list) => {
    //console.log(list)
}).catch(e => {
    console.log(e)
})


let stream = fs.createReadStream('tsconfig.json')

client.create('/tsconfig10.json', stream, {
	mode: 256|128|64,
	meta: {
		cropping: {
			x: 102,
			y: 220
		},
		image: 1220
	}
}).then( m => {
	console.log(m)
}).catch(console.error)

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