<template>
  <div v-if="showState && upyunUrl" class="popup-wrapper">
    <div class="popup-box">
      <div class="close-btn" @click="onShowStatusFn()">
        <image :src="upyunUrl + '/wxXcxImg/images/pic-close.png'" />
      </div>
      <div class="content">
        <div v-if="obj" class="text-box">
          <div class="title">抢学费活动规则</div>
          <div class="text">{{ obj }}</div>
        </div>
        <div v-if="oRule" class="text-box">
          <div class="title">提现须知</div>
          <div class="text">{{ oRule }}</div>
        </div>
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
      'checkStatus'
    ])
  },
  methods: {
    ...mapMutations({
      setCheckStatus: 'SET_CHECK_STATUS'
    }),
    // 关闭弹窗
    onShowStatusFn () {
      this.$emit('popupStatusChild', false)
    },
    // 复选框勾选
    onCheckStatusFn (state) {
      this.setCheckStatus(state)
    }
  },
  props: {
    showState: {
      type: Boolean,
      default: false
    },
    obj: {
      type: String,
      default: ''
    },
    oRule: {
      type: String,
      default: ''
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
    z-index: 9999
    background-color: rgba(0,0,0,0.5)
    .popup-box
      margin: 0 auto
      position: relative
      width: 300px
      min-height: 185px
      height: auto
      overflow: hidden
      display: flex
      align-items: center
      flex-direction: column
      border-radius: 8px
      background-color: #fff
      .close-btn
        position: absolute
        top: 0
        right: 0
        width: 35px
        height: 35px
        transform: rotate(-90deg)
        background-color: #ff4040
        border-radius: 35px 0px 0px 0px
        image
          position: absolute
          top: 16px
          right: 9px
          display: block
          width: 11px
          height: 11px
      .content
        padding: 25px 15px
        box-sizing: border-box
        .text-box
          padding-bottom: 15px
          width: 100%
          height: auto
          .title
            padding-bottom: 10px
            font-size: 16px
            text-align: center
            color: #000
          .text
            display: block
            max-height: 360px
            overflow: hidden
            overflow-y: scroll
            font-size: 13px
            line-height: 20px
            color: #000
        .confirm
          margin: 0 auto
          width: 175px
          height: 34px
          line-height: 34px
          font-size: 14px
          text-align: center
          color: #fff
          background-color: #ff4040
          box-shadow: 0px 0px 1px 0px rgba(65,117,246,0.65)
          border-radius: 25px
</style>
