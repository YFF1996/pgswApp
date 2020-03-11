<template>
  <div class="get-book-btn" @click="onSkipSendBookFn()" v-if="state">
    <img :src="upyunUrl + '/wxXcxImg/images/get-book-icon.gif'" />
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
  methods: {
    onSkipSendBookFn () {
      uni.navigateTo({
        url: '/pages/mission/sendBook/index'
      })
    }
  },
  props: {
    state: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="stylus" scoped>
  .get-book-btn
    position: fixed
    top: 50%
    right: 10px
    width: 50px
    height: 50px
    z-index: 999
    img
      width: 100%
      height: 100%
</style>
