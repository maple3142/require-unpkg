unpkg-require
=============
require from [unpkg.com](https://unpkg.com/) in browser
--------------------------------------------------------

### [Example](https://rawgit.com/maple3142/require-unpkg/master/test.html)
### [Example(codepen)](https://codepen.io/maple3142/pen/qXebVQ)

```html
<head>
	<script src="https://unpkg.com/require-unpkg"></script>
</head>
<body>
	<div id="jquery"></div>
	<div id="vue">{{message}}</div>
</body>
```
```js
//with es7 async/await:
(async function () {
	let $ = await require('jquery')
	$('#jquery').text('jQuery')
})()

//with Promise+Array Destructuring:
require(['jquery', 'vue']).then(([$, Vue]) => {
	new Vue({
		el: '#vue',
		data: {
			message: $.fn.jquery //jQuery version
		}
	})
})
```