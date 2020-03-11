import store from '../store'
import * as types from './mutation-types'
import {
  deviceType,
  staleCode,
  newApiUrl,
  upyunUrl,
  versions,
  apiUrl,
  appId,
  code,
  ret
} from '../api/config'

let currentTime = 0
let stopTime = null
let firstEnter = true

const myAudio = uni.getBackgroundAudioManager()
const WXBizDataCrypt = require('../utils/WXBizDataCrypt')

export default {
  // 获取授权微信信息
  setUserInfo ({ dispatch, commit }, data) {
    let msg = ''
    if (deviceType === 'mini') { // 小程序
      msg = data.mp.detail.errMsg.split(':')
    } else {
      msg = data.errMsg.split(':')
    }
    if (msg[1] === 'ok') {
      let userInfo = deviceType === 'mini' ? data.mp.detail : data.authResult
      uni.showLoading({ title: 'Loading' })
      if (deviceType === 'mini') {
        uni.login({
          success: res => {
            userInfo['code'] = res.code
            dispatch('logIn', userInfo)
          }
        })
      } else {
        dispatch('logIn', userInfo)
      }
    }
  },
  logIn ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: deviceType === 'mini' ? newApiUrl + '/wx/user_auth/wechatLogin' : newApiUrl + '/wx/user_auth/appLoginByWechat',
        header: {
          fromClient: deviceType
        },
        data: {
          encryptedData: data.encryptedData || '',
          access_token: data.access_token || '',
          unionid: data.unionid || '',
          openid: data.openid || '',
          code: data.code || '',
          iv: data.iv || ''
        },
        success: (res) => {
          if (res.data.code === code) {
            const openid = res.data.data.openid
            uni.setStorageSync('openid', openid)
            dispatch('getUserInfo', { openid, isRegister: true }).then((res) => {
              resolve(res)
            })
          } else {
            showToastFn('授权登录失败!')
          }
        }
      })
    })
  },
  // 获取用户信息
  getUserInfo ({ dispatch, commit, state }, data) {
    const openid = data ? data.openid : state.userInfo.openid
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/user/getinfo',
        header: {
          fromClient: deviceType
        },
        data: { openid },
        success: (res) => {
          if (res.data.code === code) {
            let oJson = res.data.data
            oJson['openid'] = openid
            oJson['sub_total'] = oJson.sub_total >= 10000 ? Math.round((oJson.res.sub_total / 10000) * 100) / 100 + '万' : oJson.sub_total
            oJson['play_total'] = oJson.play_total >= 10000 ? Math.round((oJson.play_total / 10000) * 100) / 100 + '万' : oJson.play_total
            oJson['like_total'] = oJson.like_total >= 10000 ? Math.round((oJson.like_total / 10000) * 100) / 100 + '万' : oJson.like_total
            oJson['attention_total'] = oJson.attention_total >= 10000 ? Math.round((oJson.attention_total / 10000) * 100) / 100 + '万' : oJson.attention_total
            oJson['collection_total'] = oJson.collection_total >= 10000 ? Math.round((oJson.collection_total / 10000) * 100) / 100 + '万' : oJson.collection_total
            if (data && data.isRegister) {
              // dispatch('setUnionidRecord', data)
              showToastFn('授权登录成功')
              setTimeout(() => {
                uni.navigateBack()
              }, 2000)
              if (state.shareid) dispatch('motivateOther')
              if (state.shareid || state.channel) dispatch('setActivityInviteRecord')
            }
            commit(types.SET_USERINFO, oJson)
            resolve(oJson)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 保存unionid
  setUnionidRecord ({ dispatch, commit, state }, data) {
    uni.login({
      success: res => {
        const oJson = { code: res.code }
        data.that.getWxlogin(oJson).then((res) => {
          const pc = new WXBizDataCrypt(appId, res.session_key)
          uni.getUserInfo({
            success (res) {
              const decryptData = pc.decryptData(res.encryptedData, res.iv)
              uni.request({
                method: 'GET',
                url: apiUrl + '/activity/unionid_record.php',
                header: {
                  fromClient: deviceType
                },
                data: {
                  openid: state.userInfo.openid || '',
                  unionid: decryptData.unionId
                },
                success: (res) => {
                  commit(types.SET_UNIONID, res.data.unionid)
                }
              })
            }
          })
        })
      }
    })
  },
  // 邀请 - 渠道记录
  setActivityInviteRecord ({ dispatch, commit, state }) {
    uni.request({
      method: 'POST',
      url: newApiUrl + '/wx/user/inviteRecord',
      header: {
        fromClient: deviceType
      },
      data: {
        openid: state.userInfo.openid || '',
        shareid: state.shareid,
        channel: state.channel
      }
    })
  },
  // 统计用户浏览记录
  setActivityViewRecord ({ dispatch, commit, state }) {
    let uuid = uni.getStorageSync('uuid')
    if (!uuid) {
      uuid = guid(8, 16) // "098F4D35"
      uni.setStorageSync('uuid', guid(8, 16))
    }
    uni.request({
      method: 'POST',
      url: newApiUrl + '/wx/user/viewRecord',
      header: {
        fromClient: deviceType
      },
      data: {
        shareid: state.shareid,
        channel: state.channel,
        uuid
      }
    })
  },
  // 后台控制部分设置状态是否显示
  getIsReview ({ dispatch, commit, state }) {
    uni.request({
      method: 'POST',
      url: newApiUrl + '/wx/simple/getIsReview',
      header: {
        fromClient: deviceType
      },
      data: { version: versions },
      success: (res) => {
        commit(types.SET_IS_REVIEW, res.data.data.is_review)
      }
    })
  },
  // 活动弹窗
  getActivityUpWindows ({ dispatch, commit, state }) {
    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/activity/get_author_popup.php',
        header: {
          fromClient: deviceType
        },
        data: {
          shareid: state.shareid || ''
        },
        success: (res) => {
          if (res.data.ret === ret) {
            resolve(res.data.data)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 激发它人
  motivateOther ({ dispatch, commit, state }) {
    uni.request({
      method: 'GET',
      url: apiUrl + '/api/wx_jf.php',
      header: {
        fromClient: deviceType
      },
      data: {
        s_user_id: state.userInfo.user_id,
        other_user_id: state.shareid
      }
    })
  },
  // 获取首页分类标签
  getTypeLabel ({ dispatch, commit, state }) {
    uni.request({
      method: 'POST',
      url: newApiUrl + '/wx/home/getHomeTab',
      header: {
        fromClient: deviceType
      },
      success: (res) => {
        if (res.data.code === code) {
          commit(types.SET_INDEX_TYPE_LABEL_LIST, res.data.data)
        } else {
          if (res.data.code === staleCode) signOut()
          showToastFn(res.data.message)
        }
      }
    })
  },
  // 获取分类轮播
  getClassifyBanner ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/special/wx_banner_catid.php',
        header: {
          fromClient: deviceType
        },
        data: {
          catid: data.catid,
          type: 2
        },
        success: (res) => {
          if (res.data.ret === ret) {
            resolve(res.data.data)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取二级分类标签
  getSecondTypeLabel ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/special/wx_catlist_by_top_catid.php',
        header: {
          fromClient: deviceType
        },
        data: {
          catid: data.catid
        },
        success: (res) => {
          if (res.data.ret === ret) {
            let lists = []

            if (res.data.data.lists.length) lists = [{ catid: 0, catname: '全部', parentid: res.data.data.lists[0].parentid }]

            lists = lists.concat(res.data.data.lists)
            resolve(lists)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取热门栏目
  getHotColumnList ({ dispatch, commit, state }, data) {
    const allItem = state.allCurrentMusicItem

    commit(types.SET_LOADING_STATE, true)
    commit(types.SET_IS_DATA_STATE, false)

    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/simple/getHotVoiceList',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          catid: data.catid || 0,
          page: data.page
        },
        success: (res) => {
          if (data.more) {
            let lists = JSON.parse(JSON.stringify(state.hotColumnList))

            res.data.data.forEach((item) => {
              allItem.id === item.vid && state.allPlaying ? item['playing'] = true : item['playing'] = false
              item['listType'] = 'hotColumnType'
              item['catid'] = data.catid
              item['page'] = data.page
              lists.push(item)
            })

            commit(types.SET_LOADING_STATE, false)
            commit(types.SET_HOT_COLUMN_LIST, lists)
            commit(types.SET_IS_DATA_STATE, !res.data.data.length)
            if (allItem.listType === 'hotColumnType' && allItem.catid === data.catid) commit(types.SET_ALL_MUSIC_LIST, lists)
          }
          resolve(res.data)
        }
      })
    })
  },
  // 获取二级分类content
  getClassifycontent ({ dispatch, commit, state }, data) {
    commit(types.SET_IS_DATA_STATE, false)
    commit(types.SET_LOADING_STATE, true)

    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/special/wx_special_catid.php',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          catid: data.catid,
          page: data.page
        },
        success: (res) => {
          if (res.data.ret === ret) {
            commit(types.SET_IS_DATA_STATE, !res.data.data.lists.length)
            commit(types.SET_LOADING_STATE, false)
            resolve(res.data)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取音乐列表
  getMusicList ({ dispatch, commit, state }, data) {
    uni.showLoading({ title: 'Loading' })
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/home/index',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          page: data.page
        },
        success: (res) => {
          firstEnter = true

          if (res.data.code === code) {
            let lists = res.data.data

            lists.forEach((item) => {
              state.allCurrentMusicItem.id === item.vid && state.allPlaying ? item['playing'] = true : item['playing'] = false
              item['inputtime'] = getLocalTime(item.inputtime * 1000)
              if (item.window) item.window['state'] = true
              item['listType'] = 'indexMusic'
              item['page'] = data.page
            })

            commit(types.SET_MUSIC_LIST, lists)
            commit(types.SET_ALL_MUSIC_LIST, lists)
            commit(types.CURRENT_MUSIC_ITEM, lists[0])
            commit(types.ALL_CURRENT_MUSIC_ITEM, lists[0])

            if (!data.first) {
              commit(types.SET_CURRENT_INDEX, 0)
              commit(types.SET_INDEX_LOADING_MUSIC_STATUS, false)
              dispatch('setMusicStatus', { that: data.that, item: lists[0], list: lists })
            }
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }

          uni.hideLoading()
          resolve(res)
        }
      })
    })
  },
  // 获取音频详情
  getMusicDetails ({ dispatch, commit, state }, data) {
    uni.showLoading({ title: 'Loading' })
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/special/getVoiceInfo',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          id: data.id
        },
        success: (res) => {
          if (res.data.code === code) {
            if (state.setTitleState) {
              uni.setNavigationBarTitle({
                title: res.data.data.title
              })
            }

            res.data.data['id'] = data.id
            res.data.data['page'] = data.page
            res.data.data['keywords'] = data.keywords
            res.data.data['listType'] = data.listType
            res.data.data['authorId'] = data.authorId

            if (res.data.data.url) {
              commit(types.SET_IS_SWITCH_MUSIC_STATE, false)
              dispatch('setMusicStatus', { that: data.that, item: res.data.data, list: state.allMusicList })
            } else {
              myAudio.stop()
              firstEnter = true
              commit(types.SET_TOTAL_TIME, 0)
              commit(types.SET_CURRENT_TIME, 0)
              dispatch('pauseStop', { item: data })

              uni.showModal({
                title: '温馨提示',
                content: '购买后才能播放!',
                confirmColor: '#e1564f'
              })
            }

            commit('MUSIC_DETAILS', res.data.data)
            uni.hideLoading()
            resolve(res.data)
          } else {
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 全局搜索
  getAllSearch ({ dispatch, commit, state }, data) {
    const allItem = state.allCurrentMusicItem

    commit(types.SET_LOADING_STATE, true)
    commit(types.SET_IS_DATA_STATE, false)

    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/voice/search',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          keywords: data.keywords,
          page: data.page
        },
        success: (res) => {
          let lists = JSON.parse(JSON.stringify(state.allSearchLists))

          res.data.data.data.forEach((item) => {
            allItem.id === item.id && state.allPlaying ? item['playing'] = true : item['playing'] = false
            item['inputtime'] = getLocalTime(item.inputtime * 1000)
            item['listType'] = 'allSearchType'
            item['keywords'] = data.keywords
            item['page'] = data.page
            lists.push(item)
          })

          commit(types.SET_LOADING_STATE, false)
          commit(types.SET_ALL_SEARCH_LISTS, lists)
          commit(types.SET_IS_DATA_STATE, !res.data.data.data.length)
          if (allItem.listType === 'allSearchType' && allItem.keywords === data.keywords) commit(types.SET_ALL_MUSIC_LIST, lists)

          uni.hideLoading()
          resolve()
        }
      })
    })
  },
  // 搜索专题
  getSubjectSearch ({ dispatch, commit, state }, data) {
    commit(types.SET_IS_DATA_STATE, false)
    commit(types.SET_LOADING_STATE, true)

    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/special/search',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          keywords: data.keywords,
          page: data.page
        },
        success: (res) => {
          let lists = JSON.parse(JSON.stringify(state.subjectSearchLists))

          res.data.data.data.forEach((item) => {
            item['keyWord'] = data.keyWord
            item['page'] = data.page
            lists.push(item)
          })

          commit(types.SET_SUBJECT_SEARCH_LISTS, lists)
          commit(types.SET_IS_DATA_STATE, !res.data.data.data.length)
          commit(types.SET_LOADING_STATE, false)

          resolve()
        }
      })
    })
  },
  // 监听首页播放音频状态
  setMusicStatus ({ dispatch, commit, state }, data) {
    let allMusicList = []

    if (data.item.listType === 'indexMusic') allMusicList = state.musicList
    if (data.item.listType === 'allSearchType') allMusicList = state.allSearchLists
    if (data.item.listType === 'collectType') allMusicList = state.collectMusicList
    if (data.item.listType === 'giveThumbsType') allMusicList = state.giveThumbsMusicList
    if (data.item.listType === 'historyType') allMusicList = state.playHistoryList
    if (data.item.listType === 'newsMusic') allMusicList = state.newsList
    if (data.item.listType === 'subjectType') allMusicList = state.subjectDetailList
    if (data.item.listType === 'hotColumnType') allMusicList = state.hotColumnList
    if (data.item.listType === 'shareMusic') allMusicList = state.shareInfo
    if (data.item.listType === 'lectureType') allMusicList = state.lectureMusicList

    data.item = JSON.parse(JSON.stringify(data.item).replace(/vid/g, 'id'))
    data.list.forEach((item) => { if (item.vid) item['id'] = item.vid })

    if (firstEnter || state.allCurrentMusicItem.id !== data.item.id) {
      if (currentTime) dispatch('setActivityActRecord', data)

      myAudio.title = data.item.title || '瓶盖思维'
      myAudio.opname = data.item.title || '瓶盖思维'
      myAudio.singer = '瓶盖思维'
      myAudio.coverImgUrl = data.item.thumb || data.item.cover
      myAudio.src = data.item.url
      firstEnter = false
    }
    // 播放
    myAudio.onPlay(() => {
      // indexMusic
      if (data.item.listType === 'indexMusic') commit(types.SET_PLAYING_STATE, true)
      commit(types.SET_ALL_PLAYING_STATE, true)
      dispatch('setMusicListPlayStatusFn', { item: data.item })
    })
    // 暂停
    myAudio.onPause(() => {
      dispatch('pauseStop', data)
    })
    // 关闭播放
    myAudio.onStop(() => {
      firstEnter = true
      dispatch('pauseStop', data)
    })
    // 播放错误
    myAudio.onError(() => {
      myAudio.pause()
      dispatch('recordMusicPlayError', data)
      commit(types.SET_ALL_PLAYING_STATE, false)
      if (data.item.listType === 'indexMusic') commit(types.SET_PLAYING_STATE, false)
      uni.showModal({ content: '播放错误!' })
    })
    // 后台运行切换下一曲
    myAudio.onNext(() => { dispatch('setSwitchMusic', { that: data.that, status: 'next' }) })
    // 后台运行切换上一曲
    myAudio.onPrev(() => { dispatch('setSwitchMusic', { that: data.that, status: 'prev' }) })
    // 如果当前播放id和再次传入的id相同时
    if (!state.isSwitchMusic && state.allCurrentMusicItem.id === data.item.id) {
      if (state.allPlaying) {
        myAudio.pause()
        // indexMusic
        if (data.item.listType === 'indexMusic') commit(types.SET_PLAYING_STATE, false)
        commit(types.SET_ALL_PLAYING_STATE, false)
      } else {
        dispatch('musicPlayFn', data)
      }
    } else {
      dispatch('musicPlayFn', data)
    }
    // indexMusic
    if (data.item.listType === 'indexMusic') commit(types.CURRENT_MUSIC_ITEM, data.item)

    commit(types.ALL_CURRENT_MUSIC_ITEM, data.item)
  },
  // 播放音频错误-记录
  recordMusicPlayError ({ dispatch, commit, state }, data) {
    let uuid = uni.getStorageSync('uuid')

    if (!uuid) {
      uuid = guid(8, 16) // "098F4D35"
      uni.setStorageSync('uuid', guid(8, 16))
    }

    uni.request({
      method: 'POST',
      url: newApiUrl + '/wx/simple/errorRecord',
      header: {
        fromClient: deviceType
      },
      data: {
        openid: state.userInfo.openid || '',
        remark: JSON.stringify(data.item),
        c_id: data.item.id,
        type: 0,
        uuid
      }
    })
  },
  // 暂停-关闭播放
  pauseStop ({ dispatch, commit, state }, data) {
    // indexMusic
    if (data.item.listType === 'indexMusic') commit(types.SET_PLAYING_STATE, false)
    commit(types.SET_ALL_PLAYING_STATE, false)
    dispatch('setMusicListPlayStatusFn', { item: data.item })
  },
  // 播放音乐和监听音频进度及结束
  musicPlayFn ({ dispatch, commit, state }, data) {
    myAudio.play()

    state.allMusicList.forEach((item, i) => {
      if (item.id === data.item.id || item.vid === data.item.id) {
        if (i === state.allMusicList.length - 1) {
          // 获取搜索音频列表
          if (data.item.listType === 'allSearchType') {
            let oJson = {
              keywords: data.item.keywords,
              page: data.item.page + 1,
              that: data.that
            }
            dispatch('getAllSearch', oJson)
          }
          // 获取收藏音频列表
          if (data.item.listType === 'collectType') {
            let oJson = {
              keywords: data.item.keywords,
              page: data.item.page + 1,
              that: data.that,
              type: 0
            }
            dispatch('getCollectList', oJson)
          }
          // 获取点赞音频列表
          if (data.item.listType === 'giveThumbsType') {
            let oJson = {
              page: data.item.page + 1,
              that: data.that
            }
            dispatch('getGiveThumbsMusicList', oJson)
          }
          // 获取播放历史音频列表
          if (data.item.listType === 'historyType') {
            let oJson = {
              page: data.item.page + 1,
              that: data.that
            }
            dispatch('getPlayAnnalList', oJson)
          }
          // 获取新闻音频列表
          if (data.item.listType === 'newsMusic') {
            let oJson = {
              page: data.item.page + 1,
              that: data.that
            }
            dispatch('getNewsList', oJson)
          }
          // 获取专题音频列表
          if (data.item.listType === 'subjectType') {
            let oJson = {
              page: data.item.page + 1,
              id: data.item.special_id,
              that: data.that
            }
            dispatch('getSubjectList', oJson)
          }
          // 获取热门列表音频列表
          if (data.item.listType === 'hotColumnType') {
            let oJson = {
              page: data.item.page + 1,
              catid: data.item.catid,
              that: data.that,
              more: true
            }
            dispatch('getHotColumnList', oJson)
          }
          // 获取讲师音频列表
          if (data.item.listType === 'lectureType') {
            let oJson = {
              page: data.item.page + 1,
              authorId: data.item.authorId,
              that: data.that
            }
            dispatch('getLectureMusicList', oJson)
          }
        }
      }
    })
    // indexMusic
    if (data.item.listType === 'indexMusic') {
      commit(types.SET_PLAYING_STATE, true)
    } else {
      commit(types.SET_PLAYING_STATE, false)
    }

    commit(types.SET_MIMI_SHOW_CLOSE_STATUS, true)
    commit(types.SET_ALL_PLAYING_STATE, true)

    // dispatch('recordingPlayMusic', { item: state.allCurrentMusicItem, that: data.that })

    // 当前进度时间和总时间
    myAudio.onTimeUpdate(() => {
      currentTime = myAudio.currentTime
      dispatch('setCurrentTimeDuration', { currentTime: myAudio.currentTime, duration: myAudio.duration })
    })
    // 音频播放结束时
    myAudio.onEnded(() => {
      data['isFinish'] = 1
      // 记录播放音频
      dispatch('recordingPlayMusic', { item: state.allCurrentMusicItem, that: data.that })
      // 自动切换下一首
      dispatch('setSwitchMusic', { that: data.that, status: 'next' })
      // 记录播放完成的音频
      dispatch('setActivityActRecord', data)
    })
  },
  // 设置音频进度状态和结束状态
  setCurrentTimeDuration ({ dispatch, commit, state }) {
    commit(types.SET_CURRENT_TIME, myAudio.currentTime)
    commit(types.SET_TOTAL_TIME, myAudio.duration)
  },
  // 音频进度条拖拽
  setSliderChange ({ dispatch, commit, state }, data) {
    let num = data.status ? getPercent(data.num, data.total) : data.num
    myAudio.seek(state.totalTime * (num / 100))
  },
  // 播放音频
  myAudioPlay ({ dispatch, commit, state }) {
    myAudio.play()
  },
  // 暂停音频
  myAudioPause ({ dispatch, commit, state }, data) {
    myAudio.pause()
  },
  // 设置切换音频
  setSwitchMusic ({ dispatch, commit, state }, data) {
    let currentIndex = 0
    const lists = state.allMusicList
    const allItem = state.allCurrentMusicItem

    for (let i = 0; i < lists.length; i++) {
      if (allItem.id === lists[i].id || allItem.id === lists[i].vid) {
        data.status === 'next' ? currentIndex = i + 1 : currentIndex = i - 1
        if (currentIndex < lists.length) {
          if (lists[currentIndex].listType === 'indexMusic') {
            setTimeout(() => {
              dispatch('setMusicStatus', { that: data.that, item: lists[currentIndex], list: lists })
              commit(types.SET_CURRENT_INDEX, currentIndex)
            }, 500)
          } else if (lists[currentIndex].listType === 'newsMusic') {
            setTimeout(() => {
              dispatch('setMusicStatus', { that: data.that, item: lists[currentIndex], list: lists })
            }, 500)
          } else {
            const oJson = {
              that: data.that,
              id: lists[currentIndex].vid || lists[currentIndex].id,
              keywords: lists[currentIndex].keywords || '',
              listType: lists[currentIndex].listType,
              authorId: lists[currentIndex].authorId,
              page: lists[currentIndex].page
            }
            dispatch('getMusicDetails', oJson)
          }
        } else {
          firstEnter = true
          // indexMusic
          if (lists[0].listType === 'indexMusic') {
            let oJson = {
              page: state.musicList[0].page + 1,
              that: data.that,
              type: 'index',
              first: false
            }
            dispatch('getMusicList', oJson)
          }
          commit(types.SET_PLAYING_STATE, false)
          commit(types.SET_ALL_PLAYING_STATE, false)
          dispatch('setMusicListPlayStatusFn', { item: lists[currentIndex - 1] })
        }
      }
    }
  },
  // 改变list播放列表状态
  setMusicListPlayStatusFn ({ dispatch, commit, state }, data) {
    let newMusicList = []
    switch (data.item.listType) {
      case 'indexMusic':
        newMusicList = state.musicList
        break
      case 'allSearchType':
        newMusicList = state.allSearchLists
        break
      case 'newsMusic':
        newMusicList = state.newsList
        break
      case 'collectType':
        newMusicList = state.collectMusicList
        break
      case 'historyType':
        newMusicList = state.playHistoryList
        break
      case 'giveThumbsType':
        newMusicList = state.giveThumbsMusicList
        break
      case 'subjectType':
        newMusicList = state.subjectDetailList
        break
      case 'hotColumnType':
        newMusicList = state.hotColumnList
        break
      case 'shareMusic':
        newMusicList = state.shareInfo
        break
      case 'lectureType':
        newMusicList = state.lectureMusicList
        break
      default:
        return false
    }
    state.allMusicList.forEach((item) => {
      item.vid === data.item.id && state.allPlaying ? item['playing'] = true : item['playing'] = false
    })
    newMusicList.forEach((item) => {
      (item.id === data.item.id || item.vid === data.item.id) && state.allPlaying ? item['playing'] = true : item['playing'] = false
    })
  },
  // 音频点赞和收藏
  likeCollectFn ({ dispatch, commit, state }, data) {
    let lists = []
    switch (data.type) {
      case 'allMusicType':
        data.state === 1 ? state.allCurrentMusicItem[data.operateType] = 0 : state.allCurrentMusicItem[data.operateType] = 1
        break
      case 'indexType':
        data.state === 1 ? state.currentMusicItem[data.operateType] = 0 : state.currentMusicItem[data.operateType] = 1
        break
      case 'allSearchType':
        lists = state.allSearchLists
        break
      case 'collectType':
        lists = state.collectMusicList
        break
      case 'historyType':
        lists = state.playHistoryList
        break
      case 'giveThumbsType':
        lists = state.giveThumbsMusicList
        break
      case 'subjectType':
        lists = state.subjectDetailList
        break
      case 'hotColumnType':
        lists = state.hotColumnList
        break
      case 'lectureType':
        lists = state.lectureMusicList
        break
      default:
        return false
    }
    lists.forEach((item) => {
      if (item.id === data.id || item.vid === data.id) {
        data.state === 1 ? item[data.operateType] = 0 : item[data.operateType] = 1
        if (data.operateType === 'is_like') data.state === 1 ? item.like_hits = item.like_hits - 1 : item.like_hits = item.like_hits + 1
        if (data.operateType === 'is_collection') data.state === 1 ? item.collection_hits = item.collection_hits - 1 : item.collection_hits = item.collection_hits + 1
      }
    })
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: data.operateType === 'is_like' ? newApiUrl + '/wx/simple/thumbsUp' : newApiUrl + '/wx/simple/collection',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          id: data.id,
          type: 0
        },
        success: (res) => {
          if (res.data.code === code) {
            resolve(res.data)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 全部点赞
  allThumbsUp ({ dispatch, commit, state }, data) {
    // 0 音频 1 专题 2 文章 3 评论
    let oJson = ''
    let lists = []
    switch (data.likeType) {
      case 'commentType':
        oJson = state.commentList[data.index]
        oJson['is_like'] = data.status === 0 ? 1 : 0
        oJson['like_total'] = data.status === 0 ? oJson.like_total + 1 : oJson.like_total - 1
        JSON.parse(JSON.stringify(state.commentList))
        break
      case 'replyType':
        oJson = state.commentList[data.index].replay_list[data.i]
        oJson['is_like'] = data.status === 0 ? 1 : 0
        oJson['like_total'] = data.status === 0 ? oJson.like_total + 1 : oJson.like_total - 1
        JSON.parse(JSON.stringify(state.commentList))
        break
      case 'indexMusic':
        lists = state.musicList
        state.currentMusicItem['is_like'] = data.status === 0 ? 1 : 0
        break
      case 'allMusicType':
        data.state === 1 ? state.allCurrentMusicItem[data.operateType] = 0 : state.allCurrentMusicItem[data.operateType] = 1
        break
      case 'allSearchType':
        lists = state.allSearchLists
        break
      case 'collectType':
        lists = state.collectMusicList
        break
      case 'historyType':
        lists = state.playHistoryList
        break
      case 'giveThumbsType':
        lists = state.giveThumbsMusicList
        break
      case 'subjectType':
        lists = state.subjectDetailList
        break
      case 'hotColumnType':
        lists = state.hotColumnList
        break
      case 'lectureType':
        lists = state.lectureMusicList
        break
    }
    lists.forEach((item) => {
      if (item.id === data.id || item.vid === data.id) {
        data.status === 1 ? item['is_like'] = 0 : item['is_like'] = 1
        data.status === 1 ? item['like_hits'] = item.like_hits - 1 : item['like_hits'] = item.like_hits + 1
      }
    })
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/simple/thumbsUp',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          type: data.type,
          id: data.id
        },
        success: (res) => {
          if (res.data.code === code) {
            resolve(res.data)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 全部收藏
  allCollection ({ dispatch, commit, state }, data) {
    // 0 音频 1 专题 2 文章
    let lists = []
    switch (data.collectionType) {
      case 'indexMusic':
        lists = state.musicList
        state.currentMusicItem['is_collection'] = data.status === 0 ? 1 : 0
        break
      case 'allMusicType':
        data.state === 1 ? state.allCurrentMusicItem[data.operateType] = 0 : state.allCurrentMusicItem[data.operateType] = 1
        break
      case 'musicDetailsType':
        state.musicDetails['is_collection'] = data.status === 0 ? 1 : 0
        break
      case 'allSearchType':
        lists = state.allSearchLists
        break
      case 'collectType':
        lists = state.collectMusicList
        break
      case 'historyType':
        lists = state.playHistoryList
        break
      case 'giveThumbsType':
        lists = state.giveThumbsMusicList
        break
      case 'subjectType':
        lists = state.subjectDetailList
        break
      case 'hotColumnType':
        lists = state.hotColumnList
        break
      case 'lectureType':
        lists = state.lectureMusicList
        break
    }
    lists.forEach((item) => {
      if (item.id === data.id || item.vid === data.id) {
        data.status === 1 ? item['is_collection'] = 0 : item['is_collection'] = 1
        data.status === 1 ? item['collection_hits'] = item.collection_hits - 1 : item['collection_hits'] = item.collection_hits + 1
      }
    })
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/simple/collection',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          type: data.type,
          id: data.id
        },
        success: (res) => {
          if (res.data.code === code) {
            resolve(res.data)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 关注-取消讲师
  concernAuthor ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/simple/attention',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          id: data.au_id
        },
        success: (res) => {
          if (res.data.code === code) {
            resolve(res.data)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 订阅专题
  subscriptionSubject ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/special/subSpecial',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          id: data.id
        },
        success: (res) => {
          if (res.data.code === code) {
            resolve(res.data)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 收藏添加备注
  collectRemark ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/simple/saveCollectionRemark',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          remark: data.remark,
          id: data.id
        },
        success: (res) => {
          resolve(res.data)
        }
      })
    })
  },
  // 获取分类列表
  getAllTypeList ({ dispatch, commit, state }, data) {
    uni.showLoading({ title: 'Loading' })
    uni.request({
      method: 'GET',
      url: apiUrl + '/category/wx_categorys.php',
      header: {
        fromClient: deviceType
      },
      data: {
        openid: state.userInfo.openid || '',
        keyWords: data.keyWord
      },
      success: (res) => {
        if (res.data.ret === ret) {
          commit(types.SET_ALLTYPE_LIST, res.data.data)
        } else {
          if (res.data.ret === staleCode) signOut()
          showToastFn(res.data.message)
        }
        uni.hideLoading()
      }
    })
  },
  // 获取分享推荐标签列表
  getRecommendLabe ({ dispatch, commit, state }, data) {
    uni.request({
      method: 'GET',
      url: apiUrl + '/category/wx_get_catname_lists.php',
      header: {
        fromClient: deviceType
      },
      data: {
        catid: data.catid
      },
      success: (res) => {
        if (res.data.ret === ret) {
          commit(types.SET_RECOMMEND_LABEL_LIST, res.data.data)
        } else {
          if (res.data.ret === staleCode) signOut()
          showToastFn(res.data.message)
        }
      }
    })
  },
  // 获取分享缩略图
  getShareThumbnail ({ dispatch, commit, state }, data) {
    uni.request({
      method: 'GET',
      url: apiUrl + '/share/wx_rand_pic.php',
      header: {
        fromClient: deviceType
      },
      data: {
        openid: state.userInfo.openid || '',
        catid: data.catid
      },
      success: (res) => {
        if (res.data.ret === ret) {
          commit(types.SET_SHARE_THUMBNAIL, res.data.data.thumb)
        } else {
          if (res.data.ret === staleCode) signOut()
          showToastFn(res.data.message)
        }
      }
    })
  },
  // 记录分享的用户
  addShareRecord ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/share/wx_add_share.php',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          user_id: state.userInfo.user_id,
          labellist: data.labellist || [],
          vid: data.vid
        },
        success: (res) => {
          if (res.data.ret === ret) {
            resolve(res.data)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 添加分享积分
  addShareJifen ({ dispatch, commit, state }) {
    if (state.shareid) {
      return new Promise((resolve) => {
        uni.request({
          method: 'GET',
          url: apiUrl + '/share/wx_add_share_jifen.php',
          header: {
            fromClient: deviceType
          },
          data: {
            openid: state.userInfo.openid || '',
            user_id: state.shareid
          },
          success: (res) => {
            if (res.data.ret === ret) {
              resolve(res.data)
            } else {
              if (res.data.ret === staleCode) signOut()
              showToastFn(res.data.message)
            }
          }
        })
      })
    }
  },
  // 获取搜索推荐标签列表
  getSeekRecommendLabe ({ dispatch, commit, state }) {
    uni.request({
      method: 'GET',
      url: apiUrl + '/keyword/wx_hot_keywords.php',
      header: {
        fromClient: deviceType
      },
      success: (res) => {
        if (res.data.ret === ret) {
          commit(types.SET_SEEK_RECOMMEND_LABEL_LIST, res.data.data)
        } else {
          if (res.data.ret === staleCode) signOut()
          showToastFn(res.data.message)
        }
      }
    })
  },
  // 用户账号余额
  getUserAccountInfo ({ dispatch, commit, state }) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/user/getUserAccount',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || ''
        },
        success: (res) => {
          if (res.data.code === code) {
            resolve(res.data)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 提现
  carryCash ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/user_withdrawal/createUserWithdrawal',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid,
          amount: data.amount
        },
        success: (res) => {
          if (res.data.code === code) {
            resolve(res.data)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取音频 - 文章 - 专题，收藏列表
  getCollectList ({ dispatch, commit, state }, data) {
    const allItem = state.allCurrentMusicItem

    commit(types.SET_LOADING_STATE, true)
    commit(types.SET_IS_DATA_STATE, false)

    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/simple/collectionList',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          keywords: data.keywords,
          page: data.page,
          type: data.type
        },
        success: (res) => {
          if (res.data.code === code) {
            let lists = []

            if (data.type === 0) {
              lists = JSON.parse(JSON.stringify(state.collectMusicList))

              res.data.data.forEach((item) => {
                allItem.id === item.vid && state.allPlaying ? item['playing'] = true : item['playing'] = false
                item['inputtime'] = getLocalTime(item.inputtime * 1000)
                item['keywords'] = data.keywords
                item['listType'] = 'collectType'
                item['page'] = data.page
                lists.push(item)
              })

              commit(types.SET_COLLECT_MUSIC_LIST, lists)
              if (allItem.listType === 'collectType' && allItem.keywords === data.keywords) commit(types.SET_ALL_MUSIC_LIST, lists)
            } else if (data.type === 1) {
              lists = JSON.parse(JSON.stringify(state.collectSubjectList))

              res.data.data.forEach((item) => {
                item['page'] = data.page
                lists.push(item)
              })

              commit(types.SET_COLLECT_SUBJECT_LIST, lists)
            } else if (data.type === 2) {
              lists = JSON.parse(JSON.stringify(state.collectArticleList))

              res.data.data.forEach((item) => {
                item['inputtime'] = getLocalTime(item.inputtime * 1000)
                lists.push(item)
              })

              commit(types.SET_COLLECT_ARTICLE_LIST, lists)
            }

            commit(types.SET_LOADING_STATE, false)
            commit(types.SET_IS_DATA_STATE, !res.data.data.length)

            resolve(lists)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取播放历史列表
  getPlayAnnalList ({ dispatch, commit, state }, data) {
    const allItem = state.allCurrentMusicItem

    commit(types.SET_LOADING_STATE, true)
    commit(types.SET_IS_DATA_STATE, false)

    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/voice/playRecord',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          page: data.page
        },
        success: (res) => {
          if (res.data.code === code) {
            let lists = JSON.parse(JSON.stringify(state.playHistoryList))

            res.data.data.data.forEach((item) => {
              item.inputtime = getLocalTime(item.inputtime * 1000)
              allItem.id === item.vid && state.allPlaying ? item['playing'] = true : item['playing'] = false
              item['listType'] = 'historyType'
              item['page'] = data.page
              lists.push(item)
            })

            commit(types.SET_LOADING_STATE, false)
            commit(types.SET_PLAY_HISTORY_LIST, lists)
            commit(types.SET_IS_DATA_STATE, !res.data.data.data.length)
            if (allItem.listType === 'historyType') commit(types.SET_ALL_MUSIC_LIST, lists)
            resolve()
          } else {
            if (res.data.data.code === staleCode) signOut()
            showToastFn(res.data.data.message)
          }
        }
      })
    })
  },
  // 记录上一次预览(文章-音频)
  setActivityActRecord ({ dispatch, commit, state }, data) {
    let type = 0
    let contentId = 0
    let uuid = uni.getStorageSync('uuid')

    if (!uuid) {
      uuid = guid(8, 16) // "098F4D35"
      uni.setStorageSync('uuid', guid(8, 16))
    }

    if (data.item) {
      // indexMusic newsMusic 等...
      contentId = data.item.id
      data.item.listType !== 'newsMusic' ? type = 0 : type = 1
    } else {
      // subjectType 2
      // articleType 3
      contentId = data.type === 4 ? data.oJson.au_id : data.oJson.id
      type = data.type
    }

    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/user/actRecord',
        header: {
          fromClient: deviceType
        },
        data: {
          info: type === 0 || type === 1 ? currentTime : 0,
          openid: state.userInfo.openid || '',
          is_finish: data.isFinish || '',
          content_id: contentId,
          uuid: uuid,
          type
        },
        success: (res) => {
          resolve(res.data)
        }
      })
    })
  },
  // 记录播放过的音频
  recordingPlayMusic ({ dispatch, commit, state }, data) {
    if (state.userInfo) {
      return new Promise((resolve) => {
        uni.request({
          method: 'GET',
          url: data.item.listType === 'newsMusic' ? apiUrl + '/played/wx_add_headline.php' : apiUrl + '/played/wx_add_played.php',
          header: {
            fromClient: deviceType
          },
          data: {
            special_id: data.item.special_id || '',
            openid: state.userInfo.openid || '',
            vid: data.item.id || data.item.vid,
            catid: data.item.catid || '',
            title: data.item.title || '',
            thumb: data.item.thumb || '',
            url: data.item.url || '',
            is_played: 1 || ''
          },
          success: (res) => {
            if (res.data.ret === ret) {
              resolve(res.data)
            } else {
              if (res.data.ret === staleCode) signOut()
              showToastFn(res.data.message)
            }
          }
        })
      })
    }
  },
  // 获取坚持签到的天数
  getCheckInDays ({ dispatch, commit, state }) {
    uni.request({
      method: 'GET',
      url: apiUrl + '/sign/wx_sign_days.php',
      header: {
        fromClient: deviceType
      },
      data: {
        openid: state.userInfo.openid || ''
      },
      success: (res) => {
        if (res.data.ret === ret) {
          commit(types.SET_DAYS, res.data.data.days)
        } else {
          if (res.data.ret === staleCode) signOut()
          showToastFn(res.data.message)
        }
      }
    })
  },
  // 获取签到如期列表
  getCheckInDateList ({ dispatch, commit, state }) {
    uni.request({
      method: 'GET',
      url: apiUrl + '/sign/wx_year_moths.php',
      header: {
        fromClient: deviceType
      },
      data: {
        openid: state.userInfo.openid || ''
      },
      success: (res) => {
        if (res.data.ret === ret) {
          commit(types.SET_CHECK_IN_LIST, res.data.data)
        } else {
          if (res.data.ret === staleCode) signOut()
          showToastFn(res.data.message)
        }
      }
    })
  },
  // 获取签到日期
  getCheckInDate ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/sign/wx_calendar.php',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          month: data.month,
          year: data.year,
          mark: data.mark
        },
        success: (res) => {
          if (res.data.ret === ret) {
            let list = []
            let lists = []

            res.data.data.forEach((item, index) => {
              list.push(item)
              if (index === 14 || index + 1 === res.data.data.length) {
                lists.push(list)
                list = []
              }
            })

            commit(types.SET_CHECK_IN_DATE_LIST, lists)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
          resolve()
        }
      })
    })
  },
  // 获取每日头条列表
  getNewsList ({ dispatch, commit, state }, data) {
    commit(types.SET_LOADING_STATE, true)
    commit(types.SET_IS_DATA_STATE, false)

    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/home/getHeadline',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          page: data.page
        },
        success: (res) => {
          if (res.data.code === code) {
            let lists = JSON.parse(JSON.stringify(state.newsList))

            res.data.data.forEach((item) => {
              state.allCurrentMusicItem.id === item.id && state.allPlaying ? item['playing'] = true : item['playing'] = false
              item['thumb'] = upyunUrl + '/wxXcxImg/images/news-cover.png'
              item['listType'] = 'newsMusic'
              item['page'] = data.page
              lists.push(item)
            })

            commit(types.SET_NEWS_LIST, lists)
            commit(types.SET_LOADING_STATE, false)
            commit(types.SET_IS_DATA_STATE, !res.data.data.length)
          } else {
            showToastFn(res.data.message)
          }
          resolve()
        }
      })
    })
  },
  // 获取文章详情
  getArticleDetail ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/news/wx_readstory.php',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          nid: data.id
        },
        success: (res) => {
          if (res.data.ret === ret) {
            if (state.setTitleState) {
              uni.setNavigationBarTitle({
                title: res.data.data.title
              })
            }

            res.data.data['listType'] = 'articleType'
            res.data.data['inputtime'] = getLocalTime(res.data.data.inputtime * 1000)

            dispatch('setActivityActRecord', { oJson: res.data.data, type: 3 })
            resolve(res.data.data)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取上进心列表
  getShareLatestRank ({ dispatch, commit, state }, data) {
    uni.request({
      method: 'GET',
      url: apiUrl + '/share/wx_latest_rank.php',
      header: {
        fromClient: deviceType
      },
      data: {
        openid: state.userInfo.openid || '',
        page: data.page
      },
      success: (res) => {
        if (res.data.ret === ret) {
          res.data.data.forEach((item) => {
            item['inputtime'] = getLocalTime(item.inputtime * 1000)
          })
          commit(types.SET_SHARE_LATEST_RANK_LIST, res.data.data)
        } else {
          if (res.data.ret === staleCode) signOut()
          showToastFn(res.data.message)
        }
      }
    })
  },
  // 获取心榜列表
  getShareRanking ({ dispatch, commit, state }, data) {
    uni.request({
      method: 'GET',
      url: apiUrl + '/share/wx_share_ranking.php',
      header: {
        fromClient: deviceType
      },
      data: {
        openid: state.userInfo.openid || '',
        page: data.page
      },
      success: (res) => {
        if (res.data.ret === ret) {
          commit(types.SET_SHARE_RANKING_OBJ, res.data.data)
        } else {
          if (res.data.ret === staleCode) signOut()
          showToastFn(res.data.message)
        }
      }
    })
  },
  // 获取排行榜信息
  getCheckRankingData ({ dispatch, commit, state }, that) {
    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/sign/wx_sign_days_listorder.php',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || ''
        },
        success: (res) => {
          if (res.data.ret === ret) {
            // 调整userList上有当前用户时，放在第一位
            res.data.data.lists.forEach((item) => {
              if (item.user_lists) {
                item.user_lists.forEach((obj, i) => {
                  if (obj.user_id === state.userInfo.user_id) {
                    item.user_lists.splice(i, 1)
                    item.user_lists.unshift(obj)
                  }
                })
              }
            })
            commit(types.SET_CHECK_RANKING_OBJ, res.data.data)
            resolve(res.data.data)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取分享落地页我的能量
  getShareEnergyData ({ dispatch, commit, state }) {
    uni.request({
      method: 'GET',
      url: apiUrl + '/sign/wx_cj.php',
      header: {
        fromClient: deviceType
      },
      data: {
        user_id: state.shareid
      },
      success: (res) => {
        if (res.data.ret === ret) {
          commit(types.SET_SHARE_ENERGY_OBJ, res.data.data)
        } else {
          if (res.data.ret === staleCode) signOut()
          showToastFn(res.data.message)
        }
      }
    })
  },
  // 获取分享落地info
  getShareInfo ({ dispatch, commit, state }, data) {
    const allItem = state.allCurrentMusicItem
    uni.request({
      method: 'GET',
      url: apiUrl + '/share/wx_get_share.php',
      header: {
        fromClient: deviceType
      },
      data: {
        user_id: state.shareid,
        tid: data.tid
      },
      success: (res) => {
        if (res.data.ret === ret) {
          let lists = []

          allItem.id === res.data.vid && state.allPlaying ? res.data['playing'] = true : res.data['playing'] = false
          res.data.data['listType'] = 'shareMusic'

          lists.push(res.data.data)
          commit(types.SET_SHARE_INFO, lists)
          if (allItem.listType === 'shareMusic') commit(types.SET_ALL_MUSIC_LIST, lists)
        } else {
          if (res.data.ret === staleCode) signOut()
          showToastFn(res.data.message)
        }
      }
    })
  },
  // 添加意见反馈
  addFeedback ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/msg/save_msg.php',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          content: data.textareaVal,
          pic_url: data.picUrl,
          tel: data.telVal
        },
        success: (res) => {
          if (res.data.ret === ret) {
            resolve(res.data)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取反馈历史列表
  getFeedbackHistoryList ({ dispatch, commit, state }, data) {
    commit(types.SET_IS_DATA_STATE, false)
    commit(types.SET_LOADING_STATE, true)

    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/msg/get_msg_list.php',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          page: data.page
        },
        success: (res) => {
          if (res.data.ret === ret) {
            let lists = JSON.parse(JSON.stringify(state.feedbackHistoryList))

            res.data.data.forEach((item) => {
              item['ctime'] = getLocalTime(item.ctime * 1000)
              lists.push(item)
            })

            commit(types.SET_IS_DATA_STATE, !res.data.data.length)
            commit(types.SET_FEEDBACK_HISTORY_LIST, lists)
            commit(types.SET_LOADING_STATE, false)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
          resolve()
        }
      })
    })
  },
  // 获取反馈详情
  getFeedbackDetails ({ dispatch, commit, state }, data) {
    uni.showLoading({ title: 'Loading' })
    uni.request({
      method: 'GET',
      url: apiUrl + '/msg/get_msg_detial.php',
      header: {
        fromClient: deviceType
      },
      data: {
        openid: state.userInfo.openid || '',
        id: data.id
      },
      success: (res) => {
        if (res.data.ret === ret) {
          let oJson = res.data.data
          oJson['ctime'] = getLocalTime(oJson.ctime * 1000)
          commit(types.SET_FEEDBACK_DATAIL, oJson)
        } else {
          if (res.data.ret === staleCode) signOut()
          showToastFn(res.data.message)
        }
        uni.hideLoading()
      }
    })
  },
  // 添加意见反馈到聊天列表
  addFeedbackReply ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/msg/save_msg_repy.php',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          content: data.inputVal,
          msgId: data.id
        },
        success: (res) => {
          if (res.data.ret === ret) {
            resolve(res.data)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 我的音频点赞列表
  getGiveThumbsMusicList ({ dispatch, commit, state }, data) {
    const allItem = state.allCurrentMusicItem

    commit(types.SET_LOADING_STATE, true)
    commit(types.SET_IS_DATA_STATE, false)

    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/simple/thumbsUpList',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          page: data.page,
          type: 0
        },
        success: (res) => {
          if (res.data.code === code) {
            let lists = JSON.parse(JSON.stringify(state.giveThumbsMusicList))

            res.data.data.forEach((item) => {
              allItem.id === item.vid && state.allPlaying ? item['playing'] = true : item['playing'] = false
              item['inputtime'] = getLocalTime(item.inputtime * 1000)
              item['listType'] = 'giveThumbsType'
              item['page'] = data.page
              lists.push(item)
            })

            commit(types.SET_LOADING_STATE, false)
            commit(types.SET_GIVE_THUMBS_MUSIC_LIST, lists)
            commit(types.SET_IS_DATA_STATE, !res.data.data.length)
            if (allItem.listType === 'giveThumbsType') commit(types.SET_ALL_MUSIC_LIST, lists)
            resolve()
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 添加内容定制
  addContentWord ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/custom/wx_add_custom.php',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          keywords: data.wordVal
        },
        success: (res) => {
          if (res.data.ret === ret) {
            resolve(res.data)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取内容定制关键词列表
  getContentWordList ({ dispatch, commit, state }, data) {
    commit(types.SET_IS_DATA_STATE, false)
    commit(types.SET_LOADING_STATE, true)

    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/custom/wx_lists.php',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          page: data.page
        },
        success: (res) => {
          if (res.data.ret === ret) {
            let lists = JSON.parse(JSON.stringify(state.contentWordList))

            res.data.data.lists.forEach((item) => {
              item['inputtime'] = getLocalTime(item.inputtime * 1000)
              lists.push(item)
            })

            commit(types.SET_CONTENT_WORD_LIST, lists)
            commit(types.SET_IS_DATA_STATE, !res.data.data.lists.length)
            commit(types.SET_LOADING_STATE, false)
            resolve(res.data.data)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取专题详情
  getSubjectInfo ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/special/getInfo',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          order_id: data.orderid || '',
          id: data.special_id
        },
        success: (res) => {
          if (res.data.code === code) {
            if (state.setTitleState) {
              uni.setNavigationBarTitle({
                title: res.data.data.title
              })
            }
            dispatch('setActivityActRecord', { oJson: res.data.data, type: 2 })
            resolve(res.data)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取专题列表
  getSubjectList ({ dispatch, commit, state }, data) {
    const allItem = state.allCurrentMusicItem

    commit(types.SET_LOADING_STATE, true)
    commit(types.SET_IS_DATA_STATE, false)

    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/special/getList',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          page: data.page,
          id: data.id
        },
        success: (res) => {
          if (res.data.code === code) {
            let lists = JSON.parse(JSON.stringify(state.subjectDetailList))

            res.data.data.data.forEach((item) => {
              item['comment_total'] = item.comment_total > 10000 ? Math.round((item.comment_total / 10000) * 100) / 100 + '万' : item.comment_total
              item['play_hits'] = item.play_hits >= 10000 ? Math.round((item.play_hits / 10000) * 100) / 100 + '万' : item.play_hits
              allItem.id === item.vid && state.allPlaying ? item['playing'] = true : item['playing'] = false
              item['duration'] = timeToMinute(item.duration)
              item['listType'] = 'subjectType'
              item['special_id'] = data.id
              item['page'] = data.page
              lists.push(item)
            })

            commit(types.SET_SUBJECT_DETAIL_LIST, lists)
            commit(types.SET_IS_DATA_STATE, !res.data.data.data.length)
            if (allItem.listType === 'subjectType' && allItem.id === data.id) commit(types.SET_ALL_MUSIC_LIST, lists)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
          commit(types.SET_LOADING_STATE, false)
          resolve()
        }
      })
    })
  },
  // 获取相似课程
  getSimilarityCourseList ({ dispatch, commit, state }, data) {
    commit(types.SET_IS_DATA_STATE, false)
    commit(types.SET_LOADING_STATE, true)

    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/special/getSimilarList',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          page: data.page,
          id: data.id
        },
        success: (res) => {
          if (res.data.code === code) {
            let lists = JSON.parse(JSON.stringify(state.similarityCourseList))

            res.data.data.data.forEach((item) => {
              item['paly'] = item.paly >= 10000 ? Math.round((item.paly / 10000) * 100) / 100 + '万' : item.paly
              lists.push(item)
            })

            commit(types.SET_SIMILARITY_COURSE_LIST, lists)
            commit(types.SET_IS_DATA_STATE, !res.data.data.data.length)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
          commit(types.SET_LOADING_STATE, false)
          resolve()
        }
      })
    })
  },
  // 获取评论list
  getCommentList ({ dispatch, commit, state }, data) {
    commit(types.SET_IS_DATA_STATE, false)
    commit(types.SET_LOADING_STATE, true)

    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/comment/getCommentList',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          c_id: data.c_id || '',
          type: data.type,
          page: data.page
        },
        success: (res) => {
          if (res.data.code === code) {
            let lists = JSON.parse(JSON.stringify(state.commentList))

            res.data.data.data.forEach((item) => {
              item['ctime'] = getLocalTime(item.ctime * 1000)
              item.replay_list.forEach((obj) => {
                obj['ctime'] = getLocalTime(obj.ctime * 1000)
              })
              lists.push(item)
            })

            commit(types.SET_COMMENT_LIST, lists)
            commit(types.SET_IS_DATA_STATE, !res.data.data.data.length)
            commit(types.SET_LOADING_STATE, false)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
          resolve(res.data.data)
        }
      })
    })
  },
  // 创建评论
  creationComment ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/comment/create',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          content: data.content,
          replay_id: data.replay_id,
          tag_id: data.tag_id,
          c_id: data.c_id || '',
          type: data.type
        },
        success: (res) => {
          if (res.data.code === code) {
            res.data.data['ctime'] = getLocalTime(res.data.data.ctime * 1000)
            res.data.data['replay_list'] = []
            data.replay_id ? state.commentList[data.index].replay_list.unshift(res.data.data) : state.commentList.unshift(res.data.data)
            showToastFn('发送成功')
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
          resolve(res.data)
        }
      })
    })
  },
  // 删除评论 - 回复
  commentDelete ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/comment/delete',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          id: data.id
        },
        success: (res) => {
          if (res.data.code === code) {
            showToastFn('移除成功!')
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
          resolve(res.data)
        }
      })
    })
  },
  // 查看更多用户回复评论
  getMoreReplyComment ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/comment/getReplayList',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          pageSize: 50,
          id: data.id,
          page: 1
        },
        success: (res) => {
          if (res.data.code === code) {
            res.data.data.data.forEach((item) => {
              item['ctime'] = getLocalTime(item.ctime * 1000)
            })
            state.commentList[data.index].replay_list = res.data.data.data
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
          resolve(res.data)
        }
      })
    })
  },
  // 参与邀请人活动
  exchangeJoinInvite ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: data.type === 'exchange' ? newApiUrl + '/wx/special/exchangeAct' : newApiUrl + '/wx/special/joinInvite',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          id: data.id
        },
        success: (res) => {
          if (res.code === code) {
          } else {
            if (res.code === staleCode) signOut()
            showToastFn(res)
          }
        }
      })
    })
  },
  // 获取专题咨询支付信息
  getWXPaySubjectConsultInfo ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: data.buy_type === 'consulting' ? apiUrl + '/wxpay/consult_order.php' : apiUrl + '/wxpay/app_special_order.php',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          pay_password: data.pay_password,
          is_balance: data.is_balance,
          id: data.id
        },
        success: (res) => {
          console.log(res)
          if (res.data.ret === ret) {
            resolve(res.data)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取全部抢学费用户列表
  getAllGrabList ({ dispatch, commit, state }) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/special/allGrabList',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          pageSize: 100,
          page: 1
        },
        success: (res) => {
          if (res.data.code === code) {
            res.data.data.forEach((item) => {
              item['ctime'] = getLocalTime(item.ctime * 1000)
            })
            commit(types.SET_ALL_GRAB_LIST, res.data.data)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
          resolve()
        }
      })
    })
  },
  // 获取邀请记录信息
  getSpecialOrdersInfo ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/special/getOrdersInfo',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          id: data.id
        },
        success: (res) => {
          if (res.data.code === code) {
            resolve(res.data.data)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取专题邀请记录列表
  getJoinSubjectList ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/special/inviteList',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          order_id: data.id
        },
        success: (res) => {
          if (res.data.code === code) {
            res.data.data.forEach((item) => {
              item['ctime'] = getLocalTime(item.ctime * 1000)
            })
            resolve(res.data.data)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取疯狂抢学费列表
  getGrabTuitionList ({ dispatch, commit, state }, data) {
    commit(types.SET_IS_DATA_STATE, false)
    commit(types.SET_LOADING_STATE, true)

    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/special/homeGrabList',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          page: data.page
        },
        success: (res) => {
          if (res.data.code === code) {
            let lists = JSON.parse(JSON.stringify(state.grabTuitionList))

            res.data.data.forEach((item) => {
              lists.push(item)
            })

            commit(types.SET_GRAB_TUITION_LIST, lists)
            commit(types.SET_IS_DATA_STATE, !res.data.data.length)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
          commit(types.SET_LOADING_STATE, false)
          resolve()
        }
      })
    })
  },
  // 获取我的抢学费进行中列表
  getConductGrabTuitionList ({ dispatch, commit, state }, data) {
    commit(types.SET_IS_DATA_STATE, false)
    commit(types.SET_LOADING_STATE, true)

    clearInterval(stopTime)

    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/special/myGrabingList',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          page: data.page
        },
        success: (res) => {
          if (res.data.code === code) {
            let lists = JSON.parse(JSON.stringify(state.conductGrabTuitionList))

            res.data.data.forEach((item) => {
              item['date'] = { days: 0, hours: 0, minutes: 0, seconds: 0 }
              lists.push(item)
            })

            stopTime = setInterval(() => {
              lists.forEach((item) => {
                if (item.date) {
                  item['date'] = timeDown(timestampToTime(item.time_limit))
                } else {
                  clearInterval(stopTime)
                }
              })
              commit(types.SET_CONDUCT_GRAB_TUITION_LIST, lists)
            }, 1000)

            commit(types.SET_CONDUCT_GRAB_TUITION_LIST, lists)
            commit(types.SET_IS_DATA_STATE, !res.data.data.length)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
          commit(types.SET_LOADING_STATE, false)
          resolve()
        }
      })
    })
  },
  // 获取我的完成抢学费列表
  getAccomplishGrabTuitionList ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/special/myGrabDoneList',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          pageSize: data.pageSize,
          page: data.page
        },
        success: (res) => {
          if (res.data.code === code) {
            let lists = JSON.parse(JSON.stringify(state.accomplishGrabTuitionList))

            res.data.data.forEach((item) => {
              lists.push(item)
            })

            commit(types.SET_ACCOMPLISH_GRAB_TUITION_LIST, lists)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
          resolve()
        }
      })
    })
  },
  // 学费晒单
  getTuitionSDList ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/special/SdList',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          order_id: data.order_id
        },
        success: (res) => {
          if (res.data.code === code) {
            res.data.data['grab_time_limit'] = timestampToTime(res.data.data.grab_time_limit)
            res.data.data.list.forEach((item) => {
              item['settle_time'] = getLocalTime(item.settle_time * 1000)
            })
            if (res.data.data.is_grab) {
              res.data.data.my_play_list.forEach((item) => {
                item['ctime'] = getLocalTime(item.ctime * 1000)
                item['play_hits'] = item.play_hits >= 10000 ? Math.round((item.play_hits / 10000) * 100) / 100 + '万' : item.play_hits
              })
              res.data.data.my_inv_list.forEach((item) => {
                item['ctime'] = getLocalTime(item.ctime * 1000)
              })
            }
            resolve(res.data.data)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 抢学费
  getTuition ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/special/grabMoney',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          share_id: state.shareid,
          order_id: data.order_id
        },
        success: (res) => {
          if (res.data.code === code || res.data.code === 360) {
            resolve(res.data.data)
          } else if (res.data.code === staleCode) signOut()
          showToastFn(res.data.message)
        }
      })
    })
  },
  // 助力返学费
  getOrderGrabList ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/special/orderGrabList',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          order_id: data.order_id
        },
        success: (res) => {
          if (res.data.code === code) {
            res.data.data['back_time_limit'] = timestampToTime(res.data.data.back_time_limit)
            res.data.data.invite_list.forEach((item) => {
              item['ctime'] = getLocalTime(item.ctime * 1000)
            })
            res.data.data.grab_list.forEach((item) => {
              item['ctime'] = getLocalTime(item.ctime * 1000)
            })
            resolve(res.data.data)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 用户它人用户信息
  getOtherUserInfo ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/simple/getUserInfo',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          order_id: data.order_id,
          id: state.shareid
        },
        success: (res) => {
          if (res.data.code === code) {
            resolve(res.data.data)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取每日坚持状态
  daysMissionStatus ({ dispatch, commit, state }) {
    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/userinfo/task/wx_action_task.php',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || ''
        },
        success: (res) => {
          if (res.data.ret === ret) {
            resolve(res.data)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取星期签到状态
  weekMissionStatus ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/sign/wx_weeks.php',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || ''
        },
        success: (res) => {
          if (res.data.ret === ret) {
            resolve(res.data)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取兑换书和物品详情列表
  getConversionBookList ({ dispatch, commit, state }, data) {
    commit(types.SET_IS_DATA_STATE, false)
    commit(types.SET_LOADING_STATE, true)

    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/activity/get_exchange_list.php',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          can_exc: data.can_exc,
          lower: data.lower,
          upper: data.upper,
          type: data.type,
          page: data.page
        },
        success: (res) => {
          if (res.data.ret === ret) {
            let lists = JSON.parse(JSON.stringify(state.conversionBookList))

            res.data.data.forEach((item) => {
              lists.push(item)
            })

            commit(types.SET_CONVERSION_BOOK_LIST, lists)
            commit(types.SET_IS_DATA_STATE, !res.data.data.length)
            commit(types.SET_LOADING_STATE, false)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
          resolve()
        }
      })
    })
  },
  // 获取兑换书和物品详情info
  getConversionBookDetail ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/activity/get_exchange_detail.php',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          id: data.id
        },
        success: (res) => {
          if (res.data.ret === ret) {
            if (state.setTitleState) {
              uni.setNavigationBarTitle({
                title: res.data.data.title
              })
            }
            resolve(res.data.data)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 瓶盖兑换书本
  exchangeBook ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/activity/exchange_act.php',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          address: data.address,
          phone: data.phone,
          name: data.name,
          id: data.id
        },
        success: (res) => {
          if (res.data.ret === ret) {
            resolve(res.data)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取支付信息
  getWXPayInfo ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/wxpay/create_order.php',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          address: data.address,
          phone: data.phone,
          name: data.name,
          id: data.id
        },
        success: (res) => {
          if (res.data.ret === ret) {
            resolve(res.data)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 领取已抽中奖品 - 领取抢书中奖品
  getWinningGoods ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: data.orderType === 'grab' ? apiUrl + 'activity/give_updata_address.php' : apiUrl + '/lottery/lottery_updata_address.php',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          address: data.address,
          phone: data.phone,
          name: data.name,
          id: data.id
        },
        success: (res) => {
          if (res.data.ret === ret) {
            resolve(res.data)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取抢书配置信息
  getRobBookInfo ({ dispatch, commit, state }) {
    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/activity/give_conf.php',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || ''
        },
        success: (res) => {
          if (res.data.ret === ret) {
            let num = 0
            const data = res.data.data
            const timeState = data.time_state
            let itemLength = data.give_book_time_set.length
            if (itemLength - 1 === timeState) {
              num = 0
              itemLength -= 1
            } else if (data.give_book_time_set.length === 3) {
              num = 12
            } else {
              num = 10
            }
            data['schedule'] = timeState ? getPercent(timeState, itemLength) + num : 0
            resolve(data)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取抢书列表
  getRobBookList ({ dispatch, commit, state }, data) {
    commit(types.SET_IS_DATA_STATE, false)
    commit(types.SET_LOADING_STATE, true)

    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/activity/get_give_list.php',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          page: data.page
        },
        success: (res) => {
          if (res.data.ret === ret) {
            let lists = JSON.parse(JSON.stringify(state.robBookList))

            res.data.data.forEach((item) => {
              lists.push(item)
            })

            commit(types.SET_ROB_BOOK_LIST, lists)
            commit(types.SET_IS_DATA_STATE, !res.data.data.length)
            commit(types.SET_LOADING_STATE, false)
            resolve()
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取抢书详情
  getRobBookDetail ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/activity/give_book_detail.php',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          id: data.id
        },
        success: (res) => {
          if (res.data.ret === ret) {
            resolve(res.data.data)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 抢-想要书操作
  robWantBook ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + data.status ? '/activity/give_grab.php' : '/activity/give_want.php',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          id: data.id
        },
        success: (res) => {
          if (res.data.ret === ret) {
            resolve(res.data)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取中书记录
  getInTheBookList ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/activity/get_give.php',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          page: data.page,
          page_size: data.pageSize
        },
        success: (res) => {
          if (res.data.ret === ret) {
            res.data.data.forEach((item) => {
              item['grab_set_time'] = timestampToTime(item.grab_set_time)
            })
            commit(types.SET_IN_THE_BOOK_LIST, res.data.data)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
          resolve(res.data)
        }
      })
    })
  },
  // 获取用户的openID和sessionKey
  getWxlogin ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/activity/wx_session_key.php',
        header: {
          fromClient: deviceType
        },
        data: {
          code: data.code
        },
        success: (res) => {
          if (res.data.ret === ret) {
            resolve(res.data.data)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 解密手机号
  wxaes ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/activity/wxaes.php',
        header: {
          fromClient: deviceType
        },
        data: {
          iv: data.iv,
          sessionKey: data.sessionKey,
          encryptedData: data.encryptedData
        },
        success: (res) => {
          if (res.data.ret === ret) {
            resolve(res.data)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取短信code
  getCode ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/api/sms.php',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          mobile: data.telVal
        },
        success: (res) => {
          if (res.data.ret === ret) {
            resolve(res.data)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 绑定手机号码
  bindingMobile ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/userinfo/wx_bdmoible.php',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          mobile: data.telVal,
          code: data.codeVal,
          type: data.type
        },
        success: (res) => {
          if (res.data.ret === ret) {
            resolve(res.data)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 更新头像
  updateAvatar ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/activity/update_avatarurl.php',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          avatarurl: data.url
        },
        success: (res) => {
          if (res.data.ret === ret) {
            resolve(res.data)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 是否绑定手机号码
  isBindingMobile ({ dispatch, commit, state }) {
    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/userinfo/wx_is_bdmoible.php',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || ''
        },
        success: (res) => {
          if (res.data.ret === ret) {
            commit(types.SET_BING_PHONE_INFO, res.data.data)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
          resolve()
        }
      })
    })
  },
  // 获取是否设置了支付密码
  isSetPayPassword ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/User/checkPayPassword',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || ''
        },
        success: (res) => {
          if (res.data.code === code) {
            resolve(res.data.data)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 设置支付 - 修改密码
  onSetEditPayPassword ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: data.type === 'edit' ? newApiUrl + '/wx/User/updatePayPassword' : newApiUrl + '/wx/User/setPayPassword',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          password: data.password,
          new_password: data.confirm_password,
          old_password: data.old_password,
          confirm_password: data.new_password
        },
        success: (res) => {
          if (res.data.code === code) {
            data.type === 'edit' ? showToastFn('修改成功!') : showToastFn('设置密码成功!')
            resolve()
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取修改密码短信code
  getPsdCode ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/User/getVerifyPayPhoneCode',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          phone: data.telVal
        },
        success: (res) => {
          if (res.data.code === code) {
            resolve()
          } else {
            if (res.data.code === staleCode) signOut()
          }
          showToastFn(res.data.message)
        }
      })
    })
  },
  // 获取修改密码短信验证code
  getPsdCodeVerify ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/User/checkVerifyPayPhoneCode',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          phone: data.telVal,
          code: data.codeVal,
          new_password: data.newPasswordVal
        },
        success: (res) => {
          if (res.data.code === code) {
            resolve()
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 一级岗位分类
  getLevelOneJobList ({ dispatch, commit, state }) {
    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/job/wx_top_type.php',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || ''
        },
        success: (res) => {
          if (res.data.ret === ret) {
            commit(types.SET_LEVEL_ONE_JOB_LIST, res.data.data)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
          resolve()
        }
      })
    })
  },
  // 二级岗位分类
  getLevelTwoJobList ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/job/wx_two_type.php',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          catid: data.catid
        },
        success: (res) => {
          if (res.data.ret === ret) {
            resolve(res.data.data)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 添加岗位
  addJobInfo ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/userinfo/wx_update_info.php',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          job: data.job
        },
        success: (res) => {
          if (res.data.ret === ret) {
            resolve(res.data)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 是否选择岗位
  getSelectedJobInfo ({ dispatch, commit, state }) {
    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/job/wx_is_hasjob.php',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || ''
        },
        success: (res) => {
          if (res.data.ret === ret) {
            commit(types.SET_SELECTED_JOB_INFO, res.data.data)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
          resolve()
        }
      })
    })
  },
  // 添加-更新地址
  addUpdateAddress ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/userinfo/wx_update_address.php',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          province: data.regionLists[0],
          city: data.regionLists[1],
          area: data.regionLists[2],
          receiver: data.goodsVal,
          address: data.siteVal,
          mobile: data.telVal,
          id: data.id,
          page: 1
        },
        success: (res) => {
          if (res.data.ret === ret) {
            resolve(res.data)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 设置默认地址
  selectAddress ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/activity/set_address_default.php',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          id: data.id
        },
        success: (res) => {
          if (res.data.ret === ret) {
            resolve(res.data)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取默认地址
  getDefaultAddress ({ dispatch, commit, state }) {
    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/activity/get_address_default.php',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || ''
        },
        success: (res) => {
          if (res.data.ret === ret) {
            commit(types.SET_AFFIRM_SITE_INFO, res.data.data)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
          resolve()
        }
      })
    })
  },
  // 删除地址
  deletedAddressInfo ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/userinfo/wx_del_address.php',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          id: data.id
        },
        success: (res) => {
          if (res.data.ret === ret) {
            resolve(res.data)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取地址列表
  getAddressList ({ dispatch, commit, state }, data) {
    commit(types.SET_IS_DATA_STATE, false)
    commit(types.SET_LOADING_STATE, true)

    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/userinfo/wx_address.php',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid,
          page: data.page
        },
        success: (res) => {
          if (res.data.ret === ret) {
            let lists = JSON.parse(JSON.stringify(state.addressList))

            res.data.data.lists.forEach((item) => {
              lists.push(item)
            })

            commit(types.SET_ADDRESS_LIST, lists)
            commit(types.SET_IS_DATA_STATE, !res.data.data.lists.length)
            commit(types.SET_LOADING_STATE, false)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
          resolve()
        }
      })
    })
  },
  // 获取订单列表
  getOrderList ({ dispatch, commit, state }, data) {
    commit(types.SET_IS_DATA_STATE, false)
    commit(types.SET_LOADING_STATE, true)

    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/activity/get_orders_list.php',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          page: data.page,
          type: data.type,
          page_size: 10
        },
        success: (res) => {
          if (res.data.ret === ret) {
            let lists = JSON.parse(JSON.stringify(state.orderList))
            res.data.data.forEach((item) => {
              lists.push(item)
            })
            commit(types.SET_ORDER_LIST, lists)
            commit(types.SET_IS_DATA_STATE, !res.data.data.length)
            commit(types.SET_LOADING_STATE, false)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
          resolve()
        }
      })
    })
  },
  // 获取订单详情
  getOrderDetail ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/activity/get_orders_detial.php',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          id: data.id
        },
        success: (res) => {
          if (res.data.ret === ret) {
            res.data.data['ctime'] = getLocalTime(res.data.data.ctime * 1000)
            res.data.data['fh_time'] = res.data.data.fh_time ? getLocalTime(res.data.data.fh_time * 1000) : '待发货'
            resolve(res.data.data)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取瓶盖的收入和支出记录
  getBottleRecordList ({ dispatch, commit, state }, data) {
    commit(types.SET_IS_DATA_STATE, false)
    commit(types.SET_LOADING_STATE, true)

    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/activity/get_account_history.php',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          type: data.type,
          page: data.page,
          page_size: 10
        },
        success: (res) => {
          if (res.data.ret === ret) {
            let lists = JSON.parse(JSON.stringify(state.bottleRecordList))
            res.data.data.forEach((item) => {
              lists.push(item)
            })
            commit(types.SET_BOTTLE_RECORD_LIST, lists)
            commit(types.SET_IS_DATA_STATE, !res.data.data.length)
            commit(types.SET_LOADING_STATE, false)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
          resolve()
        }
      })
    })
  },
  // 每日任务完成状况列表
  getTaskCaseList ({ dispatch, commit, state }) {
    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/userinfo/wx_day_tsak.php',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || ''
        },
        success: (res) => {
          if (res.data.ret === ret) {
            let lists = JSON.parse(JSON.stringify(state.taskCaseList))
            res.data.data.lists.forEach((item) => {
              lists.push(item)
            })
            commit(types.SET_TASK_CASE_LIST, lists)
            resolve(res.data.data)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取连续新增瓶盖
  getBottleNum ({ dispatch, commit, state }) {
    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/activity/get_account_add.php',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || ''
        },
        success: (res) => {
          if (res.data.ret === ret) {
            resolve(res.data)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 成长记录
  getGrowthRecord ({ dispatch, commit, state }, data) {
    commit(types.SET_IS_DATA_STATE, false)
    commit(types.SET_LOADING_STATE, true)

    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/activity/get_grow_list.php',
        header: {
          fromClient: deviceType
        },
        data: {
          page: data.page,
          page_size: 10
        },
        success: (res) => {
          if (res.data.ret === ret) {
            let lists = JSON.parse(JSON.stringify(state.growhtRecordList))
            res.data.data.forEach((item) => {
              let items = getLocalTime(item.set_time * 1000).split('-')
              item['year'] = items[0]
              item['month'] = items[1]
              item['day'] = items[2]
              if (strlen(item.content) >= 82) {
                item['isLine'] = true
                item['lineState'] = true
              } else {
                item['isLine'] = false
                item['lineState'] = false
              }
              lists.push(item)
            })
            commit(types.SET_GROWHT_RECORD_LIST, lists)
            commit(types.SET_IS_DATA_STATE, !res.data.data.length)
            commit(types.SET_LOADING_STATE, false)
            resolve(res.data)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取推荐音频
  getRecommendMusic ({ dispatch, commit, state }) {
    return new Promise((resolve) => {
      uni.request({
        method: 'GET',
        url: apiUrl + '/activity/get_recommend_list.php',
        header: {
          fromClient: deviceType
        },
        success: (res) => {
          if (res.data.ret === ret) {
            resolve(res.data)
          } else {
            if (res.data.ret === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取收入支出明细
  getConsumeList ({ dispatch, commit, state }, data) {
    commit(types.SET_IS_DATA_STATE, false)
    commit(types.SET_LOADING_STATE, true)

    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/User/getUserConsume',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid,
          type: data.type,
          page: data.page
        },
        success: (res) => {
          if (res.data.code === code) {
            let lists = JSON.parse(JSON.stringify(state.consumeList))

            res.data.data.data.forEach((item) => {
              item['ctime'] = timestampToTime(item.ctime)
              item['pay_time'] = timestampToTime(item.pay_time)
              item['wx_price'] = (item.order_price - item.use_balance).toFixed(2)
              lists.push(item)
            })

            commit(types.SET_CONSUME_LIST, lists)
            commit(types.SET_IS_DATA_STATE, !res.data.data.data.length)
            commit(types.SET_LOADING_STATE, false)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
          resolve()
        }
      })
    })
  },
  // 获取提现记录
  getExtractCashList ({ dispatch, commit, state }, data) {
    commit(types.SET_IS_DATA_STATE, false)
    commit(types.SET_LOADING_STATE, true)

    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/user_withdrawal/getUserWithdrawalList',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid,
          page: data.page
        },
        success: (res) => {
          if (res.data.code === code) {
            let lists = JSON.parse(JSON.stringify(state.extractCashList))

            res.data.data.data.forEach((item) => {
              item['ctime'] = timestampToTime(item.ctime)
              lists.push(item)
            })

            commit(types.SET_EXTRACT_CASH_LIST, lists)
            commit(types.SET_IS_DATA_STATE, !res.data.data.data.length)
            commit(types.SET_LOADING_STATE, false)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
          resolve()
        }
      })
    })
  },
  // 获取讲师主页基本信息
  getLectureInfo ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/Activity_Author/authorIndex',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          uid: data.uid,
          id: data.id
        },
        success: (res) => {
          if (res.data.code === code) {
            resolve(res.data.data)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取讲师专题
  getLectureSubjectList ({ dispatch, commit, state }, data) {
    commit(types.SET_IS_DATA_STATE, false)
    commit(types.SET_LOADING_STATE, true)

    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/Activity_Author/authorSpecial',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          page: data.page,
          uid: data.uid,
          id: data.id
        },
        success: (res) => {
          if (res.data.code === code) {
            let lists = JSON.parse(JSON.stringify(state.lectureSubjectList))

            res.data.data.data.forEach((item) => {
              item['play'] = item.play >= 10000 ? Math.round((item.play / 10000) * 100) / 100 + '万' : item.play
              lists.push(item)
            })

            commit(types.SET_LECTURE_SUBJECT_LIST, lists)
            commit(types.SET_IS_DATA_STATE, !res.data.data.data.length)
            commit(types.SET_LOADING_STATE, false)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
          resolve(res.data)
        }
      })
    })
  },
  // 获取讲师音频
  getLectureMusicList ({ dispatch, commit, state }, data) {
    const allItem = state.allCurrentMusicItem

    commit(types.SET_LOADING_STATE, true)
    commit(types.SET_IS_DATA_STATE, false)

    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/Activity_Author/authorVoice',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          id: data.authorId,
          page: data.page,
          uid: data.uid
        },
        success: (res) => {
          if (res.data.code === code) {
            let lists = JSON.parse(JSON.stringify(state.lectureMusicList))

            res.data.data.forEach((item) => {
              allItem.id === item.vid && state.allPlaying ? item['playing'] = true : item['playing'] = false
              item['listType'] = 'lectureType'
              item['authorId'] = data.authorId
              item['page'] = data.page
              lists.push(item)
            })

            commit(types.SET_LOADING_STATE, false)
            commit(types.SET_LECTURE_MUSIC_LIST, lists)
            commit(types.SET_IS_DATA_STATE, !res.data.data.length)
            if (allItem.listType === 'lectureType' && allItem.authorId === data.authorId) commit(types.SET_ALL_MUSIC_LIST, lists)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
          resolve()
        }
      })
    })
  },
  // 获取我的关注列表
  getMyAttentionList ({ dispatch, commit, state }, data) {
    commit(types.SET_IS_DATA_STATE, false)
    commit(types.SET_LOADING_STATE, true)

    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/Attention/myAttention',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid,
          page: data.page
        },
        success: (res) => {
          if (res.data.code === code) {
            let lists = JSON.parse(JSON.stringify(state.myAttentionList))

            res.data.data.data.forEach((item) => {
              lists.push(item)
            })

            commit(types.SET_MY_ATTENTION_LIST, lists)
            commit(types.SET_IS_DATA_STATE, !res.data.data.data.length)
            commit(types.SET_LOADING_STATE, false)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
          resolve()
        }
      })
    })
  },
  // 获取我的订阅列表
  getMySubscriptionList ({ dispatch, commit, state }, data) {
    commit(types.SET_IS_DATA_STATE, false)
    commit(types.SET_LOADING_STATE, true)

    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/Special_Sub/mySub',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid,
          page: data.page
        },
        success: (res) => {
          if (res.data.code === code) {
            let lists = JSON.parse(JSON.stringify(state.mySubscriptionList))

            res.data.data.data.forEach((item) => {
              item['ctime'] = getLocalTime(item.ctime * 1000)
              lists.push(item)
            })

            commit(types.SET_MY_SUBSCRIPTION_LIST, lists)
            commit(types.SET_IS_DATA_STATE, !res.data.data.data.length)
            commit(types.SET_LOADING_STATE, false)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
          resolve()
        }
      })
    })
  },
  // 获取我的课程列表
  getMyCourseList ({ dispatch, commit, state }, data) {
    commit(types.SET_IS_DATA_STATE, false)
    commit(types.SET_LOADING_STATE, true)

    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/special_order/getMySpecialList',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid,
          keywords: data.keywords,
          page: data.page
        },
        success: (res) => {
          if (res.data.code === code) {
            let lists = JSON.parse(JSON.stringify(state.myCourseList))

            res.data.data.data.forEach((item) => {
              item['learn_progress'] = parseInt(item.learn_progress)
              item['exchange_price'] = parseInt(item.exchange_price)
              lists.push(item)
            })

            commit(types.SET_MY_COURSE_LIST, lists)
            commit(types.SET_IS_DATA_STATE, !res.data.data.data.length)
            commit(types.SET_LOADING_STATE, false)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
          resolve()
        }
      })
    })
  },
  // 获取课程详情
  getCourseInfo ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/special_order/getMySpecialDetail',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid,
          id: data.id
        },
        success: (res) => {
          if (res.data.code === code) {
            res.data.data['pay_time'] = timestampToTime(res.data.data.pay_time)
            res.data.data['ctime'] = timestampToTime(res.data.data.ctime)
            res.data.data['exchange_price'] = parseInt(res.data.data.exchange_price)
            res.data.data['wx_price'] = (res.data.data.price - res.data.data.use_balance).toFixed(2)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
          resolve(res.data.data)
        }
      })
    })
  },
  // 我的课程-放弃邀请任务
  concernCourseTask ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/special_order/giveUpMyTask',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          id: data.id
        },
        success: (res) => {
          if (res.data.code === code) {
            resolve()
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取规则信息
  getRuleInfo ({ dispatch, commit, state }) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/simple/getRule',
        header: {
          fromClient: deviceType
        },
        success: (res) => {
          if (res.data.code === code) {
            resolve(res.data.data)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取抢学费分享标题title
  getShareText ({ dispatch, commit, state }) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/simple/getShareText',
        header: {
          fromClient: deviceType
        },
        success: (res) => {
          if (res.data.code === code) {
            resolve(res.data.data)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 显示免费领取课程弹窗
  getFreeSubject ({ dispatch, commit, state }) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/job_collection_free/getOne',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          status: 0
        },
        success: (res) => {
          if (res.data.code === code) {
            resolve(res.data.data)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 取消免费领取课程
  cancelFreeSubject ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/job_collection_free/delete',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          id: data.id
        },
        success: (res) => {
          if (res.data.code === code) {
            resolve(res.data)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取首页分类精品课列表
  getClassifySubjectGoodsList ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/job_collection/recommend',
        header: {
          fromClient: deviceType
        },
        data: {
          catid: data.catid,
          all: data.type
        },
        success: (res) => {
          if (res.data.code !== code) showToastFn(res.data.message)
          resolve(res.data.data)
        }
      })
    })
  },
  // 获取精品课分类标签
  getSubjectGoodsLabel({ dispatch, commit, state }){
    return new Promise((resolve) => {
			uni.request({
			  method: 'POST',
			  url: newApiUrl + '/wx/job_category/getList',
        header: {
          fromClient: deviceType
        },
			  success: (res) => {
			    if (res.data.code === code) {
			      resolve(res.data.data)
			    } else {
			      showToastFn(res.data.message)
			    }
			  }
			})
		})
  },
  // 获取精品课合集列表
  getSubjectGoodsList ({ dispatch, commit, state }, data) {
		return new Promise((resolve) => {
			uni.request({
			  method: 'POST',
			  url: newApiUrl + '/wx/job_collection/getList',
        header: {
          fromClient: deviceType
        },
				data: {
					openid: state.userInfo.openid || '',
					collection_id: data.id
				},
			  success: (res) => {
			    if (res.data.code === code) {
			      res.data.data.forEach((item) => {
			        item['secondLevelIndex'] = 0
			      })
			      resolve(res.data.data)
			    } else {
            if (res.data.code === staleCode) signOut()
			      showToastFn(res.data.message)
			    }
			  }
			})
		})
  },
  // 免费领取课程
  freeOfChargeGetCourse ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/job_collection_free/create',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          job_collection_id: data.job_collection_id,
          special_id: data.special_id
        },
        success: (res) => {
          if (res.data.code === code) {
            resolve()
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取私信未读总数
  getNoReadCount ({ dispatch, commit, state }) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/message/noReadCount',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || ''
        },
        success: (res) => {
          if (res.data.code === code) {
            resolve(res.data.data)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取发送人私信列表
  getFromUserLis ({ dispatch, commit, state }, data) {
    commit(types.SET_IS_DATA_STATE, false)
    commit(types.SET_LOADING_STATE, true)

    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/message/getFromUserList',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          page: data.page
        },
        success: (res) => {
          let lists = JSON.parse(JSON.stringify(state.messageFromUserList))

          if (res.data.code === code) {
            res.data.data.data.forEach((item) => {
              item['ctime'] = getLocalTime(item.ctime * 1000)
              item['operateState'] = false
              if (state.userInfo.user_id === item.from_uid) item['status'] = 1
              lists.push(item)
            })

            commit(types.SET_MESSAGE_FROM_USER_LIST, lists)
            commit(types.SET_IS_DATA_STATE, !res.data.data.data.length)
            commit(types.SET_LOADING_STATE, false)
            resolve()
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 标记私信全部成已读
  setReadMessage ({ dispatch, commit, state }) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/message/setRead',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || ''
        },
        success: (res) => {
          if (res.data.code === code) {
            resolve()
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 清除聊天记录 - 移除会话
  removeFromUser ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: data.state ? newApiUrl + '/wx/message/deleteBatchRecord' : newApiUrl + '/wx/message/removeFromUser',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          from_uid: data.id
        },
        success: (res) => {
          if (res.data.code === code) {
            resolve()
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取私信列表
  getMessageReadList ({ dispatch, commit, state }, data) {
    commit(types.SET_IS_DATA_STATE, false)
    commit(types.SET_LOADING_STATE, true)

    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/message/readList',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          from_uid: data.id,
          page: data.page
        },
        success: (res) => {
          let lists = JSON.parse(JSON.stringify(state.messageReadList))

          if (res.data.code === code) {
            res.data.data.data.forEach((item) => {
              item['ctime'] = timestampToTime(item.ctime)
              item['operateState'] = false
              lists.unshift(item)
            })

            commit(types.SET_MESSAGE_READ_LIST, lists)
            commit(types.SET_IS_DATA_STATE, !res.data.data.data.length)
            commit(types.SET_LOADING_STATE, false)
            resolve()
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 批量标记已读私信
  markerMessageRead ({ dispatch, commit, state }, data) {
    commit(types.SET_IS_DATA_STATE, false)
    commit(types.SET_LOADING_STATE, true)

    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/message/batchRead',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          from_uid: data.id
        },
        success: (res) => {
          resolve(res.data)
        }
      })
    })
  },
  // 删除私信
  deleteOneRecord ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/message/deleteOneRecord',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          type: data.item.type,
          id: data.item.id
        },
        success: (res) => {
          if (res.data.code === code) {
            resolve()
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 发送私信
  onSendMessage ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/message/send',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          content: data.content,
          to_uid: data.id
        },
        success: (res) => {
          if (res.data.code === code) {
            res.data.data.forEach((item) => {
              item['ctime'] = timestampToTime(item.ctime)
              item['operateState'] = false
            })
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
          resolve(res.data)
        }
      })
    })
  },
  // 获取讲师橱窗商品列表
  getAuthorWindowGoodsList ({ dispatch, commit, state }, data) {
    commit(types.SET_IS_DATA_STATE, false)
    commit(types.SET_LOADING_STATE, true)

    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/window/authorWindow',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          au_id: data.id,
          page: data.page,
          sort: data.sort
        },
        success: (res) => {
          let lists = JSON.parse(JSON.stringify(state.authorWindowGoodsList))

          if (res.data.code === code) {
            res.data.data.data.forEach((item) => {
              lists.push(item)
            })

            commit(types.SET_AUTHOR_WINDOW_GOODS_LIST, lists)
            commit(types.SET_IS_DATA_STATE, !res.data.data.data.length)
            commit(types.SET_LOADING_STATE, false)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
          resolve(res.data.data)
        }
      })
    })
  },
  // 获取讲师搜索商品列表
  getAuthorSearchGoodsList ({ dispatch, commit, state }, data) {
    commit(types.SET_IS_DATA_STATE, false)
    commit(types.SET_LOADING_STATE, true)

    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/window/searchWindow',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          keyword: data.keyword,
          page: data.page
        },
        success: (res) => {
          let lists = JSON.parse(JSON.stringify(state.authorSearchGoodsList))

          if (res.data.code === code) {
            if (res.data.data) {
              res.data.data.data.forEach((item) => {
                lists.push(item)
              })
            }

            commit(types.SET_AUTHOR_SEARCH_GOODS_LIST, lists)
            commit(types.SET_IS_DATA_STATE, res.data.data ? !res.data.data.data.length : true)
            commit(types.SET_LOADING_STATE, false)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
          resolve()
        }
      })
    })
  },
  // 获取讲师橱窗商品详情
  getAuthorWindowGoodsDetails ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/window/detail',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          id: data.id
        },
        success: (res) => {
          if (res.data.code === code) {
            resolve(res.data.data)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取咨询信息
  getConsultInfo ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/consult/getInfo',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          au_id: data.id
        },
        success: (res) => {
          if (res.data.code === code) {
            dispatch('setActivityActRecord', { oJson: res.data.data, type: 4 })
            if (res.data.data.order_info) res.data.data.order_info['pay_time'] = timestampToTime(res.data.data.order_info.pay_time)
            resolve(res.data.data)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取首页视频列表
  getIndexVideoList ({ dispatch, commit, state }, data) {
    commit(types.SET_IS_DATA_STATE, false)
    commit(types.SET_LOADING_STATE, true)

    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/home/getVideo',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          page: data.page
        },
        success: (res) => {
          let lists = JSON.parse(JSON.stringify(state.indexVideoList))

          if (res.data.code === code) {
            res.data.data.forEach((item) => {
              item['playState'] = false
              item['duration'] = timeToMinute(item.duration)
              lists.push(item)
            })
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }

          commit(types.SET_INDEX_VIDEO_LIST, lists)
          commit(types.SET_IS_DATA_STATE, !res.data.data.length)
          commit(types.SET_LOADING_STATE, false)
          resolve()
        }
      })
    })
  },
  // 获取首页视频详情
  getVideoDetails ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/video/getInfo',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          id: data.id
        },
        success: (res) => {
          if (res.data.code === code) {
            res.data.data['id'] = data.id
            res.data.data['mark'] = false
            res.data.data['duration'] = timeToMinute(res.data.data.duration)

            if (state.setTitleState) {
              uni.setNavigationBarTitle({
                title: res.data.data.title
              })
            }
            resolve(res.data.data)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取专题内容视频列表
  getSpecialVideoList ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/special/getList',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          id: data.id
        },
        success: (res) => {
          if (res.data.code === code) {
            res.data.data.data.forEach((item) => {
              item['duration'] = timeToMinute(item.duration)
            })
            resolve(res.data.data)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取专题为你推荐列表
  getSimilarList ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/special/getSimilarList',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          id: data.id
        },
        success: (res) => {
          if (res.data.code === code) {
            resolve(res.data.data)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取讲师中心和专题详情页广告
  getAdvertisingInfo ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/advertising/systemUserAd',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          au_id: data.au_id,
          special_id: data.id || '',
          location: data.location
        },
        success: (res) => {
          if (res.data.code === code) {
            resolve(res.data.data)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 保存个人资料的介绍/昵称等
  isMyDataInfo ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/user/setByParam',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid,
          field: data.field,
          value: data.field === 'address' || data.field === 'auto_play' ? JSON.stringify(data.infoVal) : data.infoVal
        },
        success: (res) => {
          if (res.data.code === code) {
            resolve(res.data.data)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 一级职业分类
  getOneTypeOccupationList ({ dispatch, commit, state }) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/occupation/getTopType',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || ''
        },
        success: (res) => {
          if (res.data.code === code) {
            commit(types.SET_ONE_TYPE_OCCUPATION_LIST, res.data.data)
            resolve()
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 二级职业分类
  getTwoTypeOccupationList ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/occupation/getTwoType',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid || '',
          catid: data.catid
        },
        success: (res) => {
          if (res.data.code === code) {
            resolve(res.data.data)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 添加工作经历
  isWorkInfo ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/experience/add',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid,
          company: data.companyVal,
          office: data.officeVal,
          word_des: data.postVal,
          start_time: data.dateStart,
          end_time: data.dateEnd
        },
        success: (res) => {
          if (res.data.code === code) {
            resolve(res.data.data)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取工作经历
  getWorkInfo ({ dispatch, commit, state }) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/experience/index',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid
        },
        success: (res) => {
          if (res.data.code === code) {
            if (res.data.data) {
              res.data.data['start_time'] = getLocalTime(res.data.data.start_time * 1000)
              res.data.data['end_time'] = getLocalTime(res.data.data.end_time * 1000)
              commit(types.SET_WORK_INFO, res.data.data)
            }
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
          resolve(res.data.data)
        }
      })
    })
  },
  // 添加教育经历
  isEducationInfo ({ dispatch, commit, state }, data) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/education/add',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid,
          school: data.schoolVal,
          specialty: data.specialtyVal,
          culture: data.cultureVal,
          start_time: data.dateStart,
          end_time: data.dateEnd
        },
        success: (res) => {
          if (res.data.code === code) {
            resolve(res.data.data)
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
        }
      })
    })
  },
  // 获取教育经历
  getEducationInfo ({ dispatch, commit, state }) {
    return new Promise((resolve) => {
      uni.request({
        method: 'POST',
        url: newApiUrl + '/wx/education/index',
        header: {
          fromClient: deviceType
        },
        data: {
          openid: state.userInfo.openid
        },
        success: (res) => {
          if (res.data.code === code) {
            if (res.data.data) {
              res.data.data['start_time'] = getLocalTime(res.data.data.start_time * 1000)
              res.data.data['end_time'] = getLocalTime(res.data.data.end_time * 1000)
              commit(types.SET_EDUCATION_INFO, res.data.data)
            }
          } else {
            if (res.data.code === staleCode) signOut()
            showToastFn(res.data.message)
          }
          resolve(res.data.data)
        }
      })
    })
  }
}
// 时间戳转常规时间
function getLocalTime (time) {
  const date = new Date(parseInt(time))
  const Y = date.getFullYear() + '-'
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
  return (Y + M + D)
}
// 时间戳转常规时间到(时分秒)
function timestampToTime (time) {
  const date = new Date(time * 1000)
  const Y = date.getFullYear() + '-'
  const M = padding(date.getMonth() + 1, 2) + '-'
  const D = padding(date.getDate(), 2) + ' '
  const h = padding(date.getHours(), 2) + ':'
  const m = padding(date.getMinutes(), 2) + ':'
  const s = padding(date.getSeconds(), 2)
  return Y + M + D + h + m + s
}
// 填充截取法
function padding (num, length) {
  // 这里用slice和substr均可
  return (Array(length).join('0') + num).slice(-length)
}
// 计算字符串的长度
function strlen (str) {
  let len = 0
  for (let i = 0; i < str.length; i++) {
    let c = str.charCodeAt(i)
    if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
      len++
    } else {
      len += 2
    }
  }
  return len
}
// 百分比计算
function getPercent (num, total) {
  if (num && total) {
    num = parseFloat(num)
    total = parseFloat(total)
    return (Math.round(num / total * 10000) / 100.00)
  }
}
// 秒转分钟
function timeToMinute (times) {
  let t
  if (times > -1) {
    const min = Math.floor(times / 60) % 60
    const sec = times % 60
    if (min < 10) {
      t = '0'
    }
    t += min + ':'
    if (sec < 10) {
      t += '0'
    }
    t += sec.toFixed(2)
  }
  t = t.substring(0, t.length - 3)
  return t
}
// 时间倒计时
function timeDown (endDateStr) {
  endDateStr = endDateStr.replace(/-/g, '/')
  // 结束时间
  const endDate = new Date(endDateStr)
  // 当前时间
  const nowDate = new Date()
  // 相差的总秒数
  const totalSeconds = parseInt((endDate - nowDate) / 1000)
  // 天数
  const days = Math.floor(totalSeconds / (60 * 60 * 24))
  // 取模（余数）
  let modulo = totalSeconds % (60 * 60 * 24)
  // 小时数
  const hours = Math.floor(modulo / (60 * 60))
  modulo = modulo % (60 * 60)
  // 分钟
  const minutes = Math.floor(modulo / 60)
  // 秒
  const seconds = modulo % 60

  return days >= 0 ? { days, hours, minutes, seconds } : { days: 0, hours: 0, minutes: 0, seconds: 0 }
}
// 生成uuid
/* eslint-disable */
function guid () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r&0x3|0x8)
    return v.toString(16)
  })
}
/* eslint-disable */

function signOut() {
  store.commit('SET_USERINFO', '')
  uni.removeStorageSync('openid')
  uni.navigateTo({
    url: `/pages/login/index`
  })
}

function showToastFn (title) {
  uni.showToast({
    title,
    icon: 'none',
    duration: 2000
  })
}
