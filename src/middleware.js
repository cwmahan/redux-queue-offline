import unset from 'lodash.unset'
import { INITIAL_STATE } from './initialState'
import { QUEUE_ACTION, ONLINE } from './actions'

let STATE_NAME = 'offlineQueue'
let ASYNC_PAYLOAD_FIELDS = ['payload.promise']
// ACTION_CREATORS should be a dictionary of key => fn() (action creators) to be dispatched directly
let ACTION_CREATORS = []

export default function middleware (stateName = STATE_NAME, asyncPayloadFields = ASYNC_PAYLOAD_FIELDS, actionCreators = ACTION_CREATORS) {
  STATE_NAME = stateName
  ASYNC_PAYLOAD_FIELDS = asyncPayloadFields
  return ({ getState, dispatch }) => (next) => (action) => {
    const state = (getState() || {})[STATE_NAME] || INITIAL_STATE

    const { isOnline, queue } = state

    // check if it's a direct action for us
    if (action.type === ONLINE) {
      const result = next(action)
      queue.forEach((actionInQueue) => {
        if (actionInQueue.payload.action) {
          dispatch(actionCreators[actionInQueue.payload.action](...actionInQueue.payload.args))
        } else {
          dispatch(actionInQueue)
        }
      })
      return result
    }

    const shouldQueue = (action.meta || {}).queueIfOffline

    // check if we don't need to queue the action
    if (isOnline || !shouldQueue) {
      return next(action)
    }

    let actionToQueue = {
      type: action.type,
      payload: {...action.payload},
      meta: {
        ...action.meta,
        skipOptimist: true
      }
    }

    if (action.meta.skipOptimist) { // if it's a action which was in the queue already
      return next({
        type: QUEUE_ACTION,
        payload: actionToQueue
      })
    }

    dispatch({
      type: QUEUE_ACTION,
      payload: actionToQueue
    })

    let actionToDispatchNow = action
    ASYNC_PAYLOAD_FIELDS.forEach((field) => { unset(actionToDispatchNow, field) })

    return next(actionToDispatchNow)
  }
}
