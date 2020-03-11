<template>
  <div v-if="upyunUrl && obj" class="consulting-pay-wrapper">
    <div v-if="obj.is_pay === 0" class="process-box">
      <img :src="upyunUrl + '/wxXcxImg/images/consulting-icon8.jpg'" />
    </div>
    <div class="copywriter-box">
      <ul v-if="obj.service.length">
        <li v-for="(item, index) in obj.service" :key="index">{{ item }}</li>
      </ul>
      <div class="price-box"><p>¥</p>{{ obj.price }}</div>
    </div>
    <div v-if="obj.is_pay === 1" class="pay-info">
      <ul>
        <li @click="onCallPhoneFn(obj.phone)">
          <div class="title">讲师电话:</div>
          <p>{{ obj.phone }}</p>
          <div class="btn">拨打</div>
        </li>
        <li @click="onCopyTextFn(obj.weixin)">
          <div class="title">讲师微信:</div>
          <p>{{ obj.weixin }}</p>
          <div class="btn">复制</div>
        </li>
        <li v-if="obj.order_info">
          <div class="title">订单编号:</div>
          <p>{{ obj.order_info.order_no }}</p>
        </li>
        <li v-if="obj.order_info">
          <div class="title">支付时间:</div>
          <p>{{ obj.order_info.pay_time }}</p>
        </li>
      </ul>
      <div class="price-box">
        <div class="title">实付：</div>
        <p>¥ {{ obj.price }}</p>
      </div>
    </div>
    <div v-if="obj.is_pay === 1" class="notice-box">
      <h3>咨询须知</h3>
      <p>{{ obj.rule }}</p>
    </div>
    <div v-if="obj.is_pay === 0" class="bottom-btn">
      <div class="price"><p>¥</p>{{ obj.price }}</div>
      <div
        @click.stop="onSkipPageFn(`/pages/subject/submitPay/index?oJson=`)"
        class="btn"
      >提交订单</div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { upyunUrl } from '../../../../../api/config'

export default {
  data () {
    return {
      upyunUrl,
      oJson: '',
      obj: ''
    }
  },
  onLoad (options) {
    this.oJson = JSON.parse(decodeURIComponent(options.oJson))
  },
  onShow () {
    this.getConsultInfoFn()
  },
  // 下拉刷新
  onPullDownRefresh () {
    this.getConsultInfoFn()
  },
  methods: {
    ...mapActions([
      'getConsultInfo'
    ]),
    // 获取咨询信息
    getConsultInfoFn () {
      uni.showLoading({ title: 'Loading' })
      this.getConsultInfo({ that: this, id: this.oJson.id }).then((res) => {
        res['buy_type'] = 'consulting'
        this.obj = res
        uni.hideLoading()
        uni.stopPullDownRefresh()
      })
    },
    // 拨打电话
    onCallPhoneFn (phone) {
      uni.makePhoneCall({
        phoneNumber: phone
      })
    },
    // 复制文本
    onCopyTextFn (url) {
      uni.showModal({
        title: '复制成功',
        content: '微信号：' + url,
        confirmColor: '#e1564f',
        success () {
          uni.setClipboardData({
            data: url
          })
        }
      })
    },
    // 跳转页面
    onSkipPageFn (url) {
      uni.navigateTo({
        url: url + encodeURIComponent(JSON.stringify(this.obj))
      })
    }
  },
  onUnload () {
    this.obj = ''
  }
}
</script>

<style lang="stylus" scoped>
  .consulting-pay-wrapper
    width: 100%
    height: auto
    border-top: 1px solid #f2f2f2
    .process-box
      width: 100%
      height: 53px
      border-bottom: 1px solid #f2f2f2
      img
        width: 100%
        height: 100%
    .copywriter-box
      width: 100%
      height: auto
      padding: 15px
      box-sizing: border-box
      ul
        width: 100%
        height: auto
        li
          width: 100%
          height: auto
          line-height: 30px
          font-size: 14px
          color: #333
      .price-box
        padding-top: 10px
        font-size: 18px
        font-weight: bold
        display: flex
        color: #F94B49
        p
          padding-right: 2px
          font-size: 12px
          line-height: 29px
    .pay-info
      width: 100%
      height: auto
      padding: 15px
      border-top: 1px solid #f2f2f2
      border-bottom: 1px solid #f2f2f2
      box-sizing: border-box
      ul
        width: 100%
        height: auto
        li
          width: 100%
          height: auto
          line-height: 35px
          font-size: 14px
          display: flex
          align-items: center
          .title
            color: #999999
          p
            padding: 0 10px
            color: #333
          .btn
            width: auto
            height: auto
            padding: 0 8px
            line-height: 20px
            font-size: 10px
            border-radius: 10px
            border: 1px solid #d6d6d6
            color: #999
      .price-box
        width: 100%
        height: auto
        padding-top: 10px
        display: flex
        align-items: center
        font-size: 14px
        font-weight: bold
        .title
          color: #333
        p
          color: #F94B49
    .notice-box
      width: 100%
      height: auto
      padding: 5px 15px
      box-sizing: border-box
      h3
        font-size: 14px
        line-height: 30px
        font-weight: bold
        color: #333
      p
        font-size: 13px
        line-height: 22px
        color: #999
    .bottom-btn
      position: fixed
      left: 0
      bottom: 0
      width: 100%
      height: auto
      padding: 15px 10px
      display: flex
      z-index: 999
      background-color: #fff
      box-sizing: border-box
      .price
        flex: 1
        font-size: 22px
        line-height: 44px
        font-weight: bold
        display: flex
        color: #F94B49
        p
          padding-right: 2px
          font-size: 12px
          line-height: 49px
      .btn
        width: auto
        height: auto
        padding: 0 50px
        line-height: 44px
        font-size: 16px
        border-radius: 4px
        color: #fff
        background-color: #F94B49
</style>
