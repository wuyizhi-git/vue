<template>
    <div class="sidebar">
      
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#304156"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <!-- {{items}} -->
            <template :keys="index+'aa'"  v-for="(item,index) in items">
                <template v-if="item.children&&item.children.length">
                    <el-submenu :index="item.id" :key="item.id">
                        <template slot="title">
                            <i class="el-icon-lx-home"></i>
                            <span slot="title">{{ item.name }}</span>
                        </template>
                        <template   :keys="index11+'BB'" v-for="(subItem,index11) in item.children">
                            <el-submenu   v-if="subItem.children&&subItem.children.length" :index="subItem.id"
                                :key="subItem.id" >
                              
                                <template slot="title"><div style="margin-left:10px">{{subItem.name}}</div>   </template>
                                <el-menu-item :keys="i+'cc'" v-for="(threeItem,i) in subItem.children" :key="threeItem.menuUrl"
                                    :index="threeItem.menuUrl">{{ threeItem.name }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.menuUrl" :key="subItem.menuUrl">{{ subItem.name }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.menuUrl" :key="item.menuUrl">
                        <i class="el-icon-lx-home"></i>
                        <span slot="title">{{ item.name }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    import { mapState, mapMutations } from "vuex";
    export default {
        data() {
            return {
                collapse: false,
            };
        },
        computed: {
            onRoutes() {

                return this.$route.path.replace('/', '');
            },
            ...mapState({
                items(state) {
                    return state.main.items;
                }
            })

        },

        created() {

            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
                bus.$emit('collapse-content', msg);
            });
        }
    };
</script>

<style scoped>
    .sidebar {
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom: 0;
        overflow-y: scroll;
    }

    .sidebar::-webkit-scrollbar {
        width: 0;
    }

    .sidebar-el-menu:not(.el-menu--collapse) {
        width: 200px;
    }

    .sidebar>ul {
        height: 100%;
    }
    
/* .el-submenu .el-submenu__title{
      background-color: #3370ff !important;
      color: #fff;
      span {
        color: #fff !important;
      }
} */
.el-submenu .el-submenu {
    background-color: red !important;
}
   
   .el-submenu .el-menu-item{
        background-color: #1F2D3D !important;
      

   }
</style>