<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <div v-if="recommends.length" class="slider-wrapper">
          <div class="slider-content">
            <slider>
              <div v-for="(recommend, index) in recommends" :key="index">
                <a :href="recommend.linkUrl">
                  <img @load="loadImg" :src="recommend.picUrl">
                </a>
              </div>
            </slider>
          </div>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li @click="selectItem(disc)" v-for="disc in discList" :key="disc.dissid" class="disc">
              <img v-lazy=disc.imgurl class="avatar">
              <div class="disc-wrapper">
                <h2 class="disc-title">{{disc.creator.name}}</h2>
                <span class="disc-desc">{{disc.dissname}}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import { getRecommend, getDiscList } from '@/api/recommend'
import { ERR_OK } from '@/api/config'
import Slider from '@/base/slider/slider'
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'
import { playListMixin } from '@/common/js/mixin'
import { mapMutations } from 'vuex'

export default {
  name: 'recommend',
  mixins: [playListMixin],
  data () {
    return {
      recommends: [],
      discList: []
    }
  },
  created () {
    this._getRecommend()
    this._getDiscList()
  },
  methods: {
    selectItem (disc) {
      this.$router.push({
        path: `/recommend/${disc.dissid}`
      })
      this.setDisc(disc)
    },
    handlePlayList (playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    _getRecommend () {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider
        }
      })
    },
    _getDiscList () {
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list
          // console.log(this.discList)
        }
      })
    },
    loadImg () {
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh()
        this.checkLoaded = true
      }
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  },
  components: {
    Slider,
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable.styl'
@import '../../common/stylus/mixin.styl'
.recommend
  position: fixed
  top: 88px
  left: 0
  bottom: 0
  width: 100%
  z-index: 99
  overflow: hidden
  .recommend-content
    position: relative
    height: 100%
    .slider-wrapper
      position: relative
      width: 100%
      height: 0
      padding-bottom: 40%
      .slider-content
        position: absolute
        width: 100%
        height: 100%
        top: 0
        left: 0
    .recommend-list
      .list-title
        font-size: $font-size-medium
        line-height: 65px
        text-align: center
      .disc
        display: flex
        padding: 0 20px 20px
        .avatar
          width: 60px
          height: 60px
          margin-right: 20px
        .disc-wrapper
          display: flex
          flex: 1
          flex-direction: column
          justify-content: space-around
          font-size: $font-size-medium
          .disc-title
            color: $color-text
          .disc-desc
            color: $color-text-d
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
