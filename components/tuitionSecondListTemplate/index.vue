<template>
  <div v-if="upyunUrl && lists.length" class="tuition-second-list-wrapper">
    <div class="tuition-second-list-ul">
      <div
        v-for="(item, index) in lists"
        @click="onSkipPageFn(item, 0)"
        :key="index"
        class="item"
      >
        <div class="avatar">
          <image mode="aspectFill" :src="item.cover" />
          <div v-if="item.type === 0" class="mark">
            <image :src="upyunUrl + '/wxXcxImg/images/rob-mark-icon01.png'" />
            <div class="text">平台福利</div>
          </div>
          <div class="mark" v-if="item.type === 1">
            <image :src="upyunUrl + '/wxXcxImg/images/rob-mark-icon02.png'" />
            <div class="text">好友福利</div>
          </div>
          <div class="mark" v-if="item.type === 2">
            <image :src="upyunUrl + '/wxXcxImg/images/rob-mark-icon03.png'" />
            <div class="text">返现福利</div>
          </div>
          <div class="video-play-num">
            <div class="icon">
              <image :src="item.avatarurl" />
            </div>
            <div class="name">{{ item.nickname }}</div>
          </div>
        </div>
        <div class="info">
          <div class="title">{{ item.title }}</div>
          <div class="process-box" v-if="item.type !== 0">
            <div class="text">已学</div>
            <div class="process-line">
              <div class="active-line" :style="{width: item.learn_progress + '%'}">
                <div class="icon">
                  <image :src="upyunUrl + '/wxXcxImg/images/gold-icon.png'" />
                </div>
              </div>
            </div>
            <div class="num">{{ item.learn_progress }}%</div>
          </div>
          <div class="time-box">
            <div class="hint-text" v-if="item.type === 0">距失效</div>
            <div class="hint-text" v-if="item.type !== 0">距结束</div>
            <div v-if="item.date" class="time-box-ul">
              <div class="item">
                <div class="text">{{ item.date.days }}</div>
              </div>
              <div class="line">:</div>
              <div class="item">
                <div class="text">{{ item.date.hours }}</div>
              </div>
              <div class="line">:</div>
              <div class="item">
                <div class="text">{{ item.date.minutes }}</div>
              </div>
              <div class="line">:</div>
              <div class="item">
                <div class="text">{{ item.date.seconds }}</div>
              </div>
            </div>
          </div>
          <div class="bottom">
            <div class="invite-box">
              <div class="invite-price">
                <div v-if="item.type === 1" class="text">好友完成</div>
                <div v-if="item.type === 2" class="text">完成任务</div>
                <div v-if="item.type === 2" class="text">预计返现</div>
                <div v-if="item.type !== 2" class="text">预计到账</div>
                <div v-if="item.type !== 2" class="text price">￥{{ item.money_range[0] }}-{{ item.money_range[1] }}元</div>
                <div v-if="item.type === 2" class="text price">￥{{ item.money }}元</div>
              </div>
              <div
                v-if="item.type === 0"
                class="invite-num"
              >还差<div class="text">{{ item.still_need_inv }}</div>人<span class="line">｜</span>听<span>{{ item.still_need_play }}</span>个知识</div>
              <div
                v-if="item.type === 1 || item.type === 2"
                class="invite-num"
              >邀请<div class="text">{{ item.sp_inv_num }}</div>人<span class="line">｜</span>还差<span>{{ item.still_need_inv }}</span>人</div>
            </div>
            <div
              v-if="item.type === 0"
              @click.stop="onSkipPageFn(item, 1)"
              class="btn-box"
            >去完成</div>
            <div
              v-if="item.type === 1"
              @click.stop="onSkipPageFn(item, 2)"
              class="btn-box"
            >去监督</div>
            <div
              v-if="item.type === 2"
              @click.stop="onSkipPageFn(item, 3)"
              class="btn-box"
            >去完成</div>
          </div>
        </div>
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
  methods: {
    // 跳转页面
    onSkipPageFn (item, index) {
      let url = ''
      switch(index) {
        case 0:
          url = `/pages/subject/subjectMusic/index?sid=${item.specil_id}`
          break
        case 1:
          url = `/pages/robTuition/tuitionBill/index?oJson=${encodeURIComponent(JSON.stringify(item))}`
          break
        case 2:
          url = `/pages/robTuition/tuitionShare/index?oJson=${encodeURIComponent(JSON.stringify(item))}`
          break
        case 3:
          url = `/pages/robTuition/tuitionShare/index?oJson=${encodeURIComponent(JSON.stringify(item))}`
          break
      }
      uni.navigateTo({
        url
      })
    }
  },
  props: {
    lists: {
      type: Array,
      default: []
    }
  }
}
</script>

<style lang="stylus" scoped>
  .tuition-second-list-wrapper
    width: 100%
    height: auto
    padding: 20px 15px 40px
    box-sizing: border-box
    .tuition-second-list-ul
      width: 100%
      height: auto
      .item
        margin-bottom: 15px
        padding-bottom: 15px
        display: flex
        border-bottom: 1px solid #f5f5f5
        .avatar
          position: relative
          width: 110px
          height: 110px
          border-radius: 3px
          image
            width: 100%
            height: 100%
            border-radius: 3px
          .mark
            position: absolute
            top: 0
            left: 0
            width: 100%
            height: 23px
            line-height: 23px
            image
              width: 100%
              height: 100%
            .text
              position: absolute
              top: 0
              left: 5px
              font-size: 10px
              color: #fff
          .video-play-num
            position: absolute
            bottom: 0
            width: 100%
            height: 40px
            padding: 13px 5px 2px
            border-radius: 0 0 6px 6px
            display: flex
            align-items: center
            background: -webkit-linear-gradient(top,rgba(255, 255, 255, 0)10%, rgba(0, 0, 0, .5)80%)
            box-sizing: border-box
            .icon
              padding: 1px
              width: 18px
              height: 18px
              box-sizing: border-box
              overflow: hidden
              background-color: #e1564f
              border-radius: 50%
              image
                display: block
                width: 100%
                height: 100%
                border-radius: 50%
            .name
              flex: 1
              padding-left: 5px
              text-align: left
              font-size: 10px
              color: #fff
              display: -webkit-box
              -webkit-box-orient: vertical
              -webkit-line-clamp: 1
              overflow: hidden
        .info
          position: relative
          margin-left: 15px
          flex: 1
          .title
            margin-bottom: 6px
            width: 100%
            min-height: 9px
            margin-top: -3px
            font-size: 14px
            line-height: 18px
            font-weight: bold
            color: #333
            display: -webkit-box
            -webkit-box-orient: vertical
            -webkit-line-clamp: 2
            overflow: hidden
          .process-box
            margin: 4px 0
            display: flex
            align-items: center
            justify-content: space-around
            font-size: 11px
            .text
              padding-right: 8px
              color: #999
            .process-line
              flex: 1
              width: 100%
              height: 4px
              background-color: #fff2e8
              border-radius: 20px
              .active-line
                position: relative
                width: 0
                height: 4px
                display: flex
                align-items: center
                background: linear-gradient(267deg,rgba(255,150,38,1),rgba(255,186,54,1))
                border-radius: 20px
                .icon
                  position: absolute
                  right: -8px
                  width: 10px
                  height: 10px
                  image
                    display: block
                    width: 100%
                    height: 100%
            .num
              padding-left: 8px
              font-size: 12px
              color: #333
          .time-box
            margin-bottom: 6px
            display: flex
            align-items: center
            .hint-text
              padding-right: 6px
              font-size: 11px
              color: #333
            .time-box-ul
              flex: 1
              margin-top: 0
              display: flex
              align-items: center
              .item
                display: block
                margin-bottom: 0
                height: 16px
                line-height: 16px
                font-size: 10px
                text-align: center
                font-weight: bold
                box-sizing: border-box
                border: none
                .text
                  display: block
                  width: 16px
                  height: auto
                  color: #fff
                  background-color: #575757
                  border-radius: 2px
                &.line
                  padding: 0 5px
                  color: #575757
          .bottom
            position: absolute
            bottom: -2px
            width: 100%
            height: auto
            display: flex
            align-items: center
            justify-content: space-between
            .invite-box
              flex: 1
              .invite-price
                margin-bottom: 2px
                font-size: 11px
                display: flex
                color: #999
                .text
                  padding-right: 5px
                  &.price
                    font-size: 12px
                   color: #ff4040
              .invite-num
                font-size: 11px
                display: flex
                color: #999
                .text
                  padding: 0 3px
                  color: #333
                  &.line
                    padding: 0 5px
                    color: #999
            .btn-box
              width: 60px
              height: 26px
              line-height: 26px
              font-size: 12px
              text-align: center
              font-weight: bold
              color: #fff
              background-color: #ff4040
              box-shadow: 0 1px 4px 0 rgba(255,64,64,0.3)
              border-radius: 25px
      .item:last-child
        margin-bottom: 0
        border-bottom: none
</style>
