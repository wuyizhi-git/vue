<template>
    <div class="app-container">
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card class="min-height">
                    <div slot="header" class="clearfix">
                        <span>菜单结构</span>
                        <el-button @click="doAdd(true)" size="big"  v-if="PERMISSON.add"
                            style="float: right; padding: 3px 0;width: 100px;height: 30px;margin-left:20px;"
                            type="primary">
                            新增一级菜单</el-button>
                    </div>
                    <el-tree node-key="menuId" :default-expanded-keys="openArr" @node-click="nodeClick" highlight-current
                        accordion :data="TreeData">

                    </el-tree>

                </el-card>
            </el-col>


            <el-col :span="16">
                <el-card class="min-height">
                    <div slot="header" class="clearfix">
                        <span>菜单内容</span>
                        <div style="width: 100%">


                            <div v-if="!actionType">
                                <el-button v-if="PERMISSON.remove" @click="doDelete" size="big" class="button_style" type="danger">
                                    <i class="el-icon-lx-redpacket_fill"></i>删除菜单</el-button>

                                <el-button v-if="PERMISSON.update"  @click="edit" size="big" class="button_style" type="warning">
                                    <i class="el-icon-edit"></i>修改</el-button>

                                <el-button v-if="PERMISSON.add" @click="doAdd(false)" size="big" class="button_style" type="primary">
                                    <i class="el-icon-plus"></i>新增子菜单</el-button>
                            </div>
                            <div v-if="actionType=='edit'">
                                <el-button @click="saveEdit" size="big" class="button_style" type="primary">
                                    确认修改</el-button>
                                <el-button @click="cancel" size="big" class="button_style" 取消</el-button> </div> <div
                                    v-if="actionType=='add'">
                                    <el-button @click="saveAdd" size="big" class="button_style" type="primary">
                                        确认添加</el-button>
                            </div>
                        </div>


                    </div>

                    <el-form :disabled="formDisabled" :rules="rules" :model="postObj" ref="form" label-width="100px">
                        <el-row :gutter="20">
                            <el-col v-if="actionType=='add'" align="left" :span="12">
                                <el-form-item label="父级菜单">
                                    {{parentName}}
                                </el-form-item>
                            </el-col>
                            <el-col align="left" :span="12">
                               
                                <el-form-item label="菜单类型" prop="menuType">
                                    <el-select :disabled="!!(selectItem.children&&selectItem.children.length)"
                                        style="width:200px;" v-model="postObj.menuType" clearable placeholder="请选择">
                                        <el-option label="F-父级菜单" value="F"></el-option>
                                        <el-option label="L-子菜单" value="L"></el-option>
                                    </el-select>

                                </el-form-item>
                            </el-col>
                            <el-col align="left" :span="12">
                                <el-form-item label="菜单号" prop="menuId">
                                    <el-input style="width:200px;" v-model.trim="postObj.menuId"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col align="left" :span="12">
                                <el-form-item prop="name" label="菜单名称">
                                    <el-input style="width:200px;" v-model.trim="postObj.name"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col v-if="postObj.menuType=='L'" align="left" :span="12">
                                <el-form-item label="流程编号">
                                    <el-input style="width:200px;" v-model.trim="postObj.flowKey"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col v-if="postObj.menuType=='L'" align="left" :span="12">
                                <el-form-item label="版本管理">
                                    <el-select style="width:200px;" v-model="postObj.isEdition" clearable
                                        placeholder="请选择">
                                        <el-option label="0-否" value="0"></el-option>
                                        <el-option label="1-是" value="1"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col v-if="postObj.menuType=='L'" align="left" :span="12">
                                <el-form-item label="交易名称">
                                    <el-input style="width:200px;" v-model.trim="postObj.tranName"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col v-if="postObj.menuType=='L'" align="left" :span="12">
                                <el-form-item label="菜单URL">
                                    <el-input style="width:200px;" v-model.trim="postObj.menuUrl"></el-input>
                                </el-form-item>
                            </el-col>

                        </el-row>

                        <el-transfer v-if="postObj.menuType=='L'" :props="{
                            key: 'buttonId',
                            label: 'buttonName'
                          }" style="margin-left:100px;" filterable v-model="buttonPerms" :titles="['可选按钮', '已选按钮']"
                            :data="allButtons">

                        </el-transfer>

                    </el-form>



                </el-card>

            </el-col>

        </el-row>


    </div>
</template>

<script>
   
    import MIXIN from "@views/mixin/button"

    import { deleteKey, deepClone } from "@/utils"
    import { queryMenu, createMenu, deleteMenu, querySysButtonsListAll, updateMenu, queryMenuForTree } from "@/api/system"
    export default {
          mixins: [MIXIN],
        data() {
            return {
                TreeData: [],
                value: [],
                data: [{
                    key: 'success',
                    label: "123",
                }],
                parentName: "",

                showDelete: false,
                formDisabled: true,
                postObj: {},
                postObjZan: {},//放到暂存区；


                allButtons: [],
                buttonPerms: [],
                buttonPermsZan: [],//放到暂存区；
                actionType: "",
                selectItem: {},
                parentName: "",
                openArr: [],
                rules: {
                    menuType: [
                        { required: true, message: '请输入菜单类型', trigger: 'change' },

                    ],
                    menuId: [
                        { required: true, message: '请输入菜单号', trigger: 'change' }
                    ],
                    name: [
                        { required: true, message: '请输入菜单名称', trigger: 'change' }
                    ],
                }


            }
        },
        methods: {
            async init() {
                let info = await queryMenuForTree();
                if (info.resCode === "0") {
                    this.TreeData = info.rows;
                }
               

            },
            async initAllButton(){
                let info = await querySysButtonsListAll();
                if (info.resCode === "0") {
                    this.allButtons = info.rows;
                }
              

            },
            edit() {
                if (!this.selectItem.id) {
                    return this.$message.error("请重新左侧节点选择后修改");

                }
                this.formDisabled = false;
                this.actionType = "edit";
                this.postObjZan = deepClone(this.postObj);
                this.buttonPermsZan = deepClone(this.buttonPerms);

            },
            doAdd(bol) {
                if (!this.selectItem.id && !bol) {
                    return this.$message.error("请重新左侧节点选择后添加");


                }
                this.selectItem={
                       menuId:this.selectItem.menuId,
                };
                this.formDisabled = false;
                this.actionType = "add";
                this.buttonPerms = [];
                this.parentName = this.postObj.name;
            
                
                this.postObj = {
                    pId: this.postObj.menuId,
                    name: "",
                    menuId: "",
                    menuType: "F",
                    flowKey: "",
                    isEdition: "",
                    tranName: "",
                    menuUrl: "",

                }
                if (bol) {
                    this.postObj.pId = "0";
                    this.parentName = "根目录";
                    this.init();
                    this.openArr=[];
                    this.selectItem={
                     
                    };

                }

            },
            async saveAdd() {

                let obj = deepClone(this.postObj);
                obj.buttonPerms = this.buttonPerms.join(",");
                let info = await createMenu(obj);
                if (info.resCode === "0") {
                    this.$message.success("添加成功");
                    this.formDisabled = true;
                    this.actionType = "";
                    this.openArr=[];
                    this.openArr[0] = this.selectItem.menuId;

                    this.init();
                   
                    this.selectItem = {};
                }
            },


            async saveEdit() {
               
                let obj = deepClone(this.postObj);
                obj.buttonPerms = this.buttonPerms.join(",");
                let info = await updateMenu(obj);
                if (info.resCode === "0") {
                    this.$message.success("操作成功");
                    this.formDisabled = true;
                    this.actionType = "";
                    this.openArr=[];
                    this.openArr[0] = this.selectItem.menuId;
                    // this.$set(this.openArr,0,this.selectItem.id);
                  
                    this.init();
                   
                    this.selectItem = {};

                }
            },
            async doDelete() {
                if (!this.selectItem.id) {
                    return this.$message.error("请重新左侧节点选择后修改");

                }
                this.$msgbox({
                    title: "确认删除此菜单吗？",
                    beforeClose: async (action, instance, done) => {
                        if (action == "confirm") {
                            let info = await deleteMenu({ id: this.selectItem.id });

                            if (info.resCode === "0") {
                                this.openArr = [];
                                this.openArr[0] = this.selectItem.pId;
                                
                             
                                this.$message.success("操作成功");
                                this.selectItem = {};
                                this.init();


                            }
                            done();

                        }
                        else {
                            done();
                        }
                    }
                })


            },
            cancel() {
                this.formDisabled = true;
                this.actionType = "";
                this.postObj = deepClone(this.postObjZan);
                this.buttonPerms = deepClone(this.buttonPermsZan);
            },





            nodeClick(item, index) {
                this.formDisabled = true;
                this.buttonPerms = [];
                this.actionType = "";
                this.selectItem = item;

                this.postObj = {
                    id: item.id,
                    pId: item.pId,
                    name: item.name,
                    menuId: item.menuId,
                    menuType: item.menuType,
                    flowKey: "",
                    isEdition: "",
                    tranName: "",
                    menuUrl: "",


                }

                if (item.menuType == 'L') {
                    this.postObj.flowKey = item.flowKey;
                    this.postObj.isEdition = item.isEdition;
                    this.postObj.tranName = item.tranName;
                    this.postObj.menuUrl = item.menuUrl;


                    if (!item.buttonPerms) {
                        this.buttonPerms = [];

                    }
                    else {
                        this.buttonPerms = item.buttonPerms.split(",")

                    }



                }




                if (item.children && item.children.length > 0) {
                    this.showDelete = false;
                }
                else {
                    this.showDelete = true;
                }

            }



        }
        , mounted() {
            this.init();
            this.initAllButton();
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