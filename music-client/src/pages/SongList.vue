<template>
  <div class="song-list" >
    <ul class="song-list-header">
      <li
        v-for="(item, index) in songStyle"
        :key="index"
        :class="{active: item.name === activeName}"
        @click="handleChangeView(item.name)">
        {{item.name}}
      </li>
    </ul>
    <div class="song-content">
      <content-list :contentList="data"></content-list>
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          background
          layout="total, prev, pager, next"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import ContentList from '../components/ContentList'
import { mapGetters } from 'vuex'
import { songStyle } from '../assets/data/songList'
import { getSongListPage, getSongListOfStyle } from '../api/index'

export default {
  name: 'song-list',
  components: {
    ContentList
  },
  data () {
    return {
      songStyle: [], // 歌单导航栏类别
      activeName: '全部歌单',
      pageSize: 15, // 页数
      total: 0,     //数量
      currentPage: 1, // 当前页
      albumData: [], // 歌单
      page: {
        dir: '',
        limit: 15,
        page: 1,
        sort: '',
        start: 0
      }
    }

  },
  computed: {
    ...mapGetters([
      'songsList'
    ]),
    // 计算当前表格中的数据
    data () {
      // return this.albumDatas.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
      return this.albumData
    }
  },
  mounted () {
    this.songStyle = songStyle
    this.handleChangeView('全部歌单')
  },
  methods: {
    // 获取当前页
    handleCurrentChange (val) {
      this.currentPage = val
      this.getSongList('page')
    },
    // 获取歌单
    handleChangeView: function (name) {
      this.activeName = name
      this.albumData = []
      if (name === '全部歌单') {
        this.getSongList(this.cur_page)
      } else {
        this.getSongListOfStyle(name)
      }
    },
    // 分页获取歌单
    getSongList (page) {
      this.page.page = this.currentPage
      this.page.limit = this.pageSize
      getSongListPage(this.page)
        .then(res => {
          this.total = res.data.total
          this.albumData = res.data.records
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 通过类别获取歌单
    getSongListOfStyle (style) {
      getSongListOfStyle(style)
        .then(res => {
          this.currentPage = 1
          this.albumData = res.data
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/song-list.scss';
</style>
