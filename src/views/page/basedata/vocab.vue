<template>
    <div>
        <system-table>
            <div slot="top">
                <el-form ref="form" :inline="true" label-width="80px">
                    <system-component :required="false" :query="query" />

                    <el-form-item label="数据标准">


                        <el-select style="width:200px;" v-model="query.dataStand" clearable placeholder="请选择">
                            <el-option :key="index+'cc'" v-for="(item,index) in dataStandList"
                                :label="item.value+'-'+item.name" :value="item.value"></el-option>

                        </el-select>
                    </el-form-item>
                    <el-form-item label="英文词根">
                        <el-input style="width:200px;" v-model.trim="query.wordCode"></el-input>
                    </el-form-item>
                    <el-form-item label="中文名称">
                        <el-input style="width:200px;" v-model.trim="query.wordDesc"></el-input>
                    </el-form-item>
                    <el-form-item label="英文全称">
                        <el-input style="width:200px;" v-model.trim="query.englishDesc"></el-input>

                    </el-form-item>
                </el-form>
            </div>
            <div slot="search">
                <div class="header-search">
                    <el-button @click="queryList" type="primary">查询</el-button>
                    <el-button @click="clearSearch" type="warning">清除</el-button>
                </div>


            </div>
            <div slot="action">

                <el-button @click="doAdd" type="primary">添加</el-button>

            </div>

            <!--表单渲染-->
            <div slot="body">
                <el-table border ref="table" align="center" :data="data.rows" style="width: 100%;">
                    <el-table-column align="center" type="index" label="序号" width="50" />
                    <el-table-column align="center" prop="userSex" label="子系统">
                        <template slot-scope="scope">{{subSysObj[scope.row.subSysId]}}</template>
                    </el-table-column>
                    <el-table-column align="center" prop="wordCode" label="英文词根" />
                    <el-table-column align="center" prop="wordDesc" label="中文描述" />
                    <el-table-column align="center" prop="englishDesc" label="英文全称" />

                    <el-table-column width="120" align="center" prop="userSex" label="数据标准">
                        <template slot-scope="scope">{{dataStandObj[scope.row.dataStand]}}</template>
                    </el-table-column>

                    <el-table-column label="操作" width="280" align="center" fixed="right">
                        <template slot-scope="scope">
                            <el-button @click="doEdit(scope.row,scope.index)" type="primary">修改</el-button>
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
            <el-dialog title="添加词根" :visible="showAdd" width="800px" :show-close="false">
                <el-form ref="formAdd" :model="addObj" :rules="rules" :inline="true" label-width="80px">
                    <system-component :required="true" :query="addObj" />
                    <el-form-item prop="dataStand" label="数据标准">
                        <el-select style="width:200px;" v-model="addObj.dataStand" clearable placeholder="请选择">
                            <el-option :key="index+'cc'" v-for="(item,index) in dataStandList"
                                :label="item.value+'-'+item.name" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="wordCode" label="英文词根">
                        <el-input style="width:200px;" v-model.trim="addObj.wordCode"></el-input>
                    </el-form-item>
                    <el-form-item prop="wordDesc" label="中文描述">
                        <el-input style="width:200px;" v-model.trim="addObj.wordDesc"></el-input>
                    </el-form-item>
                    <el-form-item label="英文全称">
                        <el-input style="width:200px;" v-model.trim="addObj.englishDesc"></el-input>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input style="width:200px;" v-model.trim="addObj.remark"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="doCloseAdd(false)">取 消</el-button>
                    <el-button type="primary" @click="doCloseAdd(true)">确认添加</el-button>
                </div>
            </el-dialog>
        </div>
        <div v-if="showEdit">
            <el-dialog title="添加词根" :visible="showEdit" width="800px" :show-close="false">
                <el-form ref="formEdit" :model="editObj" :rules="rules" :inline="true" label-width="80px">
                    <system-component :required="true" :query="editObj" />
                    <el-form-item prop="dataStand" label="数据标准">
                        <el-select style="width:200px;" v-model="editObj.dataStand" clearable placeholder="请选择">
                            <el-option :key="index+'cc'" v-for="(item,index) in dataStandList"
                                :label="item.value+'-'+item.name" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="wordCode" label="英文词根">
                        <el-input style="width:200px;" v-model.trim="editObj.wordCode"></el-input>

                    </el-form-item>
                    <el-form-item prop="wordDesc" label="中文描述">
                        <el-input style="width:200px;" v-model.trim="editObj.wordDesc"></el-input>
                    </el-form-item>
                    <el-form-item label="英文全称">
                        <el-input style="width:200px;" v-model.trim="editObj.englishDesc"></el-input>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input style="width:200px;" v-model.trim="editObj.remark"></el-input>
                    </el-form-item>
                    <el-form-item label="创建人">
                        <el-input disabled style="width:200px;" v-model.trim="editObj.createUser"></el-input>
                    </el-form-item>
                    <el-form-item label="创建时间">
                        <el-input disabled style="width:200px;" v-model.trim="editObj.createTime"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="doCloseEdit(false)">取 消</el-button>
                    <el-button type="primary" @click="doCloseEdit(true)">确认修改</el-button>
                </div>
            </el-dialog>

        </div>

    </div>
</template>

<script>
    import { deleteKey, getSessionId } from '@/utils';
    import MIXIN from "@views/mixin/button"
    import SYSTEM from "@views/mixin/system"
    import systemComponent from '@views/components/system.component.vue';
    import { queryVocabList, createVocab, updateVocab, deleteVocab } from '@/api/basedata';
    export default {
        mixins: [MIXIN, SYSTEM],
        components: { systemComponent },

        data() {
            return {
                query: {
                    dataStand: '',
                    sysId: "",
                    subSysId: "",
                    pageNum: 1,
                    numPerPage: 10,
                    clickMenuId: this.clickMenuId,
                },



                showAdd: false,
                addObj: {
                    sysId: "",
                    subSysId: "",
                    dataStand: "",
                },
                showEdit: false,
                showRole: false,
                editObj: {
                    buttonId: '',
                    buttonName: '',
                    popId: ''
                },


                data: {
                    total: 0,

                    rows: []
                },
                selectPeople: '',
                checkedRole: [],

                rules: {
                    sysId: [{ required: true, message: '请选择系统', trigger: 'change' }],
                    subSysId: [{ required: true, message: '请选择系统', trigger: 'change' }],
                    dataStand: [{ required: true, message: '请输入', trigger: 'change' }],
                    wordCode: [{ required: true, message: '请输入', trigger: 'change' }],
                    wordDesc: [{ required: true, message: '请输入', trigger: 'change' }],

                }
            };
        },
        methods: {
            clearSearch() {
                this.query = {

                    sysId: "",
                    subSysId: "",

                    pageNum: 1,
                    numPerPage: 10
                };
            },
            doDelete(item) {
                let postObj = { id: item.id, clickMenuId: this.clickMenuId };

                this.$msgbox({
                    title: '删除',
                    message: '确认删除此该词根吗？',

                    beforeClose: async (action, instance, done) => {
                        if (action == 'confirm') {
                            let info = await deleteVocab(postObj);
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
                this.wordCode = "";
                this.addObj = {
                    sysId: "",
                    subSysId: "",
                };

            },
            doCloseAdd(bol) {
                if (bol) {
                    this.$refs['formAdd'].validate(async valid => {
                        if (valid) {
                            this.addObj.clickMenuId = this.clickMenuId;
                            if (!/^[a-zA-Z][a-zA-Z0-9]{1,100}$/.test(this.addObj.wordCode)) {
                                return this.$message.error("格式错误");


                            }
                            this.addObj.wordCode = this.addObj.wordCode.toLowerCase()
                            let info = await createVocab(this.addObj);
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
                    createTime: item.createTime,
                    createUser: item.createUser,
                    dataStand: item.dataStand,
                    englishDesc: item.englishDesc,
                    id: item.id,
                    remark: item.remark,



                    subSysId: item.subSysId,
                    sysId: item.sysId,

                    wordCode: item.wordCode,
                    wordDesc: item.wordDesc,
                };
            },
            doCloseEdit(bol) {
                if (bol) {
                    this.$refs['formEdit'].validate(async valid => {
                        if (valid) {
                            this.editObj.clickMenuId = this.clickMenuId;
                            if (!/^[a-zA-Z][a-zA-Z0-9]{1,100}$/.test(this.editObj.wordCode)) {
                                return this.$message.error("格式错误")

                            }
                            this.editObj.wordCode = this.editObj.wordCode.toLowerCase()
                            let info = await updateVocab(this.editObj);
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
            async getList(num) {
                let postObj = deleteKey(this.query);
                postObj.pageNum--;
                postObj.clickMenuId = this.clickMenuId;

                let info = await queryVocabList(postObj);
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

        },
        mounted() {

            // this.getList();
        }
    };
</script>