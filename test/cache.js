import cache from '../src/cache'
import assert from 'assert'

function sleep(ms) {
	return new Promise((resolve, reject) => setTimeout(() => resolve(), ms))
}
describe('cache', function() {
	it('cache get,set,has must work', function() {
		cache.set('key', 48763)
		assert(cache.has('key'))
		assert(48763 === cache.get('key'))
	})
	it('cache will expire', async function() {
		cache.expire = 1
		cache.set('key2', 48763)
		await sleep(2)
		assert(!cache.has('key2'))
	})
})
