<template>
  <div v-if="upyunUrl" class="share-wrapper">
    <div class="share-content">
      <div class="user-box">
        <span>你的好友</span>
        <i>
          <img mode="aspectFill" :src="oJson.avatarurl" />
        </i>
        <span>{{ oJson.nickname }}</span>
      </div>
      <div class="cover">
        <img :src="upyunUrl + '/wxXcxImg/images/red-bag-bg.png'" />
        <div class="rob-btn" @click="onGetTuitionFn()">
          <img :src="upyunUrl + '/wxXcxImg/images/red-btn-icon.png'" />
        </div>
      </div>
      <div class="rule-box">
        <div class="title">
          <i>
            <img :src="upyunUrl + '/wxXcxImg/images/title-white-icon.png'" />
          </i>
          <h2>抢学费攻略</h2>
          <i class="left-icon">
            <img :src="upyunUrl + '/wxXcxImg/images/title-white-icon.png'" />
          </i>
        </div>
        <ul>
          <li>
            <div class="word">1. 监督好友完成学习任务分学费</div>
          </li>
          <li>
            <div class="word">2. 与众人一起学习并抢学费</div>
          </li>
          <li class="affect">
            <div>抢得的学费可用于：</div>
            <div class="text">
              <i>1</i>
              <span>提现</span>
            </div>
            <div class="text">
              <i>2</i>
              <span>购买课程</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!--抢学费结果弹窗-->
    <tuition-draw-popup @popupStatusChild="onClosePopupStatusFn" :obj="options" />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { upyunUrl } from '../../../api/config'
import TuitionDrawPopup from '../../../components/tuitionDrawPopupTemplate'

export default {
  data () {
    return {
      upyunUrl,
      oJson: '',
      orderid: '',
      shareText: '',
      options: {
        state: false,
        data: {}
      }
    }
  },
  onLoad (options) {
    this.setShareId(options.shareid)
    this.orderid = options.orderid
    this.getShareTextFn()
  },
  onShow () {
    this.getOtherUserInfoFn()
  },
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  methods: {
    ...mapMutations({
      setShareId: 'SET_SHARE_ID'
    }),
    ...mapActions([
      'getShareText',
      'getOtherUserInfo',
      'getTuition'
    ]),
    // 获取分享title
    getShareTextFn () {
      this.getShareText({ that: this }).then((res) => {
        this.shareText = res
      })
    },
    // 用户它人用户信息
    getOtherUserInfoFn () {
      this.getOtherUserInfo({ that: this, order_id: this.orderid }).then((res) => {
        this.oJson = res
      })
    },
    // 立即抢学费
    onGetTuitionFn () {
      if (this.userInfo) {
        if (this.orderid && !this.oJson.is_my && !this.oJson.is_join_inv && !this.oJson.is_join_pt) {
          uni.showLoading({ title: 'Loading' })
          this.getTuition({ that: this, order_id: this.orderid }).then((res) => {
            if (res.code === 200) {
              this.options = {
                state: true,
                data: res.data
              }
            } else {
              this.options = {
                state: true,
                data: {type: 3}
              }
            }
            uni.hideLoading()
          })
        } else if ((this.orderid && this.oJson.is_my) || (this.orderid && this.oJson.is_join_inv)) {
          this.onClosePopupStatusFn(false)
        } else {
          uni.switchTab({ url: '/pages/robTuition/index' })
        }
      } else {
        this.onSkipPageFn(`/pages/login/index`)
      }
    },
    // 关闭弹窗
    onClosePopupStatusFn (state) {
      const data = {
        order_id: this.orderid
      }
      this.onSkipPageFn(`/pages/robTuition/tuitionShare/index?oJson=${encodeURIComponent(JSON.stringify(data))}`)
      this.options.state = state
    },
    // 跳转页面
    onSkipPageFn (url) {
      uni.navigateTo({ url })
    }
  },
  components: {
    TuitionDrawPopup
  }
}
</script>

<style lang="stylus" scoped>
  .share-wrapper
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    width: 100%
    height: 100%
    background: linear-gradient(0deg,rgba(255,255,255,1) 0%,rgba(255,124,89,1) 0%,rgba(255,64,64,1) 100%);
    .share-content
      padding: 20px 15px
      width: 100%
      height: auto
      box-sizing: border-box
      .title
        margin: 0 auto 18px
        display: flex
        align-items: center
        justify-content: center
        i
          width: 25px
          height: 25px
          img
            display: block
            width: 100%
            height: 100%
          &.left-icon
            transform: rotate(-180deg)
        h2
          padding: 0 5px
          font-size: 15px
          color: #fff
      .user-box
        width: 100%
        height: auto
        display: flex
        align-items: center
        justify-content: center
        span
          padding: 0 10px
          font-size: 15px
          font-weight: bold
          color: #fff
          box-sizing: border-box
        i
          width: 46px
          height: 46px
          background-color: #ff4040
          box-shadow: 0px 1px 10px 0px rgba(141,9,9,0.51)
          border-radius: 50%
          img
            width: 100%
            height: 100%
            border-radius: 50%
      .cover
        position: relative
        margin: 8px 0 20px
        display: flex
        justify-content: center
        width: 100%
        height: 305px
        img
          display: block
          width: 100%
          height: 100%
        .rob-btn
          position: absolute
          margin-left: -5px
          bottom: 70px
          width: 77px
          height: 77px
          transform: scale(0.8, 0.8)
          animation: change 2s infinite
      .rule-box
        margin-bottom: 25px
        width: 100%
        height: auto
        text-align: center
        ul
          margin: 0 auto
          width: 100%
          height: auto
          li
            margin-bottom: 15px
            font-size: 13px
            color: #000
            display: flex
            align-items: center
            justify-content: center
            .word
              width: 200px
              text-align: left
            .text
              padding-left: 3px
              display: flex
              align-items: center
              i
                width: 12px
                height: 12px
                line-height: 12px
                text-align: center
                color: #fff
                border: 1px solid #fff
                border-radius: 50%
              span
                padding-left: 3px
  @-webkit-keyframes change
    0%
      transform: scale(0.8, 0.8)
      transition-delay: 0.5s
    50%
      transform: scale(1, 1)
      transition-delay: 0.5s
    100%
      transform: scale(0.8, 0.8)
      transition-delay: 0.5s
</style>
