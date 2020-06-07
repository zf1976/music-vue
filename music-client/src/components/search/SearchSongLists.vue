<template>
  <div class="search-song-Lists" style="height: 500px">
    <content-list :contentList="albumData" style="background-color: rgba(0,0,0,0)"></content-list>
  </div>
</template>

<script>
import ContentList from '../ContentList'
import { getSongListOfLikeTitle } from '../../api/index'

export default {
  name: 'search-song-Lists',
  components: {
    ContentList
  },
  data () {
    return {
      albumData: []
    }
  },
  mounted () {
    this.getSearchList()
  },
  methods: {
    getSearchList () {
      if (!this.$route.query.keywords) {
        console.log(this.$route.query.keywords)
        this.notify('你输入的内容为空', 'warning')
      } else {
        getSongListOfLikeTitle(this.$route.query.keywords)
          .then(res => {
            this.albumData = res.data
            console.log(res.data)
          }).catch(err => {
            console.log(err)
            this.notify('暂无该歌曲内容', 'error')
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/search-song-Lists.scss';
</style>
