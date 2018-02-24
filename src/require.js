import cache from './cache'

//internal get
function _get(url) {
	return new Promise((res, rej) => {
		let xhr = new require.XMLHttpRequest()

		xhr.open('GET', url)

		xhr.onload = () => res(xhr.responseText)
		xhr.onerror = () => rej(xhr.statusText)

		xhr.setRequestHeader('Cache-Control', 'no-cache')

		xhr.send()
	})
}

//internal require
async function _require(pkg) {
	pkg = pkg.toLowerCase()
	if (!cache.has(pkg)) {
		let js = await _get(`https://unpkg.com/${pkg}?time=${Date.now()}`)
		cache.set(pkg, js)
	}
	let module = { exports: {} }
	let code = new Function(['module', 'exports'], cache.get(pkg))
	code.apply(null, [module, module.exports])
	return module.exports
}

/**
 * require module from unpkg.com
 * @function require
 * @param {String|String[]} package module name or modules name
 * @return {Promise<Object>|Promise<Object[]>} return promise with module or array of module
 */
async function require(pkg) {
	if (!Array.isArray(pkg)) return await _require(pkg)
	else {
		let pms = pkg.map(p => _require(p))
		return await Promise.all(pms)
	}
}

if (typeof window !== 'undefined') {
	require.XMLHttpRequest = window.XMLHttpRequest
}

require.cache = cache
require._require = _require
require._get = _get

export default require
