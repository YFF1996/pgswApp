<template>
  <div v-if="upyunUrl && lists.length" class="tuition-list-wrapper">
    <div class="tuition-list-ul">
      <div
        v-for="(item, index) in lists"
        @click="onSkipPageFn(`/pages/subject/subjectMusic/index?sid=${item.specil_id}`)"
        :key="index"
        class="item"
      >
        <div class="avatar">
          <image mode="aspectFill" :src="item.cover" />
        </div>
        <div class="right">
          <div class="info">
            <div class="title">{{ item.title }}</div>
            <div class="buyer">
              <div class="icon">
                <image mode="aspectFill" :src="item.avatarurl" />
              </div>
              <div class="name">{{ item.nickname }}在送学费</div>
            </div>
            <div v-if="item.money_range" class="get-fee">抢到最高可获得<div class="text">{{ item.money_range[1] }}</div>元</div>
            <div class="bottom">
              <div class="hint">{{ item.join_num }}人疯抢</div>
              <div
                v-if="item.grab_finish"
                class="btn-box end-btn"
              >已抢完</div>
              <div
                v-else
                class="btn-box"
                @click.stop="onSkipBtnPageFn(item)"
              >马上抢</div>
            </div>
          </div>
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
      upyunUrl
    }
  },
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  methods: {
    // 跳转页面
    onSkipPageFn (url) {
      uni.navigateTo({
        url
      })
    },
    onSkipBtnPageFn (item) {
      if (this.userInfo) {
        uni.navigateTo({
          url: `/pages/robTuition/tuitionBill/index?oJson=${encodeURIComponent(JSON.stringify(item))}`
        })
      } else {
        uni.navigateTo({
          url: `/pages/login/index`
        })
      }
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
  .tuition-list-wrapper
    width: 100%
    height: auto
    .tuition-list-ul
      padding: 20px 15px 0
      width: 100%
      height: auto
      box-sizing: border-box
      .item
        margin-bottom: 15px
        display: flex
        .avatar
          width: 110px
          height: 110px
          border-radius: 3px
          image
            width: 100%
            height: 100%
            border-radius: 3px
        .right
          margin-left: 15px
          padding-bottom: 15px
          flex: 1
          border-bottom: 1px solid #f5f5f5
          .info
            width: 100%
            height: auto
            .title
              margin-top: -3px
              font-size: 14px
              line-height: 20px
              font-weight: bold
              color: #333
              display: -webkit-box
              -webkit-box-orient: vertical
              -webkit-line-clamp: 2
              overflow: hidden
            .buyer
              margin-top: 10px
              display: flex
              align-items: center
              .icon
                padding: 1px
                width: 26px
                height: 26px
                box-sizing: border-box
                overflow: hidden
                background-color: #ff4040
                border-radius: 50%
                image
                  display: block
                  width: 100%
                  height: 100%
                  border-radius: 50%
              .name
                flex: 1
                padding-left: 5px
                font-size: 12px
                color: #999
            .get-fee
              margin-top: 8px
              font-size: 12px
              display: flex
              color: #666
              .text
                padding: 0 2px
                font-size: 13px
                color: #ff4040
                box-sizing: border-box
            .bottom
              width: 100%
              height: auto
              display: flex
              align-items: center
              justify-content: space-between
              .hint
                flex: 1
                margin-top: 11px
                font-size: 12px
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
                &.end-btn
                  background-color: #cacaca
                  box-shadow: 0 1px 4px 0 rgba(102,102,102,0.3)
        &:last-child .right
          border: none
      .item:last-child
        margin-bottom: 0
</style>
