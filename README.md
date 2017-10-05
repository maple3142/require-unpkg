require-unpkg
=============
require from [unpkg.com](https://unpkg.com/) in browser
--------------------------------------------------------

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

extra
------
* `require._require` only require single module only  ex: `require._require('jquery')`
* `require._get` provide simple xhr `GET` function ex:`require._get(url)`