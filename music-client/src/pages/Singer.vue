<template>
  <div class="singer" style="background-color: #787878">
    <ul class="singer-header" style="background-color: #787878">
      <li
        style="color: #000000"
        v-for="(item, index) in singerStyle"
        :key="index"
        :class="{active: item.name === activeName}"
        @click="handleChangeView(item)">
        {{item.name}}
      </li>
    </ul>
    <content-list :contentList="data"></content-list>
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :hide-on-single-page="true"
        style="background-color: #787878"
        layout=" prev, pager, next"
        :current-page.sync="currentPage"
        :page-size.sync="pageSize"
        :total.sync="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import ContentList from '../components/ContentList'
import { singerStyle } from '../assets/data/singer'
import { getSingerPage, getSingerPageOfSex } from '../api/index'

export default {
  name: 'singer',
  components: {
    ContentList
  },
  data () {
    return {
      singerStyle: [], // 歌手导航栏类别
      activeName: '全部歌手',
      pageSize: 15, // 页数
      currentPage: 1, // 当前页
      total: 0,
      albumData: [],
      page: {
        data:{
          sex: 0
        },
        dir: '',
        limit: 15,
        page: 1,
        sort: '',
        start: 0
      },
      flag: true,
      flagSex: 0
    }
  },
  computed: {
    // 计算当前表格中的数据
    data () {
      // return this.albumData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
      return this.albumData
    }
  },
  created () {
    this.singerStyle = singerStyle
    this.getAllSinger()
  },
  methods: {
    // 获取当前页
    handleCurrentChange (val) {
      this.currentPage = val
      if (!this.flag) {
        this.getSingerSex(this.flagSex)
      } else {
        this.getAllSinger()
      }
    },
    handleChangeView (item) {
      this.activeName = item.name
      this.currentPage = 1
      if (item.name === '全部歌手') {
        this.flag = true
        this.getAllSinger()
      } else {
        this.flag = false
        this.flagSex = item.type
        this.getSingerSex(item.type)
      }
    },
    // 获取所有歌手
    getAllSinger () {
      this.page.page = this.currentPage
      this.page.limit = this.pageSize
      getSingerPage(this.page)
        .then(res => {
          this.total = res.data.total
          this.albumData = res.data.records
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 通过性别对歌手分类
    getSingerSex (sex) {
      this.page.data.sex = sex
      this.page.page = this.currentPage
      this.page.limit = this.pageSize
      getSingerPageOfSex(this.page)
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
@import '../assets/css/singer.scss';
</style>
