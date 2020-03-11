<template>
  <div v-if="oJson && upyunUrl" class="details-wrapper">
    <scroll-view
      v-if="oJson.goodsInfo"
      :scroll-y="true"
      class="scroll-view"
    >
      <div class="site-box">
        <div class="site-icon">
          <img :src="upyunUrl + '/wxXcxImg/images/site-icon.png'" />
        </div>
        <div class="site-info">
          <h2>{{ oJson.name }}</h2>
          <div class="phone">{{ oJson.phone }}</div>
          <div class="site">{{ oJson.address }}</div>
        </div>
      </div>
      <div class="order-box">
        <h2>商品清单</h2>
        <div class="order-content">
          <div class="avatar">
            <img mode="aspectFill" :src="oJson.goodsInfo.cover" />
          </div>
          <div class="info">
            <h3>{{ oJson.goodsInfo.title }}</h3>
            <div class="hint">{{ oJson.goodsInfo.intro }}</div>
            <div class="bottom">
              <div class="left">
                <span class="num">￥{{ oJson.goodsInfo.price }}</span>
              </div>
              <div class="get-way" v-if="oJson.type === '1'">抢书订单</div>
              <div class="get-way" v-if="oJson.type === '2'">瓶盖兑换</div>
              <div class="get-way" v-if="oJson.type === '3'">购买订单</div>
              <div class="get-way" v-if="oJson.type === '4'">抽奖订单</div>
            </div>
          </div>
        </div>
      </div>
      <div class="order-info">
        <h2>订单信息</h2>
        <ul>
          <li>
            <div class="title">订单编号</div>
            <div class="content">{{ oJson.order_no }}</div>
          </li>
          <li>
            <div class="title">兑换时间</div>
            <div class="content">{{ oJson.ctime }}</div>
          </li>
          <li>
            <div class="title">发货状态</div>
            <div class="content" v-if="oJson.state === '0'">待发货</div>
            <div class="content" v-if="oJson.state === '1'">已发货</div>
            <div class="content" v-if="oJson.state === '2'">已完成</div>
          </li>
          <li>
            <div class="title">物流公司</div>
            <div class="content">{{ oJson.wl_gs || '待发货' }}</div>
          </li>
          <li>
            <div class="title">物流单号</div>
            <div class="content order" v-if="oJson.wl_no" @click="onCopyTextFn(oJson.wl_no)">{{ oJson.wl_no}}</div>
            <div class="content" v-else>待发货</div>
          </li>
          <li>
            <div class="title">发货时间</div>
            <div class="content">{{ oJson.fh_time }}</div>
          </li>
        </ul>
      </div>
    </scroll-view>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { upyunUrl } from '../../../../api/config'

export default {
  data () {
    return {
      upyunUrl,
      oJson: ''
    }
  },
  onLoad (options) {
    this.getOrderDetailFn(options.id)
  },
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  methods: {
    ...mapActions([
      'getOrderDetail'
    ]),
    // 获取订单详情
    getOrderDetailFn (id) {
      const data = {
        that: this,
        id
      }
      this.getOrderDetail(data).then((res) => {
        this.oJson = res
      })
    },
    // 复制订单号
    onCopyTextFn (text) {
      uni.setClipboardData({
        data: text,
        success () {
          uni.showToast({
            title: '复制成功'
          })
        }
      })
    }
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
    height: auto
    padding-top: 10px
    box-sizing: border-box
    background-color: #f8f8f8
    .scroll-view
      width: 100%
      height: 100%
      .site-box
        padding: 22px 10px 28px 30px
        width: 100%
        height: auto
        box-sizing: border-box
        display: flex
        align-items: center
        background-color: #fff
        .site-icon
          width: 23px
          height: 23px
          img
            width: 100%
            height: 100%
        .site-info
          flex: 1
          padding-left: 17px
          color: #4d4d4d
          h2
            font-size: 16px
            line-height: 16px
          .phone
            margin: 9px 0 11px
            font-size: 14px
            line-height: 14px
          .site
            font-size: 12px
            line-height: 12px
      .order-box
        padding: 13px 15px
        margin: 10px 0
        width: 100%
        height: auto
        box-sizing: border-box
        background-color: #fff
        .h2
          font-size: 15px
          line-height: 15px
          color: #2b2b2b
        .order-content
          margin-top: 15px
          display: flex
          align-items: center
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
              font-size: 16px
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
              height: 16px
              line-height: 16px
              .left
                font-size: 12px
                color: #333
                .num
                  padding-right: 14px
              .get-way
                font-size: 12px
                color: #e1564f
      .order-info
        padding: 16px 15px
        width: 100%
        height: auto
        box-sizing: border-box
        background-color: #fff
        .h2
          font-size: 15px
          line-height: 15px
          color: #2c2c2c
        ul
          margin-top: 19px
          li
            margin-bottom: 15px
            display: flex
            align-items: center
            justify-content: space-between
            font-size: 14px
            line-height: 14px
            .title
              color: #6b6b6b
            .content
              color: #2c2c2c
              &.order
                color: #5594ff
                text-decoration: underline
    ::-webkit-scrollbar
      width: 0
      height: 0
      color: transparent
      display: none
</style>
