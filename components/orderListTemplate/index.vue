<template>
  <div class="info-wrapper">
    <ul>
      <li
        v-if="lists.length"
        v-for="(item, index) in lists"
        :key="index"
        @click="onSkipOrderDetailsFn(item.id)"
      >
        <div v-if="item.state === '1'" class="state">已发货</div>
        <div v-if="item.state === '0'" class="state out">待发货</div>
        <div v-if="item.state === '2'" class="state put">已完成</div>
        <div class="avatar">
          <img mode="aspectFill" :src="item.goodsInfo.cover" />
        </div>
        <div class="info">
          <h3>{{ item.goodsInfo.title }}</h3>
          <div class="hint">{{ item.goodsInfo.intro }}</div>
          <div class="bottom">
            <div class="price">
              <span class="money">￥</span>
              <span class="new">{{ item.goodsInfo.price }}</span>
            </div>
            <div class="get-way" v-if="item.type === '1'">抢书订单</div>
            <div class="get-way" v-if="item.type === '2'">瓶盖兑换</div>
            <div class="get-way" v-if="item.type === '3'">购买订单</div>
            <div class="get-way" v-if="item.type === '4'">抽奖订单</div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    // 跳转订单详情
    onSkipOrderDetailsFn (id) {
      uni.navigateTo({
        url: `/pages/me/myOrder/orderDetails/index?id=${id}`
      })
    }
  },
  props: {
    lists: {
      type: Array,
      default: []
    }
  }
}
</script>

<style lang="stylus" scoped>
  .info-wrapper
    margin: 65px 0 10px
    width: 100%
    height: auto
    background-color: #f8f8f8
    ul
      width: 100%
      height: auto
      li
        position: relative
        padding: 40px 20px 25px 15px
        margin-bottom: 10px
        display: flex
        align-items: center
        box-sizing: border-box
        background-color: #fff
        .state
          position: absolute
          right: 0
          top: 10px
          width: 58px
          height: 24px
          line-height: 24px
          font-size:12px
          text-align:  center
          color: #fff
          border-radius: 12px 0px 0px 12px
          background: #f2c24d
          &.out
            background: #ff4040
          &.put
            background: #ff4040
        .avatar
          width: 91px
          height: 91px
          img
            width: 100%
            height: 100%
        .info
          flex: 1
          position: relative
          padding-left: 15px
          height: 91px
          h3
            height: 16px
            font-size: 15px
            font-weight: bold
            line-height: 16px
            color: #333
            display: -webkit-box
            -webkit-box-orient: vertical
            -webkit-line-clamp: 1
            overflow: hidden
          .hint
            margin: 10px 0 15px
            height: 36px
            line-height: 18px
            font-size: 14px
            display: -webkit-box
            -webkit-box-orient: vertical
            -webkit-line-clamp: 2
            overflow: hidden
          .bottom
            display: flex
            align-items: center
            justify-content: space-between
            .price
              height: 16px
              line-height: 16px
              span
                font-size: 12px
                color: #ff4040
                &.new
                  font-size: 16px
                  padding-right: 12px
            .get-way
              font-size: 12px
              line-height: 16px
              color: #ff4040
</style>
