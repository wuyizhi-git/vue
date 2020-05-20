<template>
    <div>

        <system-table>

            <div slot="top">
                <el-form ref="form" :inline="true" label-width="80px">
                    <el-form-item label="用户id">
                        <el-input style="width:200px;" v-model.trim="query.userIdSearch"></el-input>
                    </el-form-item>
                    <el-form-item label="用户名">
                        <el-input style="width:200px;" v-model.trim="query.userNameSearch"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱">
                        <el-input style="width:200px;" v-model.trim="query.userMailSearch"></el-input>
                    </el-form-item>
                    <el-form-item label="电话">
                        <el-input style="width:200px;" v-model.trim="query.userPhoneSearch"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号">
                        <el-input style="width:200px;" v-model.trim="query.userIdnoSearch"></el-input>
                    </el-form-item>
                    <el-form-item label="性别">
                        <el-select style="width:200px;" v-model="query.userSexSearch" clearable placeholder="请选择">
                            <el-option label="男" value="1"></el-option>
                            <el-option label="女" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="header-search">

                <el-button @click="queryList" type="primary">查询</el-button>
                <el-button @click="clearSearch" type="warning">清除</el-button>
            </div>
            <div slot="action">
                <el-button @click="doAdd" type="primary">添加</el-button>
            </div>
            <div slot="body">
                <el-table border ref="table" align="center" :data="data.rows" style="width: 100%;">
                    <el-table-column align="center" type="index" label="序号" width="50" />
                    <el-table-column align="center" prop="userId" label="用户ID" />
                    <el-table-column align="center" prop="userName" label="用户名" />
                    <el-table-column align="center" prop="userPhone" label="电话" />
                    <el-table-column align="center" prop="userMail" label="用户邮箱" />
                    <el-table-column align="center" prop="userIdno" label="身份证" />
                    <el-table-column align="center" prop="userSex" label="性别">
                        <template slot-scope="scope">
                            {{sexDic[scope.row.userSex]}}


                        </template>
                    </el-table-column>


                    <el-table-column label="操作" width="380" align="center" fixed="right">
                        <template slot-scope="scope">
                            <el-button @click="doEdit(scope.row,scope.index)" type="primary">修改</el-button>
                            <el-button @click="doResetPassword(scope.row,scope.index)" type="warning">重置密码</el-button>
                            <el-button @click="doShowRole(scope.row,scope.index)" type="primary">分配角色</el-button>
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
            <el-dialog title="添加用户" :visible="showAdd" width="800px" :show-close="false">
                <el-form ref="formAdd" :model="addObj" :rules="rules" :inline="true" label-width="80px">
                    <el-form-item label="用户id" prop="userId">
                        <el-input style="width:200px;" v-model.trim="addObj.userId"></el-input>
                    </el-form-item>
                    <el-form-item label="用户名" prop="userName">
                        <el-input style="width:200px;" v-model.trim="addObj.userName"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="userMail">
                        <el-input style="width:200px;" v-model.trim="addObj.userMail"></el-input>
                    </el-form-item>
                    <el-form-item label="电话">
                        <el-input style="width:200px;" v-model.trim="addObj.userPhone"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号">
                        <el-input style="width:200px;" v-model.trim="addObj.userIdno"></el-input>
                    </el-form-item>
                    <el-form-item label="性别">
                        <el-select style="width:200px;" v-model="addObj.userSex" clearable placeholder="请选择">
                            <el-option label="男" value="1"></el-option>
                            <el-option label="女" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>

                <div slot="footer" class="dialog-footer">
                    <el-button @click="doCloseAdd(false)">取 消</el-button>
                    <el-button type="primary" @click="doCloseAdd(true)">确认添加</el-button>
                </div>

            </el-dialog>
        </div>
        <div v-if="showEdit">
            <el-dialog title="编辑用户" :visible="showEdit" width="800px" :show-close="false">
                <el-form ref="formEdit" :model="editObj" :rules="rules" :inline="true" label-width="80px">
                    <el-form-item label="用户id" prop="userId">
                        <el-input style="width:200px;" v-model.trim="editObj.userId"></el-input>
                    </el-form-item>
                    <el-form-item label="用户名" prop="userName">
                        <el-input style="width:200px;" v-model.trim="editObj.userName"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="userMail">
                        <el-input style="width:200px;" v-model.trim="editObj.userMail"></el-input>
                    </el-form-item>
                    <el-form-item label="电话">
                        <el-input style="width:200px;" v-model.trim="editObj.userPhone"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号">
                        <el-input style="width:200px;" v-model.trim="editObj.userIdno"></el-input>
                    </el-form-item>
                    <el-form-item label="性别">
                        <el-select style="width:200px;" v-model="editObj.userSex" clearable placeholder="请选择">
                            <el-option label="男" value="1"></el-option>
                            <el-option label="女" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="doCloseEdit(false)">取 消</el-button>
                    <el-button type="primary" @click="doCloseEdit(true)">确认修改</el-button>
                </div>
            </el-dialog>
        </div>
        <div v-if="showRole">
            <el-dialog :title="'修改'+selectPeople.userName+'的角色'" :visible="showRole" width="800px" :show-close="false">
                <el-checkbox-group v-model="checkedRole">
                    <el-checkbox style="width:130px;margin-left:20px;" v-for="item in roleAll" :label="item.roleId"
                        :key="item.roleId">{{item.roleName}}
                    </el-checkbox>
                </el-checkbox-group>
                <div slot="footer" class="dialog-footer">

                    <el-button @click="doCloseRole(false)">取 消</el-button>
                    <el-button type="primary" @click="doCloseRole(true)">确认分配</el-button>
                </div>
            </el-dialog>
        </div>




    </div>

</template>

<script>
    import { deleteKey, getSessionId } from "@/utils"

    import { queryUserList, deleteUser, createUser, updateUser, resetPassword, queryRoleListAll, queryUserRoleAll, saveUserRole } from "@/api/system"
    export default {
        data() {
            return {
                query: {
                    userIdSearch: "",
                    userNameSearch: "",
                    userMailSearch: "",
                    userPhoneSearch: "",
                    userIdnoSearch: "",
                    userSexSearch: "",
                    pageNum: 1,
                    numPerPage: 10,

                },
                sexDic: {
                    "1": '男',
                    "0": "女"
                },

                showAdd: false,
                addObj: {
                    buttonId: "",
                    buttonName: "",
                    popId: "",
                },
                showEdit: false,
                showRole: false,
                editObj: {
                    buttonId: "",
                    buttonName: "",
                    popId: "",
                },
                updateUser: getSessionId(),

                data: {
                    total: 0,

                    rows: []
                },
                selectPeople: "",
                checkedRole: [],
                roleAll: [],//所有角色
                rules: {
                    userId: [
                        { required: true, message: '请输入用户ID', trigger: 'blur' },
                    ],
                    userName: [
                        { required: true, message: '请输入用户名字', trigger: 'blur' },
                    ],
                    userMail: [
                        { required: true, message: '请输入用户邮箱', trigger: 'blur' },
                        { type: "email", message: '请输入正确的邮箱', trigger: 'blur' },
                    ],

                }
            }
        },
        methods: {
            clearSearch() {
                this.query = {
                    userIdSearch: "",
                    userNameSearch: "",
                    userMailSearch: "",
                    userPhoneSearch: "",
                    userIdnoSearch: "",
                    userSexSearch: "",
                    pageNum: 1,
                    numPerPage: 10,
                }
            },
            doDelete(item) {
                let postObj = { id: item.id };
                this.$msgbox({
                    title: "删除",
                    message: "确认删除此该用户吗？",

                    beforeClose: async (action, instance, done) => {
                        if (action == "confirm") {
                            let info = await deleteUser(postObj);
                            if (info.resCode === "0") {
                                this.$message.success('删除成功');
                                this.getList();
                            }
                            done();

                        }
                        else {
                            done();
                        }
                    }
                })



            },
            doResetPassword(item) {
                let postObj = { id: item.id };
                this.$msgbox({
                    title: "重置密码",
                    message: "确认重置该用户的密码？",

                    beforeClose: async (action, instance, done) => {
                        if (action == "confirm") {
                            let info = await resetPassword(postObj);
                            if (info.resCode === "0") {
                                this.$message.success('操作成功');
                                this.getList();
                            }
                            done();

                        }
                        else {
                            done();
                        }
                    }
                })



            },
            async doShowRole(item) {
                this.selectPeople = item;
                this.checkedRole = [];
                this.showRole = true;
                let info = await queryUserRoleAll({ userId: item.userId });
                if (info.resCode === "0") {
                    if (info.rows) {

                        this.checkedRole = info.rows.map(item1 => {

                            return item1.roleId;

                        });
                    }


                }


            },
            async doCloseRole(bol) {
                if (bol) {
                    let rows = this.checkedRole.map(item => {
                        return { userId: this.selectPeople.userId, roleId: item }
                    })



                    let obj = {
                        userId: this.selectPeople.userId,
                        rows,

                    }
                    let info = await saveUserRole(obj);
                    if (info.resCode === "0") {
                        this.$message.success('分配成功');
                        this.getList();
                        this.showRole = false;
                    }




                }
                else {
                    this.showRole = false;
                }

            },
            doAdd() {
                this.showAdd = true;
                this.addObj = {};
                this.addObj.updateUser = this.updateUser;

            },
            doCloseAdd(bol) {
                if (bol) {
                    this.$refs['formAdd'].validate(async (valid) => {
                        if (valid) {
                            let info = await createUser(this.addObj);
                            if (info.resCode === "0") {
                                this.$message.success('添加成功');
                                this.queryList();
                                this.showAdd = false;
                            }
                        }
                    });
                }
                else {
                    this.showAdd = false;
                }
            },
            doEdit(item) {
                this.showEdit = true;
                this.editObj = {
                    id: item.id,
                    userId: item.userId,
                    userName: item.userName,
                    userMail: item.userMail,
                    userPhone: item.userPhone,
                    userIdno: item.userIdno,
                    userSex: item.userSex,
                    updateUser: this.updateUser,


                }

            },
            doCloseEdit(bol) {
                if (bol) {
                    this.$refs['formEdit'].validate(async (valid) => {
                        if (valid) {
                            let info = await updateUser(this.editObj);
                            if (info.resCode === "0") {
                                this.$message.success('修改成功');
                                this.getList();
                                this.showEdit = false;
                            }
                        }
                    });
                }
                else {
                    this.showEdit = false;
                }
            },
            async getList(num) {

                let postObj = deleteKey(this.query);
                postObj.pageNum--;

                let info = await queryUserList(postObj);
                if (info.resCode === "0") {
                    this.data = {
                        total: info.total,
                        rows: info.rows || []
                    }
                }

            },
            queryList() {
                this.query.pageNum = 1;
                this.getList(1)

            },
            handlePageChange(num) {
                this.query.pageNum = num;
                this.getList(num);
            },
            handleSizeChange(num) {
                this.query.pageNum = 1;
                this.query.numPerPage = num;
                this.getList(num)
            },
            async init() {
                let info = await queryRoleListAll();
                if (info.resCode === "0") {
                    this.roleAll = info.rows || [];
                }

            }


        }
        , mounted() {
            this.init();
            this.getList();
        },
    }
</script>