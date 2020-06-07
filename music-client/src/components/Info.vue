<template>
  <div class="info">
    <p class="title" style="color: #000000">编辑个人资料</p>
    <hr/>
    <div class="personal">
      <el-form :model="registerForm" class="demo-ruleForm" label-width="80px">
        <el-form-item prop="username" label="用户名"  >
          <el-input  :disabled="true" v-model="registerForm.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input type="password" placeholder="密码" v-model="registerForm.password"></el-input>
        </el-form-item>
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
          <el-date-picker type="date" placeholder="选择日期" v-model="registerForm.birth" style="width: 100%;" clearable></el-date-picker>
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
    <div class="btn">
      <div @click="saveMsg()" style="background-color: #2aa3ef;border-radius: 5px">保存</div>
      <div @click="goback" style="background-color: #2aa3ef;border-radius: 5px">取消</div>
    </div>
    </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { cities } from '../assets/data/form'
import { updateUserMsg, getUserOfId } from '../api/index'

export default {
  name: 'info',
  data: function () {
    return {
      registerForm: { // 注册
        username: '',
        password: '',
        sex: '',
        phoneNum: '',
        email: '',
        birth: '',
        introduction: '',
        location: ''
      },
      cities: []
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
    goback () {
      this.$router.go(-1)
    },
    saveMsg () {
      updateUserMsg(this.registerForm)
        .then(res => {
          if (res.status === 200) {
            this.showError = false
            this.showSuccess = true
            this.$store.commit('setUsername', this.registerForm.username)
            this.$notify.success({
              title: '编辑成功',
              showClose: true
            })
            setTimeout(function () {
              this.$router.go(-1)
            }, 2000)
          } else {
            this.showSuccess = false
            this.showError = true
            this.$notify.error({
              title: '编辑失败',
              showClose: true
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/info.scss';
</style>
