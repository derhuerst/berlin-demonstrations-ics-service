'use strict'

const {deepStrictEqual} = require('assert')
const {parseDemonstrations} = require('../lib/fetch-demonstrations')

const someDemonstrations = require('./demonstrations-2023-05-23T00:32:48+02:00.json')
// const someDemonstrations = readFileSync(pathJoin(__dirname, 'demonstrations-2023-05-23T00:32:48+02:00.html'), {encoding: 'utf8'})

const expected = [
	{
		"date": {
			"year": 2023,
			"month": 5,
			"day": 22
		},
		"timeStart": {
			"hour": 10,
			"minute": 30,
			"second": 0
		},
		"timeEnd": {
			"hour": 13,
			"minute": 0,
			"second": 0
		},
		"start": "2023-05-22T10:30:00+02:00",
		"end": "2023-05-22T13:00:00+02:00",
		"topic": "Stoppt die Verfolgung von FALUN DAFA / FALUN-GONG Praktizierenden und anderen unschuldigen Menschen in China. Beendet die Diktatur der Kommunistischen Partei. (vom 01.01. bis 31.12.2023 - jeweils Mo., Di., Mi., Do., Fr., Sa., So.)",
		"zipCode": "10179",
		"location": "Jannowitzbrücke",
		"route": null,
	},
	{
		"date": {
			"year": 2023,
			"month": 5,
			"day": 22
		},
		"timeStart": {
			"hour": 11,
			"minute": 0,
			"second": 0
		},
		"timeEnd": {
			"hour": 18,
			"minute": 0,
			"second": 0
		},
		"start": "2023-05-22T11:00:00+02:00",
		"end": "2023-05-22T18:00:00+02:00",
		"topic": "HUNGERSTREIK MAHNWACHE - Gegen Paragraf 129a+b  Freiheit für alle Politischen Gefangenen in Deutschland ! (vom 09.05. bis 11.08.2023 - jeweils Mo.,Di.,Mi.,Do.,Fr.)",
		"zipCode": "10117",
		"location": "Mohrenstr. 40",
		"route": null,
	},
	{
		"date": {
			"year": 2023,
			"month": 5,
			"day": 22
		},
		"timeStart": {
			"hour": 12,
			"minute": 0,
			"second": 0
		},
		"timeEnd": {
			"hour": 14,
			"minute": 0,
			"second": 0
		},
		"start": "2023-05-22T12:00:00+02:00",
		"end": "2023-05-22T14:00:00+02:00",
		"topic": "Mahnwache vor dem RKI Kritisiert wird die Rolle des RKI im Zusammenhang mit der  Corona-Hysterie und den dadurch begründeten  Menschenrec- htsverletzungen. Ferner besteht weiterhin die Forderung nach Erfüllung der Informationspflicht als Regierungsbehörde. (vom 07.11.2022 bis 29.05.2023 - jeweils Mo.)",
		"zipCode": "13353",
		"location": "Nordufer 20",
		"route": null,
	},
	{
		"date": {
			"year": 2023,
			"month": 5,
			"day": 22
		},
		"timeStart": {
			"hour": 14,
			"minute": 0,
			"second": 0
		},
		"timeEnd": {
			"hour": 16,
			"minute": 0,
			"second": 0
		},
		"start": "2023-05-22T14:00:00+02:00",
		"end": "2023-05-22T16:00:00+02:00",
		"topic": "Frieden lernen (vom 06.03. bis 26.06.2023 - jeweils Mo.)",
		"zipCode": "13086",
		"location": "Antonplatz 1",
		"route": null,
	},
]

const actual = parseDemonstrations(someDemonstrations).slice(0, 4)
deepStrictEqual(actual, expected)

console.info('looks good!')
