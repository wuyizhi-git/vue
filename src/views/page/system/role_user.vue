<template>
    <div>
        <el-row :gutter="20">'


            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <!--工具栏-->
                <div class="head-container">

                    <el-form ref="form" :inline="true" label-width="80px">
                        <el-form-item label="用户id:">
                            <div style="width:200px;font-weight: bold"> {{item.roleId}}</div>
                        </el-form-item>
                        <el-form-item label="用户名:">

                            <div style="width:200px;font-weight: bold"> {{item.roleName}}</div>

                        </el-form-item>
                    </el-form>


                    <!-- <crudOperation show="" :permission="permission" /> -->
                </div>


                <!--表格渲染-->
                <el-table border ref="table" align="center" :data="data.rows" style="width: 100%;">
                    <el-table-column align="center" prop="userId" label="角色ID" />
                    <el-table-column align="center" prop="userName" label="角色名" />
                  

                    

                </el-table>

                <!--分页组件-->
                 <div v-if="data.total"  class="pagination">
                    <el-pagination background layout="total,pager,jumper,sizes" :current-page="query.pageNum"
                        :page-sizes="[10,25,50]" :page-size="query.numPerPage" :total="data.total"
                        @current-change="handlePageChange" @size-change="handleSizeChange"></el-pagination>
                </div>

            </el-col>
        </el-row>

    </div>
</template>

<script>
    import { deleteKey } from "@/utils"

    import { searchUser } from "@/api/system"
    export default {
        name: "roleUser",
        props: {
            item: {
                type: Object,
            }

        },
        data() {
            return {
                query: {},

                data: {

                    total: 0,
                    rows: []
                },
            }
        },
        methods: {
            async getList(num) {
               
                let postObj = deleteKey(this.query);
                postObj.roleId=this.item.roleId;
                postObj.roleName=this.item.roleName;
                postObj.pageNum--;

                let info = await searchUser(postObj);
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
        },
    }
</script>