<template>
  <div class="guide-layer-wrapper" v-if="showState && upyunUrl">
    <div class="content">
      <div class="avatar">
        <img :src="upyunUrl + '/wxXcxImg/images/float-icon.png'" />
      </div>
      <div class="know" @click="onSkipReturnFn()">我知道了</div>
    </div>
  </div>
</template>

<script>
import { upyunUrl } from '../../api/config'

export default {
  data () {
    return {
      upyunUrl,
      showState: false
    }
  },
  methods: {
    onSkipReturnFn () {
      this.showState = false
    }
  }
}
</script>

<style lang="stylus" scoped>
  .guide-layer-wrapper
    position: fixed
    left: 0
    top: 0
    right: 0
    bottom: 0
    width: 100%
    height: auto
    z-index: 999
    display: flex
    align-items: center
    justify-content: center
    background-color: rgba(0, 0, 0, 0.8)
    .content
      .avatar
        width: 252px
        height: 435px
        img
          width: 100%
          height: 100%
      .know
        margin: 28px auto 0
        width: 120px
        height: 34px
        line-height: 34px
        font-size: 14px
        text-align: center
        color: #fff
        border: 1px solid #fff
        border-radius: 20px
</style>
