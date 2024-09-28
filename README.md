# llm-platform-frontend
## 在vite.config.js中，设置代码如下
```javascript
resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0', // 允许所有主机访问
    port: 8080, // 设置开发服务器的端口
    proxy: {
      '/api': {
        target: 'http://localhost:8000/',
        changeOrigin: true, // 允许代理跨域
        secure: false, // 如果使用的是自签名证书，需要将 secure 设置为 false
      }
    }
  }
```
这里设置了请求的url如果是api开头，那么就会把这个请求发到target服务器上，这个localhost表示运行vue的服务器，所以在本地也运行了django后其它电脑访问它的前端就可以。

## 在main.js中，发送请求的代码如下
```javascript
app.config.globalProperties.$get = async function (v, par, data, text = '', type = '', send = true) {
    var res = 'api/' + v;
    const keys = Object.keys(par);
    if (Object.length > 0) {
        res = res + '?' + keys[0] + '=' + par[keys[0]]
        // 从第二个元素开始遍历
        for (let i = 1; i < keys.length; i++) {
            res += '&' + keys[i] + '=' + par[keys[i]]
            // 在这里对第二个及以后的元素进行操作
        }
    }
    await axios.get(res)
        .then(response => {
            if (response.status === 200) {
                if (text) {
                    this.$showMessage(text, type);
                }
                this[data] = response.data;
            } else {
                if (response.data.msg && send) {
                    this.$showMessage(response.data.msg, 'error');
                }
                this[data] = null;
            }

        })
        .catch(error => {
            this.$showMessage(error, 'error');
            // 这里还封装了一个通知， 第一个参数是错误信息，第二个'error'表示通知的类型（出现一个红色的叉叉）
            console.error(error);
            this[data] = null;
            // 如果服务器返回401未登录，就会自动跳转过去
            if (error.response.status === 401){
                    window.location.href = '/login';
                }
        });
};
```
**delete post fetch代码类似**
### 你应该如何调用这些方法 (来自hw1)
app.config.globalProperties.$get = async function (v, par, data, text = '', type = '', send = true) 为例
par: 查询参数，Url后面?a=123&b=321 这种
data: 返回的数据要给你赋到组件上的哪个名字变量，我们统一使用data
text: 你这个请求在前端出现提示信息是什么，默认没有
type: 这个请求在前端出现提示信息类型是什么（error, success, warning），默认没有
send: 保留项，控制出错信息要不要显示
```javascript
async getHotel() {
      await this.$get('getHotels/', {}, 'data');
      this.hotel = this.data.hotels;
      console.log(this.hotel);
    }
}
```
**记得在对应的组件中，设置一个名叫data的变量**
```javascript
data() {
    return {
      data: null
    }
}
```





This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
