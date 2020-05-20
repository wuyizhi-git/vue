<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">工艺平台</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="userId">
                    <el-input v-model="param.userId" placeholder="请输入用户名">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="userPwd">
                    <el-input
                        type="password"
                        placeholder="请输入密码"
                        v-model="param.userPwd"
                        @keyup.enter.native="submitForm()"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
             
            </el-form>
        </div>
    </div>
</template>

<script>
// console.log(process.env)
import {loginUser} from "@/api/system"
import {setSessionId,clearSession,deleteKey} from "@/utils"

export default {
    data: function() {
        return {
            param: {
                userId: 'admin',
                userPwd: 'admin123',
            },
            rules: {
                userId: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                userPwd: [{ required: true, message: '请输入密码', trigger: 'blur' }],
            },
        };
    },
    mounted(){
        // window.location.reload();
    },
    methods: {
        submitForm() {
            this.$refs.login.validate(async(valid) => {

                if  (valid) {
                    
                    let params=deleteKey(this.param);
                  
                  
                    setSessionId("userId",params.userId);
                    let info=await loginUser(params);
                    if(info.resCode==="0"){
                        setSessionId("username",info.userName)
                       
                         this.$router.push('/');
                     
                         
                    }
                    else{
                        clearSession();
                    }
                   
                    return
                   
                   
                } else {
                    this.$message.error('请输入账号和密码');
                  
                     clearSession();
                    return false;
                }
            });
        },
    },
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
    color: #606266
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 1);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>