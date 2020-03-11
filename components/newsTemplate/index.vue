<template>
  <div class="news-list-wrapper">
    <div class="white-fixed"></div>
    <scroll-view
      v-if="newsList.length && upyunUrl"
      class="scroll-view"
      :scroll-y="true"
      :upper-threshold="0"
      @scrolltoupper="onScrolltoupperFn"
      @scrolltolower="onScrolltolowerFn"
    >
      <div class="news-bg">
        <div class="news-mask"></div>
        <img :src="upyunUrl + '/wxXcxImg/images/news-bg.png'" />
        <div class="news-text">
          <p class="title">Hi，{{ userInfo.nickname }}{{ detaTitle }} ！</p>
          <p>声声入耳，事事关心</p>
        </div>
      </div>
      <ul>
        <li
          v-for="(item, index) in newsList"
          :key="index"
          :class="item.playing ? 'active' : ''"
          @click="onTogglePlayingFn(item)"
        >
          <div class="news-content">
            <p class="title">{{ item.title }}</p>
            <p class="date">
              <i>
                <img :src="upyunUrl + '/wxXcxImg/images/calendar-icon.png'" />
              </i>
              <span>{{ item.inputtime }}</span>
            </p>
          </div>
          <div class="news-play">
            <img class="play" :src="upyunUrl + '/wxXcxImg/images/news-play-icon.png'" />
            <img class="pause" :src="upyunUrl + '/wxXcxImg/images/news-pause-icon.gif'" />
          </div>
        </li>
      </ul>
      <!-- 上拉加载更多loading -->
      <loading-more :lists="newsList" :listsLength="16" />
    </scroll-view>
  </div>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'
  import LoadingMore from '../loadingMoreTemplate'
  import { upyunUrl } from '../../api/config'

  export default {
    data () {
      return {
        upyunUrl,
        page: 1,
        detaTitle: '',
        firstEnter: true
      }
    },
    onLoad () {
      const date = new Date()
      this.detaTitle = this.computedDateFn(date.getHours())
    },
    computed: {
      ...mapState([
        'userInfo',
        'newsList',
        'navigationIndex',
        'indexTypeLabelList'
      ])
    },
    methods: {
      ...mapMutations({
        setNewsList: 'SET_NEWS_LIST',
        setIsSwitchMusic: 'SET_IS_SWITCH_MUSIC_STATE'
      }),
      ...mapActions([
        'getNewsList',
        'setMusicStatus'
      ]),
      // 获取今日头条新闻
      getNewsListFn (isLoading) {
        const data = {
          that: this,
          page: this.page
        }
        uni.showNavigationBarLoading()
        if (isLoading) this.setNewsList([])
        this.getNewsList(data).then(() => {
          uni.hideNavigationBarLoading()
        })
      },
      // 播放/暂停
      onTogglePlayingFn (item) {
        this.setIsSwitchMusic(false)
        this.setMusicStatus({ that: this, item, list: this.newsList })
      },
      // 计算早中晚凌晨
      computedDateFn (num) {
        if (num >= 6 && num < 9) return '早上好'
        if (num >= 9 && num < 12) return '上午好'
        if (num >= 12 && num < 14) return '中午好'
        if (num >= 14 && num < 18) return '下午好'
        if (num >= 18 && num < 24) return '晚上好'
        if (num >= 0 && num < 6) return '凌晨了注意休息哦'
      },
      // 下拉刷新
      onScrolltoupperFn () {
        this.page = 1
        this.getNewsListFn(true)
      },
      // 上拉加载更多
      onScrolltolowerFn () {
        this.page = this.newsList[this.newsList.length - 1].page + 1
        this.getNewsListFn(false)
      }
    },
    watch: {
      navigationIndex (index) {
        this.indexTypeLabelList.forEach((item, i) => {
          if (this.firstEnter && item.type === 1 && index === i) {
            this.firstEnter = false
            this.getNewsListFn(true)
          }
        })
      }
    },
    components: {
      LoadingMore
    }
  }
</script>

<style lang="stylus" scoped>
  .news-list-wrapper
    position: fixed
    left: 0
    top: 0
    right: 0
    bottom: 0
    width: 100%
    height: auto
    padding: 0 15px
    display: flex
    flex-direction: column
    background-color: #f8f8f8
    box-sizing: border-box
    .white-fixed
      position: fixed
      left: 0
      top: 0
      width: 100%
      height: 59px
      background-color: #fff
      z-index: 20
    .scroll-view
      width: 100%
      height: 100%
      .news-bg
        position: relative
        top: 80px
        width: 100%
        height: 130px
        border-radius: 4px
        overflow: hidden
        img
          width: 100%
          height: 100%
          border-radius: 4px
        .news-mask
          position: absolute
          left: 0
          top: 0
          width: 100%
          height: 100%
          background-color: rgba(0, 0, 0, 0.1)
        .news-text
          position: absolute
          left: 0
          top: 0
          width: 100%
          padding: 34px 20px 0
          box-sizing: border-box
          p
            font-size: 20px
            line-height: 35px
            color: #fff
          .title
            font-weight: bold
      ul
        width: 100%
        height: auto
        padding-top: 100px
        li
          width: 100%
          height: auto
          padding: 15px
          margin-bottom: 10px
          display: flex
          box-sizing: border-box
          background-color: #fff
          border-radius: 4px
          .news-content
            flex: 1
            height: auto
            padding-right: 30px
            .title
              width: 100%
              min-height: 20px
              font-size: 15px
              font-weight:bold
              line-height: 22px
              display: -webkit-box
              -webkit-box-orient: vertical
              -webkit-line-clamp: 2
              overflow: hidden
              color: #333
            .date
              padding-top: 18px
              width: 100%
              display: flex
              align-items: center
              font-size: 12px
              color: #999
              i
                width: 12px
                height: 12px
                img
                  display: block
                  width: 100%
                  height: 100%
              span
                padding-left: 6px
          .news-play
            width: 32px
            height: auto
            display: flex
            justify-content: center
            align-items: center
            img
              width: 26px
              height: 26px
              display: none
            .play
              display: block
        li:last-child
          margin-bottom: 0
        .active
          .news-content
            .title
              color: #ec6b38
          .news-play
            .play
              display: none
            .pause
              display: block
    ::-webkit-scrollbar
      width: 0
      height: 0
      color: transparent

</style>
