'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = middleware;

var _lodash = require('lodash.unset');

var _lodash2 = _interopRequireDefault(_lodash);

var _initialState = require('./initialState');

var _actions = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var STATE_NAME = 'offlineQueue';
var ASYNC_PAYLOAD_FIELDS = ['payload.promise'];

function middleware() {
  var stateName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : STATE_NAME;
  var asyncPayloadFields = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ASYNC_PAYLOAD_FIELDS;

  STATE_NAME = stateName;
  ASYNC_PAYLOAD_FIELDS = asyncPayloadFields;
  return function (_ref) {
    var getState = _ref.getState,
        dispatch = _ref.dispatch;
    return function (next) {
      return function (action) {
        var state = (getState() || {})[STATE_NAME] || _initialState.INITIAL_STATE;

        var isOnline = state.isOnline,
            queue = state.queue;

        // check if it's a direct action for us

        if (action.type === _actions.ONLINE) {
          var result = next(action);
          queue.forEach(function (actionInQueue) {
            return dispatch(actionInQueue);
          });
          return result;
        }

        var shouldQueue = (action.meta || {}).queueIfOffline;

        // check if we don't need to queue the action
        if (isOnline || !shouldQueue) {
          return next(action);
        }

        var actionToQueue = {
          type: action.type,
          payload: _extends({}, action.payload),
          meta: _extends({}, action.meta, {
            skipOptimist: true
          })
        };

        if (action.meta.skipOptimist) {
          // if it's a action which was in the queue already
          return next({
            type: _actions.QUEUE_ACTION,
            payload: actionToQueue
          });
        }

        dispatch({
          type: _actions.QUEUE_ACTION,
          payload: actionToQueue
        });

        var actionToDispatchNow = action;
        ASYNC_PAYLOAD_FIELDS.forEach(function (field) {
          (0, _lodash2.default)(actionToDispatchNow, field);
        });

        return next(actionToDispatchNow);
      };
    };
  };
}