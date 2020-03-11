<template>
  <div class="popup-wrapper" v-if="statusObj.status">
    <div class="popup-box">
      <div class="top">
        <img class="top-bg" :src="upyunUrl + '/wxXcxImg/images/hint-popup-bg.png'" />
        <div class="close-btn" @click="onShowStatusFn()">
          <img :src="upyunUrl + '/wxXcxImg/images/pic-close.png'" >
        </div>
        <div class="title">
          <h1 v-if="statusObj.is_get === 1">运气爆棚的你抢中了此书</h1>
          <h1 v-if="statusObj.is_get === 0">很遗憾，你没有抢中此书</h1>
          <h2>小瓶盖为你精心推荐</h2>
          <h2>多听知识获书更高哟</h2>
        </div>
      </div>
      <div class="content">
         <ul>
           <li v-if="list.length" v-for="(item, index) in list" :key="index">
             <div class="cover">
               <img :src="item.cover" mode="aspectFill" />
             </div>
             <div class="info">
               <h2 class="title">{{ item.title }}</h2>
               <div class="bottom">
                 <i>
                   <img :src="upyunUrl + '/wxXcxImg/images/learn-ico.png'" />
                 </i>
                 <div class="hint">已经有{{ item.num }}人学习</div>
               </div>
             </div>
             <div class="btn" @click="onSkipPageFn(item.type, item.id)">马上听</div>
           </li>
         </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { upyunUrl } from '../../api/config'

export default {
  data () {
    return {
      upyunUrl
    }
  },
  methods: {
    ...mapMutations({
      setNavigationIndex: 'SET_NAVIGATION_INDEX'
    }),
    onSkipPageFn (type, id) {
      if (type) {
        uni.navigateTo({
          url: `/pages/subject/subjectMusic/index?sid=${id}`
        })
      } else {
        this.setNavigationIndex(0)
        uni.switchTab({ url: '/pages/index/index' })
      }
    },
    // 关闭弹窗
    onShowStatusFn () {
      this.$emit('showStatusChild', false)
    }
  },
  props: {
    list: {
      type: Array,
      default: []
    },
    statusObj: {
      type: String,
      default: []
    }
  }
}
</script>

<style lang="stylus" scoped>
  .popup-wrapper
    position: fixed
    left: 0
    top: 0
    width: 100%
    height: 100%
    display: -webkit-box
    display: flex
    align-items: center
    z-index: 100
    background-color: rgba(0,0,0,0.5)
    .popup-box
      margin: 0 auto
      width: 300px
      height: auto
      overflow: hidden
      display: flex
      align-items: center
      flex-direction: column
      border-radius: 8px
      background-color: #fff
      .top
        position: relative
        width: 300px
        .top-bg
          display: block
          width: 100%
          height: 150px
          z-index: 80
        .close-btn
          position: absolute
          top: 0
          right: 0
          padding: 8px
          img
            display: block
            width: 12px
            height: 12px
        .title
          position: absolute
          top: 16px
          left: 21px
          color: #fff
          font-size: 13px
          h1
            margin-bottom: 5px
            font-size: 15px
          h2
            margin-bottom: 5px
      .content
        padding-bottom: 20px
        background-color: #fff
        z-index:100
        ul
          padding: 0 18px
          height: 290px
          overflow: hidden
          overflow-y: scroll
          box-sizing: border-box
          li
            padding-bottom: 13px
            margin-bottom: 13px
            display: flex
            align-items: center
            border-bottom: 1px solid #ddd
            .cover
              width: 38px
              height: 38px
              background-color: #ddd
              img
                width: 100%
                height: 100%
            .info
              flex: 1
              padding: 0 10px 0 12px
              .title
                font-size: 14px
                color: #1b1b1b
                display: -webkit-box
                -webkit-box-orient: vertical
                -webkit-line-clamp: 1
                overflow: hidden
              .bottom
                display: flex
                align-items: center
                margin-top: 5px
                i
                  width: 13px
                  height: 12px
                  img
                    display: block
                    width: 100%
                    height: 100%
                .hint
                  margin-left: 6px
                  font-size: 13px
                  color: #999
            .btn
              width: 48px
              height: 21px
              line-height: 21px
              font-size: 11px
              text-align: center
              color: #fff
              border-radius: 25px
              background-color: #ff5149
            &:last-child
              border: none
</style>
