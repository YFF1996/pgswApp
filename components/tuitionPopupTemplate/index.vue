<template>
  <div class="popup-wrapper" v-if="showState && upyunUrl">
    <div class="popup-box">
      <div class="close-btn" @click="onShowStatusFn()">
        <img :src="upyunUrl + '/wxXcxImg/images/pic-close.png'" >
      </div>
      <div class="content">
        <h1>抢学费活动规则</h1>
        <ul>
          <li>1. 购买课程后学完课程，并且邀请新或者老用户助力，返还一半学费到余额。同时被邀请的用户也可获得一定金额学费，助力返学不限制帮助人数；</li>
          <li>2. 每个课程返现份额有限，购买订单数量达到份额后，用户购买课程不再返现；</li>
          <li>3. 抢到学费完成听知识、并且邀请新用户助力，抢到的学费立即到账到余额中；</li>
        </ul>
        <div class="check">
          <!--<div class="select-icon">
            <img v-if="checkStatus" @click="onCheckStatusFn(false)" :src="upyunUrl + '/wxXcxImg/images/check-icon.png'" />
            <img v-else @click="onCheckStatusFn(true)" :src="upyunUrl + '/wxXcxImg/images/check-icon-active.png'" />
          </div>
          <div class="text">下次不弹出</div>-->
        </div>
        <div class="confirm" @click="onShowStatusFn()">确定</div>
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
    z-index: 100
    background-color: rgba(0,0,0,0.5)
    .popup-box
      margin: 0 auto
      position: relative
      width: 280px
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
        img
          position: absolute
          top: 16px
          right: 9px
          display: block
          width: 11px
          height: 11px
      .content
        padding: 30px 20px 20px
        box-sizing: border-box
        h1
          margin-bottom: 10px
          font-size: 16px
          text-align: center
          color: #000
        ul
          margin-bottom: 14px
          width: 100%
          height: 100%
          li
            margin-bottom: 10px
            font-size: 12px
            line-height: 20px
            color: #000
        .check
          display: flex
          align-items: center
          justify-content: center
          margin: 8px 0
          .select-icon
            padding: 8px
            box-sizing: border-box
            img
              display: block
              width: 11px
              height: 11px
          .text
            padding-right: 8px
            font-size: 11px
            color: rgba(51,51,51,0.7)
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
