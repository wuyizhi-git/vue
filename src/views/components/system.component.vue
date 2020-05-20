<template>
    <div style="display:inline-block">
        <el-form-item  prop="sysId" :required="required" label="系统">
            <el-select :disabled="disabled.includes('1')" @change="changeSysId" style="width:200px;" v-model="query.sysId" clearable placeholder="请选择">
                <el-option  v-for="(item,index) in sysList" :key="index+'yy'" :label="item.sysId+'-'+item.sysName"
                    :value="item.sysId"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item :required="required" prop="subSysId" label="子系统">
            <el-select @change="changeSubSysId" style="width:200px;" v-model="query.subSysId" clearable
                placeholder="请选择">
                <el-option :key="index+'xx'" v-for="(item,index) in subSysList"
                    :label="item.subSysId+'-'+item.subSysName" :value="item.subSysId"></el-option>
            </el-select>
        </el-form-item>
    </div>
</template>

<script>
    import {
        queryTp3003,
        queryTp3004
    } from '@/api/basedata';
    import { deleteKey } from '@/utils';

    import { searchUser } from '@/api/system';
    export default {
        name: 'sysytem',
        props: {
            query: {
                type: Object
            },
            disabled:{
                type:String,
                default:"",

            },
            required: {
                type: Boolean,
                default: false,
            }
        },
        data() {
            return {
                sysList: [],
                sysObj: {},
                subSysList: [],
                subSysObj: {},

            };
        },

        mounted() {
            this.getSysList();

        },
        methods: {
            changeSystem1(){
                alert(1);
            },
            async getSysList() {
                let info = await queryTp3003();
                if (info.resCode === '0') {
                    this.sysList = info.rows || [];
                    info.rows.forEach(item => {
                        this.sysObj[item.sysId] = item;
                    });
                    this.changeSysId();

                }
            },
            async getSubSysList(id) {
                let info = await queryTp3004({ sysId: id });
                if (info.resCode === '0') {
                    this.subSysList = info.rows || [];
                    this.subSysObj = {};
                    info.rows.forEach(item => {
                        this.subSysObj[item.subSysId] = item
                    });

                    if (this.query.subSysId && !this.subSysObj[this.query.subSysId]) {
                        this.query.subSysId = "";
                        this.query.subSysIdDesc = "";
                        if (!this.required) {
                            this.query.subSysIdSearch = ""

                        }

                    }
                    this.changeSubSysId();
                }
            },
            changeSysId() {

                if (!this.query.sysId) {
                    this.query.sysIdDesc = "";
                    if (!this.required) {
                        this.query.sysIdSearch = "";
                        this.query.subSysIdSearch = ""
                    }

                    this.query.subSysId = "";
                    this.query.subSysIdDesc = "";

                    this.subSysList = [];
                  


                }
                else {
                      this.$emit("changesysid",this.sysId)
                    if (!this.required) {
                        this.query.sysIdSearch = this.query.sysId;
                    }
                    this.query.sysIdDesc = this.query.sysId + "-" + this.sysObj[this.query.sysId].sysName;
                    this.getSubSysList(this.query.sysId)


                }
            },
            changeSubSysId() {
                if (!this.query.subSysId) {
                    this.query.subSysIdDesc = "";
                    if (!this.required) {
                        this.query.subSysIdSearch = ""


                    }
                }
                else {
                    if (!this.required) {
                        this.query.subSysIdSearch = this.query.subSysId;
                    }
                    console.log(this.subSysObj[this.query.subSysId]);
                    this.query.subSysIdDesc = this.query.subSysId + "-" + this.subSysObj[this.query.subSysId].subSysName

                }
            }
        }
    };
</script>