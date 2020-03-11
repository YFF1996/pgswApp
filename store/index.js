import Vue from 'vue'
import Vuex from 'vuex'

import state from './state'
import mutations from './mutations'
import actions from './actions'
// import getters from './getters'
import createLooger from 'vuex/dist/logger'

Vue.use(Vuex)

// 生产环境
const debug = process.env.NODE_ENV === 'production'

export default new Vuex.Store({
  state,
  mutations,
  actions,
  // getters,
  strict: debug,
  plugins: debug ? [createLooger()] : []
})
