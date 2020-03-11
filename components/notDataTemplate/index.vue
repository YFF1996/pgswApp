<template>
  <div v-if="upyunUrl && !list.length" class="loading-more-wrapper">
    <img :src="upyunUrl + '/wxXcxImg/images/not-data-icon.png'" />
    <h2>你还没有邀请好友，去邀请好友一起学习吧</h2>
  </div>
</template>

<script>
import { upyunUrl } from '../../api/config'

export default {
  data () {
    return {
      upyunUrl
    }
  },
  props: {
    list: {
      type: Array,
      default: []
    }
  }
}
</script>

<style lang="stylus" scoped>
  .loading-more-wrapper
    padding: 20px 0
    width: 100%
    height: auto
    box-sizing: border-box
    img
      margin: 0 auto
      display: block
      width: 80px
      height: 80px
    h2
      margin-top: 10px
      font-size: 13px
      line-height: 20px
      text-align: center
      color: #b9b9b9
</style>
