<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 歌单歌曲信息
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button  size="mini" class="handle-del mr10" @click="delAll" type="danger" icon="el-icon-delete" plain>批量删除</el-button>
        <el-input v-model="select_word" size="mini" placeholder="筛选关键词" class="handle-input mr10" clearable suffix-icon="el-icon-search"></el-input>
        <el-button type="primary" size="mini" @click="centerDialogVisible = true" plain>添加歌曲</el-button>
      </div>
      <el-table
        :data="tableData"
        border
        size="mini"
        style="width: 100%"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column prop="name" label="歌手-歌曲"></el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button size="small" type="danger" @click="handleDelete(scope.row.id)" plain>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--添加歌曲-->
    <el-dialog title="添加歌曲" :visible.sync="centerDialogVisible" width="400px" center>
      <el-form
        :model="registerForm"
        status-icon
        ref="registerForm"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item prop="singerName" label="歌手名字" size="mini">
          <el-input v-model="registerForm.singerName" placeholder="歌手名字"></el-input>
        </el-form-item>
        <el-form-item prop="songName" label="歌曲名字" size="mini">
          <el-input v-model="registerForm.songName" placeholder="歌曲名字"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="centerDialogVisible = false" plain>取 消</el-button>
        <el-button type="primary" size="mini" @click="getSongId" plain>确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt" align="center">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="delVisible = false" plain>取 消</el-button>
        <el-button type="primary" size="mini" @click="deleteRow" plain>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mixin } from '../mixins'
import { setListSong, getSongBySongListId, deleteListSong, getSongOfId, getSongOfSingerName } from '../api/index'

export default {
  name: 'list-song-page',
  mixins: [mixin],
  data () {
    return {
      registerForm: {
        singerName: '',
        songName: ''
      },
      tableData: [],
      tempDate: [],
      multipleSelection: [],
      centerDialogVisible: false,
      editVisible: false,
      delVisible: false,
      select_word: '',
      idx: -1,
      props: {
        label: 'name',
        value: 'id',
        children: 'child'
      },
      platOptions: [{
        value: 'nan',
        label: '男',
        children: []
      }, {
        value: 'nv',
        label: '女',
        children: []
      }, {
        value: 'zuhe',
        label: '组合',
        children: []
      }, {
        value: 'buming',
        label: '不明',
        children: []
      }]
    }
  },
  watch: {
    select_word: function () {
      if (this.select_word === '') {
        this.tableData = this.tempDate
      } else {
        this.tableData = []
        for (let item of this.tempDate.data) {
          if (item.name.includes(this.select_word)) {
            this.tableData.push(item)
          }
        }
      }
    }
  },
  created () {
    this.getData()
  },
  methods: {
    // 获取歌单
    getData () {
      getSongBySongListId(this.$route.query.id)
        .then(res => {
          for (let item of res.data) {
            this.getSong(item.songId)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取歌单里对应的音乐
    getSong (id) {
      getSongOfId(id)
        .then(res => {
          console.log(res.data)
          this.tableData.push(res.data)
          this.tempDate.push(res.data)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取要添加歌曲的ID
    getSongId () {
      let _this = this
      let name = _this.registerForm.singerName + '-' + _this.registerForm.songName
      console.log(name)
      getSongOfSingerName(name)
        .then(res => {
          if (res.status === 200) {
            this.addSong(res.data[0].id)
          }
        }).catch(err => {
          console.log(err)
          this.notify('未找到歌曲', 'error')
        })
    },
    // 添加歌曲
    addSong (id) {
      let listSongData = {'songId': id, 'songListId': this.$route.query.id}
      setListSong(listSongData)
        .then(res => {
          if (res.status === 200) {
            this.getData()
            this.notify('添加成功', 'success')
          } else {
            this.notify('添加失败', 'error')
          }
        })
        .catch(err => {
          this.notify('歌曲已存在', 'error')
          console.log(err)
        })
      this.centerDialogVisible = false
    },
    // 确定删除
    deleteRow () {
      // 歌手id this.idx 歌单id this.$route.query.id
      deleteListSong(this.idx, this.$route.query.id)
        .then(res => {
          if (res.status === 200) {
            this.getData()
            this.notify('删除成功', 'success')
          } else {
            this.notify('删除失败', 'error')
          }
        })
        .catch(err => {
          console.log(err)
        })
      this.delVisible = false
    }
  }
}
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
</style>
