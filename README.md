# require-unpkg

[![Greenkeeper badge](https://badges.greenkeeper.io/maple3142/require-unpkg.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/maple3142/require-unpkg.svg?branch=master)](https://travis-ci.org/maple3142/require-unpkg)

## require from [unpkg.com](https://unpkg.com/) in browser

### [Example](https://rawgit.com/maple3142/require-unpkg/master/test.html)

### [Example(codepen)](https://codepen.io/maple3142/pen/qXebVQ)

```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">

  <script src="dist/require.js"></script>
  <!--cdn-->
  <!--script src="https://unpkg.com/require-unpkg"></script-->
  <title>Example</title>
</head>

<body>
  <div id="jquery"></div>
  <div id="vue">
    <input type="text" v-model="input">
  </div>
  <script>
    require.cache.expire = 100000; //set cache time (DONT SET TO 0), default: 24 hours

    //with es7 async/await:
    (async function () {
      let $ = await require('jquery')
      $('#jquery').text('jquery hello world')
    })()

    //with Promise+Array Destructuring:
    require(['vue','vuejs-storage']).then(([Vue,vuejsStorage]) => {
      Vue.use(vuejsStorage)
      new Vue({
        el: '#vue',
        storage: {
          data: {
            input: ''
          },
          namespace: 'test'
        }
      })
    })
  </script>
</body>

</html>
```

## Extra

### \_require

`require._require` only require single module only ex: `require._require('jquery')`

### \_get

`require._get` provide simple xhr `GET` function ex:`require._get(url)`

### node.js

To use in node.js environment, you must set

```javascript
const urequire = require('unpkg-require')
urequire.XMLHttpRequest = XHR_POLYFILL //like xhr2...

urequire('lodash').then(_ => {})
```

~~But I don't know why to require unpkg instead of `node_modules`~~
