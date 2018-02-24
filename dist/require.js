(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.require = factory());
}(this, (function () { 'use strict';

var localStorage;
if (typeof window === 'undefined') {
	//For node environment
	var obj = {};
	localStorage = {
		setItem: function setItem(k, v) {
			obj[k] = v;
		},
		getItem: function getItem(k) {
			return obj[k] || null;
		},
		removeItem: function removeItem(k) {
			delete obj[k];
		}
	};
} else {
	localStorage = window.localStorage;
}
var ns = 'require-unpkg-cache';
var cache = {
	obj: {},
	set: function set(k, v) {
		this.obj[k] = { content: v, timestamp: Date.now() };
		localStorage.setItem(ns, JSON.stringify(this.obj));
	},
	get: function get(k) {
		if (!this.has(k)) {
			return null;
		}
		return this.obj[k].content;
	},
	has: function has(k) {
		if (!(k in this.obj)) {
			return false;
		}
		var g = this.obj[k];
		if (Date.now() - g.timestamp < this.expire) {
			return true;
		}
		return false;
	},
	expire: 24 * 60 * 60 * 1000 //24hours
};
if (localStorage.getItem(ns)) {
	try {
		cache.obj = JSON.parse(localStorage.getItem(ns));
	} catch (e) {
		localStorage.removeItem(ns);
	}
}

//internal get
function _get(url) {
	return new Promise(function (res, rej) {
		var xhr = new require.XMLHttpRequest();

		xhr.open('GET', url);

		xhr.onload = function () { return res(xhr.responseText); };
		xhr.onerror = function () { return rej(xhr.statusText); };

		xhr.setRequestHeader('Cache-Control', 'no-cache');

		xhr.send();
	});
}

//internal require
function _require(pkg) {
	return new Promise(function ($return, $error) {
		var module, code;

		pkg = pkg.toLowerCase();
		if (!cache.has(pkg)) {
			var js;
			return Promise.resolve(_get(("https://unpkg.com/" + pkg + "?time=" + (Date.now())))).then(function ($await_3) {
				try {
					js = $await_3;
					cache.set(pkg, js);
					return $If_1.call(this);
				} catch ($boundEx) {
					return $error($boundEx);
				}
			}.bind(this), $error);
		}

		function $If_1() {
			module = { exports: {} };
			code = new Function(['module', 'exports'], cache.get(pkg));
			code.apply(null, [module, module.exports]);
			return $return(module.exports);
		}

		return $If_1.call(this);
	}.bind(this));
}

/**
 * require module from unpkg.com
 * @function require
 * @param {String|String[]} package module name or modules name
 * @return {Promise<Object>|Promise<Object[]>} return promise with module or array of module
 */
function require(pkg) {
	return new Promise(function ($return, $error) {
		if (!Array.isArray(pkg)) {
			return Promise.resolve(_require(pkg)).then($return, $error);
		} else {
			var pms;

			pms = pkg.map(function (p) { return _require(p); });
			return Promise.resolve(Promise.all(pms)).then($return, $error);
		}
		return $return();
	}.bind(this));
}

if (typeof window !== 'undefined') {
	require.XMLHttpRequest = window.XMLHttpRequest;
}

require.cache = cache;
require._require = _require;
require._get = _get;

return require;

})));
