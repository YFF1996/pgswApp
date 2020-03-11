<template>
  <div class="details-wrapper" :style="{bottom: feedbackDetails.is_end ? 0 : 40 + 'px'}">
    <scroll-view class="scroll-view" :scroll-y="true">
      <div class="details-content">
        <div class="text-box">
          <div class="time">提交时间：{{ feedbackDetails.ctime }}</div>
          <div class="problem-show">
            <div class="title">问题描述：</div>
            <div class="info">{{ feedbackDetails.content }}</div>
          </div>
          <div class="avatar-box" v-if="feedbackDetails.pic_url.length">
            <div class="title">图片附件：</div>
            <ul class="avatar-list">
              <li
                v-for="(item, index) in feedbackDetails.pic_url"
                :key="index"
              >
                <div class="avatar">
                  <img mode="aspectFill" :src="item" @click="onPreviewImageFn(feedbackDetails.pic_url, item)" />
                </div>
              </li>
            </ul>
          </div>
        </div>
        <feedback-chat :lists="feedbackDetails.reply"></feedback-chat>
      </div>
    </scroll-view>
    <div class="reply-box" v-if="!feedbackDetails.is_end">
      <input class="text" v-model="inputVal" cursor-spacing="10" placeholder="回复" />
      <span v-if="inputVal" class="send send-active" @click="onSubmitFn()">发送</span>
      <span v-else class="send">发送</span>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { queryString } from '../../../../../utils/getQueryString'
import FeedbackChat from '../../../../../components/feedbackChatTemplate'

export default {
  data () {
    return {
      id: 0,
      inputVal: ''
    }
  },
  onLoad (options) {
    if (options.id) {
      this.id = options.id
    } else {
      let scene = decodeURIComponent(options.scene)
      this.id = queryString(scene, 'id')
    }
  },
  onReady () {
    this.getFeedbackDetailsFn()
  },
  computed: {
    ...mapState([
      'userInfo',
      'feedbackDetails'
    ])
  },
  methods: {
    ...mapActions([
      'getFeedbackDetails',
      'addFeedbackReply'
    ]),
    getQueryString (url, name) {
      let reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i')
      let r = url.substr(1).match(reg)
      if (r !== null) {
        return r[2]
      }
      return null
    },
    // 获取反馈详情
    getFeedbackDetailsFn () {
      const data = {
        that: this,
        id: this.id
      }
      this.getFeedbackDetails(data)
    },
    // 提交
    onSubmitFn () {
      const data = {
        that: this,
        inputVal: this.inputVal,
        id: this.id
      }
      this.addFeedbackReply(data).then((res) => {
        this.showToastFn(res.message)
        if (res.ret === 1) {
          this.feedbackDetails.reply.push({ content: this.inputVal, is_user: 1 })
          this.inputVal = ''
        }
      })
    },
    // 预览图片
    onPreviewImageFn (arr, url) {
      uni.previewImage({
        current: url,
        urls: arr
      })
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
    this.inputVal = ''
  },
  components: {
    FeedbackChat
  }
}
</script>

<style lang="stylus" scoped>
  .details-wrapper
    position: fixed
    left: 0
    top: 0
    right: 0
    bottom: 0
    width: 100%
    height: auto
    background: #f8f8f8
    &.details-wrapper::-webkit-scrollbar
      display: none
    .scroll-view
      position: fixed
      left: 0
      top: 0
      right: 0
      bottom: 0
      width: 100%
      height: auto
      z-index: 5
      .details-content
        padding: 15px 15px 60px 15px
        box-sizing: border-box
        width: 100%
        height: auto
        .text-box
          padding-bottom: 25px
          border-bottom: 1px solid #ddd
          font-size: 14px
          color: #666
          .time
          .problem-show
            margin: 20px 0
            display: flex
            .info
              flex: 1
          .avatar-box
            .title
              margin-bottom: 20px
            .avatar-list
              display: flex
              justify-content: flex-start
              li
                margin-right: 6px
                width: 110px
                height: 110px
                &:last-child
                  margin-right: 0
                .avatar
                  width: 100%
                  height: 110px
                  border-radius: 10px
                  img
                    width: 100%
                    height: 100%
                    border-radius: 10px
    .reply-box
      position: fixed
      left: 0
      bottom: 0
      z-index: 999
      width: 100%
      height: 50px
      display: flex
      align-items: center
      justify-content: space-between
      padding: 0 11px 0 15px
      box-sizing: border-box
      font-size: 14px
      background: #fff
      .text
        padding: 0 5px 0 12px
        width: 300px
        height: 30px
        line-height: 30px
        border: 1px solid #ccc
        border-radius: 15px
        box-sizing: border-box
      .send
        padding: 4px
        color: #999
      .send-active
        color: #ff6464
    ::-webkit-scrollbar
      width: 0
      height: 0
      color: transparent
</style>
