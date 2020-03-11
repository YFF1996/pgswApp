<template>
  <div v-if="upyunUrl" class="info-wrapper">
    <ul v-if="list.length">
      <li
        v-for="(item, index) in list"
        @click="onSkipPageFn(item)"
        :key="index"
      >
        <div class="avatar">
          <img mode="aspectFill" :src="item.cover" />
        </div>
        <div class="info">
          <h3>{{ item.title }}</h3>
          <div class="bottom">
            <div class="price">
              <span class="money">￥</span>
              <span class="num">{{ item.order_price }}</span>
            </div>
            <div v-if="item.type === 20" class="get-way">抢学费所得{{ item.fee }}元</div>
            <div v-if="item.type === 21" class="get-way">受邀请分学费所得{{ item.fee }}元</div>
            <div v-if="item.type === 22" class="get-way">购买课程返学费{{ item.fee }}元</div>
            <div v-if="item.type === 23" class="get-way">课程收入所得{{ item.fee }}元</div>
            <div v-if="item.type === 24" class="get-way">咨询服务所得{{ item.fee }}元</div>
            <div v-if="(item.pay_type === 0 && !item.type)" class="get-way">微信支付</div>
            <div v-if="item.pay_type === 1 && !item.type" class="get-way">余额支付</div>
            <div v-if="(item.pay_type === 2 && !item.type)" class="get-way">混合支付</div>
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
    onSkipPageFn (item) {
      uni.navigateTo({
        url: `/pages/me/amount/amountDetails/index?oJson=${encodeURIComponent(JSON.stringify(item))}`
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
  .info-wrapper
    width: 100%
    height: auto
    ul
      padding: 15px
      width: 100%
      height: auto
      box-sizing: border-box
      li
        padding-bottom: 15px
        margin-bottom: 15px
        display: flex
        border-bottom: 1px solid #f5f5f5
        .avatar
          width: 55px
          height: 55px
          img
            width: 100%
            height: 100%
        .info
          margin-left: 10px
          flex: 1
          position: relative
          box-sizing: border-box
          h3
            margin-top: -3px
            font-size: 14px
            line-height: 18px
            color: #333
            display: -webkit-box
            -webkit-box-orient: vertical
            -webkit-line-clamp: 2
            overflow: hidden
          .bottom
            position: absolute
            bottom: 0
            margin-top: 5px
            width: 100%
            height: auto
            display: flex
            align-items: center
            justify-content: space-between
            .price
              flex: 1
              color: #333
              span
                font-size: 11px
                padding-right: 2px
                &.num
                  font-size: 14px
                  font-weight: bold
            .get-way
              font-size: 14px
              color: #ff4040
        &:last-child
          border: none
</style>
