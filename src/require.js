//module cache
const cache = {}

//internal get
function _get(url) {
	return new Promise((res, rej) => {
		let xhr = new XMLHttpRequest()

		xhr.onload = () => res(xhr.responseText)
		xhr.onerror = () => rej(xhr.statusText)

		xhr.open('GET', url)
		xhr.send()
	})
}

//internal require
async function _require(pkg) {
	if (!(pkg in cache)) {
		let exports = {}
		let module = { exports }
		let js = await _get(`https://unpkg.com/${pkg}`)
		eval(js)
		cache[pkg] = module
	}
	return cache[pkg].exports
}

/**
 * require module from unpkg.com
 * @function require
 * @param {String|String[]} package module name or modules name
 * @return {Promise<Object>|Promise<Object[]>} return promise with module or array of module
 */
async function require(pkg) {
	if (!Array.isArray(pkg))
		return await _require(pkg)
	else {
		let pms = pkg.map(p => _require(p))
		return await Promise.all(pms)
	}
}

require._require = _require
require._get = _get

export default require