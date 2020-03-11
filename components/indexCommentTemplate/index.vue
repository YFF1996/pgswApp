<template>
  <div
    v-if="status && upyunUrl"
    @click="onShowHideCommentStateFn()"
    class="index-comment-wrapper"
  >
    <div
      class="comment-content"
      :class="{'comment-content-active' : status}"
      @click.stop
    >
      <div class="comment-num">
        <div class="num">{{ commentTotal }}评论</div>
        <div
          @click="onShowHideCommentStateFn()"
          class="close-btn"
        >
          <image :src="upyunUrl + '/wxXcxImg/images/close-btn.png'" />
        </div>
      </div>
      <div class="scroll-view-wrapper">
        <scroll-view
          @scrolltolower="scrolltolowerEnd"
          :scroll-y="true"
        >
          <comment-list :lists="commentList" :vid="currentMusicItem.id" :trenchName="'index'" />
        </scroll-view>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import CommentList from '../commentListTemplate'
import { upyunUrl } from '../../api/config'

export default {
  data () {
    return {
      upyunUrl,
      page: 1,
      commentTotal: 0
    }
  },
  computed: {
    ...mapState([
      'currentMusicItem',
      'commentList'
    ])
  },
  methods: {
    ...mapMutations({
      setCommentList: 'SET_COMMENT_LIST'
    }),
    ...mapActions([
      'getCommentList'
    ]),
    // 显示 - 隐藏, 首页评论弹窗
    onShowHideCommentStateFn () {
      this.$emit('showHideCommentStateChild', false)
    },
    // 获取评论list
    getCommentListFn (isLoading) {
      const data = {
        that: this,
        page: this.page,
        c_id: this.currentMusicItem.id,
        type: 1
      }
      if (isLoading) {
        this.setCommentList([])
        uni.showLoading({ title: 'Loading' })
      }
      this.getCommentList(data).then((res) => {
        this.commentTotal = res.total
        if (isLoading) uni.hideLoading()
      })
    },
    // 上拉加载更多
    scrolltolowerEnd () {
      this.page += 1
      this.getCommentListFn(false)
    }
  },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    vid: {
      type: String,
      default: ''
    }
  },
  components: {
    CommentList
  },
  watch: {
    status (state) {
      if (state) {
        this.page = 1
        this.getCommentListFn(true)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  .index-comment-wrapper
    position: fixed
    left: 0
    top: 0
    right: 0
    bottom: 0
    width: 100%
    height: 100%
    z-index: 999
    background-color: rgba(0, 0, 0, 0.8)
    .comment-content
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      height: 80%
      border-radius: 10px 10px 0 0
      overflow: hidden
      background-color: #fff
      &.comment-content-active
        animation: listTranslateY 0.3s alternate forwards
      .comment-num
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 40px
        .num
          text-align: center
          line-height: 40px
          font-size: 15px
          color: #000
        .close-btn
          position: absolute
          right: 0
          top: 0
          width: 40px
          height: 40px
          display: flex
          justify-content: center
          align-items: center
          image
            display: block
            width: 15px
            height: 15px
      .scroll-view-wrapper
        width: 100%
        height: 100%
        padding-top: 40px
        background-color: #fff
        box-sizing: border-box
        scroll-view
          width: 100%
          height: 100%
  @-webkit-keyframes listTranslateY
    0%
      transform: translateY(80px)
    100%
      transform: translateY(0)
</style>
