<template>
  <div class="play-bar" :class="{show:!toggle}">
    <div @click="toggle=!toggle" class="item-up" :class="{turn: toggle}">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-jiantou-xia-cuxiantiao"></use>
      </svg>
    </div>
    <div class="kongjian" >
      <!--上一首-->
      <div class="item" @click="prev">
        <svg class="icon" aria-hidden="true" style="color: #ffffff">
          <use xlink:href="#icon-ziyuanldpi"></use>
        </svg>
      </div>
      <!--播放-->
      <div class="item" @click="togglePlay" >
        <svg class="icon" aria-hidden="true" style="color: #ffffff">
          <use :xlink:href="playButtonUrl"></use>
        </svg>
      </div>
      <!--下一首-->
      <div class="item" @click="next">
        <svg class="icon" aria-hidden="true" style="color: #ffffff">
          <use xlink:href="#icon-ziyuanldpi1"></use>
        </svg>
      </div>
      <!--歌曲图片-->
      <div class="item-img" @click="goPlayerPage" >
         <img :src=picUrl alt="" style="color: #ffffff;border-radius: 2px;border: 0">
      </div>
      <!--播放进度-->
      <div class="playing-speed" style="color: #ffffff">
        <!--播放开始时间-->
        <div class="current-time" style="color: #ffffff">{{ nowTime }}</div>
        <div class="progress-box">
          <div class="item-song-title">
            <div style="color: #f8f8f8">{{this.title}}</div>
            <div style="color: #ffffff">{{this.artist}}</div>
          </div>
          <div ref="progress" class="progress" @mousemove="mousemove" style="color: #ffffff">
            <!--进度条-->
            <div ref="bg" class="bg" @click="updateMove" style="color: #ffffff">
              <div ref="curProgress" class="cur-progress" style="background: #ef2a2a" :style="{width: curLength+'%'}"></div>
            </div>
            <!--进度条 end -->
            <!--拖动的点点-->
            <div ref="idot" class="idot" :style="{left: curLength+'%'}" back @mousedown="mousedown" @mouseup="mouseup" style="background: rgb(128,128,128)"></div>
            <!--拖动的点点 end -->
          </div>
        </div>
        <!--播放结束时间-->
        <div class="left-time" style="color: #ffffff">{{ songTime }}</div>
      </div>
      <!--音量-->
      <div class="item icon-volume">
        <svg v-if="volume !== 0" class="icon" aria-hidden="true" style="color: #ffffff">
          <use xlink:href="#icon-yinliang1"></use>
        </svg>
        <svg v-else class="icon" aria-hidden="true" style="color: #f4f4f4">
          <use xlink:href="#icon-yinliangjingyinheix"></use>
        </svg>
        <el-slider class="volume" v-model="volume" :vertical="true"></el-slider>
      </div>
      <!--添加-->
      <div class="item" @click="collection" >
        <svg :class="{ active: isActive }" class="icon" aria-hidden="true" style="color: #ffffff">
          <use xlink:href="#icon-xihuan-shi"></use>
        </svg>
      </div>
      <!--下载-->
      <div class="item" @click="download" >
        <svg class="icon" aria-hidden="true" style="color: #ffffff">
          <use  xlink:href="#icon-xiazai"></use>
        </svg>
      </div>
      <!--歌曲列表-->
      <div class="item" @click="changeAside" >
        <svg class="icon" aria-hidden="true" style="color: #ffffff">
          <use xlink:href="#icon-liebiao"></use>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mixin } from '../mixins'
import {
  setCollection,
  download,
  updateStatistical,
  deleteCollection,
  getCollectionOfUser,
  getSongOfId
} from '../api/index'

export default {
  name: 'play-bar',
  mixins: [mixin],
  data () {
    return {
      tag: false,
      nowTime: '00:00',
      songTime: '00:00',
      curLength: 0, // 进度条的位置
      progressLength: 0, // 进度条长度
      mouseStartX: 0, // 拖拽开始位置
      toggle: true,
      volume: 50
    }
  },
  computed: {
    ...mapGetters([
      'loginIn', // 用户登录状态
      'userId', // 用户 id
      'isMember', // 会员身份
      'isPlay', // 播放状态
      'playButtonUrl', // 播放状态的图标
      'id', // 音乐id
      'url', // 音乐地址
      'title', // 歌名
      'artist', // 歌手名
      'picUrl', // 歌曲图片
      'flagId',
      'isPay',
      'downloads',
      'playCount',
      'curTime', // 当前音乐的播放位置
      'duration', // 音乐时长
      'listOfSongs', // 当前歌单列表
      'listIndex', // 当前歌曲在歌曲列表的位置
      'showAside', // 是否显示侧边栏
      'autoNext', // 用于触发自动播放下一首
      'isActive'
    ])
  },
  watch: {
    // 切换播放状态的图标
    isPlay (val) {
      if (val) {
        this.$store.commit('setPlayButtonUrl', '#icon-zanting')
      } else {
        this.$store.commit('setPlayButtonUrl', '#icon-bofang')
      }
    },
    volume () {
      this.$store.commit('setVolume', this.volume / 100)
    },
    // 播放时间的开始和结束
    curTime () {
      this.nowTime = this.formatSeconds(this.curTime)
      this.songTime = this.formatSeconds(this.duration)
      // 移动进度条
      this.curLength = (this.curTime / this.duration) * 100
      // 处理歌词位置及颜色
    },
    // 自动播放下一首
    autoNext () {
      this.next()
    }
  },
  mounted () {
    this.progressLength = this.$refs.progress.getBoundingClientRect().width
    document.querySelector('.icon-volume').addEventListener('click', function (e) {
      document.querySelector('.volume').classList.add('show-volume')
      e.stopPropagation()
    }, false)
    document.querySelector('.volume').addEventListener('click', function (e) {
      e.stopPropagation()
    }, false)
    document.addEventListener('click', function () {
      document.querySelector('.volume').classList.remove('show-volume')
    }, false)
  },
  methods: {
    // 收藏的歌曲ID
    getCollection (userId) {
      getCollectionOfUser(userId)
        .then(res => {
          this.collection = res.data
          // 通过歌曲ID获取歌曲信息
          for (let item of this.collection) {
            this.getCollectSongs(item.songId)
          }
          this.$store.commit('setListOfSongs', this.collectList)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取收藏的歌曲
    getCollectSongs (id) {
      getSongOfId(id)
        .then(res => {
          this.collectList.push(res.data)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 下载
    download () {
      if (!this.isMember) {
        if (this.listOfSongs[this.listIndex].isPay) {
          this.$alert('这是付费音乐', '', {
            confirmButtonText: '确定',
            center: true,
            callback: action => {
              this.$message({
                type: 'info',
                message: `tag: ${'请找管理员开通付费包'}`
              })
            }
          })
          return
        }
      }
      download(this.url)
        .then(res => {
          let content = res.data
          let eleLink = document.createElement('a')
          eleLink.download = `${this.artist}-${this.title}.mp3`
          eleLink.style.display = 'none'
          // 字符内容转变成blob地址
          let blob = new Blob([content])
          eleLink.href = URL.createObjectURL(blob)
          // 触发点击
          document.body.appendChild(eleLink)
          eleLink.click()
          // 然后移除
          document.body.removeChild(eleLink)
        }).catch(err => {
          console.log(err)
        })
      let params = {id: this.id, playCount: this.playCount, downloads: this.listOfSongs[this.listIndex].downloads + 1}
      this.listOfSongs[this.listIndex].downloads = this.listOfSongs[this.listIndex].downloads + 1
      this.$store.commit('setDownloads', this.listOfSongs[this.listIndex].downloads)
      updateStatistical(params)
        .then(res => {
          console.log(res)
        }).catch(err => {
          console.log(err)
        })
    },
    changeAside () {
      let temp = !this.showAside
      this.$store.commit('setShowAside', temp)
    },
    // 控制音乐播放 / 暂停
    togglePlay () {
      if (this.isPlay) {
        this.$store.commit('setIsPlay', false)
      } else {
        this.$store.commit('setIsPlay', true)
      }
    },
    // 解析播放时间
    formatSeconds (value) {
      let theTime = parseInt(value)
      let theTime1 = 0
      let theTime2 = 0
      if (theTime > 60) {
        theTime1 = parseInt(theTime / 60) // 分
        theTime = parseInt(theTime % 60) // 秒
        // 是否超过一个小时
        if (theTime1 > 60) {
          theTime2 = parseInt(theTime1 / 60) // 小时
          theTime1 = 60 // 分
        }
      }
      // 多少秒
      if (parseInt(theTime) < 10) {
        var result = '0:0' + parseInt(theTime)
      } else {
        result = '0:' + parseInt(theTime)
      }
      // 多少分钟时
      if (theTime1 > 0) {
        if (parseInt(theTime) < 10) {
          result = '0' + parseInt(theTime)
        } else {
          result = parseInt(theTime)
        }
        result = parseInt(theTime1) + ':' + result
      }
      // 多少小时时
      if (theTime2 > 0) {
        if (parseInt(theTime) < 10) {
          result = '0' + parseInt(theTime)
        } else {
          result = parseInt(theTime)
        }
        result = parseInt(theTime2) + ':' + parseInt(theTime1) + ':' + result
      }
      return result
    },
    // 拖拽开始
    mousedown (e) {
      this.mouseStartX = e.clientX
      this.tag = true
    },
    // 拖拽结束
    mouseup () {
      this.tag = false
    },
    // 拖拽中
    mousemove (e) {
      if (!this.duration) {
        return false
      }
      if (this.tag) {
        let movementX = e.clientX - this.mouseStartX
        let curLength = this.$refs.curProgress.getBoundingClientRect().width
        //  计算出百分比
        this.progressLength = this.$refs.progress.getBoundingClientRect().width
        let newPercent = ((curLength + movementX) / this.progressLength) * 100
        if (newPercent > 100) {
          newPercent = 100
        }
        this.curLength = newPercent
        this.mouseStartX = e.clientX
        //  根据百分比推出对应的播放时间
        this.changeTime(newPercent)
      }
    },
    // 更改歌曲进度
    changeTime (percent) {
      let newCurTime = this.duration * (percent * 0.01)
      this.$store.commit('setChangeTime', newCurTime)
    },
    updateMove (e) {
      if (!this.tag) {
        let curLength = this.$refs.bg.offsetLeft
        this.progressLength = this.$refs.progress.getBoundingClientRect().width
        let newPercent = ((e.clientX - curLength) / this.progressLength) * 100
        if (newPercent < 0) {
          newPercent = 0
        } else if (newPercent > 100) {
          newPercent = 100
        }
        this.curLength = newPercent
        this.changeTime(newPercent)
      }
    },
    // 上一首
    prev () {
      if (this.listIndex !== -1 && this.listOfSongs.length > 1) {
        if (this.listIndex > 0) {
          this.$store.commit('setListIndex', this.listIndex - 1)
          this.toPlay(this.listOfSongs[this.listIndex].url)
        } else {
          this.$store.commit('setListIndex', this.listOfSongs.length - 1)
          this.toPlay(this.listOfSongs[this.listIndex].url)
        }
      }
    },
    cycle () {

    },
    // 下一首
    next () {
      if (this.listIndex !== -1 && this.listOfSongs.length > 1) {
        if (this.listIndex < this.listOfSongs.length - 1) {
          this.$store.commit('setListIndex', this.listIndex + 1)
          this.toPlay(this.listOfSongs[this.listIndex].url)
        } else {
          this.$store.commit('setListIndex', 0)
          this.toPlay(this.listOfSongs[0].url)
        }
      }
    },
    // 选中播放
    toPlay (url) {
      if (url && url !== this.url) {
        this.$store.commit('setId', this.listOfSongs[this.listIndex].id)
        this.$store.commit('setUrl', this.$store.state.configure.HOST + url)
        this.$store.commit('setPicUrl', this.$store.state.configure.HOST + this.listOfSongs[this.listIndex].pic)
        this.$store.commit('setTitle', this.replaceFName(this.listOfSongs[this.listIndex].name))
        this.$store.commit('setArtist', this.replaceLName(this.listOfSongs[this.listIndex].name))
        this.$store.commit('setLyric', this.parseLyric(this.listOfSongs[this.listIndex].lyric))
        this.$store.commit('setDownloads', this.downloads)
        this.$store.commit('setPlayCount', this.playCount)
        this.$store.commit('setFlagId', this.id)
        let params = {id: this.id, playCount: this.playCount + 1, downloads: this.downloads}
        this.listOfSongs[this.listIndex].playCount = this.listOfSongs[this.listIndex].playCount + 1
        this.$store.commit('setPlayCount', this.listOfSongs[this.listIndex].playCount)
        updateStatistical(params)
          .then(res => {
            console.log(res)
          }).catch(err => {
            console.log(err)
          })
      }
    },
    goPlayerPage () {
      this.$router.push({path: `/lyric/${this.id}`})
    },
    collection () {
      if (this.loginIn) {
        let paramFrom = {'userId': this.userId, 'type': 0, 'songId': this.id}
        setCollection(paramFrom)
          .then(res => {
            if (res.status === 200) {
              this.$store.commit('setIsActive', true)
              this.notify('已添加到我喜欢的音乐', 'success')
            }
          })
          // eslint-disable-next-line handle-callback-err
          .catch(err => {
            deleteCollection(paramFrom)
              .then(res => {
                if (res.status === 200) {
                  console.log(this.listOfSongs.data)
                  this.$store.commit('setIsActive', false)
                  this.notify('取消喜欢成功', 'success')
                }
              })
          })
      } else {
        this.notify('请先登录', 'warning')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/play-bar.scss';
</style>
