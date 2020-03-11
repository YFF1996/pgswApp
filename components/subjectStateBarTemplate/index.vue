<template>
  <div
    v-if="upyunUrl"
    @click="onHideSubjectStateBarFn(false)"
    :class="{'subject-state-bar-active' : exchangeInviteState}"
    class="subject-state-bar"
  >
    <div
      v-if="!obj.is_pay && !exchangeInviteState && !obj.is_inviteing"
      class="get-data-box"
    >
      <div
        v-if="(isIos && isReview && obj.price > 0 && obj.activity_num - obj.activity_has > 0) || (!isIos && obj.price > 0 && obj.activity_num - obj.activity_has > 0)"
        class="hint-box"
      >
        学完课程，邀请好友抢学费获{{ obj.sp_back_percent }}%购买金额返还
        <div class="triangle"></div>
      </div>
      <div class="hint-box-ul">
        <div
          v-if="obj.can_exchange"
          @click.stop="onExchangeInviteFn()"
          class="item convert-btn"
        >免费获得</div>
        <div
          v-if="(isIos && isReview && obj.price > 0) || (!isIos && obj.price > 0)"
          @click.stop="onSkipPageFn('buyDetails')"
          class="item buy-btn"
        >购买 ¥{{ obj.price }}</div>
      </div>
    </div>
    <div
      v-if="exchangeInviteState"
      class="select-direction"
    >
      <div class="select-direction-ul">
        <div class="item">
          <div class="text-left">
            <div class="text">瓶盖兑换课程</div>
            <div class="num">
              <image :src="upyunUrl + '/wxXcxImg/images/subject-integral-icon.png'" />
              <div class="text">{{ obj.exchange_price }}</div>
            </div>
          </div>
          <div
            @click.stop="onExchangeJoinInviteFn('exchange')"
            class="btn-right"
          >
            <div class="btn">立即兑换</div>
          </div>
        </div>
        <div v-if="obj.can_invite" class="item">
          <div class="text-left">
            <div class="text">成功邀请{{ obj.need_invite }}人即可免费听课</div>
          </div>
          <div
            @click.stop="onExchangeJoinInviteFn('joinInvite')"
            class="btn-right"
          >
            <div class="btn">去邀请</div>
          </div>
        </div>
      </div>
      <div class="question-wrapper">
        <image :src="upyunUrl + '/wxXcxImg/images/question-icon.png'" />
        <div class="text">请选择您要免费听课方式，确定后不可再选择另一种方式</div>
      </div>
    </div>
    <!-- 是否已参与邀请免费听课中 -->
    <div
      v-if="obj.is_inviteing"
      class="back-tracking-wrapper"
    >
      <div
        @click.stop="onSkipPageFn('invitedRecord')"
        class="text-bar"
      >邀请免费听课｜已邀请<p>{{ obj.join_num }}</p>人，还需邀请人数<p>{{ obj.need_invite - obj.join_num }}</p></div>
      <div
        v-if="(isIos && isReview && obj.price > 0) || (!isIos && obj.price > 0)"
        @click.stop="onPaySubjectFn()"
        class="trapezoid-box"
      >购买<p>购买</p></div>
    </div>
    <!-- 返现活动中 -->
    <div
      v-if="obj.is_activity"
      @click.stop="onSkipPageFn('tuitionShare')"
      class="back-tracking-wrapper"
    >
      <div v-if="obj.back_status !== 2 && obj.sp_inv_num - obj.back_inv_num > 0" class="hint-box">
        还差{{ obj.sp_inv_num - obj.back_inv_num }}个好友，{{ obj.sp_back_percent }}%的购买金额立即到账
        <div class="triangle"></div>
      </div>
      <div class="text-bar">已花费<p>{{ obj.orders_price }}</p>元｜本课程已返还<p>{{ obj.back_money || 0 }}</p>元</div>
    </div>
    <!-- 兑换，购买，完成邀请人数时 -->
    <div
      v-if="obj.is_pay && !obj.is_activity"
      class="exchange-state"
    >已获得</div>
    <!-- 立即抢购 -->
    <!--<div-->
      <!--v-if="obj.order_info && parseInt(obj.order_info.uid) !== parseInt(userInfo.user_id) && obj.order_info.is_activity && obj.order_info.type === 0"-->
      <!--class="rush-to-purchase-box"-->
    <!--&gt;-->
      <!--<div class="user-info">-->
        <!--<image mode="aspectFill" :src="obj.order_user_headpic" />-->
        <!--<p>帮抢我们都分得学费哟</p>-->
      <!--</div>-->
      <!--<div-->
        <!--v-if="obj.is_join_inv"-->
        <!--@click.stop="onSkipPageFn(`/pages/robTuition/tuitionShare/main?oJson=${encodeURIComponent(JSON.stringify(obj))}`)"-->
        <!--class="btn"-->
      <!--&gt;立即抢</div>-->
      <!--<div-->
        <!--v-else-->
        <!--@click.stop="onSkipPageFn(`/pages/robTuition/tuitionBill/main?oJson=${encodeURIComponent(JSON.stringify(obj))}`)"-->
        <!--class="btn"-->
      <!--&gt;立即抢</div>-->
    <!--</div>-->
    <!-- 邀请好友帮完成课程 -->
    <!--<div-->
      <!--v-if="obj.order_info && parseInt(obj.order_info.uid) !== parseInt(userInfo.user_id) && !obj.order_info.is_activity && obj.order_info.type === 2"-->
      <!--class="rush-to-purchase-box"-->
    <!--&gt;-->
      <!--<div class="user-info">-->
        <!--<image mode="aspectFill" :src="obj.order_user_headpic" />-->
        <!--<p>就差你的帮忙，我就可以拿到课程了</p>-->
      <!--</div>-->
      <!--<div-->
        <!--class="btn"-->
        <!--@click="onSkipRobTuitionFn()"-->
      <!--&gt;要帮忙</div>-->
    <!--</div>-->
    <!-- 返现计划弹窗 -->
    <!--<div-->
      <!--class="return-money-pop-up"-->
      <!--v-if="returnMoneyPopUpState && obj.is_activity"-->
      <!--@click="onReturnMoneyPopUpFn(false)"-->
    <!--&gt;-->
      <!--<div class="info-box">-->
        <!--<div class="info">-->
          <!--<image class="img-bg" :src="upyunUrl + '/wxXcxImg/images/cashes-back-bg.png'" />-->
          <!--<div class="content">-->
            <!--<h1>返现计划</h1>-->
            <!--<ul>-->
              <!--<li>学完课程</li>-->
              <!--<li>邀请好友一起学习<li>-->
              <!--<li>获得<span>{{ obj.sp_back_percent }}%</span>购买金额返还</li>-->
            <!--</ul>-->
            <!--<div class="btn">确定</div>-->
          <!--</div>-->
        <!--</div>-->
        <!--<div class="hint-box">-->
          <!--<i>-->
            <!--<image :src="upyunUrl + '/wxXcxImg/images/hint-white-icon.png'" />-->
          <!--</i>-->
          <!--<div class="text">确定后，不能在选择其他方式免费请听课，以前选择邀请听课的邀请记录会被清零。</div>-->
        <!--</div>-->
        <!--<div class="close">-->
          <!--<image :src="upyunUrl + '/wxXcxImg/images/closed-up-icon.png'" />-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { upyunUrl } from '../../api/config'

export default {
  data () {
    return {
      upyunUrl,
      oJson: ''
    }
  },
  computed: {
    ...mapState([
      'isIos',
      'isReview',
      'userInfo',
      'exchangeInviteState',
      'returnMoneyPopUpState'
    ])
  },
  onLoad () {
    this.getUserAccountInfoFn()
  },
  methods: {
    ...mapMutations({
      setReturnMoneyPopUpState: 'SET_RETURN_MONEY_POP_UP_STATE',
      setExchangeInviteState: 'SET_EXCHANGE_INVITE_STATE'
    }),
    ...mapActions([
      'exchangeJoinInvite',
      'getUserAccountInfo'
    ]),
    // 选择兑换或邀请人
    onExchangeInviteFn () {
      if (this.userInfo) {
        this.setExchangeInviteState(true)
      } else {
        uni.navigateTo({
          url: '/pages/login/index'
        })
      }
    },
    // 获取瓶盖
    getUserAccountInfoFn () {
      if (this.userInfo) {
        this.getUserAccountInfo({ that: this }).then((res) => {
          this.oJson = res
        })
      }
    },
    // 瓶盖兑换专题-参与邀请人活动
    onExchangeJoinInviteFn (type) {
      if (type === 'exchange') {
        if (this.oJson.jifen > this.obj.exchange_price) {
          this.exchangeJoinInviteFn(type)
        } else {
          uni.showModal({
            content: '您的瓶盖不足，去赚瓶盖吧',
            confirmColor: '#e1564f',
            confirmText: '赚瓶盖',
            success (res) {
              if (res.confirm) {
                uni.navigateTo({
                  url: '/pages/mission/index'
                })
              }
            }
          })
        }
      } else {
        this.exchangeJoinInviteFn(type)
      }
    },
    exchangeJoinInviteFn (type) {
      const that = this
      const data = {
        that: this,
        id: this.obj.id,
        type
      }
      uni.showModal({
        content: type === 'exchange' ? `兑换该专题，将会被扣除${this.obj.exchange_price}瓶盖` : '是否参与邀请人活动?',
        confirmColor: '#e1564f',
        success (res) {
          if (res.confirm) {
            that.exchangeJoinInvite(data).then((res) => {
              if (res.code === 200) {
                that.$emit('getSubjectInfoChild', true)
              } else {
                setTimeout(() => {
                  that.onSkipPageFn(`/pages/me/myCourse/index`)
                }, 2000)
              }
            })
          }
        }
      })
    },
    // 通过邀请人进行购买专题
    onPaySubjectFn () {
      // const that = this
      uni.showModal({
        title: '温馨提示',
        content: '一旦选择购买课程，邀请活动则为放弃!',
        confirmColor: '#e1564f',
        success (res) {
          if (res.confirm) {
          }
        }
      })
    },
    // 隐藏专题专题栏
    onHideSubjectStateBarFn (state) {
      this.setExchangeInviteState(state)
    },
    // 显示-隐藏弹窗
    onReturnMoneyPopUpFn (state) {
      this.setReturnMoneyPopUpState(state)
    },
    // 跳转页面
    onSkipPageFn (type) {
      if (this.userInfo) {
        let url = ''
        switch (type) {
          case 'buyDetails':
            url = `/pages/subject/submitPay/index?oJson=${encodeURIComponent(JSON.stringify(this.obj))}`
            break
          case 'invitedRecord':
            url = `/pages/subjectDetailsPage/invitedRecord/index?orderid=${this.obj.order_id}`
            break
          case 'tuitionShare':
            url = `/pages/robTuition/tuitionShare/index?oJson=${encodeURIComponent(JSON.stringify(this.obj))}`
            break
          default:
            return false
        }
        uni.navigateTo({
          url
        })
      } else {
        uni.navigateTo({
          url: '/pages/login/index'
        })
      }
    },
    // 跳转抢学费页面
    onSkipRobTuitionFn () {
      uni.switchTab({ url: '/pages/robTuition/index' })
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
  .subject-state-bar
    position: fixed
    left: 0
    bottom: 0
    width: 100%
    height: auto
    z-index: 80
    &.subject-state-bar-active
      top: 0
      right: 0
      height: 100%
      background-color: rgba(0, 0, 0, 0.5)
    .get-data-box
      position: relative
      width: 100%
      height: auto
      .hint-box
        position: absolute
        right: 25px
        top: -35px
        padding: 0 10px
        line-height: 23px
        font-size: 12px
        border-radius: 4px
        color: #ff4040
        background-color: #fad9d9
        .triangle
          position: absolute
          right: 25px
          bottom: -9px
          width: 0
          height: 0
          border-left: 5px solid transparent
          border-right: 5px solid transparent
          border-top: 10px solid #fad9d9
      .hint-box-ul
        width: 100%
        height: auto
        display: flex
        .item
          flex: 1
          font-size: 19px
          font-weight: bold
          line-height: 55px
          text-align: center
          color: #ffffff
        .convert-btn
          background-color: #ffb76b
        .buy-btn
          background-color: #ff4240
    .select-direction
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      height: auto
      padding: 15px 15px 0 15px
      background-color: #fff
      box-sizing: border-box
      .select-direction-ul
        width: 100%
        height: auto
        .item
          width: 100%
          height: auto
          padding: 0 15px
          margin-bottom: 15px
          border-radius: 4px
          display: flex
          background-color: #f5f5f5
          box-sizing: border-box
          .text-left
            flex: 1
            height: auto
            padding: 0 5px
            display: flex
            align-items: center
            .text
              font-size: 18px
              line-height: 24px
              color: #000000
            .num
              flex: 1
              padding-left: 20px
              display: flex
              align-items: center
              box-sizing: border-box
              image
                display: block
                width: 15px
                height: 15px
              p
                flex: 1
                padding-left: 5px
                font-size: 15px
                line-height: 20px
                color: #ff5a41
          .btn-right
            width: auto
            height: 55px
            display: flex
            align-items: center
            .btn
              padding: 0 10px
              line-height: 26px
              font-size: 12px
              border-radius: 13px
              color: #ffffff
              background-color: #ff4040
        .item:last-child
          margin-bottom: 0
      .question-wrapper
        width: 100%
        height: auto
        display: flex
        align-items: center
        image
          display: block
          width: 14px
          height: 14px
        .text
          flex: 1
          padding-left: 10px
          font-size: 12px
          line-height: 35px
          color: #808080
    .exchange-state
      width: 100%
      height: auto
      font-size: 16px
      line-height: 45px
      text-align: center
      color: #fff
      background-color: #d5d5d5
    .rush-to-purchase-box
      width: 100%
      height: auto
      display: flex
      background-color: #fff
      .user-info
        flex: 1
        height: auto
        padding: 0 15px
        border-top: 1px solid #e8e8e8
        display: flex
        align-items: center
        image
          width: 30px
          height: 30px
          border-radius: 50%
          display: block
        p
          padding-left: 10px
          font-size: 13px
          color: #FF4040
      .btn
        width: auto
        height: auto
        padding: 0 20px
        line-height: 54px
        color: #fff
        background-color: #FF4040
    .back-tracking-wrapper
      position: relative
      width: 100%
      height: auto
      .text-bar
        width: 100%
        height: auto
        padding: 0 15px
        font-size: 13px
        line-height: 45px
        display: flex
        color: #999999
        background-color: #fff7e9
        box-sizing: border-box
        p
          padding: 0 5px
          color: #333333
      .trapezoid-box
        position: absolute
        right: 0
        bottom: 0
        width: auto
        padding: 0 10px
        line-height: 0
        font-size: 15px
        border-bottom: 45px solid #ff4540
        border-left: 25px solid transparent
        color: transparent
        p
          position: absolute
          left: 0
          top: 0
          width: 100%
          height: 100%
          text-align: center
          line-height: 45px
          color: #fff
      .hint-box
        position: absolute
        left: 25px
        top: -35px
        padding: 0 10px
        line-height: 23px
        font-size: 12px
        border-radius: 4px
        color: #ff4040
        background-color: #fad9d9
        .triangle
          position: absolute
          left: 25px
          bottom: -10px
          width: 0
          height: 0
          border-left: 5px solid transparent
          border-right: 5px solid transparent
          border-top: 10px solid #fad9d9
    .return-money-pop-up
      position: fixed
      left: 0
      top: 0
      width: 100%
      height: 100%
      display: flex
      align-items: center
      z-index: 70
      background-color: rgba(0, 0, 0, 0.8)
      .info-box
        margin: 0 auto
        width: 260px
        height: auto
        display: flex
        align-items: center
        flex-direction: column
        .info
          position: relative
          width: 260px
          height: 400px
          .img-bg
            position: absolute
            top: 0
            left: 0
            width: 100%
            height: 100%
          .content
            margin: 0 auto
            position: absolute
            top: 128px
            width: 100%
            height: auto
            text-align: center
            z-index: 20
            h1
              font-size: 34px
              color: #fff
              text-shadow: 2px 2px 2px rgba(250,86,48,1)
            ul
              margin: 16px 0 30px
              li
                margin-bottom: 10px
                font-size: 18px
                color: #fff
                span
                  padding: 0 8px
                  font-size: 25px
                  color: #fffc00
            .btn
              margin: 0 auto
              width: 184px
              height: 40px
              line-height: 40px
              font-size: 23px
              font-weight: bold
              text-align: center
              color: #ff1d33
              background-color: #ffcb00
              box-shadow: 0 3px 4px 0 rgba(255,29,51,0.8)
              border-radius: 15px
        .hint-box
          padding: 0 20px
          margin: 10px 0 15px
          display: flex
          box-sizing: border-box
          i
            width: 13px
            height: 13px
            image
              display: block
              width: 100%
              height: 100%
          .text
            padding-left: 4px
            flex: 1
            font-size: 10px
            line-height: 16px
            color: #fff
        .close
          width: 18px
          height: 18px
          image
            display: block
            width: 100%
            height: 100%
</style>
