<template>
  <div v-if="selectedJobInfo" class="job-wrapper">
    <div class="change-wrapper" v-if="selectedJobInfo.status">
      <div class="change-box">
        <h3>当前已选择的岗位</h3>
        <div class="change-info">{{ selectedJobInfo.job || oJob.job }}</div>
      </div>
      <div class="btn-box">
        <div class="change-btn" @click="onSkipChangeJobFn()">更换岗位</div>
      </div>
    </div>
    <div class="content-box" v-else>
      <div class="nav-box">
        <scroll-view class="scroll-view" :scroll-y="true">
          <ul v-if="levelOneJobList.length" v-for="(item, index) in levelOneJobList" :key="index">
            <li :class="{ 'active' : currentIndex === index }" @click="onChangeFn(index, item.catid)">{{ item.catname }}</li>
          </ul>
        </scroll-view>
      </div>
      <div class="info-box">
        <scroll-view class="scroll-view" :scroll-y="true">
          <ul v-if="oJson.length" v-for="(obj, num) in oJson" :key="num" >
            <li :class="{ 'active' : currentIndex === num }" @click="onSkipSelectJobFn(num,obj.catname)">{{ obj.catname }}</li>
          </ul>
        </scroll-view>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  data () {
    return {
      currentIndex: 0,
      oJson: '',
      oJob: ''
    }
  },
  onLoad () {
    this.onSelectLevelOneItemFn()
  },
  computed: {
    ...mapState([
      'userInfo',
      'levelOneJobList',
      'selectedJobInfo'
    ])
  },
  methods: {
    ...mapMutations({
      setSelectedJobInfo: 'SET_SELECTED_JOB_INFO'
    }),
    ...mapActions([
      'getLevelOneJobList',
      'getLevelTwoJobList',
      'addJobInfo'
    ]),
    // 一级分类岗位列表
    onSelectLevelOneItemFn () {
      this.getLevelOneJobList({ that: this }).then(() => {
        this.onSelectLevelTwoItemFn(this.levelOneJobList[0].catid)
      })
    },
    // 二级分类岗位列表
    onSelectLevelTwoItemFn (catid) {
      const data = {
        that: this,
        catid
      }
      this.getLevelTwoJobList(data).then((res) => {
        this.oJson = res
      })
    },
    // 选择一级分类对应切换效果
    onChangeFn (index, catid) {
      this.currentIndex = index
      this.onSelectLevelTwoItemFn(catid)
    },
    // 选择二级分类对应切换效果
    onSkipSelectJobFn (num, catname) {
      this.currentIndex = num
      this.onAddJobInfoFn(catname)
    },
    // 确定选择岗位
    onAddJobInfoFn (catname) {
      if (this.selectedJobInfo.status) {
        this.selectedJobInfo.status = 0
      } else {
        const data = {
          that: this,
          job: catname
        }
        this.addJobInfo(data).then((res) => {
          if (res.ret === 1) {
            this.setSelectedJobInfo({ status: 1, job: res.job })
          } else {
            this.showToastFn('不能重复选择岗位!')
          }
          this.oJob = res.data
        })
      }
    },
    // 是否选择岗位
    onSkipChangeJobFn () {
      if (this.selectedJobInfo.status) {
        this.selectedJobInfo.status = 0
      } else {
        this.onAddJobInfoFn()
      }
    },
    showToastFn (title) {
      uni.showToast({
        title,
        icon: 'none',
        duration: 1500
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  .job-wrapper
    width: 100%
    height: auto
    background-color: #f8f8f8
    .content-box
      position: fixed
      left: 0
      top: 0
      right: 0
      bottom: 0
      margin-top: 7px
      display: flex
      width: 100%
      height: auto
      .scroll-view
        width: 100%
        height: 100%
        ul
          width: 100%
          height: auto
          margin-top: 14px
          li
            margin-bottom: 18px
            padding-right: 10px
            height: 30px
            font-size: 15px
            line-height: 30px
            color: #0f0f0f
            &.active
              color: #ff4040
      .nav-box
        padding-left: 15px
        width: 100%
        height: auto
        box-sizing: border-box
        background-color: #fff
      .info-box
        padding-left: 21px
        width: 100%
        height: auto
        box-sizing: border-box
        background-color: #fafbfb
        .scroll-view
          ul
            li
              margin-bottom: 23px
      ::-webkit-scrollbar
        width: 0
        height: 0
        color: transparent
        display: none
    .change-wrapper
      position: fixed
      left: 0
      top: 0
      right: 0
      bottom: 0
      .change-box
        margin: 7px 0 45px
        padding: 20px 18px 21px 15px
        box-sizing: border-box
        background-color: #fff
        h3
          margin-bottom: 16px
          font-size: 15px
          line-height: 15px
          color: #7a7979
        .change-info
          font-size: 14px
          line-height: 14px
          color: #959494
      .btn-box
        padding: 0 15px
        .change-btn
          width: 100%
          height: 46px
          line-height: 46px
          font-size: 16px
          text-align: center
          color: #fff
          border-radius: 25px
          background-color: #ff4040
</style>
