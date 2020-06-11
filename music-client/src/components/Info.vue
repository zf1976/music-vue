<template>
  <div class="info">
    <p class="title" style="color: #000000">编辑个人资料</p>
    <hr/>
    <div class="personal" style="background-color: rgba(255,255,255,0.7);border-radius: 5px;">
      <el-form :model="registerForm" class="demo-ruleForm" label-width="80px">
        <el-form-item prop="username" label="用户名"  >
          <el-input  :disabled="true" v-model="registerForm.username" placeholder="用户名"></el-input>
        </el-form-item>
<!--        <el-form-item prop="password" label="密码">-->
<!--          <el-input type="password" placeholder="密码" v-model="registerForm.password"></el-input>-->
<!--        </el-form-item>-->
        <el-form-item label="性别">
          <el-radio-group v-model="registerForm.sex">
            <el-radio :label="0">女</el-radio>
            <el-radio :label="1">男</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item  prop="phoneNum" label="手机">
          <el-input  placeholder="手机"   v-model="registerForm.phoneNum" clearable></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input   placeholder="邮箱" v-model="registerForm.email" clearable></el-input>
        </el-form-item>
        <el-form-item prop="birth" label="生日">
          <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" v-model="registerForm.birth" style="width: 100%;" clearable></el-date-picker>
        </el-form-item>
        <el-form-item prop="introduction" label="签名" style="">
          <el-input  type="textarea" placeholder="签名"  v-model="registerForm.introduction" clearable></el-input>
        </el-form-item>
        <el-form-item prop="location" label="地区">
          <el-select v-model="registerForm.location" placeholder="地区"  clearable style="width:100%;" >
            <el-option
              v-for="item in cities"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="400px">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" size="mini" label-width="100px" class="demo-ruleForm">
          <el-form-item label="旧密码" prop="oldPass">
            <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="pass">
            <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')" size="mini" plain>提交</el-button>
            <el-button @click="resetForm('ruleForm')" plain size="mini">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

    <div class="btn">
<!--      <div @click="saveMsg()" style="background-color: #2aa3ef;border-radius: 5px" >保存</div>-->
<!--      <div @click="goBack" style="background-color: #2aa3ef;border-radius: 5px">取消</div>-->
      <el-button @click="saveMsg()" type="primary" plain size="mini">保存</el-button>
      <el-button @click="goBack()" type="primary" plain size="mini">取消</el-button>
      <el-button @click="dialogFormVisible = true" type="primary" plain size="mini">修改密码</el-button>
    </div>
    </div>
</div>

</template>

<script>
import { mapGetters } from 'vuex'
import { mixin } from '../mixins'
import { cities } from '../assets/data/form'
import { updateUserMsg, getUserOfId, changePass } from '../api/index'

export default {
  name: 'info',
  data: function () {
    var validateOldPass = (rule, value, callback) => {
      // if (!value) {
      //   return callback(new Error('年龄不能为空'))
      // }
      // setTimeout(() => {
      //   if (!Number.isInteger(value)) {
      //     callback(new Error('请输入数字值'))
      //   } else {
      //     if (value < 18) {
      //       callback(new Error('必须年满18岁'))
      //     } else {
      //       callback()
      //     }
      //   }
      // }, 1000)
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      registerForm: { // 注册
        id: '',
        username: '',
        password: '',
        sex: '',
        phoneNum: '',
        email: '',
        birth: '',
        introduction: '',
        location: ''
      },
      cities: [],
      dialogFormVisible: false,
      ruleForm: {
        username: '',
        pass: '',
        checkPass: '',
        oldPass: ''
      },
      rules: {
        oldPass: [
          { validator: validateOldPass, trigger: 'blur' }
        ],
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'userId'
    ])
  },
  created () {
    this.cities = cities
  },
  mounted () {
    this.getMsg(this.userId)
  },
  methods: {
    getMsg (id) {
      getUserOfId(id)
        .then(res => {
          this.registerForm = res.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    changePass () {
      this.ruleForm.username = this.registerForm.username
      changePass(this.ruleForm)
        .then(res => {
          if (res.status === 200) {
            this.$notify.success({
              title: '修改成功',
              type: 'error'
            })
          }
        }).catch(err => {
          this.$notify.error({
            title: '修改失败',
            type: 'error'
          })
          console.log(err)
        })
      this.dialogFormVisible = false
    },
    goBack () {
      this.$router.go(-1)
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.changePass()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    saveMsg () {
      console.log(this.registerForm)
      updateUserMsg(this.registerForm)
        .then(res => {
          if (res.status === 200) {
            this.$store.commit('setUsername', this.registerForm.username)
            this.$notify.success({
              title: '编辑成功',
              showClose: true
            })
            setTimeout(function () {
              this.$router.go(-1)
            }, 2000)
          } else {
            this.$notify.error({
              title: '编辑失败',
              showClose: true
            })
          }
        })
        .catch(err => {
          this.$notify.error({
            title: '编辑失败',
            showClose: true
          })
          console.log(err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/info.scss';
</style>
