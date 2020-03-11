<template>
  <div v-if="upyunUrl" class="me-wrapper">
    <div class="user-wrapper">
      <div class="user-box">
        <div class="user-name" v-if="userInfo">{{ userInfo.nickname }}</div>
        <div class="user-name" v-else @click="onSkipPageFn()">点击登录</div>
        <div class="num-box">
          <div class="item" @click="onSkipPageFn('mySubscription/index')">
            <div class="text">订阅</div>
            <div class="num">{{ userInfo.sub_total || 0 }}</div>
          </div>
          <div class="item" @click="onSkipPageFn('myAttention/index')">
            <div class="text">关注</div>
            <div class="num">{{ userInfo.attention_total || 0 }}</div>
          </div>
          <div class="item" @click="onSkipPageFn('privateLetter/index')">
            <div class="icon">
              <image :src="upyunUrl + '/wxXcxImg/images/person-chat-icon.png'" />
            </div>
            <div class="num">
              私信
              <div v-if="noReadCount" class="mark"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="avatar" @click="onSkipPageFn('myData/index')">
        <image v-if="userInfo" :src="userInfo.avatarurl" mode="aspectFill" />
        <image v-else :src="upyunUrl + '/wxXcxImg/images/not-avatar-icon.png'" />
        <div v-if="userInfo" class="edit-btn">编辑</div>
      </div>
    </div>
    <div class="my-list">
      <div class="my-list-ul">
        <div class="item" @click="onSkipPageFn('amount/index')">
          <div v-if="userInfo.account" class="my-data">{{ userInfo.account.balance}}</div>
          <div v-else class="my-data">0.00</div>
          <div class="text">收入金额(元)</div>
        </div>
        <div class="item" @click="onSkipPageFn('myCollect/index')">
          <div class="my-data">{{ userInfo.collection_total || 0 }}</div>
          <div class="text">我的收藏</div>
        </div>
        <div class="item" @click="onSkipPageFn('playHistory/index')">
          <div class="my-data">{{ userInfo.play_total || 0 }}</div>
          <div class="text">播放历史</div>
        </div>
        <div class="item" @click="onSkipPageFn('giveThumbs/index')">
          <div class="my-data">{{ userInfo.like_total || 0 }}</div>
          <div class="text">点赞列表</div>
        </div>
      </div>
    </div>
    <div
      v-if="userInfo && getFree && getFree.status !== 2"
      @click="onSkipPageFn(`/pages/subject/subjectQuality/index?oJson=${JSON.stringify({ id: getFree.job_collection_id, title: getFree.job_collection.jobCategory.name, channelPath: 'me'})}`)"
      class="free-box"
    >
      <image class="free-bg" :src="upyunUrl + '/wxXcxImg/images/free-get-bg.png'" />
      <div class="free-get">
        <div class="close" @click.stop="onCloseBoxFn(true)">
          <image :src="upyunUrl + '/wxXcxImg/images/small-close-icon.png'" />
        </div>
        <div class="free-title">免费领课程啦</div>
        <div class="hint">
          <div class="free-mark-title">你有课程待领取</div>
          <div class="icon">
            <image :src="upyunUrl + '/wxXcxImg/images/small-return-icon.png'" />
          </div>
        </div>
      </div>
    </div>
    <me-list :lists="lists"/>
    <!--<div class="copyright-text">版权归原作者所有，如有侵权请联系Customer@czlks.com处理。</div>-->
    <div class="copyright-text">Copyright©2019广西梯子科技有限公司gxtizi.com，版权所有</div>
    <!-- 关闭领取课程弹窗 -->
    <div v-if="freePopupState" class="free-popup">
      <div class="info-box">
        <div class="icon">
          <image :src="upyunUrl + '/wxXcxImg/images/big-hint-icon.png'" />
        </div>
        <div class="text">
          <div class="title">确定后入口消失</div>
          <div class="title">你将错过免费领取课程机会</div>
        </div>
        <div class="btn-box">
          <div class="btn" @click="onCloseBoxFn(false)">取消</div>
          <div class="btn sure" @click="cancelFreeFn(getFree.id)">确定</div>
        </div>
      </div>
    </div>
    <!-- mini play nav -->
    <suspend-play />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import MeList from '../../components/meListTemplate'
import SuspendPlay from '../../components/suspendPlayTemplate'
import { upyunUrl } from '../../api/config'

export default {
  data () {
    return {
      upyunUrl,
      lists: [
        {
          icon: upyunUrl + '/wxXcxImg/images/my-list-icon1.png',
          title: '我的订单',
          url: 'myOrder/index?status=true',
          isLogin: true
        },
        {
          icon: upyunUrl + '/wxXcxImg/images/my-list-icon2.png',
          title: '我的课程',
          url: 'myCourse/index',
          isLogin: true
        },
        {
          icon: upyunUrl + '/wxXcxImg/images/my-list-icon3.png',
          title: '我的能量',
          url: 'meEnergy/index',
          isLogin: true
        },
        {
          icon: upyunUrl + '/wxXcxImg/images/my-list-icon4.png',
          title: '内容定制',
          url: 'contentCustom/index',
          isLogin: true
        },
        {
          icon: upyunUrl + '/wxXcxImg/images/my-list-icon5.png',
          title: '意见反馈',
          url: 'feedback/index',
          isLogin: true
        },
        {
          icon: upyunUrl + '/wxXcxImg/images/my-list-icon6.png',
          title: '瓶盖成长记录',
          url: 'growthRecord/index',
          isLogin: false
        },
        {
          icon: upyunUrl + '/wxXcxImg/images/my-list-icon7.png',
          title: '申请讲师入驻',
          url: 'applyEnter/index',
          isLogin: false
        },
        {
          icon: upyunUrl + '/wxXcxImg/images/my-list-icon7.png',
          title: '退出登录',
          url: '',
          isLogin: false
        }
      ],
      freePopupState: false,
      getFree: '',
      cancelFree: '',
      noReadCount: 0
    }
  },
  onLoad () {
    this.initializeFn()
  },
  onPullDownRefresh () {
    this.initializeFn()
  },
  computed: {
    ...mapState([
      'userInfo',
      'musicList'
    ])
  },
  methods: {
    ...mapActions([
      'getUserInfo',
      'getNoReadCount',
      'getFreeSubject',
      'cancelFreeSubject'
    ]),
    initializeFn () {
      this.getUserInfoFn()
      this.getNoReadCountFn()
      this.getFreeSubjectFn()
    },
    // 用户收藏播放点赞统计
    getUserInfoFn () {
      if (this.userInfo) {
        this.getUserInfo().then(() => {
          uni.stopPullDownRefresh()
        })
      }
    },
    // 获取未读总数
    getNoReadCountFn () {
      if (this.userInfo) {
        this.getNoReadCount({ that: this }).then((res) => {
          this.noReadCount = res
        })
      }
    },
    // 显示免费领取课程
    getFreeSubjectFn () {
      if (this.userInfo) {
        this.getFreeSubject({ that: this }).then((res) => {
          this.getFree = res
        })
      }
    },
    // 关闭免费领取课程弹窗
    onCloseBoxFn (status) {
      this.freePopupState = status
    },
    // 取消免费领取课程操作
    cancelFreeFn (id) {
      if (this.userInfo) {
        uni.showLoading()
        this.cancelFreeSubject({ that: this, id: id }).then(() => {
          this.getFree['status'] = 2
          this.onCloseBoxFn(false)
          uni.hideLoading()
        })
      }
    },
    // 跳转页面
    onSkipPageFn (url) {
      if (this.userInfo) {
        uni.navigateTo({
          url: url
        })
      } else {
        uni.navigateTo({
          url: `/pages/login/index`
        })
      }
    }
  },
  components: {
    MeList,
    SuspendPlay
  }
}
</script>

<style lang="stylus" scoped>
  .me-wrapper
    width: 100%
    height: auto
    overflow: hidden
    background-color: #fff
    .user-wrapper
      width: 100%
      height: auto
      padding: 15px 15px 0 15px
      display: flex
      box-sizing: border-box
      .user-box
        flex: 1
        height: auto
        padding: 8px 10px
        box-sizing: border-box
        .user-name
          width: 100%
          line-height: 34px
          font-size: 20px
          font-weight: bold
          box-sizing: border-box
          color: #000
        .num-box
          width: 100%
          height: auto
          display: flex
          .item
            width: auto
            height: auto
            padding-right: 25px
            display: flex
            align-items: center
            .text
              line-height: 24px
              font-size: 12px
              color: #999
            .num
              position: relative
              padding-left: 8px
              font-size: 12px
              color: #333
              font-weight: bold
              .mark
                position: absolute
                right: -2px
                top: 1px
                width: 5px
                height: 5px
                border-radius: 50%
                background-color: #ff4040
            .icon
              width: 13px
              height: 13px
              image
                display: block
                width: 100%
                height: 100%
      .avatar
        position: relative
        width: 74px
        height: 74px
        box-sizing: border-box
        background-color: #fff
        image
          width: 100%
          height: 100%
          border-radius: 50%
        .edit-btn
          position: absolute
          right: 0
          bottom: 0
          padding: 0 8px
          font-size: 12px
          line-height: 17px
          border-radius: 8px
          color: #fff
          background-color: #ff4040
    .my-list
      width: 100%
      height: auto
      padding: 20px 15px 17px
      box-sizing: border-box
      .my-list-ul
        width: 100%
        height: auto
        display: flex
        .item
          flex: 1
          text-align: center
          .my-data
            font-size: 20px
            font-weight: 600
            line-height: 45px
            color: #000000
          .text
            font-size: 12px
            line-height: 35px
            color: #999999
    .free-box
      position: relative
      margin-bottom: 12px
      padding: 0 15px
      box-sizing: border-box
      width: 100%
      height: 45px
      line-height: 45px
      .free-bg
        width: 100%
        height: 100%
      .free-get
        position: absolute
        top: 0
        width: 100%
        height: auto
        padding: 0 58px 0 15px
        box-sizing: border-box
        display: flex
        align-items: center
        .close
          position: absolute
          top: 0
          right: 30px
          padding: 6px
          width: 9px
          height: 9px
          image
            display: block
            width: 100%
            height: 100%
        .free-title
          flex: 1
          font-size: 15px
          color: #fff
        .hint
          display: flex
          align-items: center
          .free-mark-title
            padding-right: 12px
            font-size: 12px
            color: rgba(255,255,255,0.8)
            box-sizing: border-box
          .icon
            width: 8px
            height: 8px
            image
              display: block
              width: 100%
              height: 100%
    .copyright-text
      width: 100%
      height: auto
      padding: 30px 20px
      text-align: center
      line-height: 20px
      font-size: 14px
      color: #ccc
      box-sizing: border-box
    .free-popup
      position: fixed
      top: 0
      left: 0
      right: 0
      bottom: 0
      display: flex
      align-items: center
      z-index: 600
      background-color: rgba(0,0,0,0.5)
      .info-box
        margin: 0 auto
        padding: 13px 15px
        box-sizing: border-box
        width: 280px
        height: auto
        display: flex
        align-items: center
        flex-direction: column
        background-color: #fff
        border-radius: 4px
        .icon
          width: 50px
          height: 50px
          image
            display: block
            width: 100%
            height: 100%
        .text
          padding: 25px 0 15px
          box-sizing: border-box
          .title
            margin-bottom: 15px
            font-size: 14px
            text-align: center
            font-weight: bold
            color: #000
        .btn-box
          width: 100%
          height: auto
          display: flex
          justify-content: space-around
          .btn
            width: 100px
            height:33px
            line-height: 33px
            text-align: center
            font-size: 18px
            color: #999
            border: 1px solid #999
            border-radius: 8px
            &.sure
              color: #fff
              border: 1px solid #ff4040
              background-color: #ff4040
</style>
