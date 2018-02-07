const http = require('http')
const streams = require('stream')
const Router = require('router')
const finalhandler = require('finalhandler')

class LogStream extends streams.PassThrough {
    constructor() {
        super()

        this.on('data', (chunk) => {
            console.log(chunk.toString())
        })
    }
}

let router = Router()
router.all('*', function (req, res) {
    console.log(`${req.method} ${req.url}`)

    for (let header in req.headers) {
        const val = req.headers[header]
        res.setHeader(header, val)
        console.log(`${header}: ${val}`)
    }
    req.pipe(new LogStream()).pipe(res)
})

let server = http.createServer(function(req, res) {
  router(req, res, finalhandler(req, res))
})

server.listen(process.env.PORT || 3000)