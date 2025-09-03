import {createServer} from 'node:http'
import {aboutRoute as about} from './api/index.js'
import {feedRoute as feed} from './api/feed.js'

const server = createServer((req, res) => {
	const path = new URL(req.url, 'http://example.org').pathname

	if (path === '/') {
		about(req, res)
	} else if (path === '/api/feed') {
		feed(req, res)
	} else {
		res.writeHead(404, 'not found')
		res.end('not found')
	}
})

const port = parseInt(process.env.PORT || 3000)
server.listen(port, (err) => {
	if (err) {
		console.error(err)
		process.exit(1)
	} else console.info('listening on ' + port)
})
