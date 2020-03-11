<template>
  <div class="popup-wrapper" v-if="missionPopupStatus && upyunUrl">
    <div class="popup-box">
      <div class="close-btn" @click="onShowStatusFn()">
        <img :src="upyunUrl + '/wxXcxImg/images/pic-close.png'" >
      </div>
      <div class="content">
        <h2>{{ oJson.title }}</h2>
        <div class="slogan">
          <i>
            <img :src="upyunUrl + '/wxXcxImg/images/quotes-icon01.png'" />
          </i>
          <div class="info">
            <h4>瓶盖思维认知：</h4>
            <h4 class="text">不积跬步无以至千里</h4>
          </div>
          <i class="icon">
            <img :src="upyunUrl + '/wxXcxImg/images/quotes-icon02.png'" />
          </i>
        </div>
        <div class="introduce">
          {{ cnt[oJson.id - 1].intro }}
        </div>
        <div class="hint">
          <h3>{{ cnt[oJson.id - 1].types }}</h3>
          <!--<h4>听完一个知识可获得<span class="num">5</span>个瓶盖</h4>
          <h4>每日最多可获得<span class="num">80</span>个瓶盖</h4>-->
          <h4>{{ cnt[oJson.id - 1].obtain }}</h4>
          <h4>{{ cnt[oJson.id - 1].most }}</h4>
        </div>
        <div class="check">
          <!--<div class="select-icon">
            <img v-if="checkStatus" @click="onCheckStatusFn(false)" :src="upyunUrl + '/wxXcxImg/images/check-icon.png'" />
            <img v-else @click="onCheckStatusFn(true)" :src="upyunUrl + '/wxXcxImg/images/check-icon-active.png'" />
          </div>
          <div class="text">下次不弹出</div>-->
        </div>
        <div class="confirm" @click="onSkipPageFn(false, oJson.id)">确定</div>
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
      upyunUrl,
      cnt: [
        {
          intro: '早上起来第一件事，听瓶盖每日头条第一时间了解世界发生了什么？这里集合政策法规、互联网大事、热点等信息。充分了解变化也是上进的一种。',
          types: '传递信息可获得奖励',
          obtain: '听完5条头条可获得25个瓶盖',
          most: '每日最多可获得100瓶盖',
          id: 1
        },
        {
          intro: '瓶盖思维知识库中融汇了全网跟个人成长息息相关的各类知识，只要你每天坚持听下去，量变终究会产生质变。让你在职场中突破瓶颈，如鱼得水。',
          types: '传递知识可获得奖励',
          obtain: '听完5个知识可获得25个瓶盖',
          most: '每日最多可获得100瓶盖',
          id: 2
        },
        {
          intro: '我们收集了全球著名企业发家史、名人坎坷的发家策略、有影响力的营销事件等信息整理成了案例，可以好好的参考一下别人是怎么做的。',
          types: '看案例可获得瓶盖',
          obtain: '看新案例可获得10个瓶盖',
          most: '回顾旧案例可获得1个瓶盖，每日最多可获得3个瓶盖',
          id: 3
        },
        {
          intro: '一个伟大产品的出现少不了您的参与。您可以把您在产品（程序）使用上，内容设置上及整个在线学习领域上的一些好的想法以建议的形式提交给我们，我们会逐一查看。我们坚信，我们做出的产品一定会得到您的支持和鼓励，我们期待您的宝贵建议。',
          types: '提建议可获得瓶盖',
          obtain: '您的建议被采纳后可获得50个瓶盖，无上限',
          most: '平台24小时内审核建议，奖励24小时内到账',
          id: 4
        },
        {
          intro: '学习过程中，要学会分享，独乐乐不如众乐乐。把比较有感触的内容，分享给朋友、家人、同事，把你的理解和启发与他们分享，邀请他们加入平台，共同成长。',
          types: '分享知识可获得瓶盖',
          obtain: '成功分享一个知识可获得5个瓶盖',
          most: '每日最多50个瓶盖',
          id: 5
        }
      ]
    }
  },
  computed: {
    ...mapState([
      'missionPopupStatus',
      'checkStatus'
    ])
  },
  methods: {
    ...mapMutations({
      setMissionPopupStatus: 'SET_MISSION_POPUP_STATUS',
      setNavigationIndex: 'SET_NAVIGATION_INDEX',
      setCheckStatus: 'SET_CHECK_STATUS',
      setSharePopupState: 'SET_SHARE_POPUP_STATE'
    }),
    // 关闭弹窗
    onShowStatusFn () {
      this.setMissionPopupStatus(false)
    },
    // 复选框勾选
    onCheckStatusFn (state) {
      this.setCheckStatus(state)
    },
    onSkipPageFn (url, id) {
      switch (id) {
        case 1:
          this.setNavigationIndex(1)
          uni.switchTab({ url: '/pages/index/index' })
          break
        case 2:
          this.setNavigationIndex(0)
          uni.switchTab({ url: '/pages/index/index' })
          break
        case 3:
          uni.navigateTo({ url: '/pages/checkIn/index' })
          break
        case 4:
          uni.navigateTo({ url: '/pages/me/feedback/index' })
          break
        case 5:
          this.setNavigationIndex(0)
          uni.switchTab({ url: '/pages/index/index' })
          this.setSharePopupState(true)
          break
        case 6:
          uni.navigateTo({ url: '/pages/checkIn/index' })
          break
        default:
          return false
      }
      this.setMissionPopupStatus(false)
    }
  },
  props: {
    oJson: {
      type: Array,
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
        background-color: #e1564f
        border-radius: 35px 0px 0px 0px
        img
          position: absolute
          top: 16px
          right: 9px
          display: block
          width: 11px
          height: 11px
      .content
        padding: 20px
        box-sizing: border-box
        h2
          font-size: 17px
          line-height: 22px
          text-align: center
          color: #000
        .slogan
          margin: 24px 0 20px
          width: 100%
          height: auto
          overflow: hidden
          border-radius: 5px
          background-color: #f2ece1
          i
            margin: 13px 16px 10px 20px
            width: 16px
            height: 11px
            img
              display: block
              width: 100%
              height: 100%
            &.icon
              float: right
          .info
            padding: 0 36px 0 40px
            box-sizing: border-box
            h4
              font-size: 13px
              line-height: 17px
              color: #333
              &.text
                margin-top: 10px
                text-align: right
        .introduce
          margin-bottom: 14px
          color: #000
          font-size: 12px
          line-height: 20px
        .hint
          padding-bottom: 10px
          color: #000
          border-bottom: 1px dashed #ccc
          h3
            margin-bottom: 6px
            font-size: 14px
            line-height: 19px
          h4
            margin-bottom: 3px
            font-size: 12px
            line-height: 18px
            .num
              font-size: 18px
              color: #e1564f
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
          background-color: #e1564f
          box-shadow: 0px 0px 1px 0px rgba(65,117,246,0.65)
          border-radius: 25px
</style>
