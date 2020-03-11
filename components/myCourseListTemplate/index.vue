<template>
  <div v-if="upyunUrl" class="my-course-list-wrapper">
    <ul v-if="list.length">
      <li
        v-for="(item, index) in list"
        :key="index"
      >
        <div class="url-pic" @click="onSkipPageFn(`/pages/subject/subjectMusic/index?sid=${item.id}`)">
          <img mode="aspectFill" :src="item.cover" />
        </div>
        <div class="text-right" @click="onSkipPageFn(`courseDetails/index?id=${item.order_id}`)">
          <h3>{{ item.title }}</h3>
          <div v-if="item.is_activity && item.back_money === null" class="type-price">现金返还<span class="undone">（完成后返现）</span></div>
          <div v-if="item.is_activity && item.back_money" class="type-price">现金返还<span>（已返{{ item.back_money }}元）</span></div>
          <div v-if="item.type === 1" class="type-price">瓶盖兑换<span>（{{ item.exchange_price }}）</span></div>
          <div v-if="item.type === 3" class="type-price">免费领取</div>
          <div v-if="item.is_activity" class="process-box">
            <div class="text">已学</div>
            <div class="process-line">
              <div class="active-line" :style="{width: item.learn_progress + '%'}">
                <i>
                  <img :src="upyunUrl + '/wxXcxImg/images/gold-icon.png'" />
                </i>
              </div>
            </div>
            <div class="num">{{ item.learn_progress }}%</div>
          </div>
          <div v-if="item.type === 2" class="invite-wrapper">
            <p>已邀请{{ item.join_num }}人，还差{{ item.need_invite - item.join_num }}人</p>
            <div
              v-if="item.is_pay !== 1"
              @click.stop="onSkipPageFn(`/pages/subjectDetailsPage/invitedRecord/index?orderid=${item.order_id}`)"
              class="btn"
            >
              查看任务
            </div>
          </div>
          <div
            v-if="item.type === 2"
            class="exhibition-box"
          >
            <div
              v-if="(isIos && isReview && item.type === 2) || (!isIos && item.type === 2)"
              class="price"
            >￥{{ item.order_price }}</div>
            <p>邀请免费听</p>
          </div>
          <div
            v-if="isIos && isReview && item.type === 1 || isIos && isReview && item.type === 3 || !isIos && item.type === 1 || !isIos && item.type === 3"
            class="pay-price"
          >￥{{ item.order_price }}</div>
          <div
            v-if="item.type === 0"
            class="pay-price cash"
          >￥{{ item.order_price }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { upyunUrl } from '../../api/config'

export default {
  data () {
    return {
      upyunUrl
    }
  },
  computed: {
    ...mapState([
      'isIos',
      'isReview'
    ])
  },
  methods: {
    ...mapActions([
      'concernCourseTask'
    ]),
    onSkipPageFn (url) {
      uni.navigateTo({
        url: url
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
  .my-course-list-wrapper
    width: 100%
    height: auto
    margin-top: 60px
    padding: 25px 15px 15px
    box-sizing: border-box
    ul
      width: 100%
      height: auto
      li
        width: 100%
        height: auto
        padding: 13px
        margin-bottom: 15px
        box-sizing: border-box
        display: flex
        background-color: #fff
        border-radius: 4px
        .url-pic
          width: 90px
          height: 90px
          border-radius: 5px
          overflow: hidden
          img
            width: 100%
            height: 100%
        .text-right
          position: relative
          flex: 1
          margin-top: -3px
          margin-left: 15px
          height: auto
          h3
            width: 100%
            min-height: 20px
            line-height: 20px
            font-size: 15px
            font-weight: bold
            display: -webkit-box
            -webkit-box-orient: vertical
            -webkit-line-clamp: 2
            overflow: hidden
            color: #333
          .type-price
            margin: 9px 0 5px
            font-size: 12px
            color: #999
            span
              color: #ff4040
              &.undone
                color: #999
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
                i
                  position: absolute
                  right: -8px
                  width: 10px
                  height: 10px
                  img
                    display: block
                    width: 100%
                    height: 100%
            .num
              padding-left: 8px
              font-size: 12px
              color: #333
          .invite-wrapper
            margin-top: 5px
            width: 100%
            height: auto
            display: flex
            justify-content: space-between
            align-items: center
            p
              font-size: 12px
              color: #999
            .btn
              width: auto
              height: auto
              padding: 4px 8px
              font-size: 10px
              border-radius: 20px
              color: #fff
              background-color: #ff4040
          .exhibition-box
            position: absolute
            bottom: 0
            width: 100%
            height: auto
            display: flex
            align-items: center
            justify-content: space-between
            p
              font-size: 12px
              color: #999
            .price
              font-size: 15px
              color: #ff4040
              text-decoration: line-through
          .pay-price
            font-size: 15px
            color: #ff4040
            &.cash
              margin-top: 10px
</style>
