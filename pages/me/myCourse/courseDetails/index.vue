<template>
  <div v-if="upyunUrl && oJson" class="course-details-wrapper">
    <div class="course-top">
      <div class="course-bg">
        <img :src="oJson.cover" />
      </div>
      <div
        @click="onSkipPageFn(oJson, true)"
        class="course-box"
      >
        <div class="avatar">
          <img mode="aspectFill" :src="oJson.cover" />
        </div>
        <div class="info">
          <h2 class="title">{{ oJson.title }}</h2>
          <div
            v-if="oJson.headimgurl"
            @click.stop="onSkipPageFn(`/pages/subject/lectureHome/index?id=${oJson.au_id}`, false)"
            class="author-info"
          >
            <img mode="aspectFill" :src="oJson.headimgurl" />
            <p>{{ oJson.nick_name }}</p>
          </div>
          <div v-if="oJson.type === 0" class="bottom">
            <p>实付款</p>
            <p class="price">¥ {{ oJson.price }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="course-content">
      <ul>
        <h3>课程信息</h3>
        <li>
          <p class="title">获课方式</p>
          <p v-if="oJson.type === 0">购买</p>
          <p v-if="oJson.type === 1">瓶盖兑换</p>
          <p v-if="oJson.type === 2">邀请获得</p>
          <p v-if="oJson.type === 3">免费领取</p>
        </li>
        <li>
          <p class="title">订单编号</p>
          <p>{{ oJson.order_no }}</p>
        </li>
        <li>
          <p v-if="oJson.type === 0" class="title">付款时间</p>
          <p v-if="oJson.type === 1" class="title">兑换时间</p>
          <p v-if="oJson.type === 2" class="title">邀请时间</p>
          <p v-if="oJson.type === 3" class="title">领取时间</p>
          <p v-if="oJson.pay_time === null">{{ oJson.pay_time }}</p>
          <p v-else>{{ oJson.ctime }}</p>
        </li>
        <li v-if="(oJson.type !== 2 && oJson.pay_type === 0) || (oJson.type !== 2 && oJson.pay_type === 2)">
          <p class="title">微信支付</p>
          <p>{{ oJson.wx_price }}元</p>
        </li>
        <li v-if="oJson.pay_type === 1 || oJson.pay_type === 2">
          <p class="title">余额支付</p>
          <p>{{ oJson.use_balance }}元</p>
        </li>
        <li v-if="oJson.type === 2">
          <p class="title">已邀请人数</p>
          <p>{{ oJson.join_num }}</p>
        </li>
        <li v-if="oJson.pay_type === 3">
          <p class="title">瓶盖兑换数</p>
          <p>{{ oJson.exchange_price }}</p>
        </li>
        <li v-if="oJson.is_activity">
          <p class="title">已返还</p>
          <p>{{ oJson.back_money || 0 }}元</p>
        </li>
      </ul>
    </div>
    <div class="btn-wrapper" @click="onSkipPageFn(oJson, true)">
      <div class="btn">查看专题</div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { upyunUrl } from '../../../../api/config'

export default {
  data () {
    return {
      upyunUrl,
      oJson: '',
      id: 0
    }
  },
  onLoad (options) {
    this.id = options.id
    this.getCourseInfoFn()
  },
  methods: {
    ...mapActions([
      'getCourseInfo'
    ]),
    // 获取课程详情
    getCourseInfoFn () {
      let data = {
        that: this,
        id: this.id
      }
      uni.showLoading({ title: 'Loading' })
      this.getCourseInfo(data).then((res) => {
        this.oJson = res
        uni.hideLoading()
      })
    },
    // 跳转页面
    onSkipPageFn (oJson, state) {
      let url = ''
      if (state) {
        switch (oJson.v_type) {
          case 0:
            url = `/pages/subject/subjectMusic/index?sid=${oJson.id}`
            break
          case 1:
            oJson['special_id'] = oJson.id
            url = `/pages/subject/subjectVideo/index?oJson=${encodeURIComponent(JSON.stringify(oJson))}`
            break
        }
      } else {
        url = oJson
      }
      uni.navigateTo({
        url
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  .course-details-wrapper
    position: fixed
    left: 0
    top: 0
    width: 100%
    height: 100%
    background-color: #f8f8f8
    .course-top
      position: relative
      width: 100%
      height: 135px
      overflow: hidden
      .course-bg
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        z-index: -1
        background-color: rgba(0, 0, 0, 0.5)
        img
          width: 100%
          height: 100%
          opacity: 0.6
          filter: blur(20px)
      .course-box
        width: 100%
        padding: 15px 30px 0 15px
        display: flex
        box-sizing: border-box
        .avatar
          width: 95px
          height: 95px
          overflow: hidden
          border-radius: 5px
          img
            width: 100%
            height: 100%
        .info
          position: relative
          flex: 1
          padding-left: 25px
          .title
            width: 100%
            min-height: 20px
            line-height: 20px
            font-size: 14px
            display: -webkit-box
            -webkit-box-orient: vertical
            -webkit-line-clamp: 2
            overflow: hidden
            color: #fff
          .author-info
            margin-top: 5px
            width: 100%
            height: auto
            display: flex
            align-items: center
            img
              display: block
              width: 20px
              height: 20px
              border-radius: 50%
            p
              padding-left: 8px
              font-size: 12px
              color: #fff
          .bottom
            position: absolute
            bottom: 0
            width: 100%
            height: auto
            display: flex
            justify-content: space-between
            p
              font-size: 13px
              line-height: 22px
              color: #fff
            .price
              padding: 0 10px
              font-size: 14px
              border-radius: 11px
              background-color: rgba(191,191,191,0.5)
    .course-content
      width: 100%
      height: auto
      padding: 8px
      box-sizing: border-box
      ul
        width: 100%
        height: auto
        padding: 10px 18px
        border-radius: 4px
        background-color: #fff
        box-sizing: border-box
        li
          width: 100%
          height: auto
          border-top: 1px solid #ececec
          display: flex
          align-items: center
          justify-content: space-between
          p
            font-size: 14px
            line-height: 45px
            color: #666666
          .title
            color: #333
        h3
          font-size: 14px
          text-align: center
          line-height: 35px
          font-weight: bold
          color: #333
    .btn-wrapper
      width: 100%
      height: auto
      padding: 10px
      box-sizing: border-box
      .btn
        width: 100%
        height: auto
        line-height: 45px
        text-align: center
        font-size: 14px
        border-radius: 5px
        color: #fff
        background-color: #ff4040
</style>
