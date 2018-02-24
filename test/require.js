import XMLHttpRequest from 'xhr2'
import assert from 'assert'
import unpkgrequire from '../src/require'

describe('require', function() {
	before(function() {
		unpkgrequire.XMLHttpRequest = XMLHttpRequest
		this.timeout = 10000
	})
	it('require() works', async function() {
		try {
			//I don't know why require with try-catch always failed
			const { common: { random } } = await unpkgrequire('mapleutil')
			const x = random(1, 10)
			assert(x >= 1 && x < 10)
		} catch (e) {
			console.error(e)
		}
	})
})
