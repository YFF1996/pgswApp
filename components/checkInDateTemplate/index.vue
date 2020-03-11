<template>
  <div class="check-in-date-wrapper" v-if="upyunUrl">
    <div
      :class="dateShowIndex === index ? 'check-in-box check-in-box-active' : 'check-in-box'"
      v-if="checkInList.length"
      v-for="(item, index) in checkInList"
      :key="index"
    >
      <div
        class="date-wrapper"
        @click="onToggleShowHideFn(index, item.y, item.m)"
      >
        <h2>{{ item.y }}/{{ item.m }}</h2>
        <!--<h4>共坚持20天，为你推荐10个案例</h4>-->
        <h4></h4>
        <img class="more-icon" :src="upyunUrl + '/wxXcxImg/images/date-more-icon.png'" />
      </div>
      <div class="date-content">
        <swiper
          class="swiper-wrapper"
          :duration="200"
          :current="currentIndex"
          @change="onDateChangeFn"
        >
          <swiper-item
            class="swiper-item"
            v-if="checkInDateList.length"
            v-for="(list, i) in checkInDateList"
            :key="i"
          >
            <ul>
              <li v-if="i === 0" class="li"></li>
              <li v-if="list.length" v-for="(item, j) in list" :key="j">
                <div
                  :class="item.is_sign ? 'prompt prompt-active' : 'prompt'"
                  v-if="item.id"
                  @click="onSkiptArticleDetailFn(item.id, item.is_sign)"
                >
                  <img  v-if="item.is_sign" :src="upyunUrl + '/wxXcxImg/images/book-active-icon.png'" />
                  <img  v-else :src="upyunUrl + '/wxXcxImg/images/book-mark-icon.png'" />
                  {{ item.ftitle }}
                </div>
                <p v-if="!item.id && item.is_currnet_day && !item.is_sign && item.is_day">今日</p>
                <p v-if="!item.id && !item.is_currnet_day && !item.is_day && !item.is_sign">待开启</p>
                <p v-if="!item.id && !item.is_currnet_day && item.is_day && !item.is_sign">未完成</p>
                <p v-if="!item.id && item.is_day && item.is_sign">已坚持</p>
                <p v-if="item.id"></p>
                <h3
                  @click="onSkipPopUpsFn(item.is_currnet_day, item.is_sign, item.tid)"
                >
                  {{ item.is_currnet_day && !item.is_sign ? '去打卡' : item.day }}
                </h3>
                <img v-if="item.id && !item.is_currnet_day && !item.is_day && !item.is_sign" class="mark" :src="upyunUrl + '/wxXcxImg/images/stay-insist-icon.png'" />
                <img v-if="item.id && !item.is_currnet_day && item.is_day && !item.is_sign" class="mark" :src="upyunUrl + '/wxXcxImg/images/not-insist-icon.png'" />
                <img v-if="item.is_sign" class="mark" :src="upyunUrl + '/wxXcxImg/images/end-insist-icon.png'" />
              </li>
            </ul>
          </swiper-item>
        </swiper>
        <div class="dot-wrapper">
          <div :class="currentIndex === 0 ? 'dot active' : 'dot'"></div>
          <div :class="currentIndex === 1 ? 'dot active' : 'dot'"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { upyunUrl } from '../../api/config'

export default {
  data () {
    return {
      upyunUrl,
      currentIndex: 0,
      dateShowIndex: 0,
      initializeStatus: true
    }
  },
  onShow () {
    this.dateShowIndex = 0
  },
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  methods: {
    // 打开关闭日历
    onToggleShowHideFn (index, year, month) {
      this.dateShowIndex === index ? this.dateShowIndex = '' : this.dateShowIndex = index
      this.currentIndex = 0
      if (this.dateShowIndex === index) this.$emit('toggleShowHideChild', { year, month, index })
    },
    // 切换上下页日历
    onDateChangeFn (e) {
      this.currentIndex = e.mp.detail.current
    },
    // 打开弹窗或跳转分享落地页
    onSkipPopUpsFn (currentDay, isSign, tid) {
      if (currentDay && !isSign) this.$emit('popUpsFnChild')
      if (isSign && tid) {
        uni.navigateTo({
          url: `/pages/sharePage/index?tid=${tid}&shareid=${this.userInfo.user_id}`
        })
      }
    },
    // 跳转故事详情
    onSkiptArticleDetailFn (id, isSign) {
      if (isSign) {
        uni.navigateTo({
          url: `/pages/articleDetail/index?id=${id}`
        })
      }
    }
  },
  watch: {
    checkInDateList (lists) {
      if (lists.length && this.initializeStatus) {
        lists.forEach((list) => {
          list.forEach((item) => {
            if (item.is_currnet_day) {
              this.currentIndex = item.day > 15 ? 1 : 0
              this.initializeStatus = false
            }
          })
        })
      }
    }
  },
  props: ['checkInList', 'checkInDateList']
}
</script>

<style lang="stylus" scoped>
  .check-in-date-wrapper
    width: 100%
    height: auto
    .check-in-box
      position: relative
      width: 100%
      height: auto
      margin-bottom: 10px
      border-radius: 6px
      background-color: #fff
      .date-wrapper
        width: 100%
        height: 55px
        padding: 0 16px 0 10px
        border-bottom: 1px solid rgb(240, 240, 240)
        display: flex
        align-items: center
        box-sizing: border-box
        h2
          font-size: 16px
          line-height: 55px
          color: #9798A6
        h4
          flex: 1
          padding: 0 14px
          font-size: 14px
          line-height: 55px
          color: #3B3B55
          box-sizing: border-box
        .more-icon
          display: block
          width: 14px
          height: 14px
      .date-content
        position: relative
        width: 100%
        height: 0
        opacity: 0
        transition: all 0.2s
        .swiper-wrapper
          width: 100%
          height: 100%
          .swiper-item
            width: 100%
            height: 100%
            ul
              width: 100%
              height: 100%
              padding: 20px 10px
              display: flex
              flex-wrap: wrap
              box-sizing: border-box
              li
                position: relative
                width: 75px
                height: 75px
                padding-top: 13px
                margin: 0 8px 8px 0
                border-radius: 6px
                box-sizing: border-box
                background-color: #F2F4F7
                p
                  width: 100%
                  height: 18px
                  margin-bottom: 5px
                  text-align: center
                  line-height: 18px
                  font-size: 12px
                  color: rgb(171, 173, 184)
                h3
                  width: 100%
                  height: 22px
                  text-align: center
                  line-height: 22px
                  font-size: 18px
                  font-weight: bold
                  color: rgb(59, 59, 85)
                .h3
                  color: rgb(171, 173, 184)
                .prompt
                  position: absolute
                  top: -5px
                  left: 50%
                  width: 60px
                  height: 26px
                  padding: 2px 6px
                  margin-left: -31px
                  font-size: 8px
                  border-radius: 3px
                  line-height: 11px
                  overflow: hidden
                  border: 1px solid rgb(242, 244, 247)
                  box-sizing: border-box
                  color: rgb(171, 173, 184)
                  background-color: #fff
                  img
                    width: 7px
                    height: 7px
                .prompt-active
                  color: #fff
                  background-color: #ff6464
                .mark
                  position: absolute
                  right: 0
                  bottom: 0
                  width: 40px
                  height: 28px
              li:nth-child(4n + 4)
                margin-right: 0
              .li
                background-color: #fff
        .dot-wrapper
          position: absolute
          left: 0
          bottom: 10px
          width: 100%
          height: auto
          display: flex
          justify-content: center
          .dot
            width: 8px
            height: 8px
            margin: 0 3px
            border-radius: 50%
            background-color: rgb(171, 173, 184)
          .active
            background-color: rgb(59, 59, 85)
    .check-in-box:last-child
      margin-bottom: 0
    .check-in-box-active
      .more-icon
        transform: rotate(-90deg)
      .date-content
        height: 380px
        opacity: 1
</style>
