<template>
  <div class="info-activity-wrapper" v-if="oJson && upyunUrl">
    <!-- 加载获取抢书状态 -->
    <div class="bounce-wrapper" v-if="oJson.begin_state === 10">
      <p>瓶</p>
      <p>盖</p>
      <p>思</p>
      <p>维</p>
      <p>p</p>
      <p>g</p>
      <p>s</p>
      <p>w</p>
    </div>
    <!-- 活动时间还没开始 -->
    <div class="active-start" v-if="oJson.begin_state === 0">
      <div class="start-info">
        <img :src="upyunUrl + '/wxXcxImg/images//book-details-bg.png'" />
        <div class="start-content">
          <div class="all-text">
            <div class="text-box">
              <div class="send">预计送出</div>
              <h2 class="send-num">{{ oJson.give_set_num || 0 }}<span>本</span></h2>
            </div>
            <div class="text-box">
              <div class="send">参与</div>
              <h2 class="send-num">{{ oJson.give_set_want }}<span>人</span></h2>
            </div>
          </div>
          <i class="active-line">
            <img :src="upyunUrl + '/wxXcxImg/images/line-icon.png'" />
          </i>
          <div class="hint">
            <img :src="upyunUrl + '/wxXcxImg/images/gth-icon.png'" />
            <div class="hint-text">官方暂定送出总数量，会根据参与总人数进行调整送出量</div>
          </div>
          <div class="refer-btn first-btn">
            <div class="btn end-btn">抢书</div>
            <div class="btn" @click="onSkipIndexFn()">听知识获书更高</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 活动时间 > 两分钟 < 2个小时 -->
    <div class="active-start" v-if="oJson.begin_state === 1">
      <div class="start-top">
        <i class="time-icon">
          <img :src="upyunUrl + '/wxXcxImg/images/times-icon.png'" />
        </i>
        <h3 class="top-title">本轮开抢时间</h3>
        <div class="top-time">{{ oJson.strto_time_set[oJson.time_state] || '明天' }}</div>
      </div>
      <div class="start-info start-info2">
        <img :src="upyunUrl + '/wxXcxImg/images/book-details-bg2.png'" />
        <div class="start-content">
          <div class="word">还有</div>
          <div class="content">
            <span class="content-time" v-if="startDrawDate">{{ startDrawDate }}</span>
            <!--<span class="content-colon">:</span>-->
            <!--<span class="content-time">30</span>-->
            <span class="content-word">开抢</span>
          </div>
          <div class="num">
            预计送出<span>{{ oJson.give_set_num || 0 }}</span>本<span class="want-num">{{ oJson.give_set_want }}</span>人参与
          </div>
          <i class="active-line">
            <img :src="upyunUrl + '/wxXcxImg/images/line-icon.png'" />
          </i>
          <div class="hint">
            <img :src="upyunUrl + '/wxXcxImg/images/gth-icon.png'" />
            <div class="hint-text">官方暂定送出总数量，会根据参与总人数进行调整送出量</div>
          </div>
        </div>
        <div class="refer-btn">
          <div class="btn end-btn">抢书</div>
          <div class="btn" @click="onSkipIndexFn()">听知识获书更高</div>
        </div>
      </div>
    </div>
    <!-- 活动时间最后两分钟 -->
    <div class="active-start" v-if="oJson.begin_state === 2">
      <div class="start-top start-top3">
        <i class="time-icon">
          <img :src="upyunUrl + '/wxXcxImg/images/times-icon.png'" />
        </i>
        <h3 class="top-title">本轮开抢</h3>
        <div class="top-time">{{ oJson.strto_time_set[oJson.time_state] || '明天' }}</div>
      </div>
      <div class="start-info start-info2">
        <img :src="upyunUrl + '/wxXcxImg/images/book-details-bg2.png'" />
        <div class="start-content">
          <div class="rob-time">
            <span>距离开抢：</span>
            <span class="rob-colon">{{ startDrawDate }}</span>
            <!--<span class="rob-time">00</span>-->
            <!--<span class="rob-colon">:</span>-->
            <!--<span class="rob-time">02</span>-->
            <!--<span class="rob-colon">:</span>-->
            <!--<span class="rob-time">00</span>-->
          </div>
          <div class="content content3">
            <span class="content-send">本轮送出</span>
            <span class="content-num">{{ oJson.give_set_actual || 0 }}</span>
            <span class="content-word content-this">本</span>
          </div>
          <div class="num">
            预计送出<span>{{ oJson.give_set_num || 0 }}</span>本<span class="want-num">{{ oJson.give_set_want }}</span>人参与
          </div>
          <i class="active-line">
            <img :src="upyunUrl + '/wxXcxImg/images/line-icon.png'" />
          </i>
          <div class="hint">
            <img :src="upyunUrl + '/wxXcxImg/images/gth-icon.png'" />
            <div class="hint-text">官方暂定送出总数量，会根据参与总人数进行调整送出量</div>
          </div>
        </div>
        <div class="refer-btn">
          <div class="btn end-btn">抢书</div>
          <div class="btn" @click="onSkipIndexFn()">听知识获书更高</div>
        </div>
      </div>
    </div>
    <!-- 活动正在进行中 -->
    <div class="active-start" v-if="oJson.begin_state === 3">
      <div class="start-top start-top3">
        <i class="time-icon">
          <img :src="upyunUrl + '/wxXcxImg/images/times-icon.png'" />
        </i>
        <!--<h3 class="top-title">开抢时间</h3>-->
        <!--<div class="top-time">{{ oJson.strto_time_set[oJson.time_state] || '明天' }}</div>-->
        <h3 class="top-title">活动已开始，请尽情抢取...</h3>
      </div>
      <div class="start-info start-info2">
        <img :src="upyunUrl + '/wxXcxImg/images/book-details-bg2.png'" />
        <div class="start-content">
          <div class="word word-end">本轮送出</div>
          <div class="content content3">
            <span class="content-num">{{ oJson.give_set_actual || 0 }}</span>
            <span class="content-word content-this">本</span>
          </div>
          <div class="num">
            预计送出<span>{{ oJson.give_set_num || 0 }}</span>本<span class="want-num">{{ oJson.give_set_want }}</span>人参与
          </div>
          <i class="active-line">
            <img :src="upyunUrl + '/wxXcxImg/images/line-icon.png'" />
          </i>
          <div class="hint">
            <img :src="upyunUrl + '/wxXcxImg/images/gth-icon.png'" />
            <div class="hint-text">官方暂定送出总数量，会根据参与总人数进行调整送出量</div>
          </div>
        </div>
        <div class="refer-btn">
          <div class="btn rob-btn" @click="onRobWantBookFn()">抢书</div>
        </div>
      </div>
    </div>
    <!-- 等待5分钟后出结果 -->
    <!--<div class="active-start" v-if="oJson.begin_state === 4">-->
      <!--<div class="start-top start-top3">-->
        <!--<i class="time-icon">-->
          <!--<img :src="upyunUrl + '/wxXcxImg/images/times-icon.png'" />-->
        <!--</i>-->
        <!--<h3 class="top-title">开抢时间</h3>-->
        <!--<div class="top-time">{{ oJson.strto_time_set[oJson.time_state] || '明天' }}</div>-->
        <!--<h3 class="top-title">本轮开抢已开始</h3>-->
      <!--</div>-->
      <!--<div class="start-info start-info2">-->
        <!--<img :src="upyunUrl + '/wxXcxImg/images/book-details-bg2.png'" />-->
        <!--<div class="start-content">-->
          <!--<div class="content content3">-->
            <!--<h2>5分钟</h2>-->
            <!--<h2 class="rob-end">后出抢书结果</h2>-->
          <!--</div>-->
          <!--<div class="num">-->
            <!--预计送出<span>{{ oJson.give_set_num }}</span>本<span class="want-num">{{ oJson.give_set_want }}</span>人参与-->
          <!--</div>-->
          <!--<i class="active-line">-->
            <!--<img :src="upyunUrl + '/wxXcxImg/images/line-icon.png'" />-->
          <!--</i>-->
          <!--<div class="hint">-->
            <!--<img :src="upyunUrl + '/wxXcxImg/images/gth-icon.png'" />-->
            <!--<div class="hint-text">官方暂定送出总数量，会根据参与总人数进行调整送出量</div>-->
          <!--</div>-->
        <!--</div>-->
        <!--<div class="refer-btn">-->
          <!--<div class="btn end-btn">已抢书</div>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
    <!-- 抢书成功 -->
    <div class="active-start" v-if="oJson.begin_state === 5">
      <div class="start-top start-top3">
        <i class="time-icon">
          <img :src="upyunUrl + '/wxXcxImg/images/times-icon.png'" />
        </i>
        <h3 class="top-title">恭喜你抢书成功</h3>
      </div>
      <div class="start-info start-info3">
        <img :src="upyunUrl + '/wxXcxImg/images/book-details-bg2.png'" />
        <div class="start-content">
          <div class="content content3">
            <i class="hint-icon">
              <img :src="upyunUrl + '/wxXcxImg/images/book-get-icon.png'" />
            </i>
            <h3>已获得本书</h3>
            <div class="goods-info">
              收货信息未提交，<span @click="onSkipAffirmOrderFn('grab')">点击提交收货信息</span>
            </div>
          </div>
          <i class="active-line">
            <img :src="upyunUrl + '/wxXcxImg/images/line-icon.png'" />
          </i>
          <div class="num win-text">
            您是本书第<span>{{ oJson.give_set_num || 0 }}</span>位忠实客户，您的幸运值超过<span>{{ oJson.give_set_want }}</span>人
          </div>
        </div>
        <div class="refer-btn">
          <div class="btn share-btn"><button open-type='share'/>告诉朋友，让他们也来试试</div>
        </div>
      </div>
    </div>
    <!-- 本轮抢书失败 -->
    <div class="active-start" v-if="oJson.begin_state === 6">
      <div class="start-top start-top3">
        <i class="time-icon">
          <img :src="upyunUrl + '/wxXcxImg/images/times-icon.png'" />
        </i>
        <h3 class="top-title">很遗憾抢书失败</h3>
      </div>
      <div class="start-info start-info3">
        <img :src="upyunUrl + '/wxXcxImg/images/book-details-bg2.png'" />
        <div class="start-content">
          <div class="content content3">
            <i class="hint-icon">
              <img :src="upyunUrl + '/wxXcxImg/images/book-no-icon.png'" />
            </i>
            <h4>遗憾！</h4>
            <h4 class="no-rob" v-if="oJson.is_grab">没抢到，下轮准点来</h4>
            <h4 class="no-rob" v-else>来晚了，下轮准点来</h4>
          </div>
          <div class="num">
            预计送出<span>{{ oJson.give_set_num || 0 }}</span>本<span class="want-num">{{ oJson.give_set_want }}</span>人参与
          </div>
          <i class="active-line">
            <img :src="upyunUrl + '/wxXcxImg/images/line-icon.png'" />
          </i>
          <div class="hint">
            <img :src="upyunUrl + '/wxXcxImg/images/gth-icon.png'" />
            <div class="hint-text">官方暂定送出总数量，会根据参与总人数进行调整送出量</div>
          </div>
        </div>
        <div class="refer-btn">
          <div class="btn share-btn"><button open-type='share'/>让朋友来帮忙抢书</div>
        </div>
      </div>
    </div>
    <!-- 获得此书 -->
    <div class="active-start" v-if="oJson.begin_state === 7">
      <div class="start-info start-info4">
        <img :src="upyunUrl + '/wxXcxImg/images/book-details-bg3.png'" />
        <div class="start-content">
          <div class="content">
            <h3 class="get-title">已获得本书</h3>
            <ul class="goods-list">
              <li>
                <div class="goods-hint">收货人信息</div>
              </li>
              <li>
                <div class="goods-title">收货人：</div>
                <div class="goods-text">{{ oJson.order_info.name }}</div>
              </li>
              <li>
                <div class="goods-title">电话：</div>
                <div class="goods-text">{{ oJson.order_info.phone }}</div>
              </li>
              <li>
                <div class="goods-title">地址：</div>
                <div class="goods-text">{{ oJson.order_info.address }}</div>
              </li>
            </ul>
            <div class="explain-box">
              <div class="explain-title">说明</div>
              <ul class="explain-list">
                <li>1.书本将在活动结束后3个工作日内寄出</li>
                <li>2.需正确填写收货信息，如信息有误视为放弃</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import { upyunUrl } from '../../api/config'

export default {
  data () {
    return {
      upyunUrl,
      initialStatus: false
    }
  },
  onLoad () {
    this.initialStatus = true
  },
  methods: {
    ...mapMutations({
      setNavigationIndex: 'SET_NAVIGATION_INDEX'
    }),
    ...mapActions([
      'robWantBook'
    ]),
    onRobWantBookFn () {
      const data = {
        that: this,
        id: this.oJson.id,
        status: true
      }
      if (this.initialStatus) {
        this.initialStatus = false
        this.robWantBook(data).then((res) => {
          if (res.ret === 1) {
            res.data['id'] = this.oJson.id
            this.$emit('robWantBookChild', res.data)
            this.showToastFn(res.message)
          } else {
            this.showToastFn(res.message)
            this.initialStatus = true
          }
        })
      }
    },
    // 跳转回到首页
    onSkipIndexFn () {
      this.setNavigationIndex(0)
      uni.switchTab({ url: '/pages/index/index' })
    },
    // 跳转确认订单页面
    onSkipAffirmOrderFn (text) {
      this.oJson['orderType'] = text
      uni.navigateTo({
        url: `/pages/mission/affirmOrder/index?oJson=${encodeURIComponent(JSON.stringify(this.oJson))}`
      })
    },
    showToastFn (title) {
      uni.showToast({
        title,
        icon: 'none',
        duration: 2000
      })
    }
  },
  props: ['oJson', 'startDrawDate']
}
</script>

<style lang="stylus" scoped>
  .info-activity-wrapper
    width: 100%
    height: auto
    padding: 15px
    background-color: #fff
    box-sizing: border-box
    .bounce-wrapper
      width: 100%
      height: auto
      padding: 30px 0
      font-size: 18px
      display: flex
      align-items: center
      justify-content: center
      white-space: nowrap
      p
        animation: bounce 0.75s cubic-bezier(0.05, 0, 0.2, 1) infinite alternate
        display: inline-block
        transform: translate3d(0, 0, 0)
        text-shadow: rgba(255, 255, 255, 0.4) 0 0 0.05em
        color: rgba(250, 178, 65, 1)
      p:nth-child(1)
        animation-delay: 0s
      p:nth-child(2)
        animation-delay: 0.0833333333s
      p:nth-child(3)
        animation-delay: 0.1666666667s
      p:nth-child(4)
        animation-delay: 0.25s
      p:nth-child(5)
        animation-delay: 0.3333333333s
      p:nth-child(6)
        animation-delay: 0.41s
      p:nth-child(7)
        animation-delay: 0.5333333s
      p:nth-child(8)
        animation-delay: 0.666666s
    .active-start
      width: 100%
      height: auto
      .start-top
        margin-left: 21.5%
        padding: 10px 0
        width: 190px
        box-sizing: border-box
        display: flex
        align-items: center
        justify-content: center
        border-radius: 20px
        background-color: #e1564f
        .time-icon
          width: 14px
          height: 15px
          img
            display: block
            width: 100%
            height: 100%
        .top-title
          padding-left: 6px
          font-size: 12px
          line-height: 14px
          color: #fff
        .top-time
          padding-left: 14px
          font-size: 14px
          line-height: 14px
          color: #fecf78
        &.start-top3
          margin-left: 15%
          width: 240px
          .top-time
            padding: 0 13px 0 7px
      .start-info
        position: relative
        width: 100%
        height: 280px
        img
          width: 100%
          height: 100%
        .start-content
          position: absolute
          top: 40px
          width: 100%
          height: auto
          .all-text
            display: flex
            justify-content: space-around
            .text-box
              margin-bottom: 8px
              text-align: center
              .send
                margin-bottom: 16px
                font-size: 12px
                color: #bbb
              .send-num
                font-size: 46px
                line-height: 35px
                color: #e1564f
                span
                  padding-left: 13px
                  font-size: 13px
          .rob-time
            margin-top: -4px
            text-align: center
            span
              display: inline-block
              height: 22px
              line-height 22px
              font-size: 12px
              color: #333
              &.rob-time
                width: 22px
                font-size: 12px
                color: #fff
                border-radius: 2px
                background: linear-gradient(37deg,rgba(248,110,100,1),rgba(250,176,101,1))
              &.rob-colon
                padding: 0 4px
                font-size: 12px
                color: #f98064
          .word
            padding-left: 100px
            font-size: 12px
            color: #bbb
            &.word-end
              padding-left: 142px
          .content
            margin: 12px 0 6px
            text-align: center
            &.content3
              margin: 0
            h2
              font-size: 28px
              color: #e1564f
              &.rob-end
                margin-bottom: 2px
            .hint-icon
              margin: 15px auto 4px
              width: 55px
              height: 70px
              img
                width: 100%
                height: 100%
            h4
              font-size: 20px
              color: #e1564f
              &.no-rob
                margin: 4px 0 11px
                font-size: 18px
            h3
              margin-bottom: 20px
              font-size: 24px
              color: #e1564f
              &.get-title
                margin-bottom: 8px
            .goods-info
              margin-bottom: 28px
              font-size: 12px
              color: #bbb
              span
                color: #e1564f
            .content-time
              display: inline-block
              width: auto
              height: 43px
              padding: 0 10px
              line-height: 43px
              font-size: 30px
              color: #fff
              border-radius: 2px
              background: linear-gradient(37deg,rgba(248,110,100,1),rgba(250,176,101,1))
            .content-colon
              padding: 0 7px
              height: 43px
              line-height: 43px
              font-size: 24px
              color: #f98064
            .content-send
              padding-right: 6px
              display: inline-block
              width: 33px
              font-size: 15px
              line-height: 18px
              color: #bbb
            .content-num
              font-size: 44px
              color: #e1564f
            .content-word
              padding-left: 14px
              font-size: 13px
              color: #e1564f
              &.content-this
                padding-left: 5px
            .goods-list
              padding: 0 31px
              li
                margin-bottom: 9px
                display: flex
                font-size: 14px
                line-height: 18px
                text-align: left
                color: #464646
                .goods-hint
                  font-size: 15px
                .goods-text
                  flex: 1
            .explain-box
              padding: 0 26px
              margin-top: 14px
              box-sizing: border-box
              text-align: left
              .explain-title
                font-size: 14px
                color: #e1564f
              .explain-list
                margin-top: 7px
                li
                  margin-bottom: 5px
                  font-size: 12px
                  color: #bbb
          .num
            font-size: 12px
            line-height: 21px
            text-align: center
            color: #bbb
            &.win-text
              margin-top: 25px
            span
              font-size: 15px
              color: #e1564f
              &.want-num
                padding-left: 15px
          .active-line
            margin: 12px auto 14px
            width: 64px
            height: 1px
            img
              display: block
              width: 100%
              height: 100%
          .hint
            margin: 0 auto
            width: 268px
            height: auto
            display: flex
            box-sizing: border-box
            img
              margin-top: 4px
              display: block
              width: 12px
              height: 12px
            .hint-text
              flex: 1
              padding-left: 5px
              font-size: 12px
              line-height: 18px
              text-align: left
              color: #bbb
        .refer-btn
          position: absolute
          bottom: 10px
          width: 100%
          height: auto
          padding: 0 23px
          display: flex
          box-sizing: border-box
          justify-content: space-between
          .btn
            flex: 1
            height: 50px
            font-size: 16px
            line-height: 50px
            text-align: center
            color: #c55a21
            border-radius: 4px
            background: linear-gradient(180deg, rgba(255,211,127,1) 15%, rgba(250,178,65,1) 85%)
            &.end-btn
              color: #fff
              background: linear-gradient(180deg,rgba(144,143,143,1),rgba(102,102,102,1))
            &.share-btn
              position: relative
              width: 294px
              button
                position: absolute
                left: 0
                top: 0
                right: 0
                bottom: 0
                width: 100%
                height: 100%
                opacity: 0
            &.btn:last-child
              margin-left: 6px
          &.first-btn
            bottom: -80px
        &.start-info2
          height: 294px
          .start-content
            top: 46px
        &.start-info3
          height: 388px
        &.start-info4
          height: 309px
          .start-content
            top: 24px
  @-webkit-keyframes bounce
    0%
      transform: translate3d(0, 0, 0)
      text-shadow: rgba(255, 255, 255, 0.4) 0 0 0.05em
    100%
      transform: translate3d(0, -1em, 0)
      text-shadow: rgba(255, 255, 255, 0.4) 0 1em 0.35em
</style>
