<template>
  <div class="book-content" v-if="upyunUrl">
    <ul>
      <li
        v-if="list.length"
        v-for="(item, index) in list"
        :key="index"
        @click="onSkipBookDetailFn(item.id)"
      >
        <div class="book-img">
          <img mode="aspectFill" :src="item.cover" />
        </div>
        <div class="book-text">
          <h2>{{ item.title }}</h2>
          <div class="info-box">
            <div class="num-box">
              <img :src="upyunUrl + '/wxXcxImg/images/mission-icon03.png'" />
              <div class="num">{{ item.exchange_price }}</div>
            </div>
            <div class="original-price" v-if="item.market_price">市场价：<span>{{ item.market_price }}元</span></div>
          </div>
          <div class="book-bottom">
            <h5>兑换量{{ item.exchange_num }}</h5>
            <h5 class="price">购买价：{{ item.price }}元</h5>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { upyunUrl } from '../../api/config'

export default {
  data () {
    return {
      upyunUrl
    }
  },
  methods: {
    onSkipBookDetailFn (id) {
      uni.navigateTo({
        url: `/pages/mission/bookDetail/index?id=${id}`
      })
    }
  },
  props: {
    list: {
      type: Array,
      default: []
    }
  }
}
</script>

<style lang="stylus" scoped>
  .book-content
    width: 100%
    height: auto
    ul
      width: 100%
      height: auto
      li
        width: 100%
        height: auto
        padding: 20px 0
        border-bottom: 1px solid #DDDDDD
        display: flex
        .book-img
          width: 90px
          height: 90px
          img
            width: 100%
            height: 100%
        .book-text
          position: relative
          flex: 1
          padding-left: 15px
          h2
            font-size: 15px
            line-height: 20px
            display: -webkit-box
            -webkit-box-orient: vertical
            -webkit-line-clamp: 2
            overflow: hidden
            color: #333333
        .info-box
          display: flex
          align-items: center
          justify-content: space-between
          .num-box
            margin: 7px 0
            padding-right: 8px
            display: flex
            align-items: center
            img
              display: block
              width: 16px
              height: 16px
            .num
              padding-left: 5px
              font-size: 16px
              color: #e1564f
          .original-price
            font-size: 14px
            span
              text-decoration: line-through
              color: #e1564f
        .book-bottom
          width: 100%
          height: auto
          overflow: hidden
          h5
            font-size: 14px
            float: left
            color: #333
          .price
            float: right
      li:last-child
        border-bottom: none
</style>
