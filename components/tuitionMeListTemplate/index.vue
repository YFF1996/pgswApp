<template>
  <div
    v-if="status && upyunUrl"
    @click="onShowStatusFn()"
    class="info-wrapper"
  >
    <div class="info-box" :class="{'info-active' : status}" @click.stop>
      <div class="title-box">
        <div class="title">我获得学费记录</div>
        <div class="close-btn" @click="onShowStatusFn()">
          <image :src="upyunUrl + '/wxXcxImg/images/gray-close-icon.png'" />
        </div>
      </div>
      <div v-if="lists.length" class="info-box-ul">
        <div
          v-for="(item, index) in lists"
          @click="onSkipPageFn(item)"
          :key="index"
          class="item"
        >
          <div class="avatar">
            <image mode="aspectFill" :src="item.cover" />
            <div v-if="item.type === 0" class="mark">
              <image :src="upyunUrl + '/wxXcxImg/images/rob-mark-icon01.png'" />
              <div class="text">平台福利</div>
            </div>
            <div class="mark" v-if="item.type === 1">
              <image :src="upyunUrl + '/wxXcxImg/images/rob-mark-icon02.png'" />
              <div class="text">好友福利</div>
            </div>
            <div class="mark" v-if="item.type === 2">
              <image :src="upyunUrl + '/wxXcxImg/images/rob-mark-icon03.png'" />
              <div class="text">返现福利</div>
            </div>
          </div>
          <div class="info">
            <div class="title">{{ item.title }}</div>
            <div class="buyer">
              <div class="icon">
                <image mode="aspectFill" :src="item.avatarurl" />
              </div>
              <div class="name">{{ item.nickname }}在送学费</div>
            </div>
            <div class="bottom">
              <div class="hint">{{ item.join_num }}人疯抢</div>
              <div class="btn-box" v-if="item.type === 0">抢学费获得{{ item.money }}元</div>
              <div class="btn-box" v-if="item.type === 1">受邀请分学费获得{{ item.money }}元</div>
              <div class="btn-box" v-if="item.type === 2">购买返学费获得{{ item.money }}元</div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="no-data-wrapper">
        <image :src="upyunUrl + '/wxXcxImg/images/no-data-icon.png'" />
        <div class="title">还没获得学费，去抢学费吧</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { upyunUrl } from '../../api/config'

export default {
  data () {
    return {
      upyunUrl
    }
  },
  onLoad () {
  },
  computed: {
    ...mapState([
    ])
  },
  methods: {
    ...mapMutations({
    }),
    onSkipPageFn (item) {
      let url = ''

      switch (item.type) {
        case 0:
          url = `/pages/robTuition/tuitionBill/index?oJson=${encodeURIComponent(JSON.stringify(item))}`
          break
        case 1:
          url = `/pages/robTuition/tuitionShare/index?oJson=${encodeURIComponent(JSON.stringify(item))}`
          break
        case 2:
          url = `/pages/robTuition/tuitionShare/index?oJson=${encodeURIComponent(JSON.stringify(item))}`
          break
        default:
          return false
      }
      uni.navigateTo({
        url
      })
    },
    onShowStatusFn () {
      this.$emit('meListStatusChild', false)
    }
  },
  components: {
  },
  props: {
    lists: {
      type: Array,
      default: []
    },
    status: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="stylus" scoped>
  .info-wrapper
    position: fixed
    left: 0
    top: 0
    right: 0
    bottom: 0
    width: 100%
    height: 100%
    z-index: 996
    overflow: hidden
    background-color: rgba(0, 0, 0, 0.6)
    .info-box
      position: absolute
      left: 0
      right: 0
      bottom: 0
      width: 100%
      height: auto
      overflow: hidden
      background-color: #fff
      z-index: 999
      &.info-active
        animation: listTranslateY 0.3s alternate forwards
      .title-box
        position: relative
        padding: 15px 0
        width: 100%
        height: auto
        border-bottom: 1px solid #e5e5e5
        .title
          width: 100%
          height: auto
          font-size: 17px
          text-align: center
          color: #333
        .close-btn
          position: absolute
          top: 12px
          right: 9px
          padding: 8px
          image
            display: block
            width: 12px
            height: 12px
      .info-box-ul
        padding: 20px 15px
        width: 100%
        height: 321px
        overflow: hidden
        overflow-y: auto
        box-sizing: border-box
        .item
          margin-bottom: 15px
          padding-bottom: 15px
          display: flex
          border-bottom: 1px solid #f5f5f5
          .avatar
            position: relative
            width: 110px
            height: 110px
            border-radius: 3px
            image
              width: 100%
              height: 100%
              border-radius: 3px
            .mark
              position: absolute
              top: 0
              left: 0
              width: 100%
              height: 23px
              line-height: 23px
              image
                width: 100%
                height: 100%
              .text
                position: absolute
                top: 0
                left: 5px
                font-size: 10px
                color: #fff
          .info
            position: relative
            margin-left: 15px
            flex: 1
            height: 110px
            .title
              width: 100%
              min-height: 20px
              font-size: 14px
              line-height: 20px
              display: -webkit-box
              -webkit-box-orient: vertical
              -webkit-line-clamp: 2
              overflow: hidden
              color: #333
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
            .bottom
              position: absolute
              bottom: 0
              width: 100%
              height: auto
              display: flex
              align-items: center
              justify-content: space-between
              .hint
                flex: 1
                font-size: 12px
                color: #999
              .btn-box
                font-size: 12px
                text-align: center
                font-weight: bold
                color: #ff7633
          &:last-child
            border: none
        .item:last-child
          padding-bottom: 0
          margin-bottom: 0
      .no-data-wrapper
        padding: 40px 0
        width: 100%
        height: auto
        box-sizing: border-box
        image
          margin: 0 auto
          display: block
          width: 80px
          height: 80px
        .title
          padding-top: 5px
          font-size: 13px
          line-height: 20px
          text-align: center
          color: #b9b9b9
  @-webkit-keyframes listTranslateY
    0%
      transform: translateY(80px)
    100%
      transform: translateY(0)
</style>
