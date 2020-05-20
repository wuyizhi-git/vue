<template>
    <div>
        <system-table>

            <div slot="top">
                <el-form ref="form" :inline="true" label-width="80px">

                    <el-form-item label="搜索条件">
                        <el-input style="width:200px;" v-model.trim="query.tblSearch"></el-input>
                    </el-form-item>

                </el-form>
            </div>
            <div slot="search">
                <el-button @click="queryList" type="primary">查询</el-button>
                <el-button @click="clearSearch" type="warning">清除</el-button>
            </div>

            <div slot="action">
                <el-button @click="doAdd" type="primary">添加</el-button>
            </div>
            <div slot="body">
                <!--表单渲染-->

                <!--表格渲染-->
                <el-table border ref="table" align="center" :data="data.rows" style="width: 100%;">
                    <el-table-column align="center" type="index" label="序号" width="50" />
                    <el-table-column align="center" prop="roleId" label="角色ID" />
                    <el-table-column align="center" prop="roleName" label="角色名" />
                    <el-table-column align="center" prop="roleDesc" label="角色描述" />

                    <el-table-column label="操作" width="400" align="center" fixed="right">
                        <template slot-scope="scope">
                            <el-button @click="doEdit(scope.row,scope.index)" type="primary">修改</el-button>
                            <el-button @click="doShowPeople(scope.row,scope.index)" type="warning">查看用户</el-button>
                            <el-button @click="doShareRole(scope.row,scope.index)" type="primary">分配菜单</el-button>
                            <el-button @click="doDelete(scope.row,scope.index)" type="danger">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <!--分页组件-->
                <div v-if="data.total" class="pagination">
                    <el-pagination background layout="total,pager,jumper,sizes" :current-page="query.pageNum"
                        :page-sizes="[10,25,50]" :page-size="query.numPerPage" :total="data.total"
                        @current-change="handlePageChange" @size-change="handleSizeChange"></el-pagination>
                </div>
            </div>


        </system-table>
        <div v-if="showAdd">
            <el-dialog title="添加角色" :visible="showAdd" width="800px" :show-close="false">
                <el-form ref="formAdd" :model="addObj" :rules="rules" :inline="true" label-width="80px">
                    <el-form-item label="角色id" prop="roleId">
                        <el-input style="width:200px;" v-model.trim="addObj.roleId"></el-input>
                    </el-form-item>
                    <el-form-item label="角色名" prop="roleName">
                        <el-input style="width:200px;" v-model.trim="addObj.roleName"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述">
                        <el-input style="width:200px;" v-model.trim="addObj.roleDesc"></el-input>
                    </el-form-item>
                </el-form>

                <div slot="footer" class="dialog-footer">
                    <el-button @click="doCloseAdd(false)">取 消</el-button>
                    <el-button type="primary" @click="doCloseAdd(true)">确认添加</el-button>
                </div>
            </el-dialog>
        </div>
        <div v-if="showEdit">
            <el-dialog title="编辑角色" :visible="showEdit" width="800px" :show-close="false">
                <el-form ref="formEdit" :model="editObj" :rules="rules" :inline="true" label-width="80px">
                    <el-form-item label="角色id" prop="roleId">
                        <el-input style="width:200px;" v-model.trim="editObj.roleId"></el-input>
                    </el-form-item>
                    <el-form-item label="角色名" prop="roleName">
                        <el-input style="width:200px;" v-model.trim="editObj.roleName"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述">
                        <el-input style="width:200px;" v-model.trim="editObj.roleDesc"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="doCloseEdit(false)">取 消</el-button>
                    <el-button type="primary" @click="doCloseEdit(true)">确认修改</el-button>
                </div>
            </el-dialog>
        </div>
        <div v-if="showPeople">
            <el-dialog title="角色所对应用户" :visible="showPeople" width="800px" :show-close="false">
                <role-user :item="selectRole"></role-user>
                <div slot="footer" class="dialog-footer">

                    <el-button type="primary" @click="doClosePeople(true)">确认</el-button>
                </div>
            </el-dialog>
        </div>
        <div v-if="showTree">
            <el-dialog title="分配菜单和按钮权限" :visible="showTree" width="800px" :show-close="false">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-input placeholder="输入关键字进行过滤" v-model="filterText">
                        </el-input>
                        <el-tree ref="tree" @node-click="nodeClick" node-key="menuId" show-checkbox accordion
                            :filter-node-method="filterNode" highlight-current :data="treeData" />
                    </el-col>
                    <el-col v-if="selectItem.menuType=='L'" :span="12">
                        <!-- <div v-for="item in buttonAll">{{item}}</div> -->
                        <el-card>
                            <div slot="header">
                                按钮配置
                            </div>
                            <el-checkbox-group v-model="aa">
                                <el-checkbox style="width:100px;height:30px" :label="item.buttonId" :key="item.buttonId"
                                    v-for="(item,index) in buttonAll">{{item.buttonName}}
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-card>
                    </el-col>
                </el-row>
                </el-tree>

                <div slot="footer" class="dialog-footer">

                    <el-button @click="closeTree(false)">取消</el-button>
                    <el-button type="primary" @click="closeTree(true)">确认</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import { deleteKey } from '@/utils';
    import roleUser from './role_user';

    import { queryRoleList, deleteRole, createRole, updateRole, queryRoleMenuAll, queryMenuForTree, querySysButtonsListAll, queryMenu, saveRoleMenu } from '@/api/system';
    export default {
        components: { roleUser },
        data() {
            return {
                query: {
                    tblSearch: '',
                    pageNum: 1,
                    numPerPage: 10
                },
                sexDic: {
                    '1': '男',
                    '0': '女'
                },

                showAdd: false,
                addObj: {
                    buttonId: '',
                    buttonName: '',
                    popId: ''
                },
                showEdit: false,
                editObj: {
                    buttonId: '',
                    buttonName: '',
                    popId: ''
                },
                selectRole: {},
                showPeople: false,
                showTree: false,
                buttonAll: [],
                buttonAllList: [],

                data: {
                    total: 0,

                    rows: []
                },
                roleId: "",//选中的id
                rules: {
                    roleId: [{ required: true, message: '请输入角色ID', trigger: 'blur' }],
                    roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
                },
                treeData: [],
                aa: [],
                selectItem: {},
                minusList: [],
                filterText: "",
                changeList: [],
            };
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }, aa(val) {

                var num = 0;

                this.minusList.forEach((item, index) => {
                    if (item.menuId === this.selectItem.menuId) {
                        this.minusList[index].buttonList = val;
                        num = 1;

                    }
                })
                if (!num) {
                    this.selectItem.buttonList = val;
                    this.minusList.push(this.selectItem);

                }

            },

        },
        methods: {
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            clearSearch() {
                this.query = {
                    tblSearch: '',
                    pageNum: 1,
                    numPerPage: 10
                };
            },
            doDelete(item) {
                let postObj = { id: item.id };
                this.$msgbox({
                    title: '删除',
                    message: '确认删除此该角色吗？',

                    beforeClose: async (action, instance, done) => {
                        if (action == 'confirm') {
                            let info = await deleteRole(postObj);
                            if (info.resCode === '0') {
                                this.$message.success('删除成功');
                                this.getList();
                            }
                            done();
                        } else {
                            done();
                        }
                    }
                });
            },

            doAdd() {
                this.showAdd = true;
                this.addObj = {};
            },
            doCloseAdd(bol) {
                if (bol) {
                    this.$refs['formAdd'].validate(async valid => {
                        if (valid) {
                            let info = await createRole(this.addObj);
                            if (info.resCode === '0') {
                                this.$message.success('添加成功');
                                this.queryList();
                                this.showAdd = false;
                            }
                        }
                    });
                } else {
                    this.showAdd = false;
                }
            },

            doEdit(item) {
                this.showEdit = true;
                this.editObj = {
                    id: item.id,
                    roleId: item.roleId,
                    roleName: item.roleName,
                    roleDesc: item.roleDesc,

                };
            },
            doCloseEdit(bol) {
                if (bol) {
                    this.$refs['formEdit'].validate(async valid => {
                        if (valid) {
                            let info = await updateRole(this.editObj);
                            if (info.resCode === '0') {
                                this.$message.success('修改成功');
                                this.getList();
                                this.showEdit = false;
                            }
                        }
                    });
                } else {
                    this.showEdit = false;
                }
            },
            async doShowPeople(item) {
                this.showPeople = true;
                this.selectRole = item;

            },
            async doShareRole(item) {//先处理父节点删除
                this.selectItem = {};
                this.roleId = item.roleId;
                this.minusList = [];
                this.aa = [];
                let info = await queryRoleMenuAll({ roleId: item.roleId });
                let listSelected = [];
                if (info.resCode === '0') {
                    this.showTree = true;
                    listSelected = info.rows || [];
                };
                let info1 = await queryMenu();
                let listOne = [];
                if (info1.resCode === '0') {
                    listOne = info1.rows || [];
                    for (let i = 0; i < listSelected.length; i++) {

                        for (let j = 0; j < listOne.length; j++) {

                            if (listSelected[i].menuId === listOne[j].pId) {
                                listSelected.splice(i, 1);
                                i--;
                                break;
                            }
                        }
                    }
                    this.minusList = listSelected;
                    let arr = listSelected.map(ite => {
                        return ite.menuId
                    });
                    this.$refs.tree.setCheckedKeys(arr);
                }
                else {
                    return ""
                };

            },
            async closeTree(bol) {
                if (bol) {
                    let allList = this.$refs.tree.getCheckedNodes(false, true);

                    let rows = allList.map(item => {
                        let num = 0;
                        let newObj = {}
                        this.minusList.forEach(ite => {
                            if (item.menuId == ite.menuId && ite.buttonList) {

                                num = 1;
                                newObj = { roleId: this.roleId, menuId: item.menuId, buttonPerms: ite.buttonList.join(",") }
                            }
                        })
                        if (!num) {
                            if (item.menuType == 'L') {
                                return { roleId: this.roleId, menuId: item.menuId, buttonPerms: item.buttonPerms };

                            }
                            else {
                                return { roleId: this.roleId, menuId: item.menuId };

                            }

                        }
                        else {
                            return newObj;
                        }
                    })
                    let info = await saveRoleMenu({
                        roleId: this.roleId,
                        rows,
                    });
                    if (info.resCode === '0') {
                        this.$message.success('添加成功');
                        this.showTree = false;

                    }







                }
                else {
                    this.showTree = false
                }

            },
            async doClosePeople(item) {
                this.showPeople = false;

            },
            nodeClick(item) {
                this.selectItem = item;
                if (item.menuType == "F") return;
                if (item.menuId == this.selectItem.menuId)
                    this.aa = [];


                this.buttonAll = [];
                if (item.menuType == 'L' && item.buttonPerms) {


                    let list = item.buttonPerms.split(",");

                    this.buttonAllList.forEach(item => {
                        if (list.includes(item.buttonId)) {
                            this.buttonAll.push({ buttonId: item.buttonId, buttonName: item.buttonName });

                        }

                    })
                    this.minusList.forEach(ite => {

                        if (ite.menuId == item.menuId) {

                            if (ite.buttonList) {
                                this.aa = ite.buttonList

                            }
                            else if (ite.buttonPerms) {
                                this.aa = ite.buttonPerms.split(",");
                            }
                        }
                    })
                    // this.selectItem.buttonPerms=this.aa;



                }
                else {
                    this.buttonAll = [];
                }


            },


            setKeys() {

            },

            async getList(num) {
                let postObj = deleteKey(this.query);
                postObj.pageNum--;

                let info = await queryRoleList(postObj);
                if (info.resCode === '0') {
                    this.data = {
                        total: info.total,
                        rows: info.rows || []
                    };
                }
            },
            queryList() {
                this.query.pageNum = 1;
                this.getList(1);
            },
            handlePageChange(num) {
                this.query.pageNum = num;
                this.getList(num);
            },
            handleSizeChange(num) {
                this.query.pageNum = 1;
                this.query.numPerPage = num;
                this.getList(num);
            },
            async init() {
                let info = await queryMenuForTree();
                if (info.resCode === '0') {
                    this.treeData = info.rows || [];

                }
                let info1 = await querySysButtonsListAll();
                if (info1.resCode === '0') {
                    this.buttonAllList = info1.rows || [];
                };

            }
        },
        mounted() {
            this.init()
            this.getList();
        }
    };
</script>