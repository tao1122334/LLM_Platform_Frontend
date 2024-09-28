import {createApp, reactive} from 'vue'
import App from './App.vue'
import {createRouter, createWebHistory} from "vue-router";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import {ElIcon} from 'element-plus';
import axios from "axios";
import {ElMessage, ElMessageBox} from 'element-plus';
import Home from "@/views/Home.vue";
import login from "@/views/login.vue";
import PersonalPage from "@/views/PersonalPage.vue";
import BotShop from "@/views/BotShop.vue";
import Hw1 from "@/views/hw1.vue";

// import VueLazyload from "vue-lazyload";
const routes = [
    {
        path: '/login',
        name: 'Login',
        component: login
    },
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/PersonalPage',
        name: 'PersonalPage',
        component: PersonalPage
    },
    {
        path: '/BotShop',
        name: 'BotShop',
        component: BotShop
    },
    {
        path: '/Hw1',
        name: 'Hw1',
        component: Hw1
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

const app = createApp(App);
app.config.globalProperties.$showMessage = (text, type) => {
    ElMessage({
        message: text,
        type: type,
        duration: 3000, // 持续时间，单位为毫秒
        zIndex: 5000
    });
};
app.config.globalProperties.$showMessageBox = (title, text) => {
    return ElMessageBox.confirm(text, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        zIndex: 5000
    }).then(() => {
        return true;
    }).catch(() => {
        return false;
    });
};

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
            console.error(error);
            this[data] = null;
            if (error.response.status === 401){
                    window.location.href = '/login';
                }
        });
};
app.config.globalProperties.$fetch = async function (v, par, data, text, type) {
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
            console.log(response);
            if (response.request.status === 200) {
                if (text) {
                    this.$showMessage(text, type);
                }
                this[data] = response.data;
            } else {

                this[data] = null;
            }

        })
        .catch(error => {
            this.$showMessage(error, 'error');
            console.error(error);
            this[data] = null;
            if (error.response.status === 401){
                    window.location.href = '/login';
                }
        });
};
app.config.globalProperties.$dealtime = function (dateTime) {
    if (dateTime) {
        try {
            return dateTime.replace('T', ' ');
        } catch (e) {
            console.log(dateTime)
        }
    }
}
app.config.globalProperties.$post = async function (v, par, data, to = null, text, type) {
    var res = 'api/' + v;

    if (par && Object.length > 0) {
        const keys = Object.keys(par);
        res = res + '?' + keys[0] + '=' + par[keys[0]]
        // 从第二个元素开始遍历
        for (let i = 1; i < keys.length; i++) {
            res += '&' + keys[i] + '=' + par[keys[i]]
            // 在这里对第二个及以后的元素进行操作
        }
    }
    await axios.post(res, data, {
            headers: {
                'Content-Type': 'multipart/json'
            }
        }
    )
        .then(response => {
            if (response.status === 200) {
                if (text) {
                    this.$showMessage(text, type);
                }
                if (to) {
                    this[to] = response.data;
                }
            }

        })
        .catch(error => {
            this.$showMessage(error.response.data.msg, 'error');
            this[to] = null;
            console.error(error);
            if (v!=='login/' && error.response.status === 401){
                    window.location.href = '/login';
                }
        });
};

app.config.globalProperties.$delete = async function (v, par = {}, to = null, text, type) {
    let res = 'api/' + v;

    // 如果有参数，构建查询字符串
    if (Object.keys(par).length > 0) {
        const keys = Object.keys(par);
        res += '?' + keys[0] + '=' + par[keys[0]];
        // 从第二个元素开始遍历
        for (let i = 1; i < keys.length; i++) {
            res += '&' + keys[i] + '=' + par[keys[i]];
        }
    }

    await axios.delete(res, {
        headers: {
            'Content-Type': 'application/json' // 可根据需求修改内容类型
        }
    })
    .then(response => {
        if (200<=response.status < 300) {
            if (text) {
                this.$showMessage(text, type);
            }
            if (to) {
                this[to] = response.data;
            }
        } else {
            this.$showMessage(response.data.msg, 'error');
            this[to] = null;
        }
    })
    .catch(error => {
        this.$showMessage(error.message || 'An error occurred', 'error');
        this[to] = null;
        console.error(error);
        if (v !== 'login/' && error.response && error.response.status === 401) {
            window.location.href = '/login';
        }
    });
};



app.use(router);
app.use(ElementPlus)
app.use(ElIcon)
// app.use(VueLazyload, {
//     preLoad: 1.3,
//     // error: 'img/white.png', // 错误时显示的图片
//     // loading: 'img/pika.png', // 加载时显示的图片
//     attempt: 1
// });
let usr = reactive({userId: 12345, username: null, userImg: null, isSuper: null})
let showChatView = reactive({flag: false, flag2: false})
app.config.globalProperties.$user = usr;
app.config.globalProperties.$showChatView = showChatView;
app.config.globalProperties.$toggleVisibility = function (v) {
    const el = document.getElementById(v); // 获取组件的元素
    if (!el) {
        return;
    }
    el.style.visibility = el.style.visibility === 'hidden' ? 'visible' : 'hidden'; // 切换可见性
}
app.config.globalProperties.$toggleVisibilityChat = function (v) {
    const el = document.getElementById(v); // 获取组件的元素
    if (!el) {
        return;
    }
    el.style.visibility = el.style.visibility === 'hidden' ? 'visible' : 'hidden'; // 切换可见性
    showChatView.flag = false
    showChatView.flag2 = false

}
app.config.globalProperties.$nologin = function () {
    axios.get('/api/user/isLogin')
        .then(response => {
            console.log(response)
            if (response.request.status === 200) {
                this.$usr.userId = response.data.data.userId;
                this.$usr.userName = response.data.data.userName;
                this.$usr.userImg = response.data.data.userImg;
                this.$usr.userMail = response.data.data.userMail;
                this.$usr.userMajor = response.data.data.userMajor;
                // console.log(response.data.data.userPermission)
                // console.log(response.data.data.userPermission[0].roleId)
                this.$usr.isadmin = response.data.data.userPermission[0].roleId === 1;
                // console.log('is admin : '+ this.$usr.isadmin)
                console.log('this user has login')
                return false;
            } else {
                this.$router.push('/login');
                return true;
            }
        })
        .catch(error => {
            console.error(error);
            this.$showMessage('请先登录', 'error');
            this.$router.push('/login');
            return true;
        });
    return false;
}

app.mount('#app')