<template>
  <div
    v-if="upyunUrl"
    @click="onCancelOperateFn()"
    class="lecturer-dialogue-wrapper"
  >
    <div
      @click="onCancelOperateFn()"
      class="page-bg"
    ></div>
    <div class="lecturer-dialogue-content">
      <ul v-if="messageReadList.length">
        <li
          v-for="(item, index) in messageReadList"
          :class="item.type === 2 ? 'left' : 'right'"
          @longpress="onLongpressFn(index)"
          :key="index"
        >
          <div
            v-if="item.fromUser"
            @click="onSkipPageFn(`/pages/subject/lectureHome/index?id=&uid=${item.fromUser.user_id}`, item)"
            class="avatar"
          >
            <img :src="item.fromUser.avatarurl" />
          </div>
          <div class="dialogue-box">
            <div class="time">{{ item.ctime }}</div>
            <div class="content">
              {{ item.content }}
              <div v-if="item.operateState" class="operate-box">
                <div class="operate-ul">
                  <div
                    @click="onCopyTextFn(item.content, index)"
                    class="operate-li"
                  >
                    <div class="icon">
                      <img :src="upyunUrl + '/wxXcxImg/images/private-letter-icon4.png'" />
                    </div>
                    <h3>复制</h3>
                  </div>
                  <div
                    @click="onDeleteTextFn(item, index)"
                    class="operate-li"
                  >
                    <div class="icon">
                      <img :src="upyunUrl + '/wxXcxImg/images/private-letter-icon2.png'" />
                    </div>
                    <h3>删除</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="clear"></div>
        </li>
      </ul>
      <div v-else class="no-data-text">现在开始聊天</div>
    </div>
    <!-- 回复输入框 -->
    <div class="reply-box" :style="{bottom: keyBoardHeight}">
      <div class="input-box">
        <input
          v-model="inputVal"
          @focus="testFocus"
          @blur="onBlurFn"
          @confirm="onEnterFn"
          :adjust-position="false"
          placeholder="请输入内容..."
          cursor-spacing="10"
          placeholder-style="color: #999;"
        />
      </div>
      <div
        v-if="inputVal"
        @click="onEnterFn()"
        class="reply-btn reply-btn-active"
      >
        <img :src="upyunUrl + '/wxXcxImg/images/lecturer-return-icon.png'" />
      </div>
      <div
        v-else
        class="reply-btn"
      >
        <img :src="upyunUrl + '/wxXcxImg/images/lecturer-return-icon.png'" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { upyunUrl } from '../../../../api/config'

export default {
  data () {
    return {
      upyunUrl,
      page: 1,
      oJson: '',
      inputVal: '',
      keyBoardHeight: 0,
      submitState: true
    }
  },
  onLoad (options) {
    this.page = 1
    this.oJson = JSON.parse(decodeURIComponent(options.oJson))
    uni.setNavigationBarTitle({
      title: this.oJson.nick_name || this.oJson.fromUser.nickname
    })
    this.onGetMessageReadListFn(true)
    this.markerMessageReadFn()
  },
  onPageScroll (e) {
    if (e.scrollTop === 0) {
      this.page = this.page + 1
      this.onGetMessageReadListFn(false)
    }
  },
  computed: {
    ...mapState([
      'messageReadList'
    ])
  },
  methods: {
    ...mapMutations({
      setIsDataState: 'SET_IS_DATA_STATE',
      setMessageReadList: 'SET_MESSAGE_READ_LIST'
    }),
    ...mapActions([
      'getMessageReadList',
      'markerMessageRead',
      'deleteOneRecord',
      'onSendMessage'
    ]),
    // 获取私信列表
    onGetMessageReadListFn (isLoading) {
      const data = {
        that: this,
        id: this.oJson.uid || this.oJson.fromUser.user_id,
        page: this.page
      }
      if (isLoading) {
        this.setMessageReadList([])
        uni.showLoading({ title: 'Loading' })
      }
      this.getMessageReadList(data).then(() => {
        if (isLoading) this.pageScrollBottomFn()
        uni.hideLoading()
      })
    },
    // 批量标记已读私信
    markerMessageReadFn () {
      this.markerMessageRead({ id: this.oJson.uid || this.oJson.fromUser.user_id })
    },
    // 长按内容content
    onLongpressFn (index) {
      this.messageReadList.forEach((item, i) => {
        index === i ? item['operateState'] = true : item['operateState'] = false
      })
    },
    // 复制文本
    onCopyTextFn (text, index) {
      const that = this
      uni.setClipboardData({
        data: text,
        success () {
          that.messageReadList[index].operateState = false
          uni.showToast({
            title: '复制成功'
          })
        }
      })
    },
    // 删除文本
    onDeleteTextFn (item, index) {
      this.messageReadList.splice(index, 1)
      if (!this.messageReadList.length) this.setIsDataState(true)
      this.deleteOneRecord({ that: this, item })
    },
    // input聚焦时
    testFocus (e) {
      this.keyBoardHeight = e.mp.detail.height + 'px'
    },
    // input失去焦点时
    onBlurFn () {
      this.keyBoardHeight = 0
    },
    // input回车发送
    onEnterFn () {
      if (this.inputVal && this.submitState) {
        const data = {
          that: this,
          id: this.oJson.user_name || this.oJson.fromUser.user_name,
          content: this.inputVal
        }
        uni.showLoading({ title: '发送中...' })
        this.submitState = false
        this.onSendMessage(data).then((res) => {
          if (res.code === 200) {
            res.data.forEach((item) => {
              this.messageReadList.push(item)
            })
            this.pageScrollBottomFn()
            this.inputVal = ''
            uni.hideLoading()
          }
          this.submitState = true
        })
      } else {
        this.showToastFn('内容不能为空!')
      }
    },
    // 取消操作
    onCancelOperateFn () {
      this.messageReadList.forEach((item) => { item.operateState = false })
    },
    // page滚动到底部
    pageScrollBottomFn () {
      uni.createSelectorQuery().select('.lecturer-dialogue-wrapper').boundingClientRect((rect) => {
        if (rect) {
          uni.pageScrollTo({
            duration: 0,
            scrollTop: rect.height
          })
        }
      }).exec()
    },
    // 跳转页面
    onSkipPageFn (url, item) {
      if (item.type === 2) {
        uni.navigateTo({
          url
        })
      }
    },
    showToastFn (title) {
      uni.showToast({
        title,
        icon: 'none',
        duration: 2000
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  .lecturer-dialogue-wrapper
    width: 100%
    height: auto
    border-top: 1px solid #f2f2f2
    .page-bg
      position: fixed
      left: 0
      top: 0
      width: 100%
      height: 100%
      z-index: -1
    .lecturer-dialogue-content
      width: 100%
      height: auto
      padding: 15px 15px 55px 15px
      box-sizing: border-box
      ul
        width: 100%
        height: auto
        li
          width: 100%
          height: auto
          padding-bottom: 25px
          .avatar
            float: left
            width: 47px
            height: 47px
            background-color: #ccc
            border-radius: 50%
            img
              width: 100%
              height: 100%
              border-radius: 50%
          .dialogue-box
            float: left
            width: 280px
            height: auto
            padding: 10px 0 0 15px
            .time
              padding-bottom: 5px
              line-height: 12px
              font-size: 12px
              color: #999
            .content
              position: relative
              display: inline-block
              width: auto
              padding: 5px 15px
              font-size: 13px
              line-height: 23px
              border-radius: 5px
              color: #fff
              background-color: #ff4040
              .operate-box
                position: absolute
                bottom: -70px
                width: 76px
                height: auto
                padding: 10px 15px
                border-radius: 3px
                border: 1px solid #e6e6e6
                background-color: #fff
                box-sizing: border-box
                z-index: 997
                &.operate-box:before
                  box-sizing: content-box
                  width: 0
                  height: 0
                  position: absolute
                  top: -11px
                  padding:0
                  border-bottom: 6px solid #FFFFFF
                  border-top: 6px solid transparent
                  border-left: 6px solid transparent
                  border-right: 6px solid transparent
                  display: block
                  content: ''
                  z-index: 999
                &.operate-box:after
                  box-sizing: content-box
                  width: 0
                  height: 0
                  position: absolute
                  top: -13px
                  padding: 0
                  border-bottom: 7px solid #e6e6e6
                  border-top: 7px solid transparent
                  border-left: 7px solid transparent
                  border-right: 7px solid transparent
                  display: block
                  content: ''
                  z-index: 998
                .operate-ul
                  width: auto
                  height: auto
                  .operate-li
                    width: auto
                    height: auto
                    padding-bottom: 15px
                    display: flex
                    .icon
                      width: 12px
                      height: 12px
                      img
                        width: 100%
                        height: 100%
                        display: block
                    h3
                      padding-left: 8px
                      font-size: 12px
                      line-height: 12px
                      color: #333333
                  .operate-li:last-child
                    padding-bottom: 0
          .clear
            clear: both
        .left
          .dialogue-box
            .content
              .operate-box
                left: 0
                &.operate-box:before
                  left: 12px
                &.operate-box:after
                  left: 11px
        .right
          .avatar
            float: right
          .dialogue-box
            float: right
            padding: 10px 15px 0 0
            .time
              text-align: right
            .content
              float: right
              color: #333
              background-color: #edf0f2
              .operate-box
                right: 0
                &.operate-box:before
                  right: 12px
                &.operate-box:after
                  right: 11px
      .no-data-text
        text-align: center
        line-height: 100px
        font-size: 24px
        font-weight: bold
        color: #ccc
    .reply-box
      position: fixed
      left: 0
      width: 100%
      height: 55px
      padding: 0 15px
      border-top: 1px solid #e6e6e6
      display: flex
      align-items: center
      justify-content: space-between
      z-index: 999
      background: #fff
      box-sizing: border-box
      .input-box
        flex: 1
        height: 33px
        padding: 0 15px
        margin-right: 15px
        border-radius: 16px
        display: flex
        align-items: center
        background-color: #f5f5f5
        box-sizing: border-box
        input
          flex: 1
          height: 100%
          font-size: 14px
          color: #333
      .reply-btn
        width: 33px
        height: 33px
        border-radius: 50%
        display: flex
        justify-content: center
        align-items: center
        background-color: #ccc
        img
          display: block
          width: 16px
          height: 16px
      .reply-btn-active
        background-color: #ff4040
</style>
