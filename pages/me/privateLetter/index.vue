<template>
  <div
    v-if="upyunUrl"
    @click="onCancelOperateFn()"
    class="private-letter-wrapper"
  >
    <div
      @click="onCancelOperateFn()"
      class="bg-color"
    ></div>
    <div class="tab-nav-bar">
      <ul>
        <li class="active">
          <p v-if="noReadCount">{{ noReadCount }}</p>
          私信
          <div class="line"></div>
        </li>
        <li @click="onSetReadMessageFn()">
          标记已读
          <div class="line"></div>
        </li>
      </ul>
    </div>
    <div class="private-letter-wrapper">
      <ul v-if="messageFromUserList.length">
        <li
          v-for="(item, index) in messageFromUserList"
          @longpress="onLongpressFn(index)"
          @click="onSkipLecturerDialoguePageFn(item)"
          :key="index"
        >
          <div v-if="item.fromUser" class="avatar">
            <div v-if="!item.status" class="mark"></div>
            <img :src="item.fromUser.avatarurl" />
          </div>
          <div v-if="item.fromUser" class="text-box">
            <h3>{{ item.fromUser.nickname }}</h3>
            <p>{{ item.content }}</p>
          </div>
          <div class="time">{{ item.ctime }}</div>
          <div v-if="item.operateState" class="operate-box">
            <div class="operate-ul">
              <div
                @click.stop="onRemoveFromUserFn(item, index, true)"
                class="operate-li"
              >
                <div class="icon">
                  <img :src="upyunUrl + '/wxXcxImg/images/private-letter-icon1.png'" />
                </div>
                <h3>清除聊天记录</h3>
              </div>
              <div
                @click.stop="onRemoveFromUserFn(item, index, false)"
                class="operate-li"
              >
                <div class="icon">
                  <img :src="upyunUrl + '/wxXcxImg/images/private-letter-icon2.png'" />
                </div>
                <h3>移除会话聊天</h3>
              </div>
              <div
                v-if="item.from_auid"
                @click.stop="onSkipPageFn(`/pages/subject/lectureHome/index?id=${item.from_auid}`)"
                class="operate-li"
              >
                <div class="icon">
                  <img :src="upyunUrl + '/wxXcxImg/images/private-letter-icon3.png'" />
                </div>
                <h3>查看讲师主页</h3>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <!-- 上拉加载更多loading -->
      <loading-more :lists="messageFromUserList" :listsLength="16" />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { upyunUrl } from '../../../api/config'
import LoadingMore from '../../../components/loadingMoreTemplate'

export default {
  data () {
    return {
      upyunUrl,
      page: 1,
      noReadCount: 0,
      submitState: true
    }
  },
  onLoad () {
    this.getNoReadCountFn()
    this.getFromUserLisFn(true)
  },
  // 下拉刷新
  onPullDownRefresh () {
    this.page = 1
    this.getNoReadCountFn()
    this.getFromUserLisFn(true)
  },
  // 上拉加载
  onReachBottom () {
    this.page = this.page + 1
    this.getFromUserLisFn(false)
  },
  computed: {
    ...mapState([
      'userInfo',
      'messageFromUserList'
    ])
  },
  methods: {
    ...mapMutations({
      setIsDataState: 'SET_IS_DATA_STATE',
      setMessageFromUserList: 'SET_MESSAGE_FROM_USER_LIST'
    }),
    ...mapActions([
      'getNoReadCount',
      'getFromUserLis',
      'setReadMessage',
      'removeFromUser'
    ]),
    // 获取未读总数
    getNoReadCountFn () {
      this.getNoReadCount({ that: this }).then((res) => {
        this.noReadCount = res
      })
    },
    // 获取发送人私信列表
    getFromUserLisFn (isLoading) {
      if (isLoading) {
        this.setMessageFromUserList([])
        uni.showLoading({ title: 'Loading' })
      }
      this.getFromUserLis({ that: this, page: this.page }).then(() => {
        this.submitState = true
        uni.stopPullDownRefresh()
        uni.hideLoading()
      })
    },
    // 标记私信全部成已读
    onSetReadMessageFn () {
      this.noReadCount = 0
      uni.showLoading({ title: '标记中...' })
      if (this.submitState) {
        this.submitState = false
        this.setReadMessage({ that: this }).then(() => {
          this.getFromUserLisFn(true)
        })
      }
    },
    // 长按内容content
    onLongpressFn (index) {
      this.messageFromUserList.forEach((item, i) => {
        index === i ? item['operateState'] = true : item['operateState'] = false
      })
    },
    // 取消操作
    onCancelOperateFn () {
      this.messageFromUserList.forEach((item) => { item.operateState = false })
    },
    // 清除聊天记录 - 移除会话
    onRemoveFromUserFn (item, index, state) {
      this.getNoReadCountFn()
      this.messageFromUserList.splice(index, 1)
      if (!this.messageFromUserList.length) this.setIsDataState(true)
      this.removeFromUser({ that: this, id: item.fromUser.user_id, state })
    },
    // 跳转页面
    onSkipPageFn (url) {
      uni.navigateTo({
        url
      })
    },
    onSkipLecturerDialoguePageFn (item) {
      uni.navigateTo({
        url: `/pages/subject/lectureHome/lecturerDialogue/index?oJson=${encodeURIComponent(JSON.stringify(item))}`
      })
    }
  },
  components: {
    LoadingMore
  }
}
</script>

<style lang="stylus" scoped>
  .private-letter-wrapper
    width: 100%
    height: auto
    .tab-nav-bar
      position: fixed
      left: 0
      top: 0
      width: 100%
      height: auto
      z-index: 999
      background-color: #fff
      ul
        width: 100%
        height: 44px
        padding: 0 75px
        display: flex
        justify-content: space-between
        box-sizing: border-box
        li
          position: relative
          width: auto
          height: auto
          font-size: 15px
          line-height: 44px
          color: #999
          &.active
            color: #000
            .line
              position: absolute
              left: 50%
              bottom: 3px
              width: 26px
              height: 2px
              margin-left: -13px
              border-radius: 1px
              display: block
              background-color: #ff4040
          p
            position: absolute
            right: -5px
            top: 12px
            width: 10px
            height: 10px
            font-size: 8px
            text-align: center
            line-height: 10px
            border-radius: 50%
            border: 2px solid #fff
            color: #fff
            background-color: #ff4040
          .line
            display: none
    .private-letter-wrapper
      width: 100%
      height: auto
      padding-top: 54px
      ul
        width: 100%
        height: auto
        li
          position: relative
          width: 100%
          height: auto
          padding: 15px
          margin-bottom: 10px
          display: flex
          background-color: #fff
          box-sizing: border-box
          .avatar
            position: relative
            width: 38px
            height: 38px
            border-radius: 50%
            background-color: #ccc
            img
              width: 100%
              height: 100%
              border-radius: 50%
            .mark
              position: absolute
              right: 0
              top: 0
              width: 5px
              height: 5px
              border-radius: 50%
              background-color: #ff7979
          .text-box
            flex: 1
            height: auto
            padding: 0 15px
            h3, p
              width: 100%
              height: auto
              line-height: 16px
              font-size: 14px
              color: #333
            p
              margin-top: 6px
              color: #999
          .time
            width: auto
            height: auto
            font-size: 12px
            color: #999999
          .operate-box
            position: absolute
            left: 15px
            top: 62px
            width: auto
            height: auto
            padding: 15px
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
              left: 12px
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
              left: 11px
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
        li:last-child
          margin-bottom: 0
</style>
