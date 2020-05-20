<template>
    <div>
        <system-table>

            <!--工具栏-->
            <div slot="top">
                <el-form ref="form" :inline="true" label-width="140px">
                    <system-component :required="false" :query="query" />

                    <el-form-item label="数据标准">


                        <el-select style="width:200px;" v-model="query.dataStand" clearable placeholder="请选择">
                            <el-option :key="index+'cc'" v-for="(item,index) in dataStandList"
                                :label="item.value+'-'+item.name" :value="item.value"></el-option>

                        </el-select>
                    </el-form-item>
                    <el-form-item label="数据字典">
                        <el-input style="width:200px;" v-model.trim="query.dictCode"></el-input>
                    </el-form-item>
                    <el-form-item label="元数据代码">
                        <el-input style="width:200px;" v-model.trim="query.unitDataCode"></el-input>
                    </el-form-item>
                    <el-form-item label="中文名称">
                        <el-input style="width:200px;" v-model.trim="query.unitDataDesc"></el-input>

                    </el-form-item>
                </el-form>


                <!-- <crudOperation show="" :permission="permission" /> -->
            </div>
            <div slot="search">
                <el-button @click="queryList" type="primary">查询</el-button>
                <el-button @click="clearSearch" type="warning">清除</el-button>
            </div>
            <div slot="action">
                <el-button @click="doAdd" type="primary">添加</el-button>
            </div>
            <!--表单渲染-->

            <!--表格渲染-->
            <div slot="body">
                <el-table border ref="table" align="center" :data="data.rows" style="width: 100%;">
                    <el-table-column align="center" type="index" label="序号" width="50" />
                    <el-table-column align="center" prop="userSex" label="子系统">
                        <template slot-scope="scope">{{subSysObj[scope.row.subSysId]}}</template>
                    </el-table-column>
                    <el-table-column width="120" align="center" prop="userSex" label="数据标准">
                        <template slot-scope="scope">{{dataStandObj[scope.row.dataStand]}}</template>
                    </el-table-column>
                    <el-table-column align="center" prop="unitDataCode" label="元数据代码" />
                    <el-table-column align="center" prop="unitDataDesc" label="中文名称" />
                    <el-table-column align="center" prop="englishDesc" label="英文全称" />
                    <el-table-column align="center" prop="dictCode" label="数据字典" />
                    <el-table-column align="center" prop="optionCode" label="选项代码" />
                    <el-table-column align="center" prop="optionGroup" label="选项组别" />
                    <el-table-column align="center" prop="dictCode" label="敏感数据">
                        <template slot-scope="scope">{{senseFlagObj[scope.row.sensFlag]}}</template>
                    </el-table-column>
                    <el-table-column align="center" prop="dictCode" label="状态">
                        <template slot-scope="scope">{{statusObj[scope.row.status]}}</template>
                        statusObj



                    </el-table-column>
                    <el-table-column align="center" prop="remark" label="备注" />



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
            <el-dialog title="添加元数据" :visible="showAdd" width="800px" :show-close="false">
                <el-form ref="formAdd" :model="addObj" :rules="rules" :inline="true" label-width="120px">
                    <system-component @changesysid="changesysid" :required="true" :query="addObj" />
                    <el-form-item prop="dataStand" label="数据标准">
                        <el-select style="width:200px;" v-model="addObj.dataStand" clearable placeholder="请选择">
                            <el-option :key="index+'cc'" v-for="(item,index) in dataStandList"
                                :label="item.value+'-'+item.name" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="englishDesc" label="英文全称">
                        <el-input style="width:200px;" v-model.trim="addObj.englishDesc"></el-input>
                    </el-form-item>
                    <el-form-item label="词根拼接">
                        <el-select filterable style="width:200px;" v-model="unitDataCode" clearable placeholder="请选择">
                            <el-option :key="index+'c5'" v-for="(item,index) in voCabList"
                                :label="item.wordDesc+'-'+item.wordCode" :value="item.wordCode">
                            </el-option>
                        </el-select>
                        <el-button @click="addCombin('addObj')">组合</el-button>
                    </el-form-item>
                    <el-form-item label="元数据代码">
                        <el-input style="width:400px;" disabled v-model.trim="addObj.unitDataCode"></el-input>
                        <el-button @click="deleteCombin('addObj')" type="primary" icon="el-icon-back"></el-button>
                        <el-button @click="clearCombin('addObj') " type="primary" icon="el-icon-delete"></el-button>

                    </el-form-item>
                    <el-form-item label="中文名称">
                        <el-input style="width:400px;" v-model.trim="addObj.unitDataDesc"></el-input>

                    </el-form-item>
                    <el-form-item label="选项代码">

                        <el-select filterable style="width:400px;" v-model="addObj.optionCode" clearable
                            placeholder="请选择">
                            <el-option :key="index+'cc'" v-for="(item,index) in disinList"
                                :label="item.optionCode+'-'+item.optionName" :value="item.optionCode"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="dictCode" label="数据字典">
                        <el-select placeholder="请查询后输入" filterable remote :remote-method="remoteMethod"
                            style="width:400px;" v-model.trim="addObj.dictCode">
                            <el-option :key="index+'cc'" v-for="(item,index) in dictList"
                                :label="item.dictCode+'-'+item.dictDesc +'--------类型:'+item.type+',长度'+item.length"
                                :value="item.dictCode"></el-option>

                        </el-select>
                    </el-form-item>

                    <el-form-item prop="sensFlag" label="敏感数据">
                        <el-select style="width:200px;" v-model="addObj.sensFlag" clearable placeholder="请选择">
                            <el-option :key="index+'cc'" v-for="(item,index) in senseFlagList"
                                :label="item.optionValue+'-'+item.optionDesc" :value="item.optionValue"></el-option>
                        </el-select>
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
            <el-dialog title="修改元数据" :visible="showEdit" width="800px" :show-close="false">

                <el-form ref="formEdit" :model="editObj" :rules="rules" :inline="true" label-width="120px">
                    <system-component disabled="1" :required="true" :query="editObj" />
                    <el-form-item prop="dataStand" label="数据标准">
                        <el-select style="width:200px;" v-model="editObj.dataStand" clearable placeholder="请选择">
                            <el-option :key="index+'cc'" v-for="(item,index) in dataStandList"
                                :label="item.value+'-'+item.name" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="englishDesc" label="英文全称">
                        <el-input style="width:200px;" v-model.trim="editObj.englishDesc"></el-input>
                    </el-form-item>
                    <el-form-item label="词根拼接">
                        <el-select filterable style="width:200px;" v-model="unitDataCode" clearable placeholder="请选择">
                            <el-option :key="index+'c5'" v-for="(item,index) in voCabList"
                                :label="item.wordDesc+'-'+item.wordCode" :value="item.wordCode">
                            </el-option>
                        </el-select>
                        <el-button @click="addCombin('editObj')">组合</el-button>
                    </el-form-item>
                    <el-form-item label="元数据代码">
                        <el-input style="width:400px;" disabled v-model.trim="editObj.unitDataCode"></el-input>
                        <el-button @click="deleteCombin('editObj')" type="primary" icon="el-icon-back"></el-button>
                        <el-button @click="clearCombin('editObj') " type="primary" icon="el-icon-delete"></el-button>

                    </el-form-item>
                    <el-form-item label="中文名称">
                        <el-input style="width:400px;" v-model.trim="editObj.unitDataDesc"></el-input>

                    </el-form-item>
                    <el-form-item label="选项代码">

                        <el-select filterable style="width:400px;" v-model="editObj.optionCode" clearable
                            placeholder="请选择">
                            <el-option :key="index+'cc'" v-for="(item,index) in disinList"
                                :label="item.optionCode+'-'+item.optionName" :value="item.optionCode"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="dictCode" label="数据字典">
                        <el-select placeholder="请查询后输入" filterable remote :remote-method="remoteMethod"
                            style="width:400px;" v-model.trim="editObj.dictCode">
                            <el-option :key="index+'cc'" v-for="(item,index) in dictList"
                                :label="item.dictCode+'-'+item.dictDesc +'----类型:'+item.type+',长度'+item.length"
                                :value="item.dictCode"></el-option>

                        </el-select>
                    </el-form-item>

                    <el-form-item prop="sensFlag" label="敏感数据">
                        <el-select style="width:200px;" v-model="editObj.sensFlag" clearable placeholder="请选择">
                            <el-option :key="index+'cc'" v-for="(item,index) in senseFlagList"
                                :label="item.optionValue+'-'+item.optionDesc" :value="item.optionValue"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="sensFlag" label="状态">
                        <el-select style="width:200px;" v-model="editObj.status" clearable placeholder="请选择">
                            <el-option label="1-启用" value="1"></el-option>
                            <el-option label="2-禁用" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input style="width:200px;" v-model.trim="editObj.remark"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="doCloseEdit(false)">取 消</el-button>
                    <el-button type="primary" @click="doCloseEdit(true)">确认添加</el-button>
                </div>
            </el-dialog>



        </div>

    </div>
</template>

<script>
    import { deleteKey, getSessionId, getSplitArr, getStrLowCase } from '@/utils';
    import MIXIN from "@views/mixin/button"
    import SYSTEM from "@views/mixin/system"
    import systemComponent from '@views/components/system.component.vue';
    import { queryUnitDataList, createUnitData, updateVocab, deleteUnitData, queryListPaging2 } from '@/api/basedata';
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

                unitDataCode: "",
                statusObj: {
                    1: '启用',
                    2: '禁用',
                },
                showAdd: false,
                addObj: {

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
                dictList: [],
                
                rules: {
                    sysId: [{ required: true, message: '请选择系统', trigger: 'change' }],
                    subSysId: [{ required: true, message: '请选择系统', trigger: 'change' }],
                    dataStand: [{ required: true, message: '请输入', trigger: 'change' }],
                    unitDataCode: [{ required: true, message: '请输入', trigger: 'change' }],
                    wordDesc: [{ required: true, message: '请输入', trigger: 'change' }],
                    dictCode: [{ required: true, message: '请输入', trigger: 'change' }],
                    sensFlag: [{ required: true, message: '请选择', trigger: 'change' }],

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
                let postObj = { id: item.id, clickMenuId: this.clickMenuId, dataStand: item.dataStand };

                this.$msgbox({
                    title: '删除',
                    message: '确认删除此该词根吗？',

                    beforeClose: async (action, instance, done) => {
                        if (action == 'confirm') {
                            let info = await deleteUnitData(postObj);
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
            changesysid() {
                this.addObj.dictCode = "";
                this.addObj.unitDataCode = "";
                this.addObj.unitDataDesc = "";
                this.addObj.optionCode = "";


            },

            doAdd() {
                this.showAdd = true;
                this.unitDataCode = "";
                this.addObj = {
                    sysId: "",
                    subSysId: "",
                    dataStand: "",
                    dictCode: "",
                    unitDataCode: "",
                    unitDataDesc: "",
                };

            },
            doCloseAdd(bol) {
                if (bol) {
                    this.$refs['formAdd'].validate(async valid => {
                        // return console.log(this.addObj)
                        if (valid) {
                            this.addObj.clickMenuId = this.clickMenuId;

                            let info = await createUnitData(this.addCreateObj);
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
                console.log(item);
                this.editObj = {

                    dataStand: item.dataStand + "",
                    englishDesc: item.englishDesc,
                    subSysId: item.subSysId,
                    sysId: item.sysId,
                    unitDataDesc: item.unitDataDesc,
                    unitDataCode: item.unitDataCode,
                    wordDesc: item.wordDesc,
                    optionCode: item.optionCode,
                    dictCode: item.dictCode,
                    sensFlag: item.sensFlag + "",
                    remark: item.remark,
                    status: item.status + "",



                };
                this.remoteMethod(item.dictCode)
            },
            doCloseEdit(bol) {
                if (bol) {
                    this.$refs['formEdit'].validate(async valid => {
                        if (valid) {
                            this.editObj.clickMenuId = this.clickMenuId;
                            if (!/^[a-zA-Z][a-zA-Z0-9]{1,100}$/.test(this.editObj.unitDataCode)) {
                                return this.$message.error("格式错误")

                            }
                            this.editObj.unitDataCode = this.editObj.unitDataCode.toLowerCase()
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
            async remoteMethod(query) {
                if (/^[a-zA-Z]*$/.test(query)) {
                    let info = await queryListPaging2({ ref_dictCode: query, sysId: this.addObj.sysId, dictCode: query })
                    this.dictList = info.rows || [];
                }
                else {
                    let info = await queryListPaging2({ dictDesc: query, sysId: this.addObj.sysId })
                    this.dictList = info.rows || [];

                }

            },
            addCombin(item) {
                if (!this.unitDataCode) {
                    return this.$message.error("请在词根拼接处选择")
                }
                console.log(this.addObj.unitDataCode)
                if (this[item].unitDataCode.length) {
                    this[item].unitDataCode += getStrLowCase(this.unitDataCode)

                }
                else {
                    this[item].unitDataCode = this.unitDataCode;

                }
                this[item].unitDataDesc += this.voCabObj[this.unitDataCode];

            },
            deleteCombin(arr) {

                if (this[arr].unitDataCode.length == 0) return;

                let list = getSplitArr(this[arr].unitDataCode).split(",");

                list.length = list.length - 1;
                console.log(list.length)
                console.log(list);
                list.forEach((item, index) => {
                    if (index) {
                        this[arr].unitDataCode += getStrLowCase(item);

                    }
                    else {
                        this[arr].unitDataCode = item;
                        this[arr].unitDataDesc = "";

                    }
                    this[arr].unitDataDesc += this.voCabObj[item];

                })
                if (list.length == 0) {
                    this.clearCombin();
                }


            },
            clearCombin(item) {
                this.addObj.dictCode = "";
                this.editObj.dictCode = "";
                this.addObj.unitDataDesc = ""
                this.editObj.unitDataDesc = ""
            },
            async getList(num) {
                let postObj = deleteKey(this.query);
                postObj.pageNum--;
                postObj.clickMenuId = this.clickMenuId;

                let info = await queryUnitDataList(postObj);
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

            this.queryDistinctOption();
            this.getVoCabList();

            // this.getList();
        }
    };
</script>