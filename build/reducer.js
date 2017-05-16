'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = reducer;

var _initialState = require('./initialState');

var _actions = require('./actions');

function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _initialState.INITIAL_STATE;
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  switch (action.type) {
    case _actions.QUEUE_ACTION:
      return _extends({}, state, { queue: state.queue.concat(action.payload) });
    case _actions.ONLINE:
      return { queue: [], isOnline: true };
    case _actions.OFFLINE:
      return _extends({}, state, { isOnline: false });
    default:
      return state;
  }
}