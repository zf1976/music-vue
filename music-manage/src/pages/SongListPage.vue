<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
        <el-button type="danger" icon="el-icon-delete" size="mini" class="handle-del mr10" @click="delAll" plain>批量删除</el-button>
        <el-input v-model="select_word" size="mini" placeholder="筛选关键词" class="handle-input mr10" clearable suffix-icon="el-icon-search"></el-input>
        <el-button type="primary" size="mini" @click="centerDialogVisible = true" plain>添加歌单</el-button>
      </div>
      <el-table :data="data" border size="mini" style="width: 100%" height="700px" ref="multipleTable" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column label="歌单图片" width="100" align="center" icon="el-icon-loading">
          <template slot-scope="scope">
            <img :src="getUrl(scope.row.pic)" alt="" style="width: 80px;"/>
              <el-upload
                class="upload-demo"
                :action="uploadUrl(scope.row.id)"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                >
                <el-button size="mini" icon="el-icon-picture" type="primary" plain>更新</el-button>
              </el-upload>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" width="200" align="center"></el-table-column>
        <el-table-column label="简介">
          <template slot-scope="scope">
            <p style="height: 100px; overflow: scroll">{{ scope.row.introduction }}</p>
          </template>
        </el-table-column>
        <el-table-column label="风格" width="100" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.style }}</div>
          </template>
        </el-table-column>
        <el-table-column label="内容" width="80" align="center">
          <template  slot-scope="scope">
            <el-button size="mini" @click="getContent(data[scope.$index].id)" type="info" plain>内容</el-button>
          </template>
        </el-table-column>
        <el-table-column label="评论" width="80" align="center">
          <template  slot-scope="scope">
            <el-button size="mini" @click="getComment(data[scope.$index].id)" type="info" plain>评论</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row)" type="primary" plain>编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.id)" plain>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          background
          layout="total, prev, pager, next, jumper"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total">
        </el-pagination>
      </div>
    </div>

    <!--添加歌单-->
    <el-dialog title="添加歌单" :visible.sync="centerDialogVisible" width="400px" center>
      <el-form :model="registerForm" status-icon ref="registerForm" label-width="70px" class="demo-ruleForm">
          <el-form-item label="歌单名" prop="title" size="mini">
            <el-input v-model="registerForm.title" placeholder="歌单名"></el-input>
          </el-form-item>
          <el-form-item label="歌单介绍" prop="introduction" size="mini">
            <el-input  type="textarea" v-model="registerForm.introduction" placeholder="歌单介绍" :autosize="{ minRows: 4, maxRows: 8}"></el-input>
          </el-form-item>
          <el-form-item label="风格" prop="style" size="mini">
            <el-input v-model="registerForm.style" placeholder="风格"></el-input>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="centerDialogVisible = false" plain>取 消</el-button>
        <el-button type="primary" size="mini" @click="addSongList" plain>确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="400px">
      <el-form ref="form" :model="form" label-width="40px">
        <el-form-item label="标题" size="mini">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="简介" size="mini">
          <el-input  type="textarea" v-model="form.introduction" :autosize="{ minRows: 4, maxRows: 8}"></el-input>
        </el-form-item>
        <el-form-item label="风格" size="mini">
          <el-input v-model="form.style"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="editVisible = false" plain>取 消</el-button>
        <el-button type="primary" size="mini" @click="saveEdit" plain>确 定</el-button>
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
import { setSongList, getSongList, updateSongListMsg, deleteSongList } from '../api/index'

export default {
  name: 'song-list-page',
  mixins: [mixin],
  data () {
    return {
      registerForm: {
        title: '',
        introduction: '',
        style: '',
        pic: '/data/img/songListPic/123.jpg'
      },
      tableData: [],
      tempDate: [],
      multipleSelection: [], // 记录要删除的歌单
      centerDialogVisible: false,
      editVisible: false,
      delVisible: false,
      select_word: '',
      form: {
        id: '',
        title: '',
        pic: '',
        introduction: '',
        style: ''
      },
      pageSize: 5, // 页数
      currentPage: 1, // 当前页
      total: 0,
      page: {
        dir: '',
        limit: 0,
        page: 0,
        sort: '',
        start: 0
      },
      idx: -1
    }
  },
  computed: {
    // 计算当前表格中的数据
    data () {
      // return this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
      return this.tableData
    }
  },
  watch: {
    select_word: function () {
      if (this.select_word === '') {
        this.tableData = this.tempDate
      } else {
        this.tableData = []
        for (let item of this.tempDate) {
          if (item.title.includes(this.select_word)) {
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
    uploadUrl (id) {
      return `${this.$store.state.HOST}/api/admin/song_list/img/update?id=${id}`
    },
    // 获取歌单信息
    getData () {
      this.page.page = this.currentPage
      this.page.limit = this.pageSize
      getSongList(this.page).then((res) => {
        this.tableData = res.data.records
        this.tempDate = res.data.records
        this.total = res.data.total
      })
    },
    // 获取当前页
    handleCurrentChange (val) {
      this.currentPage = val
      this.getData()
    },
    getContent (id) {
      this.$router.push({path: '/listSong', query: {id: id}})
    },
    getComment (id) {
      this.$router.push({path: '/Comment', query: {id: id, type: 1}})
    },
    // 编辑啊
    handleEdit (row) {
      this.idx = row.id
      this.form = {
        id: row.id,
        title: row.title,
        pic: row.pic,
        introduction: row.introduction,
        style: row.style
      }
      this.editVisible = true
    },
    // 保存编辑
    saveEdit () {
      updateSongListMsg(this.form)
        .then(res => {
          if (res.status === 200) {
            this.notify('编辑成功', 'success')
            this.getData()
          } else {
            this.notify('歌单已经存在', 'error')
          }
        })
        .catch(err => {
          if (err.data.errCode === 500) {
            this.notify('歌单已经存在', 'error')
          }
          console.log(err)
        })
      this.editVisible = false
    },
    // 添加歌单
    addSongList () {
      setSongList(this.registerForm).then(res => {
        if (res.status === 200) {
          this.getData()
          this.registerForm = {}
          this.notify('添加成功', 'success')
        } else {
          this.notify('歌单已经存在', 'error')
        }
      }).catch(err => {
        if (err.data.errCode === 500) {
          this.notify('歌单已经存在', 'error')
        }
        console.log(err)
      })
      this.centerDialogVisible = false
    },
    // 确定删除
    deleteRow () {
      deleteSongList(this.idx)
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
.pagination {
    display: flex;
    justify-content: center;
}
.sysBox .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #FD7A3A;   // 进行修改背景和字体
color: #fff;
}
</style>
