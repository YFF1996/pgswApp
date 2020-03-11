<template>
  <div
    v-if="upyunUrl"
    class="info-wrapper"
  >
    <ul v-if="mySubscriptionList.length">
      <li
        v-for="(item, index) in mySubscriptionList"
        @longpress="handleLongPress(item.id, index)"
        :key="index"
      >
        <div
          @click.stop="onSkipPageFn(item)"
          class="item"
        >
          <div class="cover">
            <image mode="aspectFill" :src="item.cover" />
            <div class="video-play-num">
              <div v-if="item.v_type === 0">音频</div>
              <div v-if="item.v_type === 1">视频</div>
            </div>
          </div>
          <div class="content-box">
            <h2>{{ item.title }}</h2>
            <div class="info">
              <span class="num">共{{ item.s_num }}个知识</span>
              <span>{{ item.ctime }}</span>
            </div>
            <i v-if="item.is_hide || item.del">
              <image :src="upyunUrl + '/wxXcxImg/images/shelves-icon.png'" />
            </i>
          </div>
        </div>
      </li>
    </ul>
    <loading-more :lists="mySubscriptionList" :listsLength="16" />
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
      startTime: 0,
      endTime: 0
    }
  },
  onLoad () {
    this.page = 1
    this.getMySubscriptionListFn(true)
  },
  computed: {
    ...mapState([
      'mySubscriptionList'
    ])
  },
  // 下拉刷新
  onPullDownRefresh () {
    this.page = 1
    this.getMySubscriptionListFn(true)
  },
  // 上拉加载
  onReachBottom () {
    this.page += 1
    this.getMySubscriptionListFn(false)
  },
  methods: {
    ...mapMutations({
      setMySubscriptionList: 'SET_MY_SUBSCRIPTION_LIST'
    }),
    ...mapActions([
      'getMySubscriptionList',
      'subscriptionSubject'
    ]),
    // 获取我的订阅列表
    getMySubscriptionListFn (loadingStatus) {
      const data = {
        that: this,
        page: this.page
      }
      if (loadingStatus) {
        uni.showLoading({ title: 'Loading' })
        this.setMySubscriptionList([])
      }
      uni.showNavigationBarLoading()
      this.getMySubscriptionList(data).then(() => {
        if (loadingStatus) uni.hideLoading()
        uni.stopPullDownRefresh()
        uni.hideNavigationBarLoading()
      })
    },
    handleLongPress (id, index) {
      const that = this
      uni.showModal({
        content: '确认取消订阅?',
        confirmColor: '#ff4040',
        success (res) {
          if (res.confirm) {
            that.mySubscriptionList.splice(index, 1)
            that.subscriptionSubject({ that, id: id })
          }
        }
      })
    },
    onSkipPageFn (item) {
      let url = ''
      if (item.is_hide || item.del) {
        this.showToastFn('课程已下架,无法查看')
        return false
      } else {
        switch (item.v_type) {
          case 0:
            url = `/pages/subject/subjectMusic/index?sid=${item.id}`
            break
          case 1:
            item['special_id'] = item.id
            url = `/pages/subject/subjectVideo/index?oJson=${encodeURIComponent(JSON.stringify(item))}`
            break
        }
      }
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
      padding: 15px
      width: 100%
      height: auto
      box-sizing: border-box
      li
        padding-bottom: 15px
        margin-bottom: 15px
        box-sizing: border-box
        border-bottom: 1px solid #f5f5f5
        .item
          display: flex
          .cover
            position: relative
            width: 72px
            height: 72px
            background-color: #fff
            border-radius: 4px
            image
              display: block
              width: 100%
              height: 100%
              border-radius: 4px
            .video-play-num
              position: absolute
              bottom: 0
              width: 100%
              height: 30px
              padding: 9px 5px 2px
              display: flex
              align-items: center
              justify-content: flex-end
              font-size: 11px
              color: #fff
              background: -webkit-linear-gradient(top,rgba(255, 255, 255, 0)10%, rgba(0, 0, 0, .5)80%)
              box-sizing: border-box
              border-radius: 0 0 4px 4px
          .content-box
            position: relative
            flex: 1
            height: 72px
            padding: 0 22px 0 15px
            box-sizing: border-box
            h2
              margin-top: -3px
              font-size: 15px
              line-height: 20px
              color: #333
              display: -webkit-box
              -webkit-box-orient: vertical
              -webkit-line-clamp: 2
              overflow: hidden
            .info
              position: absolute
              bottom: 0
              span
                font-size: 12px
                color: #b3b3b3
                &.num
                  padding-right: 44px
            i
              position: absolute
              bottom: 0
              right: 15px
              width: 58px
              height: 58px
              image
                display: block
                width: 100%
                height: 100%
        &:last-child
          border: none
</style>
