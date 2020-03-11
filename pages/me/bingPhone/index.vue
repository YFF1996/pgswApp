<template>
  <div v-if="bingPhoneInfo && upyunUrl" class="bound-wrapper">
    <div v-if="bingPhoneInfo.status" class="change-box">
      <h3>当前绑定手机号</h3>
      <div class="change-info">
        <div class="left">
          <img :src="upyunUrl + '/wxXcxImg/images/phone-icon.png'" />
          <div class="text">
            <h4>手机号</h4>
            {{ bingPhoneInfo.mobile }}
          </div>
        </div>
        <div class="bound-btn">已绑定</div>
      </div>
    </div>
    <ul v-else>
      <li>
        <h3>手机号码</h3>
        <div class="right">
          <input type="number" v-model="telVal" placeholder="请输入您要绑定的手机号码" />
        </div>
      </li>
      <li>
        <h3>验证码</h3>
        <div class="right">
          <input type="text" v-model="codeVal" placeholder="请输入验证码" />
          <div class="get-code-num" v-if="sendStatus">{{ sec }}</div>
          <div class="get-code" v-else @click="onGetCodeFn()">{{ codeName }}</div>
        </div>
      </li>
    </ul>
    <div class="btn-box">
      <div class="bound-btn" @click="onBoundFn(true)">{{ bingPhoneInfo.status ? '更换手机号' : '确定' }}</div>
      <div class="bound-btn bound-btn-green" v-if="!bingPhoneInfo.status">
        <button open-type='getPhoneNumber' @getphonenumber="getPhoneNumber" />
        绑定微信手机号
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { upyunUrl } from '../../../api/config'

export default {
  data () {
    return {
      upyunUrl,
      telVal: '',
      codeVal: '',
      sTopTime: null,
      sendStatus: false,
      sec: 60,
      codeName: '获取验证码',
      sessionKey: '',
      needCode: 0
    }
  },
  onLoad () {
    this.getWxloginFn()
    clearInterval(this.sTopTime)
  },
  computed: {
    ...mapState([
      'userInfo',
      'bingPhoneInfo'
    ])
  },
  methods: {
    ...mapMutations({
      setBingPhoneInfo: 'SET_BING_PHONE_INFO'
    }),
    ...mapActions([
      'getWxlogin',
      'wxaes',
      'getCode',
      'bindingMobile'
    ]),
    // 获取用户的openID和sessionKey
    getWxloginFn () {
      const that = this
      uni.login({
        success: res => {
          const data = {
            that,
            code: res.code
          }
          that.getWxlogin(data).then((res) => {
            that.sessionKey = res.session_key
          })
        }
      })
    },
    // 获取用户的openID和sessionKey
    getPhoneNumber (e) {
      const data = {
        that: this,
        encryptedData: e.mp.detail.encryptedData,
        iv: e.mp.detail.iv,
        sessionKey: this.sessionKey
      }
      this.wxaes(data).then((res) => {
        if (res.ret === 1) {
          this.telVal = res.data.phoneNumber
          this.onBoundFn(false)
        }
      })
    },
    // 获取验证码
    onGetCodeFn () {
      const myreg = /^1\d{10}$/
      const telVal = this.telVal
      const data = {
        that: this,
        telVal,
        codeVal: ''
      }
      if (!myreg.test(telVal)) {
        this.showToastFn('手机号格式不正确!')
        return false
      }
      uni.showLoading({ title: 'Loading' })
      this.getCode(data).then((res) => {
        if (res.ret === 1) {
          this.computedCountDownFn()
          this.showToastFn(res.message)
        } else {
          this.showToastFn(res.message)
        }
      })
    },
    computedCountDownFn () {
      this.sendStatus = true
      this.sTopTime = setInterval(() => {
        if (this.sec > 0) {
          this.sec = this.sec - 1
        } else {
          this.sendStatus = false
          this.codeName = '重新获取'
          this.sec = 60
          clearInterval(this.sTopTime)
        }
      }, 1000)
    },
    // 绑定手机号码
    onBoundFn (isCode) {
      isCode ? this.needCode = 1 : this.needCode = 0

      if (isCode && this.bingPhoneInfo.status) {
        this.bingPhoneInfo.status = 0
      } else {
        const myreg = /^1\d{10}$/
        const telVal = this.telVal
        const codeVal = this.codeVal
        const data = {
          that: this,
          telVal,
          codeVal,
          type: this.needCode
        }
        if (isCode && !myreg.test(telVal)) {
          this.showToastFn('手机号格式不正确!')
          return false
        }
        if (isCode && !codeVal) {
          this.showToastFn('请填写验证码!')
          return false
        }
        uni.showLoading({ title: 'Loading' })
        this.bindingMobile(data).then((res) => {
          if (res.ret === 1) {
            this.setBingPhoneInfo({ status: 1, mobile: telVal })
            this.emptyDataFn()
          }
          this.showToastFn(res.message)
        })
      }
    },
    // 清空数据
    emptyDataFn () {
      this.telVal = ''
      this.codeVal = ''
      this.sendStatus = ''
      this.sec = 60
      this.codeName = '获取验证码'
    },
    showToastFn (title) {
      uni.showToast({
        title,
        icon: 'none',
        duration: 1500
      })
    }
  },
  onUnload () {
    this.emptyDataFn()
  }
}
</script>

<style lang="stylus" scoped>
  .bound-wrapper
    position: fixed
    left: 0
    top: 0
    right: 0
    bottom: 0
    width: 100%
    height: auto
    background-color: #f8f8f8
    .change-box
      margin: 7px 0 45px
      padding: 20px 18px 21px 15px
      box-sizing: border-box
      background-color: #fff
      h3
        margin-bottom: 16px
        font-size: 15px
        line-height: 15px
        color: #7a7979
      .change-info
        display: flex
        justify-content: space-between
        .left
          display: flex
          img
            width: 38px
            height: 38px
          .text
            display: 1
            padding-left: 13px
            height: 38px
            font-size: 12px
            line-height: 14px
            color: #959494
            h4
              margin-bottom: 10px
              font-size: 14px
              color: #151515
        .bound-btn
          width: 57px
          height: 26px
          font-size: 12px
          line-height: 26px
          text-align: center
          color: #666
          border-radius: 25px
          background-color: #f7f6fb
    ul
      margin: 7px 0 49px
      li
        width: 100%
        height: 70px
        padding: 0 15px
        margin-bottom: 1px
        display: flex
        box-sizing: border-box
        background-color: #fff
        h3
          width: 64px
          height: 100%
          padding-right: 28px
          line-height: 70px
          font-size: 16px
          color: #333
        .right
          flex: 1
          display: flex
          align-items: center
          input
            flex: 1
            height: 100%
            padding-right: 5px
            font-size: 14px
            color: #333
          .get-code, .get-code-num
            width: 90px
            height: 30px
            border-radius: 25px
            text-align: center
            font-size: 14px
            line-height: 30px
            color: #fff
            background-color: #ff4040
          .get-code-num
            color: #e1564f
            background-color: #fff
    .btn-box
      padding: 0 15px
      .bound-btn
        position: relative
        width: 100%
        height: 46px
        margin-bottom: 20px
        line-height: 46px
        font-size: 16px
        text-align: center
        color: #fff
        border-radius: 25px
        background-color: #ff4040
        button
          position: absolute
          left: 0
          top: 0
          width: 100%
          height: 100%
          opacity: 0
      .bound-btn-green
        background-color: rgb(43, 162, 69)
</style>
