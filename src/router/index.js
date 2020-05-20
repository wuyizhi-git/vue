import Vue from 'vue';
import Router from 'vue-router';


Vue.use(Router);


export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '@/views/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '@page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
               
                {
                    path: '/button',
                    component: () => import(/* webpackChunkName: "system" */ '@page/system/button.vue'),
                    meta: { title: '系统按钮' }
                },
                {
                    // vue-schart组件
                    path: '/user',
                    component: () => import(/* webpackChunkName: "system" */ '@page/system/user.vue'),
                    meta: { title: '用户管理' }
                },
                {
                    path: '/role',
                    component: () => import(/* webpackChunkName: "system" */ '@page/system/role.vue'),
                    meta: { title: '角色管理' }
                },
                {
                    path: '/rolerelation',
                    component: () => import(/* webpackChunkName: "system" */ '@page/system/rolerelation.vue'),
                    meta: { title: '系统权限' }
                },
                {
                    path: '/test',
                    component: () => import(/* webpackChunkName: "system" */ '@page/system/test.vue'),
                    meta: { title: '系统权限' }
                },
              
           
                {
                    path: '/menu',
                    component: () => import(/* webpackChunkName: "menu" */ "@page/system/menu.vue"),
                    meta: { title: '菜单管理' }
                },
                {
                    path: '/vocab',
                    component: () => import(/* webpackChunkName: "basedata" */ "@page/basedata/vocab.vue"),
                    meta: { title: '词根' }
                },
                {
                    path: '/dic',
                    component: () => import(/* webpackChunkName: "basedata" */ "@page/basedata/dic.vue"),
                    meta: { title: '数据字典' }
                },
                {
                    path: '/unitdata',
                    component: () => import(/* webpackChunkName: "basedata" */ "@page/basedata/unitdata.vue"),
                    meta: { title: '元数据' }
                },
                {
                    path: '/unitadd',
                    component: () => import(/* webpackChunkName: "basedata" */ "@page/parmunit/unitadd.vue"),
                    meta: { title: 'test' }
                },
                {
                    path: '/qryunit',
                    component: () => import(/* webpackChunkName: "basedata" */ "@page/parmunit/qryunit.vue"),
                    meta: { title: 'test' }
                },
                
              
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '@page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '@page/403.vue'),
                    meta: { title: '403' }
                },
              
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '@page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});


