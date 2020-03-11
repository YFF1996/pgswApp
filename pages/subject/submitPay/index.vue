<template>
  <div v-if="oJson && upyunUrl" class="buy-wrapper">
    <div class="buy-content">
      <div class="cover">
        <image mode="aspectFill" :src="oJson.cover" />
      </div>
      <div class="info">
        <div class="title">{{ oJson.title || oJson.name }}</div>
        <div class="price"><div class="icon">￥</div>{{ oJson.price }}</div>
      </div>
    </div>
    <div
      v-if="userInfo.account && userInfo.account.balance > 0"
      @click="onSelectBalanceFn()"
      class="buy-type"
    >
      <div class="left">账户余额</div>
      <div class="right">
        <div class="price">¥{{ userInfo.account.balance }}</div>
        <div class="icon">
          <image v-if="isBalance === 0" :src="upyunUrl + '/wxXcxImg/images/selected-icon.png'" />
          <image v-if="isBalance === 1" :src="upyunUrl + '/wxXcxImg/images/selected-icon-active.png'" />
        </div>
      </div>
    </div>
    <div class="buy-handle">
      <div class="info">
        <div class="item">
          <div class="text title">{{ oJson.buy_type === 'consulting' ? '咨询' : '课程' }}价格</div>
          <div class="text">¥{{ oJson.price }}</div>
        </div>
        <div
          v-if="isBalance === 1 && userInfo.account && userInfo.account.balance < oJson.price"
          class="item"
        >
          <div class="text title">支付金额</div>
          <div class="text">¥{{ userInfo.account.balance  }}</div>
        </div>
      </div>
      <div class="buy-btn">
        <div
          v-if="isBalance === 1 && userInfo.account.balance < oJson.price"
          class="text"
        >实支付：¥{{ spread }}</div>
        <div v-else class="text">实支付：¥{{ oJson.price }}</div>
        <div
          v-if="isBalance === 0 || (isBalance === 1 && userInfo.account.balance < oJson.price)"
          @click="getPayInfoFn()"
          class="btn"
        >微信支付</div>
        <div
          v-if="isBalance === 1 && (userInfo.account.balance) >= oJson.price"
          @click="onBalancePayFn()"
          class="btn"
        >余额支付</div>
      </div>
    </div>
    <!-- 自定义密码框 -->
    <div
      v-if="isCustomPasswordBox"
      @click="onClosePassWordFn(false)"
      class="custom-password-wrapper"
    >
      <div class="password-box">
        <div class="close-btn">
          <image :src="upyunUrl + '/wxXcxImg/images/close-btn.png'" />
        </div>
        <div class="title">请输入支付密码</div>
        <div class="password-content">
          <div class="price">¥{{ oJson.price }}</div>
          <div class="input-box">
            <div class="input-box-ul">
              <div
                v-for="(item, index) in pasLists"
                :class="{ 'active' : item.mark }"
                :key="index"
                class="item"
              >
                <div class="dot"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <input
        type="number"
        maxlength="6"
        v-model="passwordVal"
        :focus="focusState"
      >
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { upyunUrl } from '../../../api/config'

export default {
  data () {
    return {
      upyunUrl,
      oJson: '',
      isBalance: 0, // 是否使用余额支付 1是 - 0不是
      isCustomPasswordBox: false,
      payDeployInfo: '', // 支付配置信息'
      passwordVal: null,
      pasLists: [{ mark: false }, { mark: false }, { mark: false }, { mark: false }, { mark: false }, { mark: false }],
      focusState: false,
      spread: 0
    }
  },
  onLoad (options) {
    let oJson = JSON.parse(decodeURIComponent(options.oJson))
    oJson['price'] = parseFloat(oJson.price)
    this.oJson = oJson
    this.getUserInfoFn()
  },
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  methods: {
    ...mapActions([
      'getUserInfo',
      'isSetPayPassword',
      'getWXPaySubjectConsultInfo'
    ]),
    // 获取用户信息
    getUserInfoFn () {
      this.getUserInfo()
    },
    // 获取支付专题信息
    getPayInfoFn () {
      const data = {
        is_balance: this.isBalance,
        buy_type: this.oJson.buy_type,
        pay_password: this.passwordVal ? this.$md5(this.passwordVal) : 0,
        id: this.oJson.buy_type === 'consulting' ? this.oJson.au_id : this.oJson.id
      }
      uni.showLoading({ title: 'loading...' })
      this.getWXPaySubjectConsultInfo(data).then((res) => {
        if (res.ret === 1) {
          if (res.data.need_wxpay === 1) {
            this.payDeployInfo = res.data.order_info
            this.onWXPayFn()
          } else {
            this.showToastFn('支付成功')
            setTimeout(() => {
              uni.navigateBack()
            }, 2000)
          }
        } else {
          this.showToastFn(res.message)
        }
        this.onClosePassWordFn(false)
      })
    },
    // 微信支付
    onWXPayFn () {
      // const _this = this
      const data = this.payDeployInfo
      uni.requestPayment({
        provider: 'wxpay',
        orderInfo: data,
        success () {
          uni.navigateBack()
        },
        fail (err) {
          // _this.showModalFn(err.errMsg)
        }
      })
      uni.hideLoading()
    },
    // 选择余额支付
    onSelectBalanceFn () {
      this.isBalance ? this.isBalance = 0 : this.isBalance = 1
      this.spread = parseFloat(this.oJson.price - this.userInfo.account.balance).toFixed(2)
    },
    // 余额支付
    onBalancePayFn () {
      this.isSetPayPasswordFn()
    },
    // 唤起 - 隐藏自定义密码框
    onClosePassWordFn (state) {
      this.passwordVal = null
      this.isCustomPasswordBox = state
      this.pasLists.forEach((item) => { item['mark'] = false })
    },
    // 获取是否设置了支付密码
    isSetPayPasswordFn () {
      this.isSetPayPassword({ that: this }).then((res) => {
        if (res.is_set === 2) {
          this.focusState = true
          this.onClosePassWordFn(true)
        } else {
          this.onSkipPageFn('/pages/me/setPayPassword/index')
        }
        uni.hideLoading()
      })
    },
    // input输入时
    onAlterInputFn () {
      this.pasLists.forEach((item, index) => {
        if (index + 1 <= this.passwordVal.length) {
          item.mark = true
        } else {
          item.mark = false
        }
      })
      if (this.passwordVal.length >= 6) this.getPayInfoFn()
    },
    // input失去聚焦时
    onBlurFn () {
      this.focusState = false
      this.onClosePassWordFn(false)
    },
    onSkipPageFn (url) {
      uni.navigateTo({
        url
      })
    },
    showToastFn (title) {
      uni.showToast({
        title,
        icon: 'none',
        duration: 1500
      })
    },
    showModalFn (content) {
      uni.showModal({
        title: '支付失败,原因:',
        content
      })
    }
  },
  onUnload () {
    this.isBalance = 0
    this.focusState = false
    this.onClosePassWordFn(false)
  },
  watch: {
    passwordVal () {
      this.onAlterInputFn()
    }
  }
}
</script>
<style lang="stylus" scoped>
  .buy-wrapper
    position: fixed
    top: 0
    bottom: 0
    right: 0
    left: 0
    width: 100%
    height: 100%
    background: #f5f5f5
    .buy-content
      padding: 15px
      width: 100%
      height: auto
      display: flex
      box-sizing: border-box
      background-color: #fff
      .cover
        width: 76px
        height: 76px
        border-radius: 4px
        image
          width: 100%
          height: 100%
          border-radius: 4px
      .info
        position: relative
        flex: 1
        min-height: 76px
        padding-left: 15px
        color: #333
        .title
          width: 100%
          min-height: 20px
          line-height: 20px
          font-size: 14px
          display: -webkit-box
          -webkit-box-orient: vertical
          -webkit-line-clamp: 2
          overflow: hidden
        .price
          position: absolute
          bottom: 0
          font-size: 18px
          display: flex
          align-items: center
          .icon
            font-size: 15px
    .buy-type
      margin-top: 15px
      padding: 15px
      width: 100%
      height: auto
      display: flex
      align-items: center
      box-sizing: border-box
      font-size: 14px
      color: #333
      background-color: #fff
      .left
        flex: 1
      .right
        display: flex
        align-items: center
        .price
          padding-right: 12px
        .icon
          width: 20px
          height: 20px
          border-radius: 50%
          image
            display: block
            width: 100%
            height: 100%
            border-radius: 50%
    .buy-handle
      position: fixed
      bottom: 0
      width: 100%
      height: auto
      background-color: #fff
      .info
        padding: 15px 15px 0
        width: 100%
        height: auto
        box-sizing: border-box
        .item
          margin-bottom: 16px
          display: flex
          align-items: center
          .text
            font-size: 14px
            color: #ff4040
          .title
            flex: 1
            color: #333
      .buy-btn
        width: 100%
        height: 50px
        display: flex
        justify-content: space-around
        .text
          flex: 1
          height: auto
          padding-left: 15px
          line-height: 50px
          font-size: 15px
          color: #ff4040
          border-top: 1px solid #e6e6e6
        .btn
          width: 150px
          height: auto
          line-height: 50px
          font-size: 16px
          text-align: center
          color: #fff
          background-color: #ff4040
    .custom-password-wrapper
      position: fixed
      left: 0
      top: 0
      right: 0
      bottom: 0
      width: 100%
      height: 100%
      z-index: 999
      background-color: rgba(0, 0, 0, 0.5)
      box-sizing: border-box
      input
        position: absolute
        left: -9999999px
        bottom: 0
        width: 100px
        height: 10px
        margin-left: -50px
        z-index: 1
        opacity: 0
      .password-box
        position: fixed
        left: 50%
        bottom: 50px
        margin-left: -140px
        width: 280px
        height: 180px
        text-align: center
        display: flex
        align-items: center
        flex-direction: column
        border-radius: 4px
        z-index: 999
        background-color: #fff
        .title
          padding: 10px 0
          width: 100%
          height: auto
          font-size: 14px
          color: #000
          box-sizing: border-box
          border-bottom: 1px solid #d2d3d5
        .close-btn
          position: absolute
          right: 3px
          top: 3px
          padding: 5px
          box-sizing: border-box
          image
            display: block
            width: 11px
            height: 11px
        .password-content
          padding: 15px 20px
          box-sizing: border-box
          .price
            margin-bottom: 20px
            font-size: 25px
            color: #000
          .input-box
            width: 100%
            height: 35px
            border: 1px solid #d2d3d5
            border-radius: 5px
            .input-box-ul
              width: 100%
              height: auto
              display: flex
              .item
                width: 40px
                height: 35px
                border-right: 1px solid #d2d3d5
                display: flex
                justify-content: center
                align-items: center
                .dot
                  width: 8px
                  height: 8px
                  border-radius: 50%
                  background-color: transparent
                &:last-child
                  border: none
              .active
                .dot
                  background-color: #000
</style>
