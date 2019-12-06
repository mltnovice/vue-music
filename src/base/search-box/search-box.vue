<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input class="search-input" :placeholder="placeholder" v-model="query" type="text">
    <i v-show="query" @click="clear" class="icon-dismiss"></i>
  </div>
</template>

<script>
import { debounce } from '@/common/js/util'

export default {
  name: 'search-box',
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data () {
    return {
      query: ''
    }
  },
  methods: {
    clear () {
      this.query = ''
    },
    setQuery (_query) {
      this.query = _query
    }
  },
  created () {
    this.$watch('query', debounce((newQuery) => {
      this.$emit('query', newQuery)
    }, 200))
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable.styl'
.search-box
  width: 100%
  height: 40px
  box-sizing: border-box
  padding: 0 6px
  display: flex
  align-items: center
  background: $color-highlight-background
  border-radius: 6px
  .icon-search
    display: inline-block
    width: 24px
    height: 24px
    font-size: $font-size-large-x
    color: $color-background
  .search-input
    flex: 1
    padding: 0 6px
    outline: none
    color: $color-text
    font-size: $font-size-medium
    background: $color-highlight-background
  .icon-dismiss
    display: inline-block
    width: 16px
    height: 16px
    font-size: $font-size-medium-x
    color: $color-background
</style>
