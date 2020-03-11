<template>
  <div v-if="obj.state && upyunUrl" class="popup-wrapper" @click="onShowStatusFn()">
    <!-- 抢学费失败 -->
    <div v-if="obj.data.type === 3" class="popup-box" @click.stop>
      <img class="popup-img popup-img2"  :src="upyunUrl + '/wxXcxImg/images/tuition-popup-bg01.png'" />
      <h2>很遗憾</h2>
      <div class="popup-msg">
        <div class="text">很遗憾，人太多了</div>
        <div class="text">来晚了一步没抢到</div>
        <div class="btn" @click="onSkipPageFn('/pages/robTuition/index')">再去抢学费</div>
      </div>
      <div class="close-btn" @click="onShowStatusFn()">
        <img :src="upyunUrl + '/wxXcxImg/images/popup-close-icon.png'" />
      </div>
    </div>
    <!-- 抢学费成功 -->
    <div v-else class="popup-box" @click.stop>
      <img class="popup-img popup-img3"  :src="upyunUrl + '/wxXcxImg/images/tuition-popup-bg02.png'" />
      <h2 class="get">{{ obj.data.money_range[0] }}~{{ obj.data.money_range[1] }}<span>元</span></h2>
      <div class="popup-msg">
        <div v-if="obj.data.type === 0" class="desc">就差听完{{ obj.data.need_play }}个知识<span>｜</span>{{ obj.data.need_inv }}个朋友神助攻</div>
        <div v-if="obj.data.type === 1" class="desc">您的好友完成邀请任务，学完课程获得的学费立即到账</div>
        <div v-if="obj.data.type === 0" @click="scrollBottomFn()" class="btn">确定</div>
        <div v-if="obj.data.type === 1" class="btn"><button open-type='share'/>邀好友一起抢学费</div>
      </div>
      <div class="close-btn" @click="onShowStatusFn()">
        <img :src="upyunUrl + '/wxXcxImg/images/popup-close-icon.png'" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { upyunUrl } from '../../api/config'

export default {
  data () {
    return {
      upyunUrl
    }
  },
  methods: {
    ...mapMutations({
      setNavigationIndex: 'SET_NAVIGATION_INDEX'
    }),
    onSkipPageFn (url, id) {
      if (id || id === 0) {
        switch (id) {
          case 0:
            this.setNavigationIndex(0)
            break
          case 2:
            this.setNavigationIndex(2)
            break
          default:
            return false
        }
      }
      uni.switchTab({ url })
    },
    // 关闭弹窗
    onShowStatusFn () {
      this.$emit('popupStatusChild', false)
    },
    scrollBottomFn () {
      uni.pageScrollTo({
        scrollTop: 10000,
        duration: 300
      })
      this.onShowStatusFn()
    },
    showToastFn (title) {
      uni.showToast({
        title,
        icon: 'none',
        duration: 2000
      })
    }
  },
  props: {
    obj: {
      type: Object,
      default: {}
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
    display: -webkit-box
    display: flex
    align-items: center
    z-index: 100
    background-color: rgba(0,0,0,0.5)
    .popup-box
      margin: 0 auto
      position: relative
      width: 280px
      height: auto
      display: flex
      align-items: center
      justify-content: center
      flex-direction: column
      h2
        position: absolute
        top: 80px
        font-size: 18px
        font-weight: bold
        color: #8f8f8f
        z-index: 99
        &.get
          top: 95px
          font-size: 36px
          color: #762a0f
          span
            font-size: 13px
      .popup-img
        position: relative
        display: block
        width: 280px
        height: 161px
        z-index: 98
      .popup-img2
        height: 121px
      .popup-img3
        height: 155px
      .popup-msg
        margin-top: -20px
        padding: 40px 15px 15px
        width: 100%
        box-sizing: border-box
        text-align: center
        border-radius: 6px
        background-color: #fff
        z-index: 10
        h1
          font-size: 15px
          font-weight: bold
          color: #333
        .hint
          margin-top: 15px
          font-size: 14px
          color: #999
          span
            padding: 0 3px
        .text
          margin-top: 5px
          font-size: 14px
          color: #666
        .desc
          font-size: 15px
          color: #333
        .btn
          position: relative
          margin-top: 25px
          width: 100%
          height: 44px
          line-height: 44px
          font-size: 15px
          text-align: center
          color: #fff
          background-color: #ff4040
          border-radius: 4px
          button
            position: absolute
            left: 0
            top: 0
            width: 100%
            height: 100%
            opacity: 0
        .go
          margin-top: 15px
          font-size: 15px
          color: #ff4040
          display: flex
          align-items: center
          justify-content: center
          i
            padding-left: 7px
            font-size:12px
      .close-btn
        margin-top: 25px
        width: 27px
        height: 27px
        img
          width: 100%
          height: 100%
</style>
