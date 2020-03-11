<template>
  <div v-if="getCoursePopUpState && upyunUrl" class="popup-wrapper">
    <div class="popup-box">
      <div class="banner">
        <img :src="upyunUrl + '/wxXcxImg/images/activity-popup.png'" >
        <button
          class="contact-button"
          send-message-title="根据下方提示，完成后领取课程"
          :send-message-img="upyunUrl + '/wxXcxImg/images/service-share-icon.jpg'"
          show-message-card="true"
          open-type='contact'
          plain>
        </button>
      </div>
      <div class="close-btn" @click="onShowStatusFn()">
        <img :src="upyunUrl + '/wxXcxImg/images/closed-up-icon.png'" >
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { upyunUrl } from '../../api/config'

export default {
  data () {
    return {
      upyunUrl
    }
  },
  computed: {
    ...mapState([
      'getCoursePopUpState'
    ])
  },
  methods: {
    ...mapMutations({
      setGetCoursePopupState: 'SET_GET_COURSE_POPUP_STATE'
    }),
    // 关闭弹窗
    onShowStatusFn () {
      this.setGetCoursePopupState(false)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .popup-wrapper
    position: fixed
    left: 0
    top: 0
    width: 100%
    height: 100%
    display: flex
    align-items: center
    background-color: rgba(0,0,0,0.5)
    z-index: 900
    .popup-box
      margin: 0 auto
      width: 280px
      min-height: 312px
      height: auto
      overflow: hidden
      display: flex
      align-items: center
      flex-direction: column
      .banner
        position: relative
        width: 100%
        height: 312px
        .contact-button
          position: absolute
          left: 0
          top: 0
          width: 100%
          height: 100%
          opacity: 0
        img
          width: 100%
          height: 100%
      .close-btn
        margin-top: 20px;
        width: 35px
        height: 35px
        img
          width: 100%
          height: 100%
</style>
