import createFeedRoute from 'ics-service/feed.js'
import {getIcs} from '../ics.js'

export const feedRoute = createFeedRoute(getIcs)
