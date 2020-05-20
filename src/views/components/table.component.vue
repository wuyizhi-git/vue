<template>
    <div class="app-container">
        <el-row :gutter="20">


            <el-col :span="24">
                <!--工具栏-->
                <div class="head-container">
                    <el-card>
                        <slot name="top"> </slot>
                        <div class="header-search">
                            <slot name="search"></slot>
                        </div>
                    </el-card>
                </div>
            
            
                    <el-card style="margin-top:10px">
                        <div class="header-button">
                            <slot name="action"></slot>
                        </div>

                        <slot name="body"> </slot>
                    </el-card>
            </el-col>




        </el-row>

    </div>

</template>
<style>
.header-button{
    margin-top:0
}</style>