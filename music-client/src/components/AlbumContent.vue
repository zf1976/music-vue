<template>
  <div class="content" style="background-color: rgb(29,29,29)">
    <h1 class="title" style="color: #c1c1c1">
      <slot name="title"></slot>
    </h1>
    <hr>
    <ul>
      <li class="list-title" >
        <div class="song-item" style="color: #d4d4d4">
          <span class="item-index"></span>
          <span class="item-title">歌曲名</span>
          <span class="item-intro">艺人</span>
          <span class="item-intro">专辑</span>
          <span class="item-name">下载量</span>
          <span class="item-name">播放量</span>
        </div>
      </li>
      <li class="list-content" v-for="(item, index) in songList" :key="index" style="color: #c1c1c1">
        <div class="song-item" :class="{'is-play': id === item.id}"  @click="toPlay(item.id, item.url, item.pic, index, item.name, item.lyric,item.downloads, item.playCount)">
          <span class="item-index" >
            <span v-if="id !== item.id">{{index + 1}}</span>
            <svg v-if="id === item.id" class="icon" aria-hidden="true" style="color: #e10d0d">
              <use xlink:href="#icon-yinliang"></use>
            </svg>
          </span>
          <span class="item-title">{{replaceFName(item.name)}}
            <el-avatar v-if="item.isPay === true" :size="16" style="background-color: rgba(0,0,0,0)">
              <img src="static/icon/pay.svg" alt="vip"/>
            </el-avatar>
          </span>
          <span class="item-intro">{{replaceLName(item.name)}}</span>
          <span class="item-intro">{{item.introduction}}</span>
          <span class="item-name">{{' '+item.downloads+' 次'}}</span>
          <span class="item-name">{{' '+item.playCount+' 次'}}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import {mixin} from '../mixins'
import { mapGetters } from 'vuex'

export default {
  name: 'album-content',
  mixins: [mixin],
  props: [
    'songList'
  ],
  computed: {
    ...mapGetters([
      'id' // 音乐ID
    ])
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/album-content.scss';
</style>
