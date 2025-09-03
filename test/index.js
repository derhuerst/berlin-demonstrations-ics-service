import {
	notStrictEqual,
} from 'node:assert'

import {getIcs} from '../ics.js'

notStrictEqual(await getIcs(), '', 'generate ICS must not be empty')
