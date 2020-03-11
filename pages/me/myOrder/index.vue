<template>
  <div class="order-wrapper">
    <div class="bg-color"></div>
    <div class="nav-wrapper">
      <ul>
        <li :class="{ 'active' : currentIndex === 1 }" @click="onSelectItemFn(1)">书单</li>
        <li :class="{ 'active' : currentIndex === 2 }" @click="onSelectItemFn(2)">其他订单</li>
      </ul>
    </div>
    <order-list :lists="orderList" />
    <!-- 上拉加载更多loading -->
    <loading-more :lists="orderList" :listsLength="10" />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import OrderList from '../../../components/orderListTemplate'
import LoadingMore from '../../../components/loadingMoreTemplate'

export default {
  data () {
    return {
      page: 1,
      status: false,
      currentIndex: 1
    }
  },
  onLoad (options) {
    this.page = 1
    this.status = false
    this.currentIndex = 1
    this.getOrderListFn(true)
    if (options.status) this.status = true
  },
  // 下拉刷新
  onPullDownRefresh () {
    this.page = 1
    this.getOrderListFn(true)
  },
  // 上拉加载
  onReachBottom () {
    this.page += 1
    this.getOrderListFn(false)
  },
  computed: {
    ...mapState([
      'userInfo',
      'orderList'
    ])
  },
  methods: {
    ...mapMutations({
      setOrderList: 'SET_ORDER_LIST'
    }),
    ...mapActions([
      'getOrderList'
    ]),
    // 选择类型
    onSelectItemFn (index) {
      this.setOrderList([])
      this.page = 1
      this.currentIndex = index
      this.getOrderListFn(true)
    },
    // 获取订单列表
    getOrderListFn (isLoading) {
      const data = {
        that: this,
        page: this.page,
        type: this.currentIndex
      }
      if (isLoading) {
        this.setOrderList([])
        uni.showLoading({ title: 'Loading' })
      }
      uni.showNavigationBarLoading()
      this.getOrderList(data).then(() => {
        if (isLoading) uni.hideLoading()
        uni.stopPullDownRefresh()
        uni.hideNavigationBarLoading()
      })
    }
  },
  onUnload () {
    this.setOrderList([])
    if (!this.status) uni.switchTab({ url: '/pages/me/index' })
  },
  components: {
    OrderList,
    LoadingMore
  }
}
</script>

<style lang="stylus" scoped>
  .order-wrapper
    width: 100%
    height: auto
    .nav-wrapper
      position: fixed
      left: 0
      top: 0
      width: 100%
      height: auto
      background-color: #fff
      z-index: 99
      ul
        width: 100%
        height: auto
        display: flex
        align-items: center
        justify-content: space-around
        background-color: #fff
        border-bottom: 1px solid #f5f5f5
        li
          padding: 15px 0
          font-size: 16px
          font-weight: bold
          line-height: 16px
          color: #666
          &.active
            color: #ff4040
            border-bottom: 2px solid #ff4040
</style>
