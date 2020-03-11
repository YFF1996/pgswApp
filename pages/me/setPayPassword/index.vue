<template>
  <div v-if="isPayPassword" class="set-pay-password">
    <div class="schedule-wrapper">
      <div class="schedule-box">
        <div class="dot-box dot-active">1</div>
        <div class="line" :class="{'active' : isPayPassword ===2}"></div>
        <div class="dot-box" :class="{'dot-active' : isPayPassword ===2}">2</div>
      </div>
      <div v-if="isPayPassword === 1" class="schedule-text">
        <p>绑定手机号</p>
        <p>设置密码</p>
      </div>
      <div v-else class="schedule-text">
        <p>验证手机号</p>
        <p>重置密码</p>
      </div>
    </div>
    <div class="text-wrapper" v-if="!bingPhoneInfo.status">为了您的账号安全，请先绑定手机号</div>
    <div class="input-wrapper" v-if="bingPhoneInfo.status && isPayPassword === 1">
      <div class="input-box">
        <h3>输入密码</h3>
        <input type="number" maxlength="6" v-model="passwordVal" placeholder="请设置密码，至少为6位数">
      </div>
      <div class="input-box">
        <h3>确认密码</h3>
        <input type="number" maxlength="6" v-model="confirmPasswordVal" placeholder="请再次输入密码">
      </div>
    </div>
    <div v-if="bingPhoneInfo.status && isPayPassword === 2" class="input-wrapper">
      <div class="input-box">
        <h3>+86</h3>
        <input type="number" v-model="telVal" placeholder="请输入您的手机号码" />
      </div>
      <div class="input-box">
        <h3>验证码</h3>
        <input type="text" v-model="codeVal" placeholder="请输入验证码" />
        <div class="get-code-num" v-if="sendStatus">{{ sec }}</div>
        <div class="get-code" v-else @click="onGetPsdCodeFn()">{{ codeName }}</div>
      </div>
      <div class="input-box">
        <h3>输入新密码</h3>
        <input type="number" maxlength="6" v-model="newPasswordVal" placeholder="请设置新密码，至少为6位数">
      </div>
    </div>
    <div
      v-if="!bingPhoneInfo.status"
      @click="onSubmitDataFn()"
      class="btn-wrapper"
    >去绑定</div>
    <div
      v-if="bingPhoneInfo.status && isPayPassword === 1"
      @click="onSetEditPayPasswordFn('set')"
      class="btn-wrapper"
    >确认</div>
    <div
      v-if="bingPhoneInfo.status && isPayPassword === 2"
      @click="onGetPsdCodeVerifyFn()"
      class="btn-wrapper"
    >确认</div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

let sTopTime = null

export default {
  data () {
    return {
      isPayPassword: 1,
      passwordVal: null,
      confirmPasswordVal: null,
      newPasswordVal: null,
      telVal: '',
      codeVal: '',
      sendStatus: false,
      sec: 60,
      codeName: '获取验证码'
    }
  },
  onLoad () {
    this.isBindingMobileFn()
  },
  computed: {
    ...mapState([
      'bingPhoneInfo'
    ])
  },
  methods: {
    ...mapActions([
      'isBindingMobile',
      'isSetPayPassword',
      'onSetEditPayPassword',
      'getPsdCode',
      'getPsdCodeVerify'
    ]),
    // 获取是否绑定手机info
    isBindingMobileFn () {
      uni.showLoading({ title: 'Loading' })
      this.isBindingMobile({ that: this }).then(() => {
        this.isSetPayPasswordFn()
      })
    },
    // 获取是否设置了支付密码
    isSetPayPasswordFn () {
      this.isSetPayPassword({ that: this }).then((res) => {
        this.isPayPassword = res.is_set
        uni.hideLoading()
        if (res.is_set === 1) {
          uni.setNavigationBarTitle({
            title: '设置支付密码'
          })
        } else {
          uni.setNavigationBarTitle({
            title: '重置支付密码'
          })
        }
      })
    },
    // 设置- 修改支付密码
    onSetEditPayPasswordFn (type) {
      if (!this.passwordVal) {
        this.showToastFn('密码不能为空!')
        return false
      } else if (this.passwordVal.length !== 6) {
        this.showToastFn('请输入6位密码!')
        return false
      } else if (this.isPayPassword === 2 && !this.confirmPasswordVal) {
        this.showToastFn('新密码不能为空!')
        return false
      } else if (this.isPayPassword === 2 && this.confirmPasswordVal.length !== 6) {
        this.showToastFn('请输入6位新密码!')
        return false
      } else if (this.isPayPassword === 1 && this.passwordVal !== this.confirmPasswordVal) {
        this.showToastFn('两次密码不一致!')
        return false
      }
      const data = {
        type,
        that: this,
        password: this.$md5(this.passwordVal),
        confirm_password: this.$md5(this.confirmPasswordVal),
        old_password: this.$md5(this.passwordVal),
        new_password: this.$md5(this.confirmPasswordVal)
      }
      this.onSetEditPayPassword(data).then(() => {
        this.clearDataFn()
        setTimeout(() => {
          uni.navigateBack()
        }, 2000)
      })
    },
    // 获取验证码
    onGetPsdCodeFn () {
      clearInterval(sTopTime)
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
      this.getPsdCode(data).then(() => {
        this.computedCountDownFn()
      })
    },
    computedCountDownFn () {
      this.sendStatus = true
      sTopTime = setInterval(() => {
        if (this.sec > 0) {
          this.sec = this.sec - 1
        } else {
          this.sendStatus = false
          this.codeName = '重新获取'
          this.sec = 60
          clearInterval(sTopTime)
        }
      }, 1000)
    },
    // 确认修改密码
    onGetPsdCodeVerifyFn () {
      const myreg = /^1\d{10}$/
      const telVal = this.telVal
      const codeVal = this.codeVal
      if (!myreg.test(telVal)) {
        this.showToastFn('手机号格式不正确!')
        return false
      }
      if (!codeVal) {
        this.showToastFn('请填写验证码!')
        return false
      }
      if (!this.newPasswordVal) {
        this.showToastFn('请输入新密码')
        return false
      }
      if (this.newPasswordVal.length !== 6) {
        this.showToastFn('请输入6位新密码!')
        return false
      }
      const data = {
        that: this,
        telVal,
        codeVal,
        newPasswordVal: this.$md5(this.newPasswordVal)
      }
      uni.showLoading({ title: 'Loading' })
      this.getPsdCodeVerify(data).then(() => {
        this.emptyDataFn()
      })
    },
    // 清空数据
    emptyDataFn () {
      this.telVal = ''
      this.codeVal = ''
      this.sendStatus = ''
      this.newPasswordVal = ''
      this.sec = 60
      this.codeName = '获取验证码'
    },
    onSubmitDataFn () {
      uni.navigateTo({
        url: `/pages/me/bingPhone/index`
      })
    },
    clearDataFn () {
      this.passwordVal = null
      this.confirmPasswordVal = null
    },
    showToastFn (title) {
      uni.showToast({
        title,
        icon: 'none',
        duration: 2000
      })
    }
  },
  onUnload () {
    this.emptyDataFn()
  }
}
</script>

<style lang="stylus" scoped>
  .set-pay-password
    width: 100%
    height: auto
    padding: 25px 38px 0 38px
    box-sizing: border-box
    .schedule-wrapper
      width: 100%
      height: auto
      .schedule-box
        position: relative
        width: 100%
        height: auto
        padding: 0 65px
        display: flex
        justify-content: space-between
        box-sizing: border-box
        .dot-box
          width: 25px
          height: 25px
          border: 1px solid #999
          border-radius: 50%
          text-align: center
          line-height: 24px
          font-size: 14px
          color: #999999
          background-color: #f7f7f7
          box-sizing: border-box
        .dot-active
          color: #ff4040
          border-color: #ff4040
        .line
          position: absolute
          left: 90px
          top: 50%
          width: 120px
          height: 2px
          z-index: -1
          background-color: #e6e6e6
        .active
          background-color: #ff4040
      .schedule-text
        width: 100%
        height: auto
        display: flex
        p
          flex: 1
          line-height: 30px
          text-align: center
          font-size: 12px
          color: #666666
    .text-wrapper
      text-align: center
      line-height: 90px
      font-size: 12px
      color: #333333
    .input-wrapper
      width: 100%
      height: auto
      padding: 22px 0 40px 0
      .input-box
        width: 100%
        height: auto
        margin-bottom: 22px
        display: flex
        border-bottom: 1px solid #e6e6e6
        h3
          font-size: 14px
          line-height: 30px
          color: #333333
        input
          flex: 1
          height: 30px
          padding: 0 25px
          font-size: 14px
          box-sizing: border-box
        .get-code, .get-code-num
          line-height: 30px
          font-size: 14px
          color: #ff4040
      .input-box:last-child
        margin-bottom: 0
    .btn-wrapper
      width: 100%
      height: auto
      line-height: 45px
      text-align: center
      border-radius: 4px
      font-size: 15px
      color: #fff
      background-color: #ff4040
</style>
