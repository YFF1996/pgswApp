<template>
  <div v-if="upyunUrl && oJson" class="tuition-share-wrapper">
    <div class="banner">
      <img :src="upyunUrl + '/wxXcxImg/images/tuition-shared-bg.png'" />
      <div class="btn">学完课程，邀请好友返还{{ oJson.sp_back_percent}}%学费</div>
    </div>
    <div class="share-content">
      <div class="info-bg">
        <div class="info-box">
          <div v-if="oJson.status === 0" class="time-box">
            <ul>
              <li class="time">{{ date.days }}</li>
              <li>天</li>
              <li class="time">{{ date.hours }}</li>
              <li>时</li>
              <li class="time">{{ date.minutes }}</li>
              <li>分</li>
              <li class="time second">{{ date.seconds }}</li>
              <li>秒</li>
            </ul>
            <div class="hint">后将失去学费返还机会</div>
          </div>
          <div class="process-box">
            <div class="title-box">
              <i class="left-icon">
                <img :src="upyunUrl + '/wxXcxImg/images/fee-title-icon.png'" />
              </i>
              <h2>学习进度</h2>
              <i>
                <img :src="upyunUrl + '/wxXcxImg/images/fee-title-icon.png'" />
              </i>
            </div>
            <div class="process-info">
              <div class="text">已学</div>
              <div class="process-line">
                <div class="active-line" :style="{width: oJson.learn_progress + '%'}">
                  <i>
                    <img :src="upyunUrl + '/wxXcxImg/images/gold-icon.png'" />
                  </i>
                </div>
              </div>
              <div class="num">{{ oJson.learn_progress }}%</div>
            </div>
          </div>
          <div class="invite-box">
            <div class="title-box">
              <i class="left-icon">
                <img :src="upyunUrl + '/wxXcxImg/images/fee-title-icon.png'" />
              </i>
              <h2>邀请记录</h2>
              <i>
                <img :src="upyunUrl + '/wxXcxImg/images/fee-title-icon.png'" />
              </i>
            </div>
            <ul v-if="oJson.invite_list.length">
              <li v-for="(item, index) in oJson.invite_list" :key="index">
                <div class="avatar">
                  <img mode="aspectFill" :src="item.avatarurl" />
                </div>
                <h3>{{ item.nickname }}</h3>
                <div class="time">{{ item.ctime }}</div>
              </li>
            </ul>
            <div v-else class="no-data-wrapper">
              <img :src="upyunUrl + '/wxXcxImg/images/not-data-icon.png'" />
              <div class="title">还没邀请好友，邀好友一起拿学费</div>
            </div>
          </div>
          <div class="bottom-info">
            <div
              v-if="oJson.order_is_my && oJson.status === 0"
              class="btn-box"
            >
              <div
                v-if="oJson.sp_inv_num - oJson.invite_list.length === oJson.sp_inv_num"
                @click="onMoreOperateFn()"
                class="btn"
              >
                去邀请好友
              </div>
              <div
                v-if="oJson.sp_inv_num - oJson.invite_list.length !== oJson.sp_inv_num && oJson.sp_inv_num - oJson.invite_list.length !== 0"
                @click="onMoreOperateFn()"
                class="btn"
              >
                继续邀请好友
              </div>
              <div
                v-if="oJson.sp_inv_num - oJson.invite_list.length === 0 && oJson.learn_progress !== 100"
                @click="onSkipPageFn(`/pages/subject/subjectMusic/index?sid=${oJson.sp_id}`)"
                class="btn"
              >
                去学习课程
              </div>
              <div v-if="oJson.sp_inv_num - oJson.invite_list.length !== 0 || oJson.learn_progress !== 100" class="hint">邀请{{ oJson.sp_inv_num }}位好友一起分学费，并学完课程即可获得{{ oJson.sp_back_percent }}%返现</div>
            </div>
            <div
              v-if="oJson.order_is_my && oJson.status === 1"
              class="btn-box"
            >
              <div class="btn btn-gray">已到账</div>
            </div>
            <div
              v-if="oJson.order_is_my && oJson.status === 2"
              class="btn-box"
            >
              <div class="btn btn-gray">任务超时，学费返还失败</div>
            </div>
            <div v-if="!oJson.order_is_my" class="rule-box">
              <h3>提醒好友，在限制时间内完成</h3>
              <div class="text">
                <i>1</i>
                <span>听完课程</span>
              </div>
              <div class="text">
                <i>2</i>
                <span>成功邀请{{ oJson.sp_inv_num }}个好友</span>
              </div>
              <h2>你抢到的学费才到账哦</h2>
            </div>
          </div>
        </div>
      </div>
      <div class="info-bg">
        <div class="record-box info-box">
          <div class="invite-box">
            <div class="title-box">
              <i class="left-icon">
                <img :src="upyunUrl + '/wxXcxImg/images/fee-title-icon.png'" />
              </i>
              <h2 class="record-title">抢学费记录</h2>
              <i>
                <img :src="upyunUrl + '/wxXcxImg/images/fee-title-icon.png'" />
              </i>
            </div>
            <ul v-if="oJson.grab_list.length">
              <li v-for="(item, index) in oJson.grab_list" :key="index">
                <div class="avatar">
                  <img mode="aspectFill" :src="item.avatarurl" />
                </div>
                <h3>{{ item.nickname }}<span v-if="oJson.status === 1">+{{ item.money }}元</span></h3>
                <div class="time">{{ item.ctime }}</div>
              </li>
            </ul>
            <div v-else class="no-data-wrapper">
              <img :src="upyunUrl + '/wxXcxImg/images/not-data-icon.png'" />
              <div class="title">还没有记录，分享邀更多的好友抢学费</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 更多操作 -->
    <more-operate :oItem="oItem" ref="child" />
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import MoreOperate from '../../../components/moreOperateTempage'
import { upyunUrl } from '../../../api/config'

let stopTime = null

export default {
  data () {
    return {
      upyunUrl,
      oJson: '',
      obj: '',
      shareText: '',
      date: {
        days: 0, // 天
        hours: 0, // 时
        minutes: 0, // 分
        seconds: 0
      },
      oItem: ''
    }
  },
  onLoad (options) {
    this.obj = JSON.parse(decodeURIComponent(options.oJson))
    this.getShareTextFn()
    this.getOrderGrabListFn()
  },
  onPullDownRefresh () {
    this.getOrderGrabListFn()
  },
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  methods: {
    ...mapActions([
      'getShareText',
      'getOrderGrabList'
    ]),
    // 获取分享title
    getShareTextFn () {
      this.getShareText({ that: this }).then((res) => {
        this.shareText = res
      })
    },
    // 获取阻力信息
    getOrderGrabListFn () {
      clearInterval(stopTime)

      const data = {
        that: this,
        order_id: this.obj.order_id || this.obj.id
      }

      uni.showLoading({ title: 'Loading' })
      this.getOrderGrabList(data).then((res) => {
        this.oJson = res
        if (res.status === 0) this.timeDown(this.oJson.back_time_limit)
        uni.stopPullDownRefresh()
        uni.hideLoading()
      })
    },
    // 时间倒计时
    timeDown (endDateStr) {
      endDateStr = endDateStr.replace(/-/g, '/')
      // 结束时间
      const endDate = new Date(endDateStr)
      // 当前时间
      const nowDate = new Date()
      // 相差的总秒数
      const totalSeconds = parseInt((endDate - nowDate) / 1000)
      // 天数
      const days = Math.floor(totalSeconds / (60 * 60 * 24))
      // 取模（余数）
      let modulo = totalSeconds % (60 * 60 * 24)
      // 小时数
      const hours = Math.floor(modulo / (60 * 60))
      modulo = modulo % (60 * 60)
      // 分钟
      const minutes = Math.floor(modulo / 60)
      // 秒
      const seconds = modulo % 60

      this.date = days >= 0 ? { days, hours, minutes, seconds } : { days: 0, hours: 0, minutes: 0, seconds: 0 }

      if (days < 0) {
        this.oJson['status'] = 2
        clearInterval(stopTime)
      }

      // 延迟一秒执行自己
      stopTime = setTimeout(() => {
        this.timeDown(endDateStr)
      }, 1000)
    },
    // 更多操作状态栏
    onMoreOperateFn () {
      this.oItem = {
        skipPath: 'tuitionLandingPage',
        orderid: this.obj.order_id || this.obj.id,
        thumb: 'https://flow.czlks.com/wxXcxImg/images/landing-bg.png'
      }
      this.$refs.child.onUniPopupStateFn(true)
    },
    // 跳转页面
    onSkipPageFn (url) {
      uni.navigateTo({ url })
    }
  },
  onUnload () {
    this.oJson = ''
    uni.switchTab({ url: '/pages/robTuition/index' })
  },
  components: {
    MoreOperate
  }
}
</script>
<style lang="stylus" scoped>
  .tuition-share-wrapper
    width: 100%
    height: auto
    background-color: #ff6326
    .banner
      position: relative
      width: 100%
      height: 306px
      display: flex
      justify-content: center
      z-index: 20
      img
        width: 100%
        height: 100%
      .btn
        position: absolute
        top: 90px
        width: 280px
        height: 33px
        line-height: 33px
        box-sizing: border-box
        font-size: 16px
        font-weight: bold
        text-align: center
        color: #f32121
        background: linear-gradient(0deg,rgba(254,164,5,1),rgba(255,219,71,1))
        border-radius: 20px
    .share-content
      margin-top: -19px
      padding: 0 15px 10px
      width: 100%
      height: auto
      box-sizing: border-box
      .title-box
        margin: 0 auto
        margin-bottom: 22px
        display: flex
        align-items: center
        justify-content: center
        i
          width: 25px
          height: 25px
          img
            display: block
            width: 100%
            height: 100%
          &.left-icon
            transform: rotate(-180deg)
        h2
          padding: 0 7px
          font-size: 14px
          color: #ff4040
          &.record-title
            padding: 0 10px
            font-size: 15px
      .info-bg
        margin-bottom: 15px
        padding: 15px
        box-sizing: border-box
        width: 100%
        height: auto
        border-radius: 5px
        background-color: rgba(255,255,255,0.2)
        .info-box
          padding: 20px 11px
          width: 100%
          height: auto
          box-sizing: border-box
          border-radius: 5px
          background-color: #fff
          .no-data-wrapper
            width: 100%
            height: auto
            img
              margin: 0 auto
              display: block
              width: 80px
              height: 80px
            .title
              padding-top: 5px
              font-size: 13px
              line-height: 20px
              text-align: center
              color: #b9b9b9
          .time-box
            margin-bottom: 34px
            width: 100%
            height: auto
            ul
              width: 100%
              height: auto
              display: flex
              align-items: center
              justify-content: center
              li
                margin: 0 4px
                height: 24px
                line-height: 24px
                font-size: 11px
                text-align: center
                color: #333
                &.time
                  width: 22px
                  height: 22px
                  line-height: 22px
                  font-size: 13px
                  font-weight: bold
                  color: #ff3838
                  border-radius: 2px
                  border: 2px solid #ff4040
                  background-color: #fee
                &.second
                  color: #ff7826
                  border: 1px solid #ff9e40
                  background-color: #fff4ea
            .hint
              margin-top: 10px
              font-size: 13px
              text-align: center
              color: #999
          .process-box
            margin-bottom: 24px
            width: 100%
            height: auto
            .process-info
              display: flex
              align-items: center
              justify-content: space-around
              font-size: 13px
              color: #999
              .text
                padding-right: 8px
              .process-line
                flex: 1
                width: 100%
                height: 8px
                background-color: #fff2e8
                border-radius: 20px
                .active-line
                  position: relative
                  width: 0
                  height: 8px
                  display: flex
                  align-items: center
                  background: linear-gradient(267deg,rgba(255,150,38,1),rgba(255,186,54,1))
                  border-radius: 20px
                  i
                    position: absolute
                    right: -9px
                    width: 15px
                    height: 15px
                    img
                      display: block
                      width: 100%
                      height: 100%
              .num
                padding-left: 8px
                color: #333
          .invite-box
            width: 100%
            height: auto
            ul
              width: 100%
              height: auto
              li
                margin-bottom: 14px
                display: flex
                align-items: center
                justify-content: space-around
                .avatar
                  width: 20px
                  height: 20px
                  border-radius: 50%
                  img
                    width: 100%
                    height: 100%
                    border-radius: 50%
                h3
                  flex: 1
                  position: relative
                  padding: 0 10px
                  box-sizing: border-box
                  font-size: 14px
                  color: #333
                  span
                    position: absolute
                    top: -4px
                    padding-left: 7px
                    font-size: 11px
                    font-weight: bold
                    color: #ff7633
                .time
                  font-size: 12px
                  color: #999
          .bottom-info
            margin-top: 28px
            width: 100%
            height: auto
            .btn-box
              width: 100%
              height: auto
              .btn
                position: relative
                width: 100%
                height: 44px
                line-height: 44px
                font-size: 15px
                text-align: center
                color: #fff
                background-color: #ff4040
                border-radius: 4px
              .btn-gray
                background-color: #999
              .hint
                margin-top: 10px
                font-size: 11px
                text-align: center
                color: #666
            .rule-box
              padding-top: 20px
              font-size: 13px
              text-align: center
              font-weight: bold
              color: #000
              border-top: 1px solid #f5f5f5
              .text
                margin: 10px 0
                display: flex
                align-items: center
                justify-content: center
                color: #999
                i
                  width: 15px
                  height: 15px
                  line-height: 15px
                  text-align: center
                  color: #ff4040
                  border: 1px solid #ff4040
                  border-radius: 50%
                span
                  padding-left: 9px
                  width: 120px
                  text-align: left
</style>
