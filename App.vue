<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
    }
  },
  created () {
    const openid = uni.getStorageSync('openid')
    if (openid) {
      this.getUserInfo({ openid })
    }
  },
  methods: {
    ...mapActions([
      'getUserInfo'
    ])
  }
}
</script>

<style>
	@import '/api/css.css';
</style>
