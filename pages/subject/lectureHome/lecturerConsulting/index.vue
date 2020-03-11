<template>
  <div v-if="upyunUrl && obj" class="lecturer-consulting">
    <div class="banner">
      <div class="share-btn">
        <button open-type='share'/>
        <img :src="upyunUrl + '/wxXcxImg/images/share-goods-icon.png'">
      </div>
      <img :src="obj.cover" />
      <div class="browse-num">浏览数：{{ obj.view_count || 0 }}</div>
    </div>
    <div class="lecturer-info">
      <h3>{{ obj.name }}</h3>
      <p>{{ obj.work_experience }}年工作经验 | 学历：{{ obj.education }}</p>
      <ul v-if="obj.tag.length">
        <li v-for="(item, index) in obj.tag" :key="index">{{ item }}</li>
      </ul>
    </div>
    <div class="consulting-content">
      <div class="nav-tab-wrapper">
        <ul>
          <li
            @click="onSwitchNavFn(0)"
            :class="{'active' : currentIndex === 0}"
          >服务</li>
          <li
            @click="onSwitchNavFn(1)"
            :class="{'active' : currentIndex === 1}"
          >介绍</li>
        </ul>
      </div>
      <div v-if="currentIndex === 0" class="service-wrapper">
        <ul v-if="obj.service.length">
          <li v-for="(item, index) in obj.service" :key="index">
            <div class="icon">
              <img :src="upyunUrl + '/wxXcxImg/images/consulting-icon1.png'" />
            </div>
            <p>{{ item }}</p>
          </li>
        </ul>
        <div class="consulting-info">
          <div class="consulting-ul">
            <h4>咨询时间</h4>
            <text>{{ obj.service_time }}</text>
          </div>
          <div class="consulting-ul">
            <h4>如何咨询</h4>
            <div class="process-box">
              <div class="item">
                <div class="icon">
                  <img :src="upyunUrl + '/wxXcxImg/images/consulting-icon2.png'" />
                </div>
                <p>付款成功</p>
              </div>
              <div class="item">
                <div class="icon">
                  <img :src="upyunUrl + '/wxXcxImg/images/consulting-icon2.png'" />
                </div>
                <p>获得联系</p>
              </div>
              <div class="item">
                <div class="icon">
                  <img :src="upyunUrl + '/wxXcxImg/images/consulting-icon2.png'" />
                </div>
                <p>开始咨询</p>
              </div>
            </div>
          </div>
          <div class="consulting-ul">
            <h4>咨询须知</h4>
            <p>{{ obj.rule }}</p>
          </div>
        </div>
      </div>
      <div v-if="currentIndex === 1" class="introduction-wrapper">
        <div class="introduction-content">
          <div class="left-line">
            <div class="line"></div>
          </div>
          <div class="introduction-right">
            <div class="item">
              <h5>个人寄语</h5>
              <p>
                <img :src="upyunUrl + '/wxXcxImg/images/consulting-icon3.png'" />
                <text>{{ obj.intro_wishes }}</text>
              </p>
            </div>
            <div class="item">
              <h5>个人资料</h5>
              <p>
                <img :src="upyunUrl + '/wxXcxImg/images/consulting-icon4.png'" />
                <text>{{ obj.intro_qualification }}</text>
              </p>
            </div>
            <div class="item">
              <h5>擅长领域</h5>
              <p>
                <img :src="upyunUrl + '/wxXcxImg/images/consulting-icon5.png'" />
                <text>{{ obj.intro_domain }}</text>
              </p>
            </div>
            <div class="item">
              <h5>工作履历</h5>
              <p>
                <img :src="upyunUrl + '/wxXcxImg/images/consulting-icon6.png'" />
                <text>{{ obj.intro_experience }}</text>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      @click="onSkipPageFn(`/pages/subject/lectureHome/lecturerConsulting/consultingPay/index?oJson=`)"
      class="btn-wrapper"
    >
      <div
        v-if="(isIos && isReview && obj.is_pay === 1) || (!isIos && obj.is_pay === 1)"
        class="pay-btn end"
      >已购买</div>
      <div
        v-if="(isIos && isReview && obj.is_pay !== 1) || (!isIos && obj.is_pay !== 1)"
        class="pay-btn"
      >¥{{ obj.price }}</div>
      <div
        v-if="(isIos && isReview) || (!isIos)"
        class="consulting-btn"
      >
        <img :src="upyunUrl + '/wxXcxImg/images/consulting-icon7.png'" />
        <div class="text">咨询</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { upyunUrl } from '../../../../api/config'

export default {
  data () {
    return {
      upyunUrl,
      oJson: '',
      obj: '',
      currentIndex: 0
    }
  },
  onLoad (options) {
    this.oJson = JSON.parse(decodeURIComponent(options.oJson))
    this.getConsultInfoFn()
  },
  // 下拉刷新
  onPullDownRefresh () {
    this.getConsultInfoFn()
  },
  computed: {
    ...mapState([
      'isIos',
      'isReview',
      'userInfo'
    ])
  },
  methods: {
    ...mapMutations({
      setIsIos: 'SET_IS_IOS'
    }),
    ...mapActions([
      'getConsultInfo'
    ]),
    // 获取咨询信息
    getConsultInfoFn () {
      uni.showLoading({ title: 'Loading' })
      this.getConsultInfo({ that: this, id: this.oJson.id }).then((res) => {
        this.obj = res
        uni.hideLoading()
        uni.stopPullDownRefresh()
      })
    },
    onSwitchNavFn (index) {
      this.currentIndex = index
    },
    // 跳转页面
    onSkipPageFn (url) {
      if ((this.userInfo && this.isIos && this.isReview) || (this.userInfo && !this.isIos)) {
        uni.navigateTo({
          url: url + encodeURIComponent(JSON.stringify(this.oJson))
        })
      } else if ((this.isIos && this.isReview) || (!this.isIos)) {
        uni.navigateTo({
          url: `/pages/login/index`
        })
      }
    }
  },
  onUnload () {
    this.obj = ''
  }
}
</script>

<style lang="stylus" scoped>
  .lecturer-consulting
    width: 100%
    height: auto
    .banner
      position: relative
      width: 100%
      height: 210px
      img
        width: 100%
        height: 100%
      .browse-num
        position: absolute
        left: 0
        bottom: 0
        width: 100%
        height: 28px
        padding: 0 15px
        line-height: 28px
        font-size: 12px
        color: #fff
        background-color: rgba(0, 0, 0, 0.3)
        box-sizing: border-box
      .share-btn
        position: fixed
        right: 15px
        top: 15px
        width: 28px
        height: 28px
        border-radius: 50%
        display: flex
        justify-content: center
        align-items: center
        background-color: rgba(0, 0, 0, 0.5)
        img
          display: block
          width: 14px
          height: 14px
        button
          position: absolute
          left: 0
          top: 0
          width: 100%
          height: 100%
          opacity: 0
    .lecturer-info
      width: 100%
      height: auto
      padding: 15px
      box-sizing: border-box
      h3
        font-size: 18px
        line-height: 20px
        font-weight: bold
        color: #000
      p
        font-size: 12px
        line-height: 40px
        color: #999
      ul
        width: 100%
        height: auto
        display: flex
        flex-wrap: wrap
        li
          width: auto
          height: auto
          padding: 0 10px
          line-height: 22px
          border-radius: 11px
          font-size: 12px
          margin: 0 10px 10px 0
          color: #666
          background-color: #F0F0F0
    .consulting-content
      width: 100%
      height: auto
      padding-bottom: 60px
      background-color: #f5f5f5
      .nav-tab-wrapper
        width: 100%
        height: auto
        padding: 5px 80px
        border-bottom: 1px solid #f0f0f0
        background-color: #fff
        box-sizing: border-box
        ul
          width: 100%
          height: auto
          display: flex
          justify-content: space-between
          li
            font-size: 15px
            line-height: 36px
            border-bottom: 2px solid #fff
            color: #999
          .active
            font-weight: bold
            border-color: #FF4040
            color: #000
      .service-wrapper
        width: 100%
        height: auto
        ul
          width: 100%
          height: auto
          padding: 10px 15px
          background-color: #fff
          box-sizing: border-box
          li
            width: 100%
            height: auto
            padding: 10px 0
            line-height: 14px
            font-weight: bold
            display: flex
            .icon
              width: 14px
              height: 14px
              img
                width: 100%
                height: 100%
            p
              flex: 1
              padding-left: 10px
              font-size: 14px
              color: #333
        .consulting-info
          width: 100%
          height: auto
          padding: 10px 15px
          margin-top: 10px
          background-color: #fff
          box-sizing: border-box
          .consulting-ul
            width: 100%
            height: auto
            padding-bottom: 10px
            h4
              font-weight: bold
              line-height: 40px
              font-size: 15px
              color: #000
            p, text
              line-height: 22px
              font-size: 13px
              color: #666
            .process-box
              width: 100%
              height: auto
              display: flex
              .item
                width: auto
                height: auto
                padding-right: 25px
                display: flex
                align-items: center
                .icon
                  width: 13px
                  height: 13px
                  img
                    display: block
                    width: 100%
                    height: 100%
                p
                  padding-left: 8px
      .introduction-wrapper
        width: 100%
        height: auto
        padding: 15px 0
        background-color: #fff
        .introduction-content
          width: 100%
          height: auto
          display: flex
          .left-line
            width: 34px
            height: auto
            .line
              width: 2px
              height: 100%
              margin: 0 auto
              background-color: #F2F2F2
          .introduction-right
            flex: 1
            height: auto
            padding: 0 15px 10px 0
            .item
              width: 100%
              height: auto
              padding-bottom: 10px
              h5
                font-size: 13px
                line-height: 35px
                font-weight: bold
                color: #333
              p
                position: relative
                font-size: 13px
                line-height: 18px
                color: #999
                img
                  display: block
                  position: absolute
                  left: -24px
                  top: 4px
                  width: 14px
                  height: 14px
    .btn-wrapper
      position: fixed
      left: 0
      bottom: 0
      width: 100%
      height: auto
      padding: 8px 15px
      display: flex
      z-index: 999
      background-color: #fff
      box-sizing: border-box
      .pay-btn
        position: relative
        flex: 1
        height: 34px
        font-size: 12px
        text-align: center
        line-height: 34px
        border-radius: 18px
        color: #fff
        background-color: #FF4040
        p
          position: absolute
          left: 0
          top: 0
          width: 100%
          height: 100%
          font-size: 12px
          text-align: center
          line-height: 34px
        .contact-button
          width: 34px
          height: 34px
          float: left
          opacity: 0
      .end
        background-color: #ccc
      .consulting-btn
        width: 65px
        padding-left: 15px
        height: 34px
        display: flex
        align-items: center
        img
          display: block
          width: 14px
          height: 14px
        .text
          padding-left: 5px
          font-size: 15px
          line-height: 34px
          color: #333
</style>
