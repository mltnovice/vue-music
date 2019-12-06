<template>
  <div class="song-list">
    <ul>
      <li
        v-for="(song, index) in songs"
        :key="song.id"
        @click="selectItem(song, index)"
        class="song"
      >
        <div class="rank-icon" v-if="rank">
          <span class="rank-icon-text" :class="rankIcon(index)">{{getIconText(index)}}</span>
        </div>
        <div class="content">
          <h2 class="song-name">{{song.name}}</h2>
          <p class="song-desc">{{song.singer}}-{{song.album}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'song-list',
  props: {
    songs: {
      type: Array,
      default () {
        return {}
      }
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    selectItem (item, index) {
      this.$emit('select', item, index)
    },
    rankIcon (index) {
      return `icon${index}`
    },
    getIconText (index) {
      if (index <= 2) {
        return ''
      } else {
        return index + 1
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable.styl'
@import '../../common/stylus/mixin.styl'
.song-list
  padding: 20px 30px
  .song
    height: 64px
    display: flex
    align-items: center
    .rank-icon
      width: 55px
      height: 64px
      display: flex
      align-items: center
      .rank-icon-text
        display: inline-block
        width: 25px
        height: 25px
        line-height: 25px
        font-size: $font-size-large
        text-align: center
        background-size: 100%
        background-repeat: no-repeat
        background-position: 0 center
        &.icon0
          bg-image('first')
        &.icon1
          bg-image('second')
        &.icon2
          bg-image('third')
    .content
      height: 44px
      font-size: $font-size-medium
      no-wrap()
      .song-name
        color $color-text
      .song-desc
        padding-top: 12px
        color: $color-text-d
        no-wrap()
</style>
