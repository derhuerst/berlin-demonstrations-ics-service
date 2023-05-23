'use strict'

const {ok} = require('assert')
const {Duration} = require('luxon')
const {createHash} = require('crypto')
const generateIcs = require('ics-service/generate-ics')
const debug = require('debug')('berlin-demonstrations-ics-service:ics')
const {fetchDemonstrations} = require('./lib/fetch-demonstrations')
const pkg = require('./package.json')

const TITLE = 'Demonstrations in Berlin'
const REPO_URL = pkg.homepage
ok(REPO_URL, 'pkg.homepage should not be empty')

const generateBerlinDemonstrationsIcs = async (feedUrl = null) => {
	const demonstrations = await fetchDemonstrations()

	const events = demonstrations.map((d) => {
		let duration = d.start && d.end
			? Duration.fromMillis(Date.parse(d.end) - Date.parse(d.start))
			: null
		if (duration) {
			duration = {
				days: duration.days,
				hours: duration.hours,
				minutes: duration.minutes,
				seconds: duration.seconds,
			}
		}

		const event = {
			uid: createHash('sha256').update(JSON.stringify({
				date: d.date,
				timeStart: d.timeStart,
				zipCode: d.zipCode,
				location: d.location,
			})).digest('hex'),
			title: d.topic
				? d.topic.slice(0, 50).trim()
				: '?',
			description: d.topic + (d.route ? '\n\n' + d.route : ''),
			location: d.location + ' ' + d.zipCode,
			start: [
				d.date.year, d.date.month, d.date.day,
				d.timeStart.hour, d.timeStart.minute,
			],
			startOutputType: 'local',
			duration,

			// todo: are these necessary?
			status: 'CONFIRMED',
			sequence: 1,
			productId: REPO_URL,
		}
		return event
	})
	debug('events', events)

	return generateIcs(TITLE, events, feedUrl)
}

module.exports = generateBerlinDemonstrationsIcs
