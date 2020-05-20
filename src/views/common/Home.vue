<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <div class="content-box" :class="{'content-collapse':collapse}">
            <v-tags></v-tags>
            <div class="content">
                <transition name="move" mode="out-in">
                    <keep-alive :include="tagsList">
                        <router-view></router-view>
                    </keep-alive>
                </transition>
                <el-backtop target=".content"></el-backtop>
            </div>
        </div>

    </div>
</template>

<script>

    import { mapState, mapMutations } from "vuex";
    import { getSessionId, deleteKey } from "@/utils"
    import { queryMenuListByUserFuncIdForTree, queryFuncList, createTp0004 } from "@/api/system"

    import vHead from './Header.vue';
    import vSidebar from './Sidebar.vue';
    import vTags from './Tags.vue';
    import bus from './bus';
    import router from '@/router';
    export default {
        data() {
            return {
                tagsList: [],
                collapse: false,
                list: [],
                ...mapState,
            };
        },
        components: {
            vHead,
            vSidebar,
            vTags
        },
        created() {
            bus.$on('collapse-content', msg => {
                this.collapse = msg;
            });

            // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
            bus.$on('tags', msg => {
                let arr = [];
                for (let i = 0, len = msg.length; i < len; i++) {
                    msg[i].name && arr.push(msg[i].name);
                }
                this.tagsList = arr;
            });
            this.init();

        },
        methods: {
            async createTp0004() {
                if (this.list.length === 0) return window.location.reload();
                let info = await createTp0004({ menuId: this.list[0] })
                if (info.resCode === '0') {
                    this.list.shift();
                    this.createTp0004();

                }



            },
            async init() {
                let data = {};
                if (!getSessionId("username")) {
                    return this.$router.push('/login');
                }
                let info = await queryMenuListByUserFuncIdForTree();
                if (info.resCode === '0') {
                    let info1 = await queryFuncList()
                    if (info.resCode === '0') {
                        if (info1.rows.length == info.rows.length) {

                        }
                        else {
                            let list = [];
                            let row1 = info1.rows;
                            let row = info.rows;
                            row1.forEach(item => {
                                let num = 0
                                row.forEach(item1 => {
                                    if (item.menuId == item1.menuId) {
                                        num = 1;
                                    }

                                })
                                if (num === 0) {
                                    list.push(item.menuId)
                                }
                            })
                            this.list = list;
                            return this.createTp0004();



                        }
                    }







                    data = {
                        name: getSessionId("username"),
                        items: info.rows || []
                    }

                    if (data.items.length === 0) {
                        // this.$message.error("请添加权限后再进入系统")
                        // this.$router.push('/login');

                    }
                    data.items.unshift({
                        icon: 'el-icon-lx-home',
                        menuUrl: 'dashboard',
                        name: '系统首页'
                    })
                    // data.items.length=2;




                }

                let menuArr = [];
                ; (function getMenuArr(Arr) {

                    if (Arr.length) {
                        Arr.forEach(item => {
                            if (item.children && item.children.length > 0) {
                                getMenuArr(item.children)
                            }
                            else { menuArr.push(item.menuUrl) }

                        })
                    }
                })(data.items);


                this.updateMainInfo(data);

                router.beforeEach((to, from, next) => {

                    if (to.path == "/403" || to.path == "/404" || to.path == "/login") {
                        next();
                    }
                    else if (!menuArr.includes(to.path.substr(1))) {
                        next("/403")
                    }
                    else {
                        if (!getSessionId()) {
                            this.$notify.error({
                                title: '获取用户信息失败',
                                message: '请重新登录'
                            });

                            next("/login");
                        }
                        else {
                            next();

                        }



                    }


                });


            },
            ...mapMutations(["updateMainInfo"])
        }
    };

</script>