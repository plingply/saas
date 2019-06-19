import edu from "./edu"

export default [
    {
        path: '/',
        redirect: '/Main/Home'
    },
    {
        path: '/Login',
        name: 'login',
        component: resolve => require.ensure([], () => resolve(require("../views/login/login.vue")), 'login'),
    },
    {
        path: '/Register',
        name: 'register',
        component: resolve => require.ensure([], () => resolve(require("../views/login/register.vue")), 'login'),
    }, {
        path: '/Main',
        name: 'main',
        component: resolve => require.ensure([], () => resolve(require("../views/main/index.vue")), 'main'),
        children: [
            {
                path: 'Home',
                name: 'home',
                component: resolve => require.ensure([], () => resolve(require("../views/main/home/index.vue")), 'home')
            },

            // 教务
            edu
        ]
    }
];
