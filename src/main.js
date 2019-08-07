import vue from 'vue'
import vueRouter from 'vue-router'
import App from './app'
import axios from './plugin/ajax/index'
import store from './store'
import element from "element-ui"
import vscodingui from 'vscoding-ui'
import filters from "./common/filters"
import mixins from "./common/mixins"
import utils from "./common/utils"

import '../theme/index.css'
import 'vscoding-ui/dist/style.css'
import 'vue-cut-picture/dist/style'
import './less/index.less'

import api from "./api/index"
import _alert from "./plugin/alert/index"
import tabs from "./views/componts/tabs"
import textbox from "./views/componts/textbox"
import mbox from "./plugin/mbox/index"

import vueCutPicture from "vue-cut-picture";

vue.component("tabs", tabs)
vue.component("textbox", textbox)

vue.use(vueRouter)
vue.use(axios)
vue.use(element)
vue.use(api)
vue.use(_alert)
vue.use(vscodingui)
vue.mixin(mixins)
vue.use(utils)
vue.use(vueCutPicture)
vue.use(mbox)

filters(vue)

vue.prototype.$ELEMENT = { size: 'medium', zIndex: 3000 };
vue.prototype.phoneReg = /^\s*$|^1[3456789]\d{9}$/;

import routes from './router/index'
//实例化VueRouter
let router = new vueRouter({
    routes // （缩写）相当于 routes: routes
})

router.beforeEach(function (to, from, next) {
    if (to.path == '/Login' || to.path == '/Register' || to.path == '/Wechat') {
        next()
    } else {
        if (store.state.userInfo.id) {
            next()
        } else {
            store.dispatch("getUserInfo", next)
        }
    }
})

window.vm = new vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app')