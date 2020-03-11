<template>
  <div v-if="upyunUrl" class="login-page-wrapper">
    <div class="title">欢迎使用瓶盖思维</div>
    <div class="avatar">
      <image :src="upyunUrl + '/wxXcxImg/images/login-icon.png'" />
    </div>
    <div class="agreement">
      登录/注册视为同意<span class="content">瓶盖思维用户协议</span>
    </div>
    <div class="submit-btn" @click="onLoginFn()">
      同意
      <!--<button v-if="!userInfo" @getuserinfo="getUserInfo" open-type="getUserInfo" />-->
    </div>
    <div class="hint" @click="onSkipReturnFn()">我再想想</div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { upyunUrl } from '../../api/config'

export default {
  data () {
    return {
      upyunUrl
    }
  },
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  methods: {
    ...mapActions([
      'setUserInfo'
    ]),
    onLoginFn () {
      const _this = this
      uni.login({
        provider: 'weixin',
        success (res) {
          _this.setUserInfo(res)
        }
      })
    },
    getUserInfo (e) {
      this.setUserInfo(e)
    },
    onSkipLoginFn () {
      uni.navigateTo({
        url: `/pages/login/agreement/index`
      })
    },
    onSkipReturnFn () {
      if (this.show) {
        uni.navigateBack()
      } else {
        uni.switchTab({
          url: `/pages/index/index`
        })
      }
    }
  },
  props: {
    type: Boolean,
    show: false
  }
}
</script>

<style lang="stylus" scoped>
  .login-page-wrapper
    width: 100%
    height: auto
    text-align: center
    font-size: 13px
    .title
      margin-top: 40px
      width: 100%
      height: auto
      font-size: 24px
      font-weight: 600
      line-height: 27px
      color: #333
    .avatar
      margin: 65px auto 45px
      width: 281px
      height: 201px
      img
        width: 100%
        height: 100%
    .agreement
      color: #999
      .content
        color: #578df9
    .submit-btn
      position: relative
      margin: 33px auto 18px
      width: 275px
      height: 40px
      line-height: 40px
      color: #fff
      border-radius: 20px
      box-shadow: 0 10px 10px #efefef
      background-color: #ff6464
      button
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        opacity: 0
    .hint
      color: #6b6b6d
</style>
