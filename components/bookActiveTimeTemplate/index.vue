<template>
  <div class="active-timing-wrapper" v-if="upyunUrl">
    <div class="active-start" v-if="oJson.begin_state === 0">
      <div class="start-top">
        <i class="time-icon">
          <img :src="upyunUrl + '/wxXcxImg/images/times-icon.png'" />
        </i>
        <h3 class="top-title">距离开始领书活动</h3>
      </div>
      <div class="start-info">
        <img :src="upyunUrl + '/wxXcxImg/images/book-time-bg.png'" />
        <div class="start-content">
          <div class="word">还有</div>
          <div class="num"><div class="day">{{ oJson.startDrawDate }}</div></div>
          <i class="active-line">
            <img :src="upyunUrl + '/wxXcxImg/images/line-icon.png'" />
          </i>
          <div class="hint">{{ oJson.give_book_num_intro }}</div>
        </div>
      </div>
    </div>
    <div class="active-underway" v-if="oJson.begin_state === 1">
      <div class="times-info">
        <h2 class="times-title">每日领书时间点</h2>
        <ul>
          <div class="line-wrapper">
            <div class="line" :style="{width: oJson.schedule + '%'}"></div>
          </div>
          <li
            v-if="oJson.give_book_time_set.length"
            v-for="(item, index) in oJson.give_book_time_set"
            :class="oJson.time_state === index ? 'times-active circle-active' : oJson.time_state > index ? 'times-active' : ''"
            :key="index"
          >
            <h4 v-if="item">第{{ index }}波</h4>
            <h4 v-else>准备开始</h4>
            <div class="circle">
              <div class="circle-box">
                <img :src="upyunUrl + '/wxXcxImg/images/tick-icon.png'" />
              </div>
            </div>
            <div class="time">{{ item || '' }}</div>
          </li>
        </ul>
      </div>
    </div>
    <div class="active-end" v-if="oJson.begin_state === 2">
      <h2 class="end-title">活动结束</h2>
      <div class="end-hint">
        <h3>您可以前往瓶盖换书活动</h3>
        <h3>同样的书您可以使用瓶盖兑换</h3>
      </div>
      <div class="end-icon">
        <img :src="upyunUrl + '/wxXcxImg/images/book-time-end.png'" />
      </div>
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
  props: ['oJson']
}
</script>

<style lang="stylus" scoped>
  .active-timing-wrapper
    width: 100%
    height: auto
    padding: 10px 0
    .active-start
      width: 100%
      height: auto
      padding: 5px 24px
      box-sizing: border-box
      .start-top
        margin-left: 29%
        width: 147px
        height: 30px
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
      .start-info
        position: relative
        width: 100%
        height: 212px
        img
          width: 100%
          height: 100%
        .start-content
          position: absolute
          top: 35px
          width: 100%
          height: auto
          text-align: center
          .word
            font-size: 18px
            color: #bbb
          .num
            margin: 15px 0 16px
            font-size: 46px
            color: #e1564f
            line-height: 35px
            .day
              font-size: 26px
          .active-line
            margin: 0 auto
            width: 64px
            height: 1px
            img
              display: block
              width: 100%
              height: 100%
          .hint
            margin-top: 19px
            font-size: 12px
            color: #bbb
            line-height: 13px
    .active-underway
      width: 100%
      height: auto
      background-color: #fff
      .times-info
        padding: 13px 30px 50px
        width: 100%
        height: auto
        box-sizing: border-box
        .times-title
          margin: 0 auto
          margin-bottom: 45px
          width: 164px
          height: 33px
          background: rgba(225,86,79,0.1)
          border-radius: 17px
          font-size: 15px
          text-align: center
          line-height: 33px
          color: #e1564f
        ul
          position: relative
          width: 100%
          height: auto
          display: flex
          justify-content: space-between
          align-items: center
          .line-wrapper
            position: absolute
            left: 0
            top: 15px
            width: 100%
            height: 4px
            padding: 1px 0
            border-radius: 7px
            box-sizing: border-box
            background-color: #ddd
            .line
              height: 100%
              background-color: #e1564f
          li
            position: relative
            height: auto
            h4
              position: absolute
              left: -50%
              top: -27px
              width: 50px
              height: auto
              font-size: 12px
              line-height: 12px
              color: #666
            .circle
              position: relative
              width: 18px
              height: 18px
              .circle-box
                position: relative
                width: 100%
                height: 100%
                border-radius: 50%
                z-index: 2
                background-color: #ddd
                img
                  display: none
                  width: 16px
                  height: 13px
            .time
              position: absolute
              left: -50%
              margin-top: 22px
              font-size: 12px
              color: #999
            &.times-active
              h4
                top: -27px
                color: #e1564f
              .circle-box
                background: linear-gradient(180deg,rgba(252,149,143,1),rgba(225,86,79,1))
              .line
                background-color: #e1564f
            &.circle-active
              h4
                top: -22px
                left: -10%
              .circle
                width: 31px
                height: 31px
                .circle-box
                  display: flex
                  justify-content: center
                  align-items: center
                  img
                    display: block
              .line
                background-color: #ddd
              .time
                left: -10%
                margin-top: 16px
    .active-end
      width: 100%
      height: auto
      padding: 30px 0 13px
      text-align: center
      box-sizing: border-box
      background-color: #fff
      .end-title
        font-size: 20px
        line-height: 20px
        color: #333
      .end-hint
        margin: 23px 0
        height: auto
        font-size: 18px
        line-height: 24px
        color: rgba(0, 0, 0, 0.7)
      .end-icon
        margin: 0 auto
        width: 282px
        height: 142px
        img
          width: 100%
          height: 100%
</style>
