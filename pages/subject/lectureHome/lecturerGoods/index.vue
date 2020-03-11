<template>
  <div v-if="upyunUrl && authorObj" class="lecturer-goods-wrapper">
    <div class="goods-content">
      <div class="goods-operate">
        <div class="goods-num">在售商品<p>（{{ goodsTotal }}件商品）</p></div>
        <div
          @click="onSelectPriceFn()"
          class="select-price"
        >
          <p>价格</p>
          <div class="select-icon">
            <div
              class="triangle triangle-up"
              :class="{'triangle-active' : sort === 'desc'}"
            ></div>
            <div
              class="triangle triangle-down"
              :class="{'triangle-active' : sort === 'asc'}"
            ></div>
          </div>
        </div>
        <div
          @click="onSkipPageFn(`/pages/subject/lectureHome/lecturerGoods/searchGoods/index`)"
          class="search-box"
        >
          <div class="icon">
            <img :src="upyunUrl + '/wxXcxImg/images/search-icon.png'" />
          </div>
          <p>搜索商品</p>
        </div>
      </div>
      <div class="goods-content-list">
        <ul v-if="authorWindowGoodsList.length">
          <li
            v-for="(item, index) in authorWindowGoodsList"
            @click="onSkipLecturerGoodsDetailsFn(item)"
            :key="index"
          >
            <div class="goods-img">
              <img mode="aspectFill" :src="item.cover" />
            </div>
            <div class="goods-info">
              <h3>{{ item.name }}</h3>
              <div class="price">¥{{ item.price }}</div>
            </div>
          </li>
        </ul>
        <loading-more :lists="authorWindowGoodsList" :listsLength="16" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { upyunUrl } from '../../../../api/config'
import LoadingMore from '../../../../components/loadingMoreTemplate'

export default {
  data () {
    return {
      upyunUrl,
      oJson: '',
      authorObj: '',
      page: 1,
      sort: 'desc',
      goodsTotal: 0
    }
  },
  onLoad (options) {
    this.page = 1
    this.oJson = JSON.parse(decodeURIComponent(options.oJson))
    this.getLectureInfoFn()
    this.getAuthorWindowGoodsListFn(true)
  },
  // 下拉刷新
  onPullDownRefresh () {
    this.page = 1
    this.getLectureInfoFn()
    this.getAuthorWindowGoodsListFn(true)
  },
  // 上拉加载
  onReachBottom () {
    this.page += 1
    this.getAuthorWindowGoodsListFn(false)
  },
  computed: {
    ...mapState([
      'userInfo',
      'authorWindowGoodsList'
    ])
  },
  methods: {
    ...mapMutations({
      setAuthorWindowGoodsList: 'SET_AUTHOR_WINDOW_GOODS_LIST'
    }),
    ...mapActions([
      'getLectureInfo',
      'concernAuthor',
      'getAuthorWindowGoodsList'
    ]),
    // 获取讲师基本信息
    getLectureInfoFn () {
      let data = {
        that: this,
        id: this.oJson.id
      }
      this.getLectureInfo(data).then((res) => {
        this.authorObj = res
      })
    },
    // 关注讲师
    onConcernAuthorFn (state) {
      if (this.userInfo) {
        this.authorObj.is_concern = state === 1 ? 0 : 1
        this.concernAuthor({ that: this, au_id: this.authorObj.id })
      } else {
        this.onSkipPageFn(`/pages/login/index`)
      }
    },
    // 获取讲师橱窗商品列表
    getAuthorWindowGoodsListFn (isLoading) {
      const data = {
        that: this,
        sort: this.sort,
        page: this.page,
        id: this.oJson.id
      }
      if (isLoading) {
        uni.showLoading({ title: 'Loading' })
        this.setAuthorWindowGoodsList([])
      }
      this.getAuthorWindowGoodsList(data).then((res) => {
        this.goodsTotal = res.total
        if (isLoading) uni.hideLoading()
        uni.stopPullDownRefresh()
        uni.hideNavigationBarLoading()
      })
    },
    // 通过价格筛选商品
    onSelectPriceFn () {
      this.page = 1
      this.sort = this.sort === 'desc' ? 'asc' : 'desc'
      this.getAuthorWindowGoodsListFn(true)
    },
    // 跳转页面
    onSkipPageFn (url) {
      uni.navigateTo({
        url: url
      })
    },
    onSkipLecturerGoodsDetailsFn (item) {
      uni.navigateTo({
        url: `/pages/subject/lectureHome/lecturerGoods/lecturerGoodsDetails/index?oJson=${encodeURIComponent(JSON.stringify(item))}`
      })
    }
  },
  onUnload () {
    this.authorObj = ''
  },
  components: {
    LoadingMore
  }
}
</script>

<style lang="stylus" scoped>
  .lecturer-goods-wrapper
    width: 100%
    height: auto
    .goods-content
      width: 100%
      height: auto
      padding: 0 15px
      background-color: #fff
      box-sizing: border-box
      .goods-operate
        width: 100%
        height: auto
        padding: 15px 0 20px 0
        display: flex
        align-items: center
        .goods-num
          flex: 1
          display: flex
          font-size: 13px
          color: #999
          p
            color: #000
        .select-price
          width: auto
          height: auto
          margin: 0 15px
          display: flex
          align-items: center
          p
            padding-right: 3px
            font-size: 13px
            color: #000
          .select-icon
            width: auto
            height: auto
            .triangle
              width: 0
              height: 0
              border: 4px solid
            .triangle-up
              margin-bottom: 3px
              border-color: transparent transparent #ccc
            .triangle-down
              margin-top: 3px
              border-color: #ccc transparent transparent
            .triangle-up.triangle-active
              border-color: transparent transparent #333
            .triangle-down.triangle-active
              border-color: #333 transparent transparent
        .search-box
          width: 140px
          height: 30px
          padding: 0 10px
          border-radius: 15px
          display: flex
          align-items: center
          background-color: #f6f6f6
          box-sizing: border-box
          .icon
            width: 12px
            height: 12px
            img
              display: block
              width: 100%
              height: 100%
          p
            flex: 1
            padding-left: 10px
            font-size: 12px
            color: #999
      .goods-content-list
        width: 100%
        height: auto
        ul
          width: 100%
          height: auto
          display: flex
          justify-content: space-between
          flex-wrap: wrap
          li
            width: 165px
            height: auto
            padding-bottom: 15px
            .goods-img
              width: 100%
              height: 165px
              border-radius: 4px
              overflow: hidden
              background-color: #ccc
              img
                width: 100%
                height: 100%
                border-radius: 4px
            .goods-info
              width: 100%
              height: auto
              padding: 5px
              box-sizing: border-box
              h3
                width: 100%
                height: 40px
                line-height: 20px
                font-size: 13px
                display: -webkit-box
                -webkit-box-orient: vertical
                -webkit-line-clamp: 2
                overflow: hidden
                color: #333
              .price
                width: 100%
                height: auto
                line-height: 24px
                font-size: 13px
                color: #F94B49
</style>
