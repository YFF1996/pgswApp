<template>
  <div class="login-wrapper">
    <login-page :show="IsShow" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import LoginPage from '../../components/loginPageTemplate'

export default {
  data () {
    return {
      IsShow: true
    }
  },
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  components: {
    LoginPage
  }
}
</script>

<style lang="stylus" scoped>
  .login-wrapper
    width: 100%
    height: auto
</style>
