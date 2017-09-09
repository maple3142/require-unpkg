import axios from 'axios'

//module cache
const cache = {}

//internal require
async function _require(pkg) {
	if (!(pkg in cache)) {

		let exports = {}
		let module = { exports }
		let d = await axios.get(`https://unpkg.com/${pkg}`)
		eval(d.data)
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

export default require