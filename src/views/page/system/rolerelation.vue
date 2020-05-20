<template>
    <div class="app-container">
        <el-row :gutter="20">

            <el-col :span="8">
                <el-card class="min-height">
                    <div slot="header" class="clearfix">
                        <span>系统结构</span>
                    </div>
                    <el-tree :disabled="!roleId" ref="tree" :props="defaultProps" show-checkbox node-key="menuId"
                        :default-expanded-keys="openArr" @node-click="nodeClick" highlight-current accordion
                        :data="TreeData">
                    </el-tree>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-card class="min-height">
                    <div slot="header" class="clearfix">
                        <span>角色</span>
                    </div>
                    <el-select @change="changeRole" v-model="roleId" placeholder="请选择" :clearable="false">
                        <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName"
                            :value="item.roleId"></el-option>

                    </el-select>
                    <el-button type="primary" v-if="roleId" @click="save">
                        保存
                    </el-button>

                </el-card>

            </el-col>

        </el-row>


    </div>
</template>

<script>


    import MIXIN from "@views/mixin/button"

    import { deleteKey, deepClone, getTree } from "@/utils"
    import { searchMenu, queryRoleListAll, searchMenuAll, createTp0003 } from "@/api/system"
    export default {
        mixins: [MIXIN],
        data() {
            return {
                TreeData: [],
                TreeDataForOne: [],
                roleId: "",
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },

                openArr: [],
                roleList: [],



            }
        },
        methods: {
            async init() {
                let info = await searchMenu();
                let TreeData;
                if (info.resCode === "0") {
                    TreeData = info.rows || [];
                    this.TreeDataForOne = info.rows || [];
                    let list = getTree(TreeData);
                    this.TreeData = list;
                }








            },
            async initRoleList() {
                let info = await queryRoleListAll();
                this.roleList = info.rows || [];


            },

            nodeClick(item, index) {
            },
            async save() {
                let allList = this.$refs.tree.getCheckedNodes(false, true);
                console.log(allList);
                let rows = allList.map(item => {
                    return {
                        roleId: this.roleId,
                        menuId: item.menuId,
                        subDomain: item.subDomain,
                        subSysId: item.subSysId,
                        sysId: item.sysId,
                    }
                })
                let obj = {
                    roleId: this.roleId,
                    rows
                }
                console.log(obj);
                let info = await createTp0003(obj);
                if (info.resCode === "0") {
                    this.$message.success("保存成功");
                   
                }


            },
            async changeRole() {
                if (this.roleId == "") return;
                let info = await searchMenuAll({ roleId: this.roleId });
                if (info.resCode === '0') {
                    let listSelected = info.rows || [];
                    for (let i = 0; i < listSelected.length; i++) {

                        for (let j = 0; j < this.TreeDataForOne.length; j++) {

                            if (listSelected[i].menuId === this.TreeDataForOne[j].pid) {
                                listSelected.splice(i, 1);
                                i--;
                                break;
                            }
                        }
                    }
                    let arr = listSelected.map(ite => {
                        return ite.menuId
                    });
                    this.$refs.tree.setCheckedKeys(arr);
                }

            }



        }
        , mounted() {
            this.init();
            this.initRoleList();
        },
    }
</script>
<style type="less" scoped>
    .min-height{
        height: 750px;overflow: auto
    }
    .el-transfer-panel{
        height: 300px;
    }
    .button_style{
        float: right; padding: 3px 0;width: 100px;height: 30px;margin-left:20px;margin-top:-20px;

    }

</style>