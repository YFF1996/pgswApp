<template>
  <div class="save-hint-wrapper" v-if="upyunUrl">
    <div class="close" @click="onCloseCircleFn()">
      <img :src="upyunUrl + '/wxXcxImg/images/closed-icon.png'" />
    </div>
    <h2 class="title">已保存到相册</h2>
    <div class="text-box">
      <i class="circle"></i>
      <span class="text">由于微信朋友圈分享限制，请到微信朋友圈上传分享</span>
    </div>
    <button class="submit-btn" open-type='share'>分享到好友</button>
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
    // 关闭生成朋友圈页面
    onCloseCircleFn () {
      this.$emit('closeCircleChild', false)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .save-hint-wrapper
    position: relative
    padding: 0 25px
    box-sizing: border-box
    width: 250px
    height: 217px
    background: #fff
    border-radius: 3px
    .close
      position: absolute
      top: 10px
      right: 10px
      width: 20px
      height: 20px
      border-radius: 50%
      img
        width: 100%
        height: 100%
    .title
      padding: 30px 0 24px
      box-sizing: border-box
      font-size: 16px
      font-weight: 600
      text-align: center
      color: #333
    .text-box
      margin-bottom: 30px
      display: flex
      .circle
        margin-top: 8px
        width: 4px
        height: 4px
        background: #a1a1a1
        border-radius: 50%
      .text
        padding-left: 5px
        font-size: 14px
        line-height: 20px
        color: #333
    .submit-btn
      width: 100%
      height: 35px
      line-height: 35px
      color: #fff
      font-size: 14px
      text-align: center
      background: #3cb035
      border-radius: 3px
</style>
