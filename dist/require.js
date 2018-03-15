(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.require = factory());
}(this, (function () { 'use strict';

let localStorage;

if (typeof window === 'undefined') {
  //For node environment
  const obj = {};
  localStorage = {
    setItem(k, v) {
      obj[k] = v;
    },

    getItem(k) {
      return obj[k] || null;
    },

    removeItem(k) {
      delete obj[k];
    }

  };
} else {
  localStorage = window.localStorage;
}

const ns = 'require-unpkg-cache';
const cache = {
  obj: {},

  set(k, v) {
    this.obj[k] = {
      content: v,
      timestamp: Date.now()
    };
    localStorage.setItem(ns, JSON.stringify(this.obj));
  },

  get(k) {
    if (!this.has(k)) {
      return null;
    }

    return this.obj[k].content;
  },

  has(k) {
    if (!(k in this.obj)) {
      return false;
    }

    let g = this.obj[k];

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

function _get(url) {
  return new Promise((res, rej) => {
    let xhr = new require.XMLHttpRequest();
    xhr.open('GET', url);

    xhr.onload = () => res(xhr.responseText);

    xhr.onerror = () => rej(xhr.statusText);

    xhr.setRequestHeader('Cache-Control', 'no-cache');
    xhr.send();
  });
} //internal require


async function _require(pkg) {
  pkg = pkg.toLowerCase();

  if (!cache.has(pkg)) {
    let js = await _get(`https://unpkg.com/${pkg}?time=${Date.now()}`);
    cache.set(pkg, js);
  }

  let module = {
    exports: {}
  };
  let code = new Function(['module', 'exports'], cache.get(pkg));
  code.apply(null, [module, module.exports]);
  return module.exports;
}
/**
 * require module from unpkg.com
 * @function require
 * @param {String|String[]} package module name or modules name
 * @return {Promise<Object>|Promise<Object[]>} return promise with module or array of module
 */


async function require(pkg) {
  if (!Array.isArray(pkg)) return await _require(pkg);else {
    let pms = pkg.map(p => _require(p));
    return await Promise.all(pms);
  }
}

if (typeof window !== 'undefined') {
  require.XMLHttpRequest = window.XMLHttpRequest;
}

require.cache = cache;
require._require = _require;
require._get = _get;

return require;

})));
