<template>
  <div>  
    <system-table>
      <div slot="top">
        <el-form ref="form" :inline="true" label-width="80px">

          <el-form-item label="组件名称">
           <el-input style="width:200px;" v-model.trim="compInfo.compName"></el-input>
          </el-form-item>

           <el-form-item label="组件分类">
            <el-select style="width:200px;" v-model="compInfo.compClassification" clearable placeholder="请选择">
                          <el-option :key="index+'cc'" v-for="(item,index) in compKindList"
                               :label="item.value+'-'+item.name" :value="item.value"></el-option>
                        </el-select>
          </el-form-item>

     
          <el-form-item label="产品分类">
            <el-select style="width:200px;" v-model="compInfo.productParamClassification" v-bind:disabled="compInfo.compClassification!=3" clearable placeholder="请选择">
                          <el-option :key="index+'cc'" v-for="(item,index) in compPrdtList"
                               :label="item.value+'-'+item.name" :value="item.value"></el-option>
                        </el-select>
          </el-form-item>
      
          <el-form-item label="组件类型">
           <el-select style="width:200px;" v-model="compInfo.compType" clearable placeholder="请选择">
                          <el-option :key="index+'cc'" v-for="(item,index) in compTypeList"
                               :label="item.value+'-'+item.name" :value="item.value"></el-option>
                        </el-select>
          </el-form-item>

        </el-form>
      </div>

      <div slot="action" align="center">
        <el-button @click="doAdd"  type="primary"  align="center">确定</el-button>
        <el-button @click="doClose" >取 消</el-button>
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
      <el-dialog title="编辑组件" :visible="showEdit" width="600px" :show-close="false">
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
  import MIXIN from "@views/mixin/button"
  //import { querySysButtons, deleteSysButtons, createSysButtons, updateSysButtons, querySysButtonsListAll } from "@/api/system"
  import { createCompButtons } from "@/api/parmbusi"
  export default {
    mixins: [MIXIN],
    data() {

      return {     
        compInfo: {
          orgId:"001",
          sysCode:"001",
          compClassification: "1",
          productParamClassification: "",
          compType:"1",         
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
  
      async doAdd() {
        //let obj=this.compInfo;

        if (this.compInfo.compName==null) {
          this.$alert("组件名称不能为空",this.compInfo)
        }

        let info = await createCompButtons(this.compInfo);

          if (info.resCode === "0") {   
                this.$message.success('添加成功');
                this.showAdd = false;                           
              }
              else {
                     this.$alert("交易失败",info.resMsg);
              }

      },

      doClose() {
        
         // (confirm("您确定要关闭本页吗？")){
          window.opener=null;
          window.open('','_self');
          window.close();
         
       },



    }
    , 
    //mounted() {
     // const tbody = document.querySelector(".el-table__body-wrapper tbody");
      
    //},
  }
</script>
<style>
  .sortable-ghost {
    background: red;
  }
</style>