unpkg-require
=============
require from [unpkg.com](https://unpkg.com/) in browser
--------------------------------------------------------

[example.html](https://rawgit.com/maple3142/require-unpkg/master/example.html)

```html
<head>
	<script src="https://unpkg.com/unpkg-require"></script>
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