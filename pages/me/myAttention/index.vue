<template>
  <div v-if="upyunUrl" class="info-wrapper">
    <ul v-if="myAttentionList.length">
      <li
        v-for="(item, index) in myAttentionList"
        @click="onSkipPageFn(`/pages/subject/lectureHome/index?id=${item.id}`)"
        :key="index"
      >
        <div class="avatar">
          <img mode="aspectFill" :src="item.headimgurl" />
        </div>
        <div class="content-box">
          <h2>{{ item.nick_name }}</h2>
          <div class="bottom">
            <div class="item">
              <i>
                <img :src="upyunUrl + '/wxXcxImg/images/book-num-icon.png'" />
              </i>
              <div class="num">{{ item.special + item.voice }}</div>
            </div>
            <div class="item">
              <i>
                <img :src="upyunUrl + '/wxXcxImg/images/focus-num-icon.png'" />
              </i>
              <div class="num">{{ item.fans }}</div>
            </div>
          </div>
        </div>
        <div class="btn-box">已关注</div>
      </li>
    </ul>
    <loading-more :lists="myAttentionList" :listsLength="16" />
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
      page: 1
    }
  },
  onLoad () {
    this.page = 1
    this.getMyAttentionListFn(true)
  },
  computed: {
    ...mapState([
      'myAttentionList'
    ])
  },
  // 下拉刷新
  onPullDownRefresh () {
    this.page = 1
    this.getMyAttentionListFn(true)
  },
  // 上拉加载
  onReachBottom () {
    this.page += 1
    this.getMyAttentionListFn(false)
  },
  methods: {
    ...mapMutations({
      setMyAttentionList: 'SET_MY_ATTENTION_LIST'
    }),
    ...mapActions([
      'getMyAttentionList'
    ]),
    // 获取我的关注列表
    getMyAttentionListFn (loadingStatus) {
      const data = {
        that: this,
        page: this.page
      }
      if (loadingStatus) {
        uni.showLoading({ title: 'Loading' })
        this.setMyAttentionList([])
      }
      uni.showNavigationBarLoading()
      this.getMyAttentionList(data).then(() => {
        if (loadingStatus) uni.hideLoading()
        uni.stopPullDownRefresh()
        uni.hideNavigationBarLoading()
      })
    },
    onSkipPageFn (url) {
      uni.navigateTo({
        url
      })
    }
  },
  components: {
    LoadingMore
  }
}
</script>

<style lang="stylus" scoped>
  .info-wrapper
    width: 100%
    height: 100%
    ul
      padding: 25px 15px 15px
      width: 100%
      height: auto
      box-sizing: border-box
      li
        margin-bottom: 22px
        display: flex
        align-items: center
        justify-content: space-around
        .avatar
          width: 42px
          height: 42px
          border-radius: 50%
          img
            display: block
            width: 100%
            height: 100%
            border-radius: 50%
        .content-box
          position: relative
          flex: 1
          height: 42px
          padding-left: 15px
          h2
            margin-bottom: 10px
            font-size: 15px
            color: #333
          .bottom
            position: absolute
            bottom: 0
            display: flex
            align-items: center
            .item
              padding-right: 12px
              display: flex
              align-items: center
              i
                width: 14px
                height: 14px
                img
                  display: block
                  width: 100%
                  height: 100%
              .num
                padding-left: 4px
                font-size: 12px
                color: #666
        .btn-box
          width: auto
          height: 27px
          padding: 0 15px
          line-height: 27px
          font-size: 15px
          text-align: center
          border-radius: 20px
          color: #fff
          background: #dcdcdc
</style>
