<template>
  <transition name="slide">
    <music-list :songs="songs" :bg-image="bgImage" :title="title"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSingerSong } from '@/api/singer'
import { ERR_OK } from '@/api/config'
import { createSong } from '@/common/js/song'
import MusicList from '@/components/music-list/music-list'

export default {
  name: 'singer-detail',
  data () {
    return {
      songs: []
    }
  },
  created () {
    this._getSingerSong()
  },
  computed: {
    title () {
      return this.singer.name
    },
    bgImage () {
      return this.singer.avatar
    },
    ...mapGetters([
      'singer'
    ])
  },
  methods: {
    _getSingerSong () {
      if (!this.singer.id) {
        this.$router.push('/singer')
      }
      getSingerSong(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizedSong(res.data.list)
          // console.log(this.songs)
        }
      })
    },
    _normalizedSong (list) {
      let ret = []
      list.forEach((item) => {
        let { musicData } = item
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  watch: {
    singer (newVal) {
      this._getSingerSong(newVal.singerId)
    }
  },
  components: {
    MusicList
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable.styl'
.singer-detail
  position: fixed
  z-index: 100
  top: 0
  left: 0
  right: 0
  bottom: 0
  background: $color-background
.slide-enter-active, .slide-leave-active
  transition: all .3s
.slide-enter, .slide-leave-to
  transform: translate3d(100%, 0, 0)
</style>
