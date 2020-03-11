<template>
  <div
    v-if="upyunUrl"
    class="comment-list-wrapper"
  >
    <div
      v-if="lists.length"
      class="comment-list-ul"
    >
      <div
        v-for="(item, index) in lists"
        @longpress="handleLongPress(item, index)"
        :key="index"
        class="item"
      >
        <div class="user-info">
          <div class="avatar">
            <image mode="aspectFill" :src="item.user.avatarurl" />
          </div>
          <div class="content">
            <div class="top-box">
              <div class="title-box">
                <div class="name">{{ item.user.nickname }}</div>
                <div class="mark" v-if="item.user.is_author">作者</div>
              </div>
              <div class="like-box" @click="onLikeFn(item.id, item.is_like, index, null, 'commentType')">
                <image
                  :src="upyunUrl + '/wxXcxImg/images/index-like-active.png'"
                  v-if="item.is_like"
                />
                <image
                  :src="upyunUrl + '/wxXcxImg/images/comment-default-like-icon.png'"
                  v-else
                />
                <div v-if="item.is_like" class="num active">{{ item.like_total }}</div>
                <div v-else class="num">{{ item.like_total }}</div>
              </div>
            </div>
            <div class="date-text" @click="onReplyUserFn(item.id, '', item.user.nickname, index)">{{ item.ctime }}</div>
            <div class="comment-text" @click="onReplyUserFn(item.id, '', item.user.nickname, index)">{{ item.content }}</div>
            <div class="second-comment-wrapper" v-if="item.replay_list">
              <div
                class="user-info second-comment-list"
                v-for="(obj, i) in item.replay_list"
                @longpress.stop="handleLongPress(obj, index, i)"
                :key="i"
              >
                <div class="avatar">
                  <image mode="aspectFill" :src="obj.user.avatarurl" />
                </div>
                <div class="content">
                  <div class="top-box">
                    <div class="title-box">
                      <div class="name">{{ obj.user.nickname }}</div>
                      <div class="mark" v-if="obj.user.is_author">作者</div>
                    </div>
                    <div
                      @click="onLikeFn(obj.id, obj.is_like, index, i, 'replyType')"
                      class="like-box"
                    >
                      <image
                        :src="upyunUrl + '/wxXcxImg/images/index-like-active.png'"
                        v-if="obj.is_like"
                      />
                      <image
                        :src="upyunUrl + '/wxXcxImg/images/comment-default-like-icon.png'"
                        v-else
                      />
                      <div v-if="obj.is_like" class="num active">{{ obj.like_total }}</div>
                      <div v-else class="num">{{ obj.like_total }}</div>
                    </div>
                  </div>
                  <div
                    v-if="parseInt(userInfo.user_id) !== obj.uid"
                    @click="onReplyUserFn(item.id, obj.user.user_id, obj.user.nickname, index)"
                    class="date-text"
                  >{{ obj.ctime }}</div>
                  <div v-else class="date-text">{{ obj.ctime }}</div>
                  <div
                    v-if="parseInt(userInfo.user_id) !== obj.uid"
                    @click="onReplyUserFn(item.id, obj.user.user_id, obj.user.nickname, index)"
                    class="comment-text"
                  >
                    <div class="text p1" v-if="obj.tag">回复</div>
                    <div class="text p2" v-if="obj.tag">{{ obj.tag.nickname }}：</div>
                    <div class="text p3">{{ obj.content }}</div>
                  </div>
                  <div v-else class="comment-text">
                    <div class="text p1" v-if="obj.tag">回复</div>
                    <div class="text p2" v-if="obj.tag">{{ obj.tag.nickname }}：</div>
                    <div class="text p3">{{ obj.content }}</div>
                  </div>
                </div>
              </div>
              <div
                v-if="item.replay_count > 3 && item.replay_list.length !== item.replay_count"
                @click="onMoreReplyFn(item.id, index)"
                class="more-box"
              >
                <div class="line"></div>
                <div class="text">展开{{ item.replay_count - 3 }}条回复</div>
                <image :src="upyunUrl + '/wxXcxImg/images/comment-more-icon.png'" />
              </div>
              <div
                class="more-box"
                v-if="item.replay_count > 3 && item.replay_list.length === item.replay_count"
                @click="onPackUpFn(index)"
              >
                <div class="line"></div>
                <div class="text">收起回复</div>
                <image class="active" :src="upyunUrl + '/wxXcxImg/images/comment-more-icon.png'" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 上拉加载更多loading -->
    <loading-more :lists="lists" :listsLength="16" />
    <!-- 回复输入框 -->
    <div class="reply-box" :style="{bottom: keyBoardHeight}">
      <div class="input-box">
        <image :src="upyunUrl + '/wxXcxImg/images/input-edit-icon.png'" />
        <input
          v-model="inputVal"
          @focus="testFocus"
          @blur="onBlurFn"
          @confirm="onEnterFn"
          :adjust-position="false"
          :focus="isFocus"
          :placeholder="placeholder"
          cursor-spacing="10"
          placeholder-style="color: #999;"
        />
      </div>
      <div class="reply-btn">
        <image
          v-if="inputVal"
          :src="upyunUrl + '/wxXcxImg/images/review-active-icon.png'"
          @click="onCreationCommentFn()"
        />
        <image v-if="!inputVal" :src="upyunUrl + '/wxXcxImg/images/review-icon.png'" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { upyunUrl } from '../../api/config'
import LoadingMore from '../loadingMoreTemplate'

export default {
  data () {
    return {
      upyunUrl,
      id: '',
      tag_id: '',
      commentIndex: 0,
      placeholder: '爱发言的人运气不会差',
      inputVal: '',
      isFocus: false,
      keyBoardHeight: 0,
      tabBarHeight: 0,
      submitState: true
    }
  },
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  mounted () {
    let systemInfo = uni.getSystemInfoSync()
    // 状态栏的高度
    let ktxStatusHeight = systemInfo.statusBarHeight
    // 导航栏的高度
    let navigationHeight = 44
    // window的高度
    let ktxWindowHeight = systemInfo.windowHeight
    // 屏幕的高度
    let ktxScreentHeight = systemInfo.screenHeight
    // 底部tabBar的高度
    this.tabBarHeight = ktxScreentHeight - ktxStatusHeight - navigationHeight - ktxWindowHeight
  },
  methods: {
    ...mapActions([
      'allThumbsUp',
      'creationComment',
      'commentDelete',
      'getMoreReplyComment'
    ]),
    // 提交评论（专题，音频）
    onCreationCommentFn () {
      const data = {
        that: this,
        replay_id: this.id,
        tag_id: this.tag_id,
        content: this.inputVal,
        index: this.commentIndex,
        type: this.special_id ? 0 : 1,
        c_id: this.special_id || this.vid
      }
      if (this.userInfo) {
        if (this.submitState) {
          uni.showLoading({ title: '发送中...' })
          this.submitState = false
          this.creationComment(data).then((res) => {
            this.submitState = true
            if (res.code === 200) {
              this.inputVal = ''
            }
          })
        }
      } else {
        uni.navigateTo({
          url: `/pages/login/index`
        })
      }
    },
    // 切换回复用户评论
    onReplyUserFn (id, userId, nickname, index) {
      this.id = id
      this.tag_id = userId
      this.isFocus = true
      this.commentIndex = index
      this.placeholder = `回复 手机用户${nickname}：`
    },
    // 查看更多回复用户评论
    onMoreReplyFn (id, index) {
      const data = {
        that: this,
        index,
        id
      }
      uni.showLoading({ title: 'Loading' })
      this.getMoreReplyComment(data).then(() => {
        uni.hideLoading()
      })
    },
    // 收起回复评论
    onPackUpFn (index) {
      this.lists[index].replay_list.splice(3)
    },
    // input回车发送
    onEnterFn () {
      if (this.inputVal) {
        this.onCreationCommentFn()
      } else {
        this.showToastFn('内容不能为空!')
      }
    },
    // 评论，回复评论点赞
    onLikeFn (id, status, index, i, type) {
      const data = {
        likeType: type,
        that: this,
        type: 3,
        status,
        index,
        id,
        i
      }
      if (this.userInfo) {
        this.allThumbsUp(data)
      } else {
        uni.navigateTo({
          url: `/pages/login/index`
        })
      }
    },
    // input聚焦时
    testFocus (e) {
      if (e.mp.detail.height && this.trenchName) {
        this.keyBoardHeight = (e.mp.detail.height - this.tabBarHeight) + 'px'
      } else if (e.mp.detail.height) {
        this.keyBoardHeight = e.mp.detail.height + 'px'
      }
    },
    // input失去焦点时
    onBlurFn () {
      this.isFocus = false
      this.keyBoardHeight = 0
      if (!this.inputVal) {
        this.tag_id = ''
        this.id = ''
        this.placeholder = '爱发言的人运气不会差'
      }
    },
    // 长按提示
    handleLongPress (item, index, i) {
      const that = this
      if (parseInt(this.userInfo.user_id) === item.user.user_id) {
        uni.showModal({
          title: '温馨提示',
          content: i === 0 || i ? '是否要删除该回复!' : '是否要删除该评论!',
          confirmColor: '#ff4040',
          success (res) {
            if (res.confirm) {
              i === 0 || i ? that.lists[index].replay_list.splice(i, 1) : that.lists.splice(index, 1)
              that.commentDelete({ that, id: item.id })
            }
          }
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
  },
  components: {
    LoadingMore
  },
  props: {
    lists: {
      type: Array,
      default: []
    },
    special_id: {
      type: String,
      default: null
    },
    vid: {
      type: String,
      default: null
    },
    trenchName: {
      type: String,
      default: null
    }
  }
}
</script>

<style lang="stylus" scoped>
  .comment-list-wrapper
    width: 100%
    height: auto
    padding: 5px 15px 60px 15px
    box-sizing: border-box
    .comment-list-ul
      width: 100%
      height: auto
      .item
        width: 100%
        height: auto
        padding-top: 20px
        .user-info
          width: 100%
          height: auto
          display: flex
          .avatar
            width: 27px
            height: 27px
            border-radius: 50%
            overflow: hidden
            background-color: #efefef
            image
              width: 100%
              height: 100%
          .content
            flex: 1
            padding-left: 10px
            .top-box
              width: 100%
              height: auto
              display: flex
              align-items: center
              .title-box
                flex: 1
                display: flex
                align-items: center
                .name
                  padding-right: 6px
                  font-size: 14px
                  color: #666666
                .mark
                  padding: 0 5px
                  font-size: 12px
                  line-height: 18px
                  border-radius: 2px
                  color: #fff
                  background-color: #ff4040
              .like-box
                width: auto
                height: auto
                display: flex
                image
                  display: block
                  width: 14px
                  height: 14px
                .num
                  padding-left: 6px
                  font-size: 12px
                  color: #ccc
                .active
                  color: #ff4040
            .date-text
              font-size: 12px
              line-height: 25px
              color: #999999
            .comment-text
              font-size: 14px
              line-height: 18px
              display: flex
              color: #333333
              .text
                font-size: 14px
              .p2
                padding: 0 5px
                color: #999999
              .p3
                flex: 1
                word-break: break-all
            .second-comment-wrapper
              width: 100%
              height: auto
              .second-comment-list
                padding-top: 15px
              .more-box
                position: relative
                width: 100%
                height: auto
                padding: 10px 13px 0 13px
                display: flex
                align-items: center
                box-sizing: border-box
                .line
                  width: 20px
                  height: 1px
                  background-color: #ccc
                .text
                  padding: 0 10px
                  font-size: 12px
                  color: #999999
                image
                  display: block
                  width: 10px
                  height: 6px
                .active
                  transform: rotateX(-180deg)
    .reply-box
      position: fixed
      left: 0
      width: 100%
      height: 55px
      padding: 0 15px 0 25px
      border-top: 1px solid #efefef
      display: flex
      align-items: center
      justify-content: space-between
      z-index: 50
      background: #fff
      box-sizing: border-box
      .input-box
        flex: 1
        height: 31px
        padding: 0 15px
        border-radius: 16px
        display: flex
        align-items: center
        background-color: #f0f0f0
        box-sizing: border-box
        image
          display: block
          width: 14px
          height: 14px
        input
          flex: 1
          height: 100%
          padding-left: 8px
          font-size: 12px
          color: #333
      .reply-btn
        width: 31px
        height: 31px
        padding-left: 10px
        display: flex
        align-items: center
        justify-content: center
        image
          display: block
          width: 22px
          height: 22px
</style>
