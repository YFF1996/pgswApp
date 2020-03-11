<template>
  <div class="activity-wrapper" v-if="oJson.is_show && oJson.popup_img" @click="onHideWindowsFn()">
    <div class="activity-box">
      <div v-if="oJson.type === 1" class="activity-img" @click="onSkipPageFn('/pages/mission/lecturerPoster/index')">
        <img mode="aspectFill" :src="oJson.popup_img" />
      </div>
      <div v-if="oJson.type === 2" class="video-box" @click.stop>
        <video id="video"
          :src="oJson.popup_img"
          :custom-cache='false'
          controls
          :autoplay='true'>
        </video>
      </div>
      <div v-if="oJson.type === 2" class="skip-box" @click="onSkipPageFn('/pages/mission/sendBook/index')">
        <div class="skip-btn">立即参与活动</div>
      </div>
    </div>
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
    onSkipPageFn (url) {
      uni.navigateTo({
        url
      })
    },
    // 关闭活动窗口
    onHideWindowsFn () { this.oJson['is_show'] = 0 }
  },
  props: ['oJson']
}
</script>

<style lang="stylus" scoped>
  .activity-wrapper
    position: fixed
    left: 0
    top: 0
    width: 100%
    height: 100%
    display: -webkit-box
    display: flex
    align-items: center
    z-index: 999
    background-color: rgba(0, 0, 0, 0.5)
    .activity-box
      width: 100%
      height: auto
      overflow: hidden
      display: flex
      align-items: center
      flex-direction: column
      .activity-img
        width: 300px
        height: 320px
        img
          width: 100%
          height: 100%
      .video-box
        position: relative
        width: 250px
        height: auto
        box-sizing: border-box
        video
          width: 100%
          height: 400px
          margin: 0 auto
          display: block
      .skip-box
        margin: 0 auto
        padding: 20px 10px 15px
        height: auto
        box-sizing: border-box
        .skip-btn
          width: 105px
          height: 25px
          line-height: 25px
          font-size: 14px
          text-align: center
          color: #fff
          background-color: #f34947
          border-radius: 20px
</style>
