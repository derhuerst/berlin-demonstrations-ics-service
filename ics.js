'use strict'

const generateIcs = require('ics-service/generate-ics')
const debug = require('debug')('berlin-demonstrations-ics-service:ics')

const TITLE = 'Demonstrations in Berlin'

const generateBerlinDemonstrationsIcs = async (feedUrl = null) => {
	const events = []
	// todo
	debug('events', events)

	return generateIcs(TITLE, events, feedUrl)
}

module.exports = generateBerlinDemonstrationsIcs
