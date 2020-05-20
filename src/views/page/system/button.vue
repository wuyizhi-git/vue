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
        <el-table border ref="table" align="center" :data="data.rows" style="width: 100%;">

          <el-table-column align="center" type="index" label="序号" width="50" />
          <el-table-column align="center" prop="buttonId" label="按钮id" />
          <el-table-column align="center" prop="buttonName" label="按钮名称" />
          <el-table-column align="center" prop="popId" label="弹框id" />
          <el-table-column label="操作" width="300" align="center" fixed="right">
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
      <el-dialog title="添加系统按钮" :visible="showAdd" width="600px" :show-close="false">
        <el-form ref="formAdd" :model="addObj" :rules="rules" size="small" label-width="80px">
          <el-form-item label="按钮id" prop="buttonId">
            <el-input v-model.trim="addObj.buttonId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="按钮名称" prop="buttonName">
            <el-input v-model.trim="addObj.buttonName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="弹框id">
            <el-input v-model.trim="addObj.popId" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="doCloseAdd(false)">取 消</el-button>
          <el-button type="primary" @click="doCloseAdd(true)">确认添加</el-button>
        </div>
      </el-dialog>
    </div>
    <div v-if="showEdit">
      <el-dialog title="编辑系统按钮" :visible="showEdit" width="600px" :show-close="false">
        <el-form ref="formEdit" :model="editObj" :rules="rules" size="small" label-width="80px">
          <el-form-item label="按钮id" prop="buttonId">
            <el-input v-model.trim="editObj.buttonId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="按钮名称" prop="buttonName">
            <el-input v-model.trim="editObj.buttonName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="弹框id">
            <el-input v-model.trim="editObj.popId" style="width: 370px;" />
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
  import { deleteKey, deepClone } from "@/utils"
  
  // import Sortable from "sortablejs";
  import MIXIN from "@views/mixin/button"
  import { querySysButtons, deleteSysButtons, createSysButtons, updateSysButtons, querySysButtonsListAll } from "@/api/system"
  export default {
    mixins: [MIXIN],
    data() {
      return {
        query: {
          tblSearch: "",
          pageNum: 1,
          numPerPage: 10,

        },

        showAdd: false,
        addObj: {
          buttonId: "",
          buttonName: "",
          popId: "",
        },
        showEdit: false,
        editObj: {
          buttonId: "",
          buttonName: "",
          popId: "",
        },

        data: {
          total: 20,

          rows: []
        },
        rules: {
          buttonId: [
            { required: true, message: '请输入按钮ID', trigger: 'blur' },
          ],
          buttonName: [
            { required: true, message: '请输入按钮名称', trigger: 'blur' },
          ],

        }
      }
    },
    methods: {
      clearSearch() {
        this.query.tblSearch = "";

      },
      doDelete(item) {
        let postObj = { id: item.id };
        this.$msgbox({
          title: "确认删除此按钮吗？",
          beforeClose: async (action, instance, done) => {
            if (action == "confirm") {
              let info = await deleteSysButtons(postObj);
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
      doAdd() {
        this.showAdd = true;
        this.addObj = {};

      },
      doCloseAdd(bol) {
        if (bol) {
          this.$refs['formAdd'].validate(async (valid) => {
            if (valid) {
              let info = await createSysButtons(this.addObj);
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
          buttonId: item.buttonId,
          buttonName: item.buttonName,
          popId: item.popId,
        }
      },
      doCloseEdit(bol) {
        if (bol) {
          this.$refs['formEdit'].validate(async (valid) => {
            if (valid) {
              let info = await updateSysButtons(this.editObj);
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

        let info = await querySysButtons(postObj);
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
      }


    }
    , mounted() {
      this.getList();
      const tbody = document.querySelector(".el-table__body-wrapper tbody");
      // Sortable.create(tbody, {
      //   ghostClass: 'sortable-ghost',
      //   onEnd: ({ newIndex, oldIndex }) => {
      //     let newArr = deepClone(this.data.rows);
      //     const currRow = newArr.splice(oldIndex, 1)[0]
      //     newArr.splice(newIndex, 0, currRow)
      //     // 重新排序完的表格数据
      //     this.data.rows = []
      //     this.$nextTick(function () {
      //       this.data.rows = newArr
      //     })

      //   }
      // })

    },
  }
</script>
<style>
  .sortable-ghost {
    background: red;
  }
</style>