<template>
  <div v-if="upyunUrl" class="me-energy-wrapper">
    <div class="me-energy-top">
      <h3>你影响（激发）</h3>
      <h2>{{ shareRankingObj.count }}人</h2>
      <div class="qcdsjx-wrapper">
        <img :src="upyunUrl + '/wxXcxImg/images/energy-banner.png'" />
      </div>
    </div>
    <div class="me-energy-content">
      <div class="energy-tab">
        <ul>
          <li @click="onSelectItemFn(0)" :class="currentIndex === 0 ? 'active' : ''">上进心</li>
          <li @click="onSelectItemFn(1)" :class="currentIndex === 1 ? 'active' : ''">心榜</li>
        </ul>
      </div>
      <div class="ranking-wrapper">
        <ul v-if="currentIndex === 0">
          <li v-if="shareLatestRankList.length" v-for="(item, index) in shareLatestRankList" :key="index">
            <div class="avatar">
              <img :src="item.avatarurl" mode="aspectFill"/>
            </div>
            <h2>{{ item.nickname }}</h2>
            <div class="ranking-time">{{ item.inputtime }}</div>
          </li>
        </ul>
        <ul v-if="currentIndex === 1">
          <li v-if="shareRankingObj.lists.length" v-for="(item, index) in shareRankingObj.lists" :key="index">
            <span class="span1" v-if="index === 0">{{ index + 1 }}</span>
            <span class="span2" v-if="index === 1">{{ index + 1 }}</span>
            <span class="span3" v-if="index === 2">{{ index + 1 }}</span>
            <span class="span" v-if="index >= 3">{{ index + 1 }}</span>
            <div class="avatar">
              <img :src="item.avatarurl" mode="aspectFill"/>
            </div>
            <h2>{{ item.nickname }}</h2>
            <div class="ranking-time">{{ item.num }}</div>
          </li>
        </ul>
      </div>
    </div>
    <!-- mini play nav -->
    <suspend-play />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SuspendPlay from '../../../components/suspendPlayTemplate'
import { upyunUrl } from '../../../api/config'

export default {
  data () {
    return {
      upyunUrl,
      currentIndex: 0,
      page: 1
    }
  },
  onLoad () {
    this.getShareLatestRankFn()
    this.getShareRankingFn()
  },
  computed: {
    ...mapState([
      'userInfo',
      'shareLatestRankList',
      'shareRankingObj'
    ])
  },
  methods: {
    ...mapActions([
      'getShareLatestRank',
      'getShareRanking'
    ]),
    // 选择类型
    onSelectItemFn (index) {
      this.currentIndex = index
    },
    // 获取上进心列表
    getShareLatestRankFn () {
      const data = {
        that: this,
        page: this.page
      }
      this.getShareLatestRank(data)
    },
    // 获取心榜列表
    getShareRankingFn () {
      const data = {
        that: this,
        page: this.page
      }
      this.getShareRanking(data)
    }
  },
  components: {
    SuspendPlay
  }
}
</script>

<style lang="stylus" scoped>
  .me-energy-wrapper
    width: 100%
    height: auto
    padding-bottom: 60px
    background-color: #f8f8f8
    .me-energy-top
      width: 100%
      height: auto
      background-color: #fff
      h3
        padding-top: 15px
        text-align: center
        font-size: 14px
        line-height: 30px
        color: #999
      h2
        padding-bottom: 30px
        text-align: center
        font-size: 40px
        font-weight: bold
        line-height: 56px
        color: #FF6464
      .qcdsjx-wrapper
        width: 100%
        height: 110px
        img
          width: 100%
          height: 100%
    .me-energy-content
      width: 100%
      height: auto
      padding-top: 22px
      margin-top: 10px
      background-color: #fff
      .energy-tab
        width: 100%
        height: auto
        ul
          width: 260px
          height: auto
          margin: 0 auto
          border-radius: 6px
          display: flex
          overflow: hidden
          li
            flex: 1
            height: auto
            line-height: 38px
            text-align: center
            font-size: 14px
            color: #666
            background-color: #E8EBED
          .active
            color: #fff
            background-color: #FF6464
      .ranking-wrapper
        width: 100%
        height: auto
        ul
          width: 100%
          height: auto
          padding: 10px 0 0 16px
          box-sizing: border-box
          li
            width: 100%
            height: auto
            padding: 15px 15px 15px 0
            border-bottom: 1px solid #EFEFEF
            display: flex
            align-items: center
            box-sizing: border-box
            span
              padding-right: 10px
              line-height: 40px
              font-size: 20px
              color: #333333
            .span1
              color: #FF6464
            .span2
              color: #FFC164
            .span3
              color: #E5A78B
            .span
              font-size: 16px
            .avatar
              width: 40px
              height: 40px
              border-radius: 50%
              overflow: hidden
              img
                width: 100%
                height: 100%
            h2
              flex: 1
              padding: 0 10px
              font-size: 14px
              line-height: 40px
              color: #343546
            .ranking-time
              width: 80px
              height: auto
              line-height: 40px
              font-size: 12px
              text-align: right
              color: #999
          li:last-child
            border-bottom: none
</style>
