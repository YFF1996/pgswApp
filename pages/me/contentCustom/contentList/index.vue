<template>
  <div v-if="upyunUrl" class="word-wrapper">
    <scroll-view
      :scroll-y="true"
      @scrolltolower="scrolltolower"
      class="scroll-view"
    >
      <div class="title">
        <i class="ico"></i>
        <h2 class="text">累计成功定制了<span class="num">{{ oJson.success_num }}</span>个关键词</h2>
      </div>
      <ul v-if="contentWordList.length">
        <li v-for="(item, index) in contentWordList" :key="index">
          <div class="info-box">
            <div class="word">{{ item.keywords }}</div>
            <div class="time">
              <i class="time-ico">
                <img :src="upyunUrl + '/wxXcxImg/images/time-icon.png'" />
              </i>
              <span class="text">{{ item.inputtime }}</span>
            </div>
          </div>
          <div class="state-box">
            <span class="state">状态：</span>
            <span v-if="item.status === 0" class="text">审核中</span>
            <span v-if="item.status === 1" class="pass">审核通过，内容将在首页以推荐形式显示</span>
            <span v-if="item.status === 2" class="no-pass">不予处理，违禁关键词</span>
          </div>
        </li>
      </ul>
      <!-- 上拉加载更多loading -->
      <loading-more :lists="contentWordList" :listsLength="10" />
    </scroll-view>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import LoadingMore from '../../../../components/loadingMoreTemplate'
import { upyunUrl } from '../../../../api/config'

export default {
  data () {
    return {
      upyunUrl,
      oJson: '',
      page: 1
    }
  },
  onLoad () {
    this.page = 1
    this.getContentWordListFn(true)
  },
  computed: {
    ...mapState([
      'userInfo',
      'contentWordList'
    ])
  },
  methods: {
    ...mapMutations({
      setContentWordList: 'SET_CONTENT_WORD_LIST'
    }),
    ...mapActions([
      'getContentWordList'
    ]),
    // 获取内容定制关键词列表
    getContentWordListFn (isLoading) {
      let data = {
        that: this,
        page: this.page
      }
      if (isLoading) uni.showLoading({ title: 'Loading' })
      this.getContentWordList(data).then((res) => {
        this.oJson = res
        if (isLoading) uni.hideLoading()
      })
    },
    // 上拉加载更多
    scrolltolower () {
      this.page += 1
      this.getContentWordListFn(false)
    }
  },
  onUnload () {
    this.setContentWordList([])
  },
  components: {
    LoadingMore
  }
}
</script>

<style lang="stylus" scoped>
  .word-wrapper
    position: fixed
    left: 0
    top: 0
    right: 0
    bottom: 0
    width: 100%
    height: auto
    background: #f8f8f8
    &.word-wrapper::-webkit-scrollbar
      display: none
    .scroll-view
      position: fixed
      left: 0
      top: 0
      right: 0
      bottom: 0
      padding: 25px 15px
      box-sizing: border-box
      width: 100%
      height: auto
      z-index: 5
      .title
        margin-bottom: 20px
        display: flex
        align-items: center
        .ico
          width: 3px
          height: 18px
          background: #ff6464
        .text
          margin-top: -6px
          padding-left: 8px
          font-size: 14px
          color: #333
          .num
            padding: 0 5px
            font-size: 20px
            color: #ff6464
      ul
        position: relative
        width: 100%
        height: auto
        padding: 20px 15px 15px 15px
        border-radius: 8px 8px 0 0
        box-sizing: border-box
        background-color: #fff
        li
          margin-bottom: 16px
          padding-bottom: 15px
          box-sizing: border-box
          border-bottom: 1px solid #e5e5e5
          .info-box
            margin-bottom: 10px
            display: flex
            align-items: center
            justify-content: space-between
            .word
              margin-left: -15px
              padding: 5px 16px
              font-size: 14px
              text-align: center
              color: #353535
              border-radius: 0 15px 15px 0
              background-color: #f6f6f6
            .time
              display: flex
              align-items: center
              .time-ico
                width: 11px
                height: 11px
                img
                  display: block
                  width: 100%
                  height: 100%
              .text
                padding-left: 4px
                font-size: 12px
                color: #a9a9a9
          .state-box
            font-size: 14px
            color: #333
            .text
              color: #999
            .no-pass
              color: #f64949
            .pass
              color: #34CC71
        li:last-child
          margin-bottom: 0
          border-bottom: none
    ::-webkit-scrollbar
      width: 0
      height: 0
      color: transparent
</style>
