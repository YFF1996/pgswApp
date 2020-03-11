<template>
    <div v-if="upyunUrl" class="login-page-wrapper">
      <div class="avatar">
        <img :src="upyunUrl + '/wxXcxImg/images/login-bg.png'" />
      </div>
      <div class="submit-btn">
        立即登录
        <button v-if="!userInfo" @getuserinfo="getUserInfo" open-type="getUserInfo"></button>
      </div>
      <div class="agreement">
        登录即表示您同意<span class="content" @click="onSkipLoginFn()">《瓶盖思维用户协议》</span>
      </div>
    </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
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
    ...mapMutations({
      setGetCoursePopupState: 'SET_GET_COURSE_POPUP_STATE'
    }),
    ...mapActions([
      'setUserInfo'
    ]),
    getUserInfo (e) {
      this.setUserInfo({ e, that: this }).then(() => {
        this.setGetCoursePopupState(true)
        uni.switchTab({ url: '/pages/subjectGoods/index' })
      })
    },
    onSkipLoginFn () {
      uni.navigateTo({
        url: `/pages/agreementPage/index`
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  .login-page-wrapper
    position: fixed
    left: 0
    top: 0
    right: 0
    bottom: 0
    width: 100%
    height: 100%
    text-align: center
    z-index: 1000
    background-color: #fff
    .avatar
      margin: 88px auto 128px
      width: 187px
      height: 148px
      img
        width: 100%
        height: 100%
    .agreement
      font-size: 12px
      color: #999
      .content
        color: #ff4343
    .submit-btn
      position: relative
      margin: 0 auto 23px
      width: 280px
      height: 44px
      line-height: 44px
      font-size: 16px
      color: #fff
      border-radius: 20px
      background-color: #ff4343
      button
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        opacity: 0
</style>
