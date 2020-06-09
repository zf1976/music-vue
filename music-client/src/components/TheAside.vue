<template>
  <transition name="slide-fade" >
    <div class="the-aside" v-if="showAside" style="color: #d6d6d6">
      <h2 class="title" style="color: #000000">播放列表</h2>
      <ul class="menus" >
        <li  v-for="(item, index) in listOfSongs" :class="{'is-play': id === item.id}" :key="index" @click="toPlay(item.id, item.url, item.pic, index, item.name, item.lyric, item.downloads, item.playCount)">
          {{replaceFName(item.name)}}
        </li>
      </ul>
    </div>
  </transition>
</template>

<script>
import { mixin } from '../mixins'
import { mapGetters } from 'vuex'

export default {
  name: 'the-aside',
  mixins: [mixin],
  computed: {
    ...mapGetters([
      'id', // 音乐id
      'listOfSongs', // 当前歌单列表
      'showAside' // 是否显示侧边栏
    ])
  },
  mounted () {
    let _this = this
    document.addEventListener('click', function () {
      _this.$store.commit('setShowAside', false)
    }, true)
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/the-aside.scss';
</style>
