//module cache
const ns = 'require-unpkg-cache'
const cache = {
	obj: {},
	set(k, v) {
		this.obj[k] = { content: v, timestamp: Date.now() }
		localStorage.setItem(ns, JSON.stringify(this.obj))
	},
	get(k) {
		if (!this.has(k)) {
			return null
		}
		return this.obj[k].content
	},
	has(k) {
		if (!(k in this.obj)) {
			return false
		}
		let g = this.obj[k]
		if (Date.now() - g.timestamp < this.expire) {
			return true
		}
		return false
	},
	expire: 24 * 60 * 60 * 1000 //24hours
}
if (localStorage.getItem(ns)) {
	try {
		cache.obj = JSON.parse(localStorage.getItem(ns))
	} catch (e) {
		localStorage.removeItem(ns)
	}
}

export default cache
