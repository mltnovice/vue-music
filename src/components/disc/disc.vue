<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="baImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import MusicList from '@/components/music-list/music-list'
import { mapGetters } from 'vuex'
import { getCdInfo } from '@/api/recommend'
import { ERR_OK } from '@/api/config'
import { createSong } from '@/common/js/song'

export default {
  name: 'disc',
  data () {
    return {
      songs: []
    }
  },
  created () {
    this._getCdInfo()
  },
  methods: {
    _getCdInfo () {
      if (!this.disc.dissid) {
        this.$router.push('/recommend')
        return
      }
      getCdInfo(this.disc.dissid).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizedSongs(res.cdlist[0].songlist)
          // console.log(this._normalizedSongs(res.cdlist[0].songlist))
        }
      })
    },
    _normalizedSongs (list) {
      let ret = []
      console.log(list)
      list.forEach((song) => {
        if (song.songmid && song.albummid) {
          ret.push(createSong(song))
        }
      })
      return ret
    }
  },
  computed: {
    title () {
      return this.disc.discname
    },
    baImage () {
      return this.disc.imgurl
    },
    ...mapGetters([
      'disc'
    ])
  },
  watch: {
    disc (newDisc) {
      this._getCdInfo(newDisc.dissid)
    }
  },
  components: {
    MusicList
  }
}
</script>

<style lang="stylus" scoped>
.slide-enter-active, .slide-leave-active
  transition: all .3s
.slide-enter, .slide-leave-to
  transform: translate3d(100%, 0, 0)
</style>
