import {DateTime} from 'luxon'
import {deepStrictEqual} from 'node:assert'
import fetch from 'cross-fetch'
import createDebug from 'debug'
import pkg from '../package.json' with {type: 'json'}

const debug = createDebug('berlin-demonstrations-ics-service:fetch-demonstrations')

const inBerlinTimezoneAsIso = (parsedDate, parsedTime) => {
	const {year, month, day} = parsedDate
	const {hour, minute, second} = parsedTime
	return DateTime
	.fromObject({
		year, month, day,
		hour, minute, second,
	}, {
		zone: 'Europe/Berlin',
		locale: 'de-DE',
	})
	.toISO({
		suppressMilliseconds: true,
	})
}

// https://www.berlin.de/polizei/service/versammlungsbehoerde/versammlungen-aufzuege/
// https://support.berlin.de/wiki/SimpleSearch_API
const DEMONSTRATIONS_URL = `\
https://www.berlin.de/polizei/service/versammlungsbehoerde/versammlungen-aufzuege/index.php/index.json`

const parseDate = (dateStr) => {
	const match = /^(\d{1,2})\.(\d{1,2})\.(\d{2,4})$/.exec(dateStr.trim())
	if (!match) return null
	const [day, month, year] = match.slice(1)
	return {
		year: year.length < 4 ? 2000 + (+year) : +year,
		month: +month,
		day: +day,
	}
}
deepStrictEqual(parseDate(''), null)
deepStrictEqual(parseDate('foo'), null)
deepStrictEqual(parseDate('22.05.'), null)
deepStrictEqual(parseDate('22.05.23'), {year: 2023, month: 5, day: 22})
deepStrictEqual(parseDate('22.05.2123'), {year: 2123, month: 5, day: 22})
deepStrictEqual(parseDate('111.05.2123'), null)
deepStrictEqual(parseDate('22.111.23'), null)
deepStrictEqual(parseDate('22.05.11111'), null)

const parseTime = (timeStr) => {
	const match = /^(\d{1,2}):(\d{2})$/.exec(timeStr.trim())
	if (!match) return null
	const [hour, minute] = match.slice(1)
	return {
		hour: +hour,
		minute: +minute,
		second: 0,
	}
}
deepStrictEqual(parseTime(''), null)
deepStrictEqual(parseTime('foo'), null)
deepStrictEqual(parseTime('11:'), null)
deepStrictEqual(parseTime('11:22'), {hour: 11, minute: 22, second: 0})
deepStrictEqual(parseTime('111:22'), null)
deepStrictEqual(parseTime('11:222'), null)

// const parseDemonstrations = (body) => {
// 	const $ = loadHtml(body)
// 	const table = $('#results .searchresult .result.table')

// 	const headers = Array.from($('thead th', table).map((_, el) => $(el).text().trim().toLowerCase()))
// 	// todo: assert headers
// 	const dateIdx = headers.indexOf('datum')
// 	const timeStartIdx = headers.indexOf('von')
// 	const timeEndIdx = headers.indexOf('bis')
// 	const topicIdx = headers.indexOf('thema')
// 	const locationIdx = headers.indexOf('versammlungsort')
// 	const zipCodeIdx = headers.indexOf('plz')
// 	const routeIdx = headers.indexOf('aufzugsstrecke')

// 	const demonstrations = Array.from($('tbody tr', table))
// 	.map((row, i) => {
// 		const cells = Array.from($('td', row).map((_, el) => $(el).text().trim()))
// 		if (cells.length !== 7) {
// 			debug('ignoring weird table row', cells)
// 			return null
// 		}
// 		// todo: assert cells

// 		return {
// 			date: cells[dateIdx] || null,
// 			timeStart: cells[timeStartIdx] || null,
// 			timeEnd: cells[timeEndIdx] || null,
// 			topic: cells[topicIdx] || null,
// 			location: cells[locationIdx] || null,
// 			zipCode: cells[zipCodeIdx] || null,
// 			route: cells[routeIdx] || null,
// 		}
// 	})
// 	.filter(row => row !== null)
// 	return demonstrations
// }

const parseDemonstrations = (body) => {
	const demonstrations = body.index
	.map((entry) => {
		const date = entry.datum ? parseDate(entry.datum) : null
		const timeStart = entry.von ? parseTime(entry.von) : null
		const timeEnd = entry.bis ? parseTime(entry.bis) : null

		let startIso = null, endIso = null
		if (date && timeStart) {
			startIso = inBerlinTimezoneAsIso(date, timeStart)
		}
		if (date && timeEnd) {
			endIso = inBerlinTimezoneAsIso(date, timeEnd)
		}

		return {
			date, timeStart, timeEnd,
			start: startIso, end: endIso,
			topic: entry.thema || null,
			zipCode: entry.plz || null,
			location: entry.strasse_nr || null,
			route: entry.aufzugsstrecke || null,
		}
	})
	return demonstrations
}

const fetchDemonstrations = async () => {
	debug('fetching demonstrations from berlin.de')
	const res = await fetch(DEMONSTRATIONS_URL, {
		headers: {
			'accept': 'application/json',
			'user-agent': `${pkg.name} v${pkg.version}`,
		},
	})
	if (!res.ok) {
		const err = new Error(`${res.ur}: ${res.status} ${res.statusText}`)
		err.url = res.url
		err.status = res.status
		err.statusText = res.statusText
		err.headers = res.headers
		throw err
	}
	// todo: assert content-type?
	const body = await res.json()

	const demonstrations = parseDemonstrations(body)
	debug('demonstrations', demonstrations)
	return demonstrations
}

export {
	parseDemonstrations,
	fetchDemonstrations,
}
