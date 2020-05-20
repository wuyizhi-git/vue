<template>
    <div>
        <system-table>
            <div slot="top">
                <el-form ref="form" :inline="true" label-width="80px">
                    <el-form-item label="组件分类">
                        <el-select
                            style="width:200px;"
                            v-model="query.compClassification"
                            clearable
                            placeholder="请选择"
                        >
                            <el-option
                                :key="index+'cc'"
                                v-for="(item,index) in compKindList"
                                :label="item.value+'-'+item.name"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="组件类型">
                        <el-select
                            style="width:200px;"
                            v-model="query.compType"
                            clearable
                            placeholder="请选择"
                        >
                            <el-option
                                :key="index+'cc'"
                                v-for="(item,index) in compTypeList"
                                :label="item.value+'-'+item.name"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>

            <div slot="search">
                <el-button @click="queryComp" type="primary">查询</el-button>
                <el-button @click="clearSearch" type="warning">清除</el-button>
            </div>

            <!--表格渲染-->
            <div slot="body">              
                <el-table border ref="table" align="center" :data="data.rows" style="width: 100%;">
                    <el-table-column align="center" prop="id" label="id" />
                    <el-table-column align="center" prop="compCode" label="组件代码" />
                    <el-table-column align="center" prop="compName" label="组件名称" />
                    <el-table-column align="center" prop="compClassification" label="组件分类">                    
                        <template slot-scope="scope">{{compKindObj[scope.row.compClassification]}}</template>
                    </el-table-column>

                    <el-table-column align="center" prop="compType" label="组件类型">
                        <template slot-scope="scope">{{compTypeObj[scope.row.compType]}}</template>
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
                    <el-pagination
                        background
                        layout="total,pager,jumper,sizes"
                        :current-page="query.pageNum"
                        :page-sizes="[10,25,50]"
                        :page-size="query.numPerPage"
                        :total="data.total"
                        @current-change="handlePageChange"
                        @size-change="handleSizeChange"
                    ></el-pagination>
                </div>
            </div>
        </system-table>

      <div v-if="showEdit">
      <el-dialog title="编辑组件" :visible="showEdit" width="600px" :show-close="false">
        <el-form ref="formEdit" :model="editObj" :rules="rules" size="small" label-width="80px">
           <el-form-item label="序号" prop="id" >
            <el-input v-model.trim="editObj.id" readonly style="width: 370px;" />
          </el-form-item>
           <el-form-item label="组件代码" prop="compCode" >
            <el-input v-model.trim="editObj.compCode" readonly style="width: 370px;" />
          </el-form-item>
          <el-form-item label="组件名称" prop="compName">
            <el-input v-model.trim="editObj.compName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="组件分类" prop="compClassification">
            <el-input v-model.trim="editObj.compClassification" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="组件类型" prop="compType">
            <el-input v-model.trim="editObj.compType" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="doConfirmEdit(false)">取 消</el-button>
          <el-button type="primary" @click="doConfirmEdit(true)">确认修改</el-button>
        </div>
      </el-dialog>
    </div>
    </div>
</template>

<script>
import { deleteKey, deepClone } from '@/utils';
import MIXIN from '@views/mixin/button';
import { queryCompButtons, updateCompButtons, deleteCompButtons } from '@/api/parmbusi';
export default {
    mixins: [MIXIN],
    data() {
        return {
            query: {
                dataStand: '',
                sysId: '',
                orgId: '',
                compClassification: '',
                compType: '',
                pageNum: 1,
                numPerPage: 10,
                clickMenuId: this.clickMenuId
            },         

            showEdit: false,

            editObj:{},    
            compKindObj: {},
            compTypeObj:{},

             //法人代码
            orgList: [
                {
                    name: '昆仑银行',
                    value: '001'
                }
            ],

            //系统代码
            sysList: [
                {
                    name: '核心系统',
                    value: '001'
                },
                {
                    name: '核算系统',
                    value: '002'
                }
            ],
        
            //组件分类
            compKindList: [
                {
                    name: '技术参数',
                    value: '1'
                },
                {
                    name: '业务参数',
                    value: '2'
                },
                {
                    name: '产品参数',
                    value: '3'
                }
            ],

            // 产品参数
            compPrdtList: [{
                name: "存款",
                value: "1"
            },
            {
                name: "贷款",
                value: "2"
            },
            {
                name: "内部户",
                value: "3"
            },
            {
                name: "核算",
                value: "3"
            },
             {
                name: "定价",
                value: "3"
            },
            ],
            //组件类型
            compTypeList: [
                {
                    name: '单一',
                    value: '1'
                },
                {
                    name: '复合',
                    value: '2'
                }
            ],  

            data: {
                total: 20,
                rows: []
            },

            rules: {
                buttonId: [{ required: true, message: '请输入按钮ID', trigger: 'blur' }],
                buttonName: [{ required: true, message: '请输入按钮名称', trigger: 'blur' }]
            }
        };
    },

    methods: {

        clearSearch() {
            this.query.compClassification = '';
            this.query.compType = '';
        },

        doDelete(item) {
            let postObj = { id: item.id ,compName:item.compName};
            this.$msgbox({
                title: '确认删除此按钮吗？',
                beforeClose: async (action, instance, done) => {
                    if (action == 'confirm') {
                        let info = await deleteCompButtons(postObj);
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

        async getList(num) {
            let postObj = deleteKey(this.query);
            postObj.pageNum--;

            let info = await queryCompButtons(this.postObj);

            if (info.resCode === '0') {
                this.data = {
                    total: info.total,
                    rows: info.rows || []
                };
            }
        },

        queryComp() {
            this.query.pageNum = 1;
            this.getList(1);
        },

        async doEdit(item) {
          this.showEdit = true;
          this.editObj = {
            id:item.id,
            compCode: item.compCode,
            compName: item.compName,
            compClassification: item.compClassification,
            compType: item.compType,
            popId: item.popId,
          }        
       },

        doConfirmEdit(bol) {
                if (bol) {
                    this.$refs['formEdit'].validate(async valid => {
                        if (valid) {
                            this.editObj.clickMenuId = this.clickMenuId;
                            if (!/^[a-zA-Z][a-zA-Z0-9]{1,100}$/.test(this.editObj.unitDataCode)) {
                                return this.$message.error("格式错误")

                            }
                            this.editObj.compCode = this.editObj.compCode.toLowerCase()
                            let info = await updateCompButtons(this.editObj);
                            if (info.resCode === '0') {
                                //this.$message.success('修改成功');
                                this.$msgbox({
                                        title: '交易成功',
                                        message: info.resMsg,
                                });
                                this.showEdit = false;
                            }
                            else {
                                this.$msgbox({
                                        title: '交易失败',
                                        message: info.resMsg,
                                });
                            }
                                
                        }
                    });
                } else {
                    this.showEdit = false;
                }
            },

       handlePageChange(num) {
            this.query.pageNum = num;
            this.getList(num);
        },
        handleSizeChange(num) {
            this.query.pageNum = 1;
            this.query.numPerPage = num;
            this.getList(num);
        }
    },
    mounted() {
        this.getList();
        this.compKindList.forEach(item => {
            this.compKindObj[item.value] = item.name;
        });
        this.compTypeList.forEach(item => {
            this.compTypeObj[item.value] = item.name;
        });
      
    }
};
</script>
<style>
.sortable-ghost {
    background: red;
}
</style>