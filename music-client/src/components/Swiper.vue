<template>
  <div class="swiper" style="color: #ffffff">
    <div class="swiper-container">
      <el-carousel :interval="4000" type="card" height="280px" style="color: #ffffff">
        <el-carousel-item v-for="(item, index) in swiperList" :key="index" style="color: #dfdfdf">
          <img :src="item.picImg"/>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script>
import { swiperList } from '../assets/data/swiper'

export default {
  name: 'swiper',
  data () {
    return {
      swiperList: []
    }
  },
  created () {
    this.swiperList = swiperList
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/swiper.scss';
</style>
