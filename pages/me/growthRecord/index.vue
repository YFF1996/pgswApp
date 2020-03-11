<template>
  <div v-if="upyunUrl" class="growth-wrapper">
    <scroll-view
      :scroll-y="true"
      @scrolltolower="onScrolltolowerFn()"
      class="scroll-view"
    >
      <div class="growth-box">
        <div class="growth-content">
          <div class="current-date">
            <div class="left">
              <h3>{{ date.year }}/{{ date.month }}</h3>
              <h2>{{ date.date }}</h2>
              <h3 class="month">{{ date.monthEnglish }}</h3>
            </div>
            <div class="right">
              <h2>{{ date.weekChinese }}</h2>
              <h3>{{ date.weekEnglish }}</h3>
            </div>
          </div>
          <ul v-if="growhtRecordList.length">
            <li v-for="(item, index) in growhtRecordList" :key="index">
              <div class="time-box">
                <h2>{{ item.month }}.{{ item.year }}</h2>
                <h3>{{ item.day }}</h3>
              </div>
              <div class="info-box">
                <div class="avatar">
                  <img v-if="item.user_pic" :src="item.user_pic" />
                  <img v-else :src="upyunUrl + '/wxXcxImg/images/default-avatar-icon.png'" />
                </div>
                <div class="content">
                  <h3>{{ item.user_name || '瓶盖思维' }}</h3>
                  <h4>{{ item.title || '标题' }}</h4>
                  <div class="hint-box">
                    <div
                      class="hint-content"
                      :class="{'hint-content-hide' : item.lineState && item.isLine }">
                      <parse v-if="item.content" :html="item.content" />
                    </div>
                    <div
                      class="btn"
                      v-if="item.lineState && item.isLine"
                      @click="onShowHideContentFn(index, false)"
                    >
                      <span>展开全文</span>
                      <i>
                        <img :src="upyunUrl + '/wxXcxImg/images/down-icon.png'" />
                      </i>
                    </div>
                    <div
                      class="btn"
                      v-if="item.lineState && !item.isLine"
                      @click="onShowHideContentFn(index, true)"
                    >
                      <span>收起</span>
                      <i class="up-icon">
                        <img :src="upyunUrl + '/wxXcxImg/images/down-icon.png'" />
                      </i>
                    </div>
                  </div>
                  <div class="pic-box" v-if="item.pic_arr.length">
                    <div class="cover" v-for="(o, i) in item.pic_arr" :key="i">
                      <img :src="o" mode="aspectFill" @click="onPreviewImageFn(item.pic_arr, o)" />
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <!-- 上拉加载更多loading -->
          <loading-more :lists="growhtRecordList" :listsLength="10" />
        </div>
      </div>
    </scroll-view>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import LoadingMore from '../../../components/loadingMoreTemplate'
import Parse from '../../../components/jyf-parser/jyf-parser'
import { upyunUrl } from '../../../api/config'

export default {
  data () {
    return {
      upyunUrl,
      pape: 1,
      date: {}
    }
  },
  onLoad () {
    this.page = 1
    this.newDateFn()
    this.getGrowthRecorFn(true)
  },
  computed: {
    ...mapState([
      'growhtRecordList'
    ])
  },
  methods: {
    ...mapMutations({
      setGrowhtRecordList: 'SET_GROWHT_RECORD_LIST'
    }),
    ...mapActions([
      'getGrowthRecord'
    ]),
    // 获取当前时间
    newDateFn () {
      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth()
      const date = now.getDate()
      const day = now.getDay()
      this.date['year'] = year
      this.date['month'] = month + 1
      this.date['monthEnglish'] = this.monthEnglishFn(month + 1)
      this.date['date'] = date
      this.date['weekChinese'] = this.weekChineseFn(day)
      this.date['weekEnglish'] = this.weekEnglishFn(day)
    },
    // 月份转英文
    monthEnglishFn (month) {
      switch (month) {
        case 1:
          return 'January'
        case 2:
          return 'February'
        case 3:
          return 'March'
        case 4:
          return 'April'
        case 5:
          return 'May'
        case 6:
          return 'June'
        case 7:
          return 'July'
        case 8:
          return 'August'
        case 9:
          return 'September'
        case 10:
          return 'October'
        case 11:
          return 'November'
        case 12:
          return 'December'
        default:
          return false
      }
    },
    // 星期转中文
    weekChineseFn (week) {
      switch (week) {
        case 0:
          return '星期日'
        case 1:
          return '星期一'
        case 2:
          return '星期二'
        case 3:
          return '星期三'
        case 4:
          return '星期四'
        case 5:
          return '星期五'
        case 6:
          return '星期六'
        default:
          return false
      }
    },
    // 星期转英文
    weekEnglishFn (week) {
      switch (week) {
        case 0:
          return 'Sunday'
        case 1:
          return 'Monday'
        case 2:
          return 'Tuesday'
        case 3:
          return 'Wednesday'
        case 4:
          return 'Thursday'
        case 5:
          return 'Friday'
        case 6:
          return 'Saturday'
        default:
          return false
      }
    },
    // 获取成长记录
    getGrowthRecorFn (isLoading) {
      const data = {
        that: this,
        page: this.page
      }
      if (isLoading) {
        uni.showLoading({ title: 'Loading' })
        this.setGrowhtRecordList([])
      }
      this.getGrowthRecord(data).then(() => {
        if (isLoading) uni.hideLoading()
      })
    },
    // 显示-隐藏content
    onShowHideContentFn (index, status) {
      this.growhtRecordList[index]['isLine'] = status
    },
    // 预览图片
    onPreviewImageFn (arr, url) {
      uni.previewImage({
        current: url,
        urls: arr
      })
    },
    // 上拉加载更多
    onScrolltolowerFn () {
      this.page += 1
      this.getGrowthRecorFn(false)
    }
  },
  components: {
    Parse,
    LoadingMore
  }
}
</script>

<style lang="stylus" scoped>
  .growth-wrapper
    position: fixed
    left: 0
    top: 0
    right: 0
    bottom: 0
    width: 100%
    height: auto
    padding-top: 6px
    background-color: #f5f5f5
    box-sizing: border-box
    .scroll-view
      width: 100%
      height: 100%
      background-color: #fff
      .growth-box
        padding: 12px 15px 0 15px
        width: 100%
        height: auto
        box-sizing: border-box
        .growth-content
          width: 100%
          height: auto
          .current-date
            padding: 0 13px
            display: flex
            align-items: center
            justify-content: space-between
            color: #e1564f
            .left
              padding: 0 5px
              text-align: center
              border-top: 1px solid #E1564F
              border-bottom: 1px solid #E1564F
              color: #E1564F
              h3
                font-size: 12px
                line-height: 24px
              h2
                font-size: 44px
                line-height: 60px
              .month
                text-align: left
            .right
              text-align: right
              h2
                margin-bottom: 6px
                font-size: 20px
                line-height: 27px
              h3
                font-size: 16px
                line-height: 21px
          ul
            width: 100%
            height: auto
            padding: 24px 0
            li
              width: 100%
              height: auto
              display: flex
              .time-box
                width: 50px
                padding-right: 15px
                text-align: center
                h2
                  font-size: 12px
                  color: #636361
                h3
                  font-size: 21px
                  color: #2A2A2A
              .info-box
                position: relative
                flex: 1
                border-left: 1px solid #c7c7c7
                .avatar
                  position: absolute
                  top: 0
                  left: -14px
                  width: 24px
                  height: 24px
                  border-radius: 50%
                  img
                    width: 100%
                    height: 100%
                    border-radius: 50%
                .circle
                  margin: 0 auto
                  width: 7px
                  height: 7px
                  border: 1px solid #000
                  border-radius: 50%
                .content
                  padding: 3px 0 25px 16px
                  box-sizing: border-box
                  font-size: 13px
                  color: #000
                  h3
                    margin-bottom: 18px
                  h4
                    margin-bottom: 10px
                    display: -webkit-box
                    -webkit-box-orient: vertical
                    -webkit-line-clamp: 1
                    overflow: hidden
                  .hint-box
                    width: 100%
                    height:auto
                    .hint-content
                      height: auto
                      line-height: 24px
                      word-break: break-all
                      overflow: hidden
                      color: #676767
                    .hint-content-hide
                      position: relative
                      height: 48px
                      display: -webkit-box
                      -webkit-box-orient: vertical
                      -webkit-line-clamp: 2
                      overflow: hidden
                      &::after
                        position: absolute
                        bottom: 0
                        height: 100%
                        width: 100%
                        content: ""
                        background: linear-gradient(to top, rgba(255,255,255, 0.8) 10%, rgba(255,255,255, 0) 90%)
                        pointer-events: none
                    .btn
                      padding: 6px
                      display: flex
                      align-items: center
                      justify-content: center
                      font-size: 12px
                      text-align: center
                      color: #ff5408
                      box-sizing: border-box
                      span
                        padding-right: 4px
                      i
                        width: 9px
                        height: 6px
                        img
                          display: block
                          width: 100%
                          height: 100%
                        &.up-icon
                          margin-top: -2px
                          transform: rotate(-180deg)
                  .pic-box
                    margin-top: 12px
                    display: flex
                    flex-flow: wrap
                    .cover
                      margin: 0 5px 15px 0
                      width: 58px
                      height: 58px
                      img
                        width: 100%
                        height: 100%
              &:last-child
                .info-box
                  .content
                    padding-bottom: 0
    ::-webkit-scrollbar
      width: 0
      height: 0
      color: transparent
</style>
