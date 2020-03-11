<template>
  <div
    v-if="upyunUrl && oJson"
    class="tuition-bill-wrapper"
  >
    <image class="banner" :src="upyunUrl + '/wxXcxImg/images/tuition-bill-bg.png'" />
    <!--抢得学费滚动浮窗-->
    <div class="float-box">
      <all-grab-floating-window />
    </div>
    <div class="bill-content">
      <div class="info-box">
        <div
          v-if="oJson.list.length"
          class="info-box-ul"
        >
          <div
            v-for="(item, index) in oJson.list"
            :key="index"
            class="item"
          >
            <div class="avatar">
              <image mode="aspectFill" :src="item.avatarurl" />
            </div>
            <div class="text-box">
              <div class="title">
                <div class="name">{{ item.nickname }}</div>
                <div class="num">+{{ item.money }}元</div>
              </div>
            </div>
            <div class="time">{{ item.settle_time }}</div>
          </div>
        </div>
        <div v-else class="not-data-wrapper">
          <image :src="upyunUrl + '/wxXcxImg/images/no-data-icon.png'" />
          <div class="title">还没有人抢到学费，快来成为第一人吧</div>
        </div>
      </div>
      <div
        v-if="(oJson.is_grab && oJson.status === 0) || (oJson.is_grab && oJson.status === 1 && oJson.my_play_list.length)"
        class="condition-box"
      >
        <div
          v-if="oJson.status === 0"
          class="time-box"
        >
          <div class="time-cnt">
            <div class="time-cnt-ul">
              <div class="text time">{{ date.days }}</div>
              <div class="text">天</div>
              <div class="text time">{{ date.hours }}</div>
              <div class="text">时</div>
              <div class="text time">{{ date.minutes }}</div>
              <div class="text">分</div>
              <div class="text time second">{{ date.seconds }}</div>
              <div class="text">秒</div>
            </div>
            <div class="text-info">后将失去本次所抢的学费</div>
          </div>
          <div class="title">完成以下任务学费立即到账</div>
        </div>
        <div class="content-box">
          <div class="hint-text">温馨提示：同时进行多个抢学费任务时，上个任务完成并到账后，下个任务才计算。</div>
          <div class="title-box">
            <div class="title">邀请{{ oJson.sp_grab_need_inv }}名新好友</div>
            <div
              v-if="oJson.sp_grab_need_inv !== oJson.my_inv_list.length"
              @click="onSkipPageFn(false, oJson.is_now_activity)"
              class="btn"
            ><button v-if="oJson.is_now_activity" open-type='share'/>去邀请</div>
            <div v-else class="btn btn-active">已完成</div>
          </div>
          <div
            v-if="oJson.my_inv_list.length"
            class="user-box"
          >
            <div
              v-for="(item, index) in oJson.my_inv_list"
              :key="index"
              class="item"
            >
              <div class="avatar">
                <image mode="aspectFill" :src="item.avatarurl" />
              </div>
              <div class="name">{{ item.nickname }}</div>
              <div class="date">{{ item.ctime }}</div>
            </div>
          </div>
          <div v-else class="no-data-wrapper">
            <image :src="upyunUrl + '/wxXcxImg/images/not-data-icon.png'" />
            <div class="title">你还没邀请好友，快去邀请吧</div>
          </div>
          <div class="title-box">
            <div class="title">听完{{ oJson.sp_grab_need_play }}个知识</div>
            <div
              v-if="oJson.sp_grab_need_play !== oJson.my_play_list.length"
              @click="onSkipPageFn('/pages/index/main', oJson.is_now_activity)"
              class="btn"
            >听知识</div>
            <div v-else class="btn btn-active">已完成</div>
          </div>
          <div
            v-if="oJson.my_play_list.length"
            class="list-box"
          >
            <div
              v-for="(item, index) in oJson.my_play_list"
              :key="index"
              class="item"
            >
              <div class="cover">
                <image mode="aspectFill" :src="item.thumb" />
              </div>
              <div class="text-box">
                <div class="title">{{ item.title }}</div>
                <div class="bottom">
                  <div class="num">
                    <div class="icon">
                      <image :src="upyunUrl + '/wxXcxImg/images/triangle-play-icon.png'" />
                    </div>
                    <div class="play_hits">{{ item.play_hits }}</div>
                  </div>
                  <div class="date">{{ item.ctime }}</div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="no-data-wrapper">
            <image :src="upyunUrl + '/wxXcxImg/images/not-data-icon.png'" />
            <div class="title">你还没有听知识，快去听知识吧</div>
          </div>
        </div>
      </div>
      <div
        v-if="!oJson.is_grab && oJson.status === 0"
        @click="onGetTuitionFn()"
        class="true-btn"
      >抢学费</div>
      <div
        v-if="oJson.is_grab && oJson.status === 1 && !oJson.my_play_list.length"
        class="true-btn gray"
      >好友任务已完成，奖励 ¥{{ oJson.money }}</div>
      <div
        v-if="oJson.is_grab && oJson.status === 1 && oJson.my_play_list.length"
        class="true-btn gray"
      >抢学费，奖励 ¥{{ oJson.money }}</div>
      <div
        v-if="oJson.is_grab && oJson.status === 2"
        class="true-btn gray"
      >任务超时，学费返还失败</div>
    </div>
    <!--抢学费结果弹窗-->
    <tuition-draw-popup @popupStatusChild="onClosePopupStatusFn" :obj="options" />
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { upyunUrl } from '../../../api/config'
import AllGrabFloatingWindow from '../../../components/allGrabFloatingWindowTemplate'
import TuitionDrawPopup from '../../../components/tuitionDrawPopupTemplate'

let stopTime = null

export default {
  data () {
    return {
      upyunUrl,
      obj: '',
      oJson: '',
      shareText: '',
      options: {
        state: false,
        data: {}
      },
      date: {
        days: 0, // 天
        hours: 0, // 时
        minutes: 0, // 分
        seconds: 0
      }
    }
  },
  onLoad (options) {
    this.obj = JSON.parse(decodeURIComponent(options.oJson))
    this.options.state = false
    this.getShareTextFn()
    this.getAllGrabListFn()
    this.getTuitionSDListFn()
  },
  onPullDownRefresh () {
    this.getTuitionSDListFn()
  },
  computed: {
    ...mapState([
      'userInfo',
      'shareid'
    ])
  },
  methods: {
    ...mapMutations({
      setNavigationIndex: 'SET_NAVIGATION_INDEX'
    }),
    ...mapActions([
      'getShareText',
      'getAllGrabList',
      'getTuitionSDList',
      'getTuition'
    ]),
    // 获取分享title
    getShareTextFn () {
      this.getShareText({ that: this }).then((res) => {
        this.shareText = res
      })
    },
    // 获取全部抢学费用户列表
    getAllGrabListFn () {
      this.getAllGrabList({ that: this })
    },
    // 学费晒单
    getTuitionSDListFn () {
      clearInterval(stopTime)
      const data = {
        that: this,
        order_id: this.obj.order_id || this.obj.id
      }
      this.getTuitionSDList(data).then((res) => {
        this.oJson = res
        if (res.status === 0) this.timeDown(this.oJson.grab_time_limit)
        uni.stopPullDownRefresh()
      })
    },
    // 立即抢学费
    onGetTuitionFn () {
      const data = {
        that: this,
        order_id: this.obj.order_id || this.obj.id
      }
      uni.showLoading({ title: 'Loading' })
      this.getTuition(data).then((res) => {
        if (res.code === 200) {
          this.options = {
            state: true,
            data: res.data
          }
          if (!this.obj.share_id) this.getTuitionSDListFn()
        } else {
          this.options = {
            state: true,
            data: {type: 3}
          }
        }
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
      if (days < 0) clearInterval(stopTime)

      // 延迟一秒执行自己
      stopTime = setTimeout(() => {
        this.timeDown(endDateStr)
      }, 1000)
    },
    // 关闭弹窗
    onClosePopupStatusFn (state) {
      if (this.shareid) {
        this.obj['id'] = this.obj.order_id
        uni.navigateTo({
          url: `/pages/robTuition/tuitionShare/main?oJson=${encodeURIComponent(JSON.stringify(this.obj))}`
        })
      }
      this.options.state = state
    },
    // 跳转页面
    onSkipPageFn (url, state) {
      if (state) {
        if (url) {
          this.setNavigationIndex(0)
          uni.switchTab({ url })
        }
      } else {
        this.showToastFn('亲，上一个平台福利任务没有完成，多做的任务不记录到此任务中哟')
      }
    },
    showToastFn (title) {
      uni.showToast({
        title,
        icon: 'none',
        duration: 2000
      })
    }
  },
  onUnload () {
    this.oJson = ''
  },
  components: {
    AllGrabFloatingWindow,
    TuitionDrawPopup
  }
}
</script>
<style lang="stylus" scoped>
  .tuition-bill-wrapper
    position: relative
    width: 100%
    height: auto
    background: #f5f5f5
    .banner
      position: relative
      display: block
      width: 100%
      height: 222px
      z-index: 20
    .float-box
      position: absolute
      top: 145px
      left: 0
      z-index: 999
    .bill-content
      padding: 0 15px
      width: 100%
      height: auto
      box-sizing: border-box
      .info-box
        padding: 10px 15px 5px
        width: 100%
        height: auto
        box-sizing: border-box
        border-radius: 4px
        background-color: #fff
        .info-box-ul
          width: 100%
          height: auto
          .item
            position: relative
            margin-bottom: 16px
            padding-bottom: 16px
            display: flex
            align-items: center
            justify-content: space-around
            border-bottom: 1px solid #f2f2f2
            .avatar
              width: 36px
              height: 36px
              border-radius: 50%
              image
                width: 100%
                height: 100%
                border-radius: 50%
            .text-box
              flex: 1
              padding: 0 10px
              box-sizing: border-box
              .title
                display: flex
                align-items: center
                .name
                  padding-right: 10px
                  font-size: 14px
                  color: #333
                .num
                  padding: 2px 5px
                  font-size: 11px
                  text-align: center
                  font-weight: bold
                  color: #fff
                  background-color: #ff7633
                  border-radius: 20px
            .time
              font-size: 12px
              color: #999
            &:last-child
              margin-bottom: 0
              border: none
        .not-data-wrapper
          padding-bottom: 10px
          width: 100%
          height: auto
          image
            margin: 0 auto
            display: block
            width: 200px
            height: 116px
          .title
            padding-top: 10px
            font-size: 13px
            line-height: 20px
            text-align: center
            color: #b9b9b9
      .condition-box
        margin-top: 15px
        width: 100%
        height: auto
        background-color: #fff
        border-radius: 4px
        .time-box
          padding: 15px 50px
          width: 100%
          height: auto
          box-sizing: border-box
          text-align: center
          background-color: #fcfcfc
          .time-cnt
            margin: 0 auto
            padding: 10px 11px 8px
            box-sizing: border-box
            .time-cnt-ul
              margin-bottom: 12px
              width: 100%
              height: auto
              display: flex
              align-items: center
              justify-content: center
              .item
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
                  border: 2px solid #ff9e40
                  background-color: #fff4ea
            .text-info
              font-size: 14px
              color: #666
          .title
            margin-top: 12px
            font-size: 15px
            font-weight: bold
            color: #333
        .content-box
          padding: 15px 15px 5px
          box-sizing: border-box
          background-color: #fff
          .hint-text
            padding-bottom: 20px
            line-height: 18px
            font-size: 11px
            color: #666
          .title-box
            margin-bottom: 20px
            width: 100%
            height: auto
            display: flex
            align-items: center
            justify-content: space-around
            .title
              flex: 1
              font-size: 15px
              color: #000
            .btn
              position: relative
              width: 65px
              height: 26px
              line-height: 26px
              font-size: 13px
              text-align: center
              font-weight: bold
              color: #fff
              background-color: #ff4040
              box-shadow: 0 1px 4px 0 rgba(255,64,64,0.3)
              border-radius: 20px
              button
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                opacity: 0
            .btn-active
              box-shadow: none
              background-color: #cacaca
          .no-data-wrapper
            padding-bottom: 20px
            width: 100%
            height: auto
            image
              margin: 0 auto
              display: block
              width: 60px
              height: 60px
            .title
              padding-top: 2px
              font-size: 13px
              line-height: 20px
              text-align: center
              color: #b9b9b9
          .list-box
            width: 100%
            height: auto
            .item
              display: flex
              padding-bottom: 15px
              margin-bottom: 15px
              border-bottom: 1px solid #f0f0f0
              .cover
                width: 62px
                height: 62px
                image
                  display: block
                  width: 100%
                  height: 100%
              .text-box
                flex: 1
                position: relative
                padding: 0 10px
                height: 62px
                .title
                  width: 100%
                  height: 40px
                  margin: -3px 0 8px
                  font-size: 14px
                  line-height: 20px
                  color: #333
                  display: -webkit-box
                  -webkit-box-orient: vertical
                  -webkit-line-clamp: 2
                  overflow: hidden
                .bottom
                  width: 100%
                  height: auto
                  display: flex
                  justify-content: space-between
                  .num
                    display: flex
                    align-items: center
                    .icon
                      width: 12px
                      height: 12px
                      image
                        display: block
                        width: 100%
                        height: 100%
                    .play_hits
                      padding-left: 6px
                      font-size: 12px
                      color: #b3b3b3
                  .date
                    font-size: 12px
                    color: #999
              &:last-child
                border: none
          .user-box
            margin-top: 5px
            width: 100%
            height: auto
            .item
              margin-bottom: 15px
              display: flex
              align-items: center
              justify-content: space-around
              .avatar
                width: 26px
                height: 26px
                border-radius: 50%
                image
                  display: block
                  width: 100%
                  height: 100%
                  border-radius: 50%
              .name
                flex: 1
                padding-left: 11px
                font-size: 14px
                color: #333
                display: -webkit-box
                -webkit-box-orient: vertical
                -webkit-line-clamp: 1
                overflow: hidden
              .date
                font-size: 12px
                color: #999
      .true-btn
        margin: 20px 0
        width: 100%
        height: 44px
        line-height: 44px
        font-size: 15px
        text-align: center
        color: #fff
        background-color: #ff4040
        border-radius: 4px
      .gray
        background-color: #999
</style>
