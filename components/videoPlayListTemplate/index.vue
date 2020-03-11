<template>
  <div class="video-wrapper">
    <div class="white-fixed"></div>
    <scroll-view
      :scroll-y="true"
      :upper-threshold="0"
      @scrolltoupper="onScrolltoupperFn"
      @scrolltolower="onScrolltolowerFn"
      class="scroll-view"
    >
      <div class="seek-wrapper">
        <div
          @click="onSkipPageFn('/pages/subject/searchPage/index')"
          class="input-bar"
        >
          <i class="search">
            <img :src="upyunUrl + '/wxXcxImg/images/search-icon.png'" />
          </i>
          <span class="text">搜您想听看您想看</span>
        </div>
      </div>
      <ul
        v-if="indexVideoList.length"
        class="video-list"
      >
        <li
          v-for="(item, index) in indexVideoList" :key="index"
          @click="onSkipDetailsPageFn(item)"
        >
          <div class="title">{{ item.title }}</div>
          <div class="video-box">
            <div
              v-if="item.thumb"
              class="video-cover"
            >
              <image
                :src='item.thumb'
                mode="aspectFill"
                class="cover-img"
              />
              <image
                :src="upyunUrl + '/wxXcxImg/images/video-play-icon.png'"
                class="play-icon"
              />
              <div class="video-bottom">
                <div class="cnt-box">
                  <div class="left-cnt">
                    <img :src="upyunUrl + '/wxXcxImg/images/xq-pause-icon.png'" class="play-num-icon" mode="aspectFill"/>
                    <div class="video-txt">{{ item.play_num }}播放量</div>
                  </div>
                  <div class="duration-text">{{ item.duration }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="info-box">
            <div
              v-if="item.author_info && item.author_info.au_id"
              @click.stop="onSkipPageFn(`/pages/subject/lectureHome/index?id=${item.author_info.au_id}`)"
              class="lecturer-box"
            >
              <div class="lecturer">
                <div class="avatar">
                  <image mode="aspectFill" :src="item.author_info.headimgurl"/>
                </div>
                <div class="name">{{ item.author_info.nick_name }}</div>
              </div>
              <div
                v-if="userInfo.user_id !== item.author_info.uid && item.author_info.is_attention === 0"
                @click.stop="onConcernAuthorFn(item.author_info.au_id, item.author_info.is_attention, index)"
                class="focus-btn"
              >+关注</div>
              <div
                v-if="userInfo.user_id !== item.author_info.uid && item.author_info.is_attention !== 0"
                @click.stop="onConcernAuthorFn(item.author_info.au_id, item.author_info.is_attention, index)"
                class="focus-btn active"
              >已关注</div>
            </div>
            <div v-else class="lecturer-box"></div>
            <div class="handle-box">
              <div
                class="comments"
              >
                <div class="comments-icon">
                  <image :src="upyunUrl + '/wxXcxImg/images/comments-icon.png'" />
                </div>
                <div class="comments-num">{{ item.comment_num }}</div>
              </div>
              <div class="btn-box" @click.stop="onMoreOperateFn(item)">
                <div class="handle-btn">
                  <image :src="upyunUrl + '/wxXcxImg/images/share-show-icon.png'" />
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <!-- 上拉加载更多loading -->
      <loading-more :lists="indexVideoList" :listsLength="10" />
    </scroll-view>
    <!-- 更多操作 -->
    <more-operate :oItem="oItem" ref="child" />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { upyunUrl } from '../../api/config'
import MoreOperate from '../moreOperateTempage'
import LoadingMore from '../loadingMoreTemplate'

export default {
  data () {
    return {
      upyunUrl,
      page: 1,
      firstEnter: true,
      oItem: ''
    }
  },
  computed: {
    ...mapState([
      'userInfo',
      'indexTypeLabelList',
      'navigationIndex',
      'indexVideoList'
    ])
  },
  methods: {
    ...mapMutations({
      setIndexVideoList: 'SET_INDEX_VIDEO_LIST'
    }),
    ...mapActions([
      'getUserInfo',
      'concernAuthor',
      'getIndexVideoList'
    ]),
    // 获取首页视频列表
    getIndexVideoFn (isLoading) {
      if (isLoading) {
        uni.showLoading({ title: 'Loading' })
        this.setIndexVideoList([])
      }
      this.getIndexVideoList({ page: this.page }).then(() => {
        if (isLoading) uni.hideLoading()
      })
    },
    // 关注讲师
    onConcernAuthorFn (id, state, index) {
      if (this.userInfo) {
        if (state === 0) {
          this.indexVideoList[index].author_info.is_attention = 1
        } else {
          this.indexVideoList[index].author_info.is_attention = 0
        }
        this.concernAuthor({ that: this, au_id: id })
      } else {
        uni.navigateTo({
          url: `/pages/login/index`
        })
      }
    },
    // 下拉刷新
    onScrolltoupperFn () {
      this.page = 1
      this.getIndexVideoFn(true)
    },
    // 上拉加载更多
    onScrolltolowerFn () {
      this.page = this.page + 1
      this.getIndexVideoFn(false)
    },
    // 更多操作状态栏
    onMoreOperateFn (item) {
      if (item.special_id) {
        item['skipPath'] = 'subjectVideo'
      } else {
        item['skipPath'] = 'videoDetails'
      }
      this.oItem = item
      this.$refs.child.onUniPopupStateFn(true)
    },
    // 跳转页面
    onSkipPageFn (url) {
      uni.navigateTo({
        url
      })
    },
    onSkipDetailsPageFn (item) {
      let url = ''
      if (item.special_id) {
        url = `/pages/subject/subjectVideo/index?oJson=${encodeURIComponent(JSON.stringify(item))}`
      } else {
        url = `/pages/subject/subjectVideo/videoDetails/index?oJson=${encodeURIComponent(JSON.stringify(item))}`
      }
      uni.navigateTo({
        url
      })
    }
  },
  watch: {
    navigationIndex (index) {
      const lists = this.indexTypeLabelList
      for (let i = 0; i < lists.length; i++) {
        if (this.firstEnter && lists[i].type === 2 && index === i) {
          this.firstEnter = false
          this.getIndexVideoFn(true)
        }
        if (lists[i].type === 2 && index === i) {
          this.$refs.child.onUniPopupStateFn(false)
          break
        }
      }
    }
  },
  components: {
    MoreOperate,
    LoadingMore
  }
}
</script>

<style lang="stylus" scoped>
  .video-wrapper
    position: fixed
    left: 0
    top: 0
    right: 0
    bottom: 50px
    width: 100%
    height: 100%
    padding: 54px 15px 0
    box-sizing: border-box
    .white-fixed
      position: fixed
      left: 0
      top: 0
      right: 0
      bottom: 0
      width: 100%
      height: 100%
      background: #fff
      z-index: -1
    .scroll-view
      width: 100%
      height: 100%
      .seek-wrapper
        width: 100%
        height: auto
        padding: 0 15px
        box-sizing: border-box
        .input-bar
          width: 100%
          height: 100%
          line-height: 34px
          border-radius: 17px
          display: flex
          align-items: top
          justify-content: center
          background-color: #f6f6f6
          .search
            margin-top: 2px
            width: 13px
            height: 14px
            img
              width: 100%
              height: 100%
          .text
            padding-left: 10px
            text-align: center
            font-size: 13px
            color: #999
      .video-list
        width: 100%
        height: auto
        padding-top: 20px
        li
          margin-bottom: 25px
          width: 100%
          height: auto
          overflow: hidden
          .title
            margin-bottom: 10px
            font-size: 16px
            line-height: 24px
            color: #33344c
            display: -webkit-box
            -webkit-box-orient: vertical
            -webkit-line-clamp: 2
            overflow: hidden
          .video-box
            position: relative
            margin-bottom: 10px
            width: 100%
            height: auto
            box-sizing: border-box
            border-radius: 6px
            .video
              width: 100%
              height: 180px
              margin: 0 auto
              display: block
              border-radius: 6px
            .video-cover
              position: relative
              width: 100%
              height: 180px
              .cover-img
                width: 100%
                height: 100%
              .play-icon
                position: absolute
                left: 50%
                top: 50%
                width: 30px
                height: 34px
                margin-left: -15px
                margin-top: -17px
                z-index: 5
              .video-bottom
                position:absolute
                left: 0
                bottom: 0
                width: 100%
                height: 54px
                padding: 0 10px
                box-sizing: border-box
                font-size: 11px
                color: #fff
                background: linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,0.35) 100%)
                .cnt-box
                  margin-top: 28px
                  display: flex
                  align-items: center
                  justify-content: space-between
                  .left-cnt
                    display: flex
                    align-items: center
                    .play-num-icon
                      width: 12px
                      height: 12px
                    .video-txt
                      padding-left: 5px
            .label
              position: absolute
              right: 10px
              top: 15px
              width: 50px
              height: 20px
              line-height: 20px
              text-align: center
              font-size: 10px
              color: #fffefe
              background: -webkit-linear-gradient(top,rgba(255, 255, 255, 0)10%, rgba(0, 0, 0, .45)80%)
              border-radius: 2px
          .info-box
            width: 100%
            height: auto
            display: flex
            align-items: center
            justify-content: space-between
            .lecturer-box,.lecturer,.handle-box,.comments
              display: flex
              align-items: center
              .avatar
                width: 28px
                height: 28px
                border-radius: 50%
                image
                  display: block
                  width: 100%
                  height: 100%
                  border-radius: 50%
              .name
                padding-left: 10px
                font-size: 14px
                color: #545467
              .focus-btn
                margin-left: 30px
                width: 44px
                height: 23px
                line-height: 23px
                font-size: 12px
                text-align: center
                color: #ff6464
                border: 1px solid #ff6464
                border-radius: 4px
                &.active
                  color: #9798a6
                  border: 1px solid #9798a6
              .comments-icon
                width: 16px
                height: 16px
                image
                  display: block
                  width: 100%
                  height: 100%
              .comments-num
                padding: 0 30px 0 10px
                font-size: 12px
                color: #545467
              .btn-box
                padding: 10px
                box-sizing: border-box
                .handle-btn
                  width: 15px
                  height: 3px
                  image
                    display: block
                    width: 100%
                    height: 100%
    ::-webkit-scrollbar
      width: 0
      height: 0
      color: transparent
</style>
