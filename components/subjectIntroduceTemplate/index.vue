<template>
  <div v-if="upyunUrl" class="mini-play-wrapper">
    <div class="info editor-box">
      <div class="text">
        <parse v-if="str" :html="str" />
        <div v-else class="not-data-wrapper">
          <image :src="upyunUrl + '/wxXcxImg/images/no-data-icon.png'" />
          <div class="title">暂无介绍</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Parse from '../jyf-parser/jyf-parser'
import { upyunUrl } from '../../api/config'

export default {
  data () {
    return {
      upyunUrl
    }
  },
  methods: {
  },
  components: {
    Parse
  },
  props: {
    str: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="stylus" scoped>
  .mini-play-wrapper
    width: 100%
    height: auto
    color: #333
    .info
      position: relative
      width: 100%
      flex: 1
      .not-data-wrapper
        padding-top: 30px
        height: auto
        image
          margin: 0 auto
          display: block
          width: 200px
          height: 116px
        .title
          padding-top: 10px
          font-size: 13px
          line-height: 20px
          text-align: center
          color: #b9b9b9
</style>
