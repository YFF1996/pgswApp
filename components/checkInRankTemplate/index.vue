<template>
  <div class="rank-wrapper" v-if="upyunUrl">
    <div class="rank-title">
      <i class="title-line"></i>
      <h2>排行榜</h2>
      <i class="title-line"></i>
    </div>
    <div class="rank-box" @click="onStipCheckInRanKingFn()">
      <div class="bg-wrapper">
        <img :src="upyunUrl + '/wxXcxImg/images/rank-bg.png'" />
      </div>
      <ul class="rank-list">
        <li v-if="newLists.length" v-for="(item, index) in newLists" :key="index" :class="index === 1 ? 'active' : ''">
          <div class="rank-content">
            <div class="rank-total">
               <div class="rank-num" v-if="item.user_lists">{{ item.user_lists[0].days }}</div>
               <div class="rank-num" v-else>{{ item.days }}</div>
               <p class="rank-hint">总签到数</p>
            </div>
            <div class="rank-icon">
              <img v-if="index === 1" :src="upyunUrl + '/wxXcxImg/images/check-ranking1.png'" />
              <img v-if="index === 0" :src="upyunUrl + '/wxXcxImg/images/check-ranking2.png'" />
              <img v-if="index === 2" :src="upyunUrl + '/wxXcxImg/images/check-ranking3.png'" />
            </div>
          </div>
          <div class="rank-info">
            <div class="rank-avatar-box">
              <div class="rank-avatar" v-if="!item.user_lists">
                <img :src="item.avatarurl" />
              </div>
              <div class="rank-avatar many-avatar"
                v-for="(obj, i) in item.user_lists"
                v-if="i <= 2 || obj.user_id === userInfo.user_id"
                :key="i"
                :class="item.user_lists.length >= 3 && i === 2 ? 'last-avatar' : ''"
                :style="{ marginLeft: item.user_lists.length >= 3 && i === 2 ? i * - 4.5 + 'px' : i * -8 + 'px', zIndex: 10 - i }"
              >
                <img :src="obj.avatarurl" />
                <div class="many-dots" v-if="item.user_lists.length >= 3 && i === 2">
                  <i></i>
                  <i></i>
                  <i></i>
                </div>
              </div>
            </div>
            <div class="rank-name" v-if="item.user_lists && item.user_lists.length === 2">{{ item.user_lists[0].nickname + ' / ' + item.user_lists[1].nickname }}</div>
            <div class="rank-name" v-if="item.user_lists && item.user_lists.length >= 3">{{ item.user_lists[0].nickname + ' / ' + item.user_lists[1].nickname + ' / ' + item.user_lists[2].nickname }}</div>
            <div class="rank-name" v-if="!item.user_lists">{{ item.nickname }}</div>
          </div>
        </li>
      </ul>
    </div>
    <div class="rank-bottom" @click="onStipCheckInRanKingFn()">
      <div class="rank-bottom-info">
        <div class="user-avatar">
          <img :src="userInfo.avatarurl" />
        </div>
        <div class="rank-text">
            <span class="my-rank">我的排名：</span>
            <span class="my-sum">{{ oJson.num ? oJson.num : '暂无排名' }}</span>
            <p class="text-content">比你优秀的人比你还努力，你怎么还好意思不学习</p>
        </div>
      </div>
      <div class="all-rank">
        <span>查看全部排行榜</span>
        <img :src="upyunUrl + '/wxXcxImg/images/more-wealth-icon.png'" />
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
      newLists: []
    }
  },
  onReady () {
    if (this.oJson) {
      this.manageUserListFn(this.oJson.lists)
    }
  },
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  methods: {
    // 跳转排行榜页面
    onStipCheckInRanKingFn () {
      uni.navigateTo({
        url: `/pages/checkIn/checkInRanking/index`
      })
    },
    // 处理用户排行数据
    manageUserListFn (lists) {
      let rankingList = []
      // 调整冠亚军位置
      lists.forEach((item, i) => {
        if (i <= 2) {
          if (i === 1) {
            rankingList.unshift(item)
          } else {
            rankingList.push(item)
          }
        }
      })
      this.newLists = rankingList
    }
  },
  watch: {
    oJson (data) {
      this.manageUserListFn(data.lists)
    }
  },
  props: ['oJson']
}
</script>

<style lang="stylus" scoped>
  .rank-wrapper
    width: 100%
    height: auto
    .rank-title
      margin-bottom: 13px
      height: 36px
      line-height: 36px
      display: flex
      align-items: center
      justify-content: center
      h2
        padding: 0 7px
        font-size: 25px
        color: #3b3b55
        box-sizing: border-box
      .title-line
        display: inline-block
        width: 17px
        height: 1px
        background-color: #3b3b55
        border-radius: 9px
    .rank-box
      position: relative
      width: 100%
      height: auto
      .bg-wrapper
        width: 100%
        height: 160px
        img
          width: 100%
          height: 100%
      .rank-list
        position: absolute
        top: 25px
        width: 100%
        height: auto
        display: flex
        li
          flex: 1
          height: auto
          .rank-content
            width: 100%
            padding: 0 10px 0 20px
            display: flex
            box-sizing: border-box
            .rank-icon
              width: 17px
              height: 23px
              img
                width: 100%
                height: 100%
            .rank-total
              flex: 1
              padding: 8px 4px 9px 0
              text-align: center
              box-sizing: border-box
              .rank-num
                height: 26px
                line-height: 26px
                font-size: 19px
                font-weight: 300
                color: #3b3b55
              .rank-hint
                height: 14px
                line-height: 14px
                font-size: 10px
                color: rgba(59,59,85,.49)
          .rank-info
            width: 100%
            height: auto
            .rank-avatar-box
              width: 100%
              height: 46px
              display: flex
              align-items: center
              justify-content: center
              .many-dots
                position: absolute
                top: 0
                width: 100%
                height: 100%
                padding-left: 4px
                border-radius: 50%;
                display: flex
                align-items: center
                justify-content: center
                background-color: rgba(0,0,0,.29)
                i
                  display: inline-block
                  width: 3px
                  height: 3px
                  margin: 0 1px
                  border-radius: 50%
                  background-color: #fff
              .rank-avatar
                position: relative
                width: 44px
                height: 44px
                border-radius: 50%
                overflow: hidden
                padding: 2px
                box-sizing: border-box
                background-color: #fff
                img
                  width: 100%
                  height: 100%
                  border-radius: 50%
              .many-avatar
                width: 30px
                height: 30px
              .last-avatar
                padding: 0
                width: 26px
                height: 26px
                background-color: #ccc
            .rank-name
              margin-top: 4px
              padding: 0 4px
              height: 16px
              line-height: 16px
              font-size: 12px
              font-weight: 400
              text-align: center
              color: #3b3b55
              box-sizing: border-box
              display: -webkit-box
              -webkit-box-orient: vertical
              -webkit-line-clamp: 1
              overflow: hidden
              white-space: normal
        .active
          margin-top: -10px
          .rank-content .rank-total .rank-num
            font-size: 20px
    .rank-bottom
      margin-top: -13px
      width: 100%
      height: auto
      background-color: rgba(255,121,96,1)
      box-shadow: 0px 3px 6px rgba(130,162,178,0.16)
      border-radius: 8px
      box-sizing: border-box
      .rank-bottom-info
        padding: 30px 0 15px 16px
        box-sizing: border-box
        display: flex
        justify-content: flex-start
        border-bottom: 1px solid rgba(255,255,255,.21)
        .user-avatar
          padding: 2px
          width: 35px
          height: 35px
          border-radius: 50%
          overflow: hidden
          box-sizing: border-box
          background-color: #fff
          img
            width: 100%
            height: 100%
            border-radius: 50%
        .rank-text
          padding: 0 10px
          flex: 1
          box-sizing: border-box
          .my-rank
            padding-right: 8px
            font-size: 19px
            color: #fff
          .my-sum
            font-size: 19px
            color: #fff
          .text-content
            margin-top: 5px
            font-size: 13px
            line-height: 18px
            font-weight: 400
            color: rgba(255,255,255,.83)
      .all-rank
        width: 100%
        height: 40px
        display: flex
        justify-content: center
        align-items: center
        span
          font-size: 14px
          line-height: 40px
          color: rgba(255,255,255,.83)
        img
          width: 15px
          height: 15px
</style>
