<template>
  <div class="in-the-book-list" v-if="upyunUrl">
    <ul v-if="list.length">
      <li  v-for="(item, index) in list" :key="index">
        <div class="cover">
          <img :src="item.cover" mode="aspectFill" />
        </div>
        <div class="book-text">
          <div class="book-info">
            <h3>{{ item.title }}</h3>
            <div class="btn btn-active" v-if="item.order_id">已领取</div>
            <div
              class="btn"
              @click="onSkipAffirmOrderFn(item, 'grab')"
              v-else
            >填写地址</div>
          </div>
          <p>中奖时间：{{ item.grab_set_time }}</p>
        </div>
      </li>
    </ul>
    <div class="no-data-wrapper" v-else>
      <img :src="upyunUrl + '/wxXcxImg/images/in-the-book-no.png'" />
      <p>无中奖记录</p>
    </div>
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
    // 跳转确认订单页面
    onSkipAffirmOrderFn (item, text) {
      item['orderType'] = text
      uni.navigateTo({
        url: `/pages/mission/affirmOrder/index?oJson=${encodeURIComponent(JSON.stringify(item))}`
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
  .in-the-book-list
    width: 100%
    height: auto
    padding: 0 15px 0 15px
    box-sizing: border-box
    ul
      width: 100%
      height: auto
      li
        width: 100%
        height: auto
        border-bottom: 1px solid #ddd
        padding: 15px 0 20px
        display: flex
        .cover
          width: 90px
          height: 90px
          border-radius: 2px
          overflow: hidden
          img
            width: 100%
            height: 100%
        .book-text
          flex: 1
          height: auto
          padding: 10px 0 0 15px
          .book-info
            width: 100%
            height: 35px
            display: flex
            align-items: center
            h3
              flex: 1
              height: 35px
              line-height: 35px
              font-size: 16px
              display: -webkit-box
              -webkit-box-orient: vertical
              -webkit-line-clamp: 1
              overflow: hidden
              color: #333333
            .btn
              padding: 0 10px
              font-size: 12px
              line-height: 20px
              border-radius: 10px
              color: #fff
              background-color: #e1564f
            .btn-active
              background-color: #999
          p
            line-height: 45px
            font-size: 14px
            color: #333333
    .no-data-wrapper
      width: 100%
      height: auto
      padding-top: 35px
      img
        width: 52px
        height: 45px
        display: block
        margin: 0 auto
      p
        text-align: center
        font-size: 18px
        line-height: 60px
        color: #333
</style>
