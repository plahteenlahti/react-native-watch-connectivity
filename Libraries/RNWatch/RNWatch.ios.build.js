Object.defineProperty(exports, '__esModule', { value: true });
exports.Encoding = exports.WatchState = undefined;
exports.sendMessage = sendMessage;
exports.subscribeToMessages = subscribeToMessages;
exports.sendMessageData = sendMessageData;
exports.subscribeToFileTransfers = subscribeToFileTransfers;
exports.transferFile = transferFile;
exports.subscribeToWatchState = subscribeToWatchState;
exports.getWatchState = getWatchState;
exports.subscribeToWatchReachability = subscribeToWatchReachability;
exports.getWatchReachability = getWatchReachability;
exports.getIsPaired = getIsPaired;
exports.getIsWatchAppInstalled = getIsWatchAppInstalled;
exports.subscribeToUserInfo = subscribeToUserInfo;
exports.sendUserInfo = sendUserInfo;
exports.getUserInfo = getUserInfo;
exports.updateApplicationContext = updateApplicationContext;
exports.subscribeToApplicationContext = subscribeToApplicationContext;
exports.getApplicationContext = getApplicationContext;
exports._subscribe = _subscribe;
var _reactNative = require('react-native');
var watch = _reactNative.NativeModules.RNWatch;
var EVENT_FILE_TRANSFER_ERROR = 'WatchFileTransferError';
var EVENT_FILE_TRANSFER_FINISHED = 'WatchFileTransferFinished';
var EVENT_RECEIVE_MESSAGE = 'WatchReceiveMessage';
var EVENT_WATCH_STATE_CHANGED = 'WatchStateChanged';
var EVENT_WATCH_REACHABILITY_CHANGED = 'WatchReachabilityChanged';
var EVENT_WATCH_USER_INFO_RECEIVED = 'WatchUserInfoReceived';
var EVENT_APPLICATION_CONTEXT_RECEIVED = 'WatchApplicationContextReceived';
var WatchState = (exports.WatchState = {
	NotActivated: 'NotActivated',
	Inactive: 'Inactive',
	Activated: 'Activated'
});
var _WatchState = {
	WCSessionActivationStateNotActivated: WatchState.NotActivated,
	WCSessionActivationStateInactive: WatchState.Inactive,
	WCSessionActivationStateActivated: WatchState.Activated
};
var Encoding = (exports.Encoding = {
	NSASCIIStringEncoding: 1,
	NSNEXTSTEPStringEncoding: 2,
	NSJapaneseEUCStringEncoding: 3,
	NSUTF8StringEncoding: 4,
	NSISOLatin1StringEncoding: 5,
	NSSymbolStringEncoding: 6,
	NSNonLossyASCIIStringEncoding: 7,
	NSShiftJISStringEncoding: 8,
	NSISOLatin2StringEncoding: 9,
	NSUnicodeStringEncoding: 10,
	NSWindowsCP1251StringEncoding: 11,
	NSWindowsCP1252StringEncoding: 12,
	NSWindowsCP1253StringEncoding: 13,
	NSWindowsCP1254StringEncoding: 14,
	NSWindowsCP1250StringEncoding: 15,
	NSISO2022JPStringEncoding: 21,
	NSMacOSRomanStringEncoding: 30,
	NSUTF16StringEncoding: 10,
	NSUTF16BigEndianStringEncoding: 0x90000100,
	NSUTF16LittleEndianStringEncoding: 0x94000100,
	NSUTF32StringEncoding: 0x8c000100,
	NSUTF32BigEndianStringEncoding: 0x98000100,
	NSUTF32LittleEndianStringEncoding: 0x9c000100
});
var DEFAULT_ENCODING = Encoding.NSUTF8StringEncoding;
function sendMessage() {
	var message =
		arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var cb =
		arguments.length > 1 && arguments[1] !== undefined
			? arguments[1]
			: function() {};
	return watch.sendMessage(
		message,
		function(reply) {
			return cb(null, reply);
		},
		function(err) {
			return cb(err);
		}
	);
}
function subscribeToMessages() {
	var cb =
		arguments.length > 0 && arguments[0] !== undefined
			? arguments[0]
			: function() {};
	return _subscribe(EVENT_RECEIVE_MESSAGE, function(payload) {
		console.log('received message payload', payload);
		var messageId = payload.id;
		var replyHandler = messageId
			? function(resp) {
					return watch.replyToMessageWithId(messageId, resp);
			  }
			: null;
		cb(null, payload, replyHandler);
	});
}
function sendMessageData(data) {
	var encoding =
		arguments.length > 1 && arguments[1] !== undefined
			? arguments[1]
			: DEFAULT_ENCODING;
	var cb =
		arguments.length > 2 && arguments[2] !== undefined
			? arguments[2]
			: function() {};
	return new Promise(function(resolve, reject) {
		var replyHandler = function replyHandler(resp) {
			cb(null, resp);
			resolve(resp);
		};
		var errorHandler = function errorHandler(err) {
			cb(err);
			reject(err);
		};
		watch.sendMessageData(data, encoding, replyHandler, errorHandler);
	});
}
function subscribeToFileTransfers() {
	var cb =
		arguments.length > 0 && arguments[0] !== undefined
			? arguments[0]
			: function() {};
	var subscriptions = [
		_subscribe(EVENT_FILE_TRANSFER_FINISHED, function(res) {
			return cb(null, res);
		}),
		_subscribe(EVENT_FILE_TRANSFER_ERROR, function(err, res) {
			return cb(err, res);
		})
	];
	return function() {
		return subscriptions.forEach(function(fn) {
			return fn();
		});
	};
}
function transferFile(uri) {
	var metadata =
		arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	var cb =
		arguments.length > 2 && arguments[2] !== undefined
			? arguments[2]
			: function() {};
	return new Promise(function(resolve, reject) {
		watch.transferFile(
			uri,
			metadata,
			function(resp) {
				resolve(resp);
				cb(null, resp);
			},
			function(err) {
				reject(err);
				cb(err);
			}
		);
	});
}
function subscribeToWatchState() {
	var cb =
		arguments.length > 0 && arguments[0] !== undefined
			? arguments[0]
			: function() {};
	getWatchState(cb);
	return _subscribe(EVENT_WATCH_STATE_CHANGED, function(payload) {
		return cb(null, _WatchState[payload.state]);
	});
}
function getWatchState() {
	var cb =
		arguments.length > 0 && arguments[0] !== undefined
			? arguments[0]
			: function() {};
	return new Promise(function(resolve) {
		watch.getSessionState(function(state) {
			cb(null, _WatchState[state]);
			resolve(_WatchState[state]);
		});
	});
}
function subscribeToWatchReachability() {
	var cb =
		arguments.length > 0 && arguments[0] !== undefined
			? arguments[0]
			: function() {};
	getWatchReachability(cb);
	return _subscribe(EVENT_WATCH_REACHABILITY_CHANGED, function(payload) {
		return cb(null, payload.reachability);
	});
}
function getWatchReachability() {
	var cb =
		arguments.length > 0 && arguments[0] !== undefined
			? arguments[0]
			: function() {};
	return new Promise(function(resolve) {
		watch.getReachability(function(reachability) {
			cb(null, reachability);
			resolve(reachability);
		});
	});
}
function getIsPaired() {
	var cb =
		arguments.length > 0 && arguments[0] !== undefined
			? arguments[0]
			: function() {};
	return new Promise(function(resolve) {
		watch.getIsPaired(function(isPaired) {
			cb(null, isPaired);
			resolve(isPaired);
		});
	});
}
function getIsWatchAppInstalled() {
	var cb =
		arguments.length > 0 && arguments[0] !== undefined
			? arguments[0]
			: function() {};
	return new Promise(function(resolve) {
		watch.getIsWatchAppInstalled(function(isWatchAppInstalled) {
			cb(null, isWatchAppInstalled);
			resolve(isWatchAppInstalled);
		});
	});
}
function subscribeToUserInfo() {
	var cb =
		arguments.length > 0 && arguments[0] !== undefined
			? arguments[0]
			: function() {};
	getUserInfo(cb);
	return _subscribe(EVENT_WATCH_USER_INFO_RECEIVED, function(payload) {
		return cb(null, payload);
	});
}
function sendUserInfo() {
	var info =
		arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	watch.sendUserInfo(info);
}
function getUserInfo() {
	var cb =
		arguments.length > 0 && arguments[0] !== undefined
			? arguments[0]
			: function() {};
	return new Promise(function(resolve) {
		watch.getUserInfo(function(info) {
			cb(null, info);
			resolve(info);
		});
	});
}
function updateApplicationContext() {
	var context =
		arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	watch.updateApplicationContext(context);
}
function subscribeToApplicationContext() {
	var cb =
		arguments.length > 0 && arguments[0] !== undefined
			? arguments[0]
			: function() {};
	getApplicationContext(cb);
	return _subscribe(EVENT_APPLICATION_CONTEXT_RECEIVED, function(payload) {
		return cb(null, payload);
	});
}
function getApplicationContext() {
	var cb =
		arguments.length > 0 && arguments[0] !== undefined
			? arguments[0]
			: function() {};
	return new Promise(function(resolve) {
		watch.getApplicationContext(function(context) {
			cb(null, context);
			resolve(context);
		});
	});
}
function _subscribe(event) {
	var cb =
		arguments.length > 1 && arguments[1] !== undefined
			? arguments[1]
			: function() {};
	if (!event) throw new Error('Must pass event');
	return _reactNative.NativeAppEventEmitter.addListener.call(
		_reactNative.NativeAppEventEmitter,
		event,
		cb
	).remove;
}
