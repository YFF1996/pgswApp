<template>
  <div  class="chat-wrapper" v-if="upyunUrl">
    <div class="title">
      <i class="ico"></i>
      <span class="text">处理进度</span>
    </div>
    <ul class="chat-list">
      <li
        class="reply"
        v-if="lists.length"
        v-for="(item, index) in lists"
        :key="index"
      >
        <div :class="item.is_user ? 'avatar avatar-active' : 'avatar'">
          <img v-if="item.is_user" :src="userInfo.avatarurl" />
          <img v-else :src="upyunUrl + '/wxXcxImg/images/kefu-icon.png'" />
        </div>
        <div :class="item.is_user ? 'content content-active' : 'content'">
          <div class="text">
            {{ item.content }}
          </div>
        </div>
      </li>
    </ul>
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
  props: ['lists']
}
</script>

<style lang="stylus" scoped>
  .chat-wrapper
    width: 100%
    height: auto
    font-size: 14px
    color: #000
    .title
      margin: 15px 0 25px
      display: flex
      align-items: center
      .ico
        width: 4px
        height: 15px
        background: #ff6464
      .text
        padding-left: 10px
    .chat-list
      li
        margin-bottom: 15px
        font-size: 14px
        overflow: hidden
        box-sizing: border-box
        .avatar
          width: 35px
          height: 35px
          border-radius: 50%
          float: left
          img
            width: 100%
            height: 100%
            border-radius: 50%
        .avatar-active
          float: right
        .content
          padding-left: 45px
          text-align: left
          .text
            display: inline-block
            padding: 10px
            box-sizing: border-box
            color: #000
            background: #fff
            border-radius: 12px
        .content-active
          padding-right: 45px
          text-align: right
          .text
            text-align: left
            color: #fff
            background: #ff6464
</style>
