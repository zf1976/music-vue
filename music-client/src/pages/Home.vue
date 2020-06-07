<template>
  <div class="home">
    <!--轮播图-->
    <swiper/>
    <!--热门歌单/歌手-->
    <div class="section" style="background-color: #787878" v-for="(item, index) in songsList" :key="index" >
      <div style="color: #060606" class="section-title">{{item.name}}</div>
      <content-list :contentList="item.list" style="color: #000000"></content-list>
    </div>
  </div>
</template>

<script>
import Swiper from '../components/Swiper'
import ContentList from '../components/ContentList'
import { getSongListPage, getSingerPage } from '../api/index'

export default {
  name: 'home',
  components: {
    Swiper,
    ContentList
  },
  data () {
    return {
      songsList: [
        {name: '歌单', list: []},
        {name: '歌手', list: []}
      ],
      page: {
        dir: '',
        limit: 10,
        page: 1,
        sort: '',
        start: 0
      }
    }
  },
  created () {
    // 获取歌单列表
    this.getSongList('songList')
    // 获取歌手列表
    this.getSinger('singer')
  },
  methods: {
    getSongList (path) {
      getSongListPage(this.page)
        .then(res => {
          this.songsList[0].list = res.data.records
        })
        .catch(err => {
          console.log(err)
        })
    },
    getSinger () {
      getSingerPage(this.page).then(res => {
        this.songsList[1].list = res.data.records
      })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/home.scss';
</style>
