<template>
  <div v-if="upyunUrl && obj" class="details-wrapper">
    <div v-if="obj.type" class="order-info">
      <div class="money-box">
        <div class="text">入账金额 (元)</div>
        <div class="money">+{{ obj.fee }}</div>
      </div>
      <ul>
        <li>
          <div class="title">入账时间</div>
          <div class="content">{{ obj.ctime }}</div>
        </li>
        <li>
          <div class="title">收入类型</div>
          <div v-if="obj.type === 20" class="content">抢学费</div>
          <div v-if="obj.type === 21" class="content">受邀请分学费</div>
          <div v-if="obj.type === 22" class="content">购买课程返现</div>
          <div v-if="obj.type === 23" class="content">课程收入所得</div>
          <div v-if="obj.type === 24" class="content">咨询服务所得</div>
        </li>
        <li>
          <div class="title">名称</div>
          <div class="content">{{ obj.title }}</div>
        </li>
        <li>
          <div class="title">订单编号</div>
          <div class="content">{{ obj.order_no }}</div>
        </li>
      </ul>
    </div>
    <div v-else class="order-info">
      <div class="money-box">
        <div class="text">支出金额 (元)</div>
        <div class="money pay">-{{ obj.order_price }}</div>
      </div>
      <ul>
        <li>
          <div class="title">支出时间</div>
          <div class="content">{{ obj.pay_time }}</div>
        </li>
        <li>
          <div class="title">支付类型</div>
          <div v-if="obj.pay_type === 0" class="content">微信支付</div>
          <div v-if="obj.pay_type === 1" class="content">余额支付</div>
          <div v-if="obj.pay_type === 2" class="content">混合支付</div>
        </li>
        <li v-if="obj.pay_type === 2">
          <div class="title">余额支付</div>
          <div class="content">{{ obj.use_balance }}元</div>
        </li>
        <li v-if="obj.pay_type === 2">
          <div class="title">微信支付</div>
          <div class="content">{{ obj.wx_price }}元</div>
        </li>
        <li>
          <div class="title">名称</div>
          <div class="content">{{ obj.title }}</div>
        </li>
        <li>
          <div class="title">订单编号</div>
          <div class="content">{{ obj.order_no }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { upyunUrl } from '../../../../api/config'

export default {
  data () {
    return {
      upyunUrl,
      obj: ''
    }
  },
  onLoad (options) {
    this.obj = JSON.parse(decodeURIComponent(options.oJson))
    if (this.obj.type) {
      uni.setNavigationBarTitle({
        title: '收入详情'
      })
    } else {
      uni.setNavigationBarTitle({
        title: '支出详情'
      })
    }
  },
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  methods: {
  }
}
</script>

<style lang="stylus" scoped>
  .details-wrapper
    position: fixed
    left: 0
    top: 0
    right: 0
    bottom: 0
    width: 100%
    height: 100%
    background-color: #f8f8f8
    .order-info
      width: 100%
      height: auto
      background-color: #fff
      .money-box
        padding: 20px 15px
        box-sizing: border-box
        border-bottom: 1px solid #efefef
        .text
          margin-bottom: 14px
          font-size: 12px
          color: #999
        .money
          font-size: 18px
          color: #0eb756
          &.pay
            color: #ff4040
      ul
        padding: 18px 15px 15px
        box-sizing: border-box
        li
          margin-bottom: 18px
          display: flex
          align-items: center
          justify-content: space-between
          font-size: 14px
          line-height: 14px
          .title
            padding-right: 30px
            color: #666
          .content
            flex: 1
            height: 14px
            text-align: right
            color: #333
            display: -webkit-box
            -webkit-box-orient: vertical
            -webkit-line-clamp: 1
            overflow: hidden
</style>
