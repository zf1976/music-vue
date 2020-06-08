<template>
  <div class="song-list" style="background-color: #787878">
    <ul class="song-list-header">
      <li
        style="color: #000000"
        v-for="(item, index) in songStyle"
        :key="index"
        :class="{active: item.name === activeName}"
        @click="handleChangeView(item.name)">
        {{item.name}}
      </li>
    </ul>
    <div class="song-content" style="color: #000000">
      <content-list :contentList="data"></content-list>
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          :hide-on-single-page="true"
          layout=" prev, pager, next"
          style="background-color: #787878"
          :current-page.sync="currentPage"
          :page-size.sync="pageSize"
          :total.sync="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import ContentList from '../components/ContentList'
import { mapGetters } from 'vuex'
import { songStyle } from '../assets/data/songList'
import { getSongListPage, getSongListPageOfStyle } from '../api/index'

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
      total: 0, // 数量
      currentPage: 1, // 当前页
      albumData: [], // 歌单
      page: {
        data:{
          style: null
        },
        dir: '',
        limit: 15,
        page: 1,
        sort: '',
        start: 0
      },
      flag: true
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
      if (!this.flag) {
        this.getSongListOfStyle(this.activeName)
      } else {
        this.getSongList('page')
      }
    },
    // 获取歌单
    handleChangeView: function (name) {
      this.activeName = name
      this.currentPage = 1
      if (name === '全部歌单') {
        this.flag = true
        this.getSongList(this.cur_page)
      } else {
        this.flag = false
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
      this.page.data.style = style
      this.page.page = this.currentPage
      this.page.limit = this.pageSize
      getSongListPageOfStyle(this.page)
        .then(res => {
          this.total = res.data.total
          this.albumData = res.data.records
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
