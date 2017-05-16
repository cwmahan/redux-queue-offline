'use strict';

var _actions = require('./actions');

var actions = _interopRequireWildcard(_actions);

var _middleware = require('./middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _reducer = require('./reducer');

var _reducer2 = _interopRequireDefault(_reducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

module.exports = {
  ONLINE: actions.ONLINE,
  OFFLINE: actions.OFFLINE,
  QUEUE_ACTION: actions.QUEUE_ACTION,
  middleware: _middleware2.default,
  reducer: _reducer2.default
};