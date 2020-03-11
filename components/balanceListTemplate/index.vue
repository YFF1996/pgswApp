<template>
  <div class="book-content">
    <ul>
      <li
        v-if="list.length"
        v-for="(item, index) in list"
        :key="index"
      >
        <div class="info">
          <h4>{{ item.remark }}</h4>
          <div class="time">{{ item.ctime }}</div>
        </div>
        <div class="num"><i v-if="order === 2">+</i>{{ item.fee }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: []
    },
    order: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="stylus" scoped>
  .book-content
    width: 100%
    height: auto
    ul
      width: 100%
      height: auto
      li
        width: 100%
        height: auto
        padding: 13px 0
        display: flex
        align-items: center
        justify-content: space-between
        border-bottom: 1px solid #eee
        .info
          flex: 1
          h4
            height: 17px
            font-size: 13px
            line-height: 17px
            display: -webkit-box
            -webkit-box-orient: vertical
            -webkit-line-clamp: 1
            overflow: hidden
            color: #333
          .time
            margin-top: 6px
            font-size:12px
            color: #5a5a5a
        .num
          display: flex
          font-size:16px
          color: #333
        &:last-child
          border-bottom: none
</style>

