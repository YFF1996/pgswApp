<template>
  <div v-if="upyunUrl" class="feedback-wrapper">
    <div class="edit-box">
      <textarea
        v-model="textareaVal"
        placeholder="请输入反馈内容..."
        placeholder-class="placeholder"
      />
    </div>
    <ul class="pic-box">
      <li
        v-if="images.length"
        v-for="(url, index) in images"
        :key="index"
      >
        <div class="avatar">
          <img mode="aspectFill" :src="url" />
        </div>
        <div class="close-box">
          <div class="close" @click="onCloseImgFn(index)">
            <img :src="upyunUrl + '/wxXcxImg/images/pic-close.png'" />
          </div>
        </div>
      </li>
      <li
        v-if="images.length < 3"
        @click="onChooseImageFn()"
        class="up-btn"
      >
        <div class="avatar">
          <img :src="upyunUrl + '/wxXcxImg/images/pic-add.png'" />
        </div>
      </li>
    </ul>
    <div class="contact-box">
      <p class="title">联系方式</p>
      <input
        class="text"
        v-model="telVal"
        cursor-spacing="10"
        maxlength="30"
        placeholder="请输入QQ号、邮箱或手机号（选填）"
      />
    </div>
    <div
      v-if="textareaVal"
      @click="onSubmitFn()"
      class="submit-box submit-box-active"
    >提交</div>
    <div class="submit-box" v-else>提交</div>
    <div class="history">
      <span @click="onSkipPageFn(`/pages/me/feedback/feedbackList/index`)">反馈历史</span>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { apiUrl, upyunUrl } from '../../../api/config'
import Upyun from '../../../utils/upyun-wxapp-sdk'

const upyun = new Upyun({
  bucket: 'pgsw-flow',
  operator: 'ftpuser',
  getSignatureUrl: `${apiUrl}/msg/get_upyun_sign.php`
})

export default {
  data () {
    return {
      upyunUrl,
      textareaVal: '',
      images: [],
      telVal: '',
      initialStatus: false
    }
  },
  onLoad () {
    this.initialStatus = false
  },
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  methods: {
    ...mapActions([
      'addFeedback'
    ]),
    // 选择上传图片
    onChooseImageFn () {
      const _this = this
      uni.chooseImage({
        count: 3,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success (res) {
          const tempFilePaths = res.tempFilePaths
          tempFilePaths.forEach((url) => {
            _this.upyunUploadFn(url)
          })
        }
      })
    },
    // 通过又拍云转网络图片url
    upyunUploadFn (localPath) {
      const _this = this
      _this.showToastIconFn()
      upyun.upload({
        localPath,
        remotePath: '/Pic-x/{year}-{mon}-{day}/{filemd5}{.suffix}',
        success (res) {
          const oJson = JSON.parse(res.data)
          _this.hideToastIconFn()
          if (_this.images.length < 3) {
            _this.images.push(upyunUrl + oJson.url)
          } else {
            _this.showToastFn('亲，最多只能上传3张图片哦!')
          }
        }
      })
    },
    // 移除反馈图片
    onCloseImgFn (index) {
      this.images.splice(index, 1)
    },
    // 提交
    onSubmitFn () {
      if (this.initialStatus) return false
      const images = this.images
      let picUrl = ''
      picUrl = images.join(',')
      const data = {
        that: this,
        textareaVal: this.textareaVal,
        picUrl,
        telVal: this.telVal
      }
      uni.showLoading({ title: 'Loading' })
      this.initialStatus = true
      this.addFeedback(data).then((res) => {
        this.showToastFn(res.message)
        if (res.ret === 1) {
          this.textareaVal = ''
          this.images = []
          this.telVal = ''
          this.initialStatus = false
        }
      })
    },
    // 跳转反馈历史页面
    onSkipPageFn (url) {
      uni.navigateTo({
        url
      })
    },
    showToastFn (title) {
      uni.showToast({
        title,
        icon: 'none',
        duration: 2000
      })
    },
    showToastIconFn () {
      uni.showToast({
        icon: 'loading',
        duration: 2000
      })
    },
    hideToastIconFn () {
      uni.hideToast()
    }
  }
}
</script>

<style lang="stylus" scoped>
  .feedback-wrapper
    padding: 0 15px
    width: 100%
    height: auto
    box-sizing: border-box
    .edit-box
      margin: 20px 0
      textarea
        width: 100%
        font-size: 14px
    .pic-box
      width: 100%
      height: auto
      overflow: hidden
      padding-bottom: 30px
      border-bottom: 1px solid #eaeaed
      li
        position: relative
        width: 110px
        height: 110px
        margin-right: 6px
        float: left
        .avatar
          width: 100%
          height: 110px
          img
            width: 100%
            height: 100%
        .close-box
          position: absolute
          top: 0
          right: 0
          width: 100%
          height: 20px
          background: linear-gradient(180deg, rgba(204,204,204,0.6) 0%, rgba(102,102,102,0.34) 47%, rgba(255,255,255,0) 100%)
          .close
            float: right
            padding: 5px
            width: 12px
            height: 12px
            img
              display: block
              width: 100%
              height: 100%
      li:last-child
        margin-right: 0
    .contact-box
      display: flex
      width: 100%
      height: 43px
      line-height: 43px
      align-items: center
      font-size: 14px
      border-bottom: 1px solid #eaeaed
      .title
        padding-right: 20px
        color: #000
        box-sizing: border-box
      .text
        flex: 1
    .submit-box
      margin: 50px 0 25px
      width: 100%
      height: 40px
      text-align: center
      line-height: 40px
      font-size: 14px
      border-radius: 22px
      box-shadow: 0 10px 10px #efefef
      color: #999
      background-color: #f8f8f8
    .submit-box-active
      color: #fff
      background-color: rgb(255, 100, 100)
    .history
      width: 100%
      height: auto
      text-align: right
      text-decoration: underline
      font-size: 14px
      color: #999
      span
        padding: 10px 15px 10px 10px

</style>
