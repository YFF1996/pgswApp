<template>
  <div class="search-goods-wrapper">
    <input-seek
      @watchInputChild="watchInputFn"
      @enterChild="onEnterFn"
      @emptyDataChild="onEmptyDataFn"
      :inputText="keywords"
    />
    <div class="goods-content">
      <ul v-if="authorSearchGoodsList.length">
        <li
          v-for="(item, index) in authorSearchGoodsList"
          @click="onSkipPageFn(`/pages/subject/lectureHome/lecturerGoods/lecturerGoodsDetails/index?oJson=`, item)"
          :key="index"
        >
          <div class="goods-img">
            <img mode="aspectFill" :src="item.cover" />
          </div>
          <div class="text-box">
            <h3>{{ item.name }}</h3>
            <div class="price">¥<p>{{ item.price }}</p></div>
            <div class="lecturer">{{ item.author_nickname }}</div>
          </div>
        </li>
      </ul>
      <loading-more :lists="authorSearchGoodsList" :listsLength="16" />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import InputSeek from '../../../../../components/inputSeekTemplate/index'
import LoadingMore from '../../../../../components/loadingMoreTemplate/index'

export default {
  data () {
    return {
      page: 1,
      keywords: ''
    }
  },
  onLoad () {
    this.getAuthorSearchGoodsListFn(true)
  },
  // 下拉刷新
  onPullDownRefresh () {
    this.page = 1
    this.getAuthorSearchGoodsListFn(true)
  },
  // 上拉加载
  onReachBottom () {
    this.page += 1
    this.getAuthorSearchGoodsListFn(false)
  },
  computed: {
    ...mapState([
      'authorSearchGoodsList'
    ])
  },
  methods: {
    ...mapMutations({
      setAuthorSearchGoodsList: 'SET_AUTHOR_SEARCH_GOODS_LIST'
    }),
    ...mapActions([
      'getAuthorSearchGoodsList'
    ]),
    getAuthorSearchGoodsListFn (isLoading) {
      const data = {
        that: this,
        page: this.page,
        keyword: this.keywords
      }
      if (isLoading) {
        uni.showLoading({ title: 'Loading' })
        this.setAuthorSearchGoodsList([])
      }
      this.getAuthorSearchGoodsList(data).then(() => {
        if (isLoading) uni.hideLoading()
        uni.stopPullDownRefresh()
        uni.hideNavigationBarLoading()
      })
    },
    // Input输入框变化时-热门推荐搜索
    watchInputFn (keywords) {
      this.keywords = keywords
    },
    // 回车搜索
    onEnterFn () {
      this.getAuthorSearchGoodsListFn(true)
    },
    // 一件清空keywords
    onEmptyDataFn () {
      this.keywords = ''
      this.getAuthorSearchGoodsListFn(true)
    },
    // 跳转页面
    onSkipPageFn (url, item) {
      uni.navigateTo({
        url: url + encodeURIComponent(JSON.stringify(item))
      })
    }
  },
  onUnload () {
    this.keywords = ''
  },
  components: {
    InputSeek,
    LoadingMore
  }
}
</script>

<style lang="stylus" scoped>
  .search-goods-wrapper
    width: 100%
    height: auto
    border-top: 1px solid #f2f2f2
    .goods-content
      width: 100%
      height: auto
      padding-top: 55px
      ul
        width: 100%
        height: auto
        li
          width: 100%
          height: auto
          padding: 15px 15px 0 15px
          display: flex
          box-sizing: border-box
          .goods-img
            width: 88px
            height: 88px
            border-radius: 4px
            overflow: hidden
            background-color: #ccc
            img
              width: 100%
              height: 100%
              border-radius: 4px
          .text-box
            flex: 1
            height: auto
            padding: 0 0 15px 15px
            border-bottom: 1px solid #f0f0f0
            h3
              width: 100%
              height: 40px
              line-height: 20px
              font-size: 15px
              display: -webkit-box
              -webkit-box-orient: vertical
              -webkit-line-clamp: 2
              overflow: hidden
              color: #333
            .price
              width: 100%
              height: auto
              padding: 12px 0
              font-size: 10px
              line-height: 14px
              display: flex
              align-items: center
              color: #F94B49
              p
                font-size: 14px
            .lecturer
              width: 100%
              height: auto
              line-height: 10px
              font-size: 10px
              color: #999999
</style>
