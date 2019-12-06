<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="baImage" :songs="songs" :rank="true"></music-list>
  </transition>
</template>

<script>
import MusicList from '@/components/music-list/music-list'
import { getRankDisc } from '@/api/rank'
import { mapGetters } from 'vuex'
import { ERR_OK } from '@/api/config'
import { createSong } from '@/common/js/song'

export default {
  name: 'rank-disc',
  data () {
    return {
      songs: []
    }
  },
  created () {
    this._getRankDisc()
  },
  methods: {
    _getRankDisc () {
      if (!this.rankDisc.id) {
        this.$router.push('/rank')
        return
      }
      getRankDisc(this.rankDisc.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizedSongs(res.songlist)
        }
      })
    },
    _normalizedSongs (list) {
      let ret = []
      list.forEach((song) => {
        if (song.data.songmid && song.data.albummid) {
          ret.push(createSong(song.data))
        }
      })
      return ret
    }
  },
  computed: {
    title () {
      return this.rankDisc.topTitle
    },
    baImage () {
      if (this.songs.length) {
        return this.songs[0].image
      }
      return ''
    },
    ...mapGetters([
      'rankDisc'
    ])
  },
  watch: {
    rankDisc (newDisc) {
      this._getRankDisc(newDisc.id)
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
