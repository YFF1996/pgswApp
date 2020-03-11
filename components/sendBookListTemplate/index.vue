<template>
  <ul class="send-book-list">
    <li
      v-if="lists.length"
      v-for="(item, index) in lists"
      :key="index"
      @click="onSkipBookInfoFn(item.id)"
    >
      <div class="avatar">
        <img mode="aspectFill" :src="item.cover" />
      </div>
      <div class="book-info">
        <h2 class="title">{{ item.title }}</h2>
        <div class="hint">{{ item.intro }}</div>
        <div class="book-bottom">
          <div class="bottom-hint">累计送出<span class="send-num">{{  item.give_lj_num }}</span>本，<span class="want-num">{{ item.give_set_want }}</span>人参与</div>
          <div class="want-btn get-btn" v-if="item.is_get">已抢到</div>
          <div class="want-btn end-btn" v-if="!item.is_get && item.is_grab">已参与</div>
          <div class="want-btn" v-if="!item.is_get && !item.is_grab">去抢书</div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {}
  },
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  methods: {
    onSkipBookInfoFn (id) {
      if (this.userInfo) {
        uni.navigateTo({ url: `/pages/mission/sendBookInfo/index?id=${id}` })
      } else {
        uni.navigateTo({ url: `/pages/login/index` })
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
  .send-book-list
    li
      padding: 18px 0
      border-bottom: 1px solid #ddd
      display: flex
      align-items: center
      .avatar
        width: 90px
        height: 90px
        img
          width: 100%
          height: 100%
      .book-info
        position: relative
        padding-left: 13px
        flex: 1
        height: 90px
        .title
          height: 16px
          font-size: 16px
          line-height: 16px
          color: #333
          display: -webkit-box
          -webkit-box-orient: vertical
          -webkit-line-clamp: 1
          overflow: hidden
        .hint
          margin: 6px 0 12px
          height: 36px
          font-size: 14px
          line-height: 18px
          color: #333
          display: -webkit-box
          -webkit-box-orient: vertical
          -webkit-line-clamp: 2
          overflow: hidden
        .book-bottom
          display: flex
          align-items: center
          justify-content: space-between
          height: 21px
          .bottom-hint
            padding-right: 7px
            flex: 1
            font-size: 12px
            line-height: 16px
            color: #333
            span
              color: #e1564f
              &.send-num
                font-size: 15px
              &.want-num
                font-size: 12px
          .want-btn
            width: 57px
            height: 21px
            font-size: 12px
            line-height: 21px
            text-align: center
            border-radius: 18px
            color: #fff
            background-color: #e1564f
          .get-btn
            background: linear-gradient(180deg, #ffd37f 15%, #fab241 85%)
          .end-btn
            background: linear-gradient(180deg, #908f8f, #666)
      &:last-child
        border: none
</style>
