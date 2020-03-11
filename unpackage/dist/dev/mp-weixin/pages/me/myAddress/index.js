(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pages/me/myAddress/index"],{

/***/ 254:
/*!***********************************************************************************************!*\
  !*** C:/Users/tizi-05/Desktop/uni_app_pgsw/main.js?{"page":"pages%2Fme%2FmyAddress%2Findex"} ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(createPage) {__webpack_require__(/*! uni-pages */ 4);__webpack_require__(/*! @dcloudio/uni-stat */ 5);

var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));
var _index = _interopRequireDefault(__webpack_require__(/*! ./pages/me/myAddress/index.vue */ 255));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}
createPage(_index.default);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["createPage"]))

/***/ }),

/***/ 255:
/*!**************************************************************************!*\
  !*** C:/Users/tizi-05/Desktop/uni_app_pgsw/pages/me/myAddress/index.vue ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_vue_vue_type_template_id_3e51d1fe_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=3e51d1fe&scoped=true& */ 256);
/* harmony import */ var _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js& */ 258);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _index_vue_vue_type_style_index_0_id_3e51d1fe_lang_stylus_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index.vue?vue&type=style&index=0&id=3e51d1fe&lang=stylus&scoped=true& */ 260);
/* harmony import */ var _D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ 15);

var renderjs





/* normalize component */

var component = Object(_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _index_vue_vue_type_template_id_3e51d1fe_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _index_vue_vue_type_template_id_3e51d1fe_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "3e51d1fe",
  null,
  false,
  _index_vue_vue_type_template_id_3e51d1fe_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"],
  renderjs
)

/* hot reload */
if (false) { var api; }
component.options.__file = "C:/Users/tizi-05/Desktop/uni_app_pgsw/pages/me/myAddress/index.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 256:
/*!*********************************************************************************************************************!*\
  !*** C:/Users/tizi-05/Desktop/uni_app_pgsw/pages/me/myAddress/index.vue?vue&type=template&id=3e51d1fe&scoped=true& ***!
  \*********************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_16_0_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_template_id_3e51d1fe_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--16-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./index.vue?vue&type=template&id=3e51d1fe&scoped=true& */ 257);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_16_0_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_template_id_3e51d1fe_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_16_0_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_template_id_3e51d1fe_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_16_0_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_template_id_3e51d1fe_scoped_true___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_16_0_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_template_id_3e51d1fe_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ 257:
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--16-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!C:/Users/tizi-05/Desktop/uni_app_pgsw/pages/me/myAddress/index.vue?vue&type=template&id=3e51d1fe&scoped=true& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return recyclableRender; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "components", function() { return components; });
var components
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ 258:
/*!***************************************************************************************************!*\
  !*** C:/Users/tizi-05/Desktop/uni_app_pgsw/pages/me/myAddress/index.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--12-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./index.vue?vue&type=script&lang=js& */ 259);
/* harmony import */ var _D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 259:
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--12-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!C:/Users/tizi-05/Desktop/uni_app_pgsw/pages/me/myAddress/index.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;












































var _vuex = __webpack_require__(/*! vuex */ 12);

var _config = __webpack_require__(/*! ../../../api/config */ 21);function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};var ownKeys = Object.keys(source);if (typeof Object.getOwnPropertySymbols === 'function') {ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {return Object.getOwnPropertyDescriptor(source, sym).enumerable;}));}ownKeys.forEach(function (key) {_defineProperty(target, key, source[key]);});}return target;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}var LoadingMore = function LoadingMore() {return Promise.all(/*! import() | components/loadingMoreTemplate/index */[__webpack_require__.e("common/vendor"), __webpack_require__.e("components/loadingMoreTemplate/index")]).then(__webpack_require__.bind(null, /*! ../../../components/loadingMoreTemplate */ 541));};var _default =

{
  data: function data() {
    return {
      upyunUrl: _config.upyunUrl,
      isAddressBack: false,
      page: 1 };

  },
  onLoad: function onLoad(options) {
    this.isAddressBack = options.isAddressBack;
  },
  onShow: function onShow() {
    this.getAddressListFn(true);
  },
  // 下拉刷新
  onPullDownRefresh: function onPullDownRefresh() {
    this.page = 1;
    this.getAddressListFn(true);
  },
  // 上拉加载
  onReachBottom: function onReachBottom() {
    this.page += 1;
    this.getAddressListFn(false);
  },
  computed: _objectSpread({},
  (0, _vuex.mapState)([
  'userInfo',
  'addressList'])),


  methods: _objectSpread({},
  (0, _vuex.mapMutations)({
    setAffirmSiteInfo: 'SET_AFFIRM_SITE_INFO',
    setAddressList: 'SET_ADDRESS_LIST' }),

  (0, _vuex.mapActions)([
  'getAddressList',
  'selectAddress',
  'deletedAddressInfo']), {

    // 获取地址列表
    getAddressListFn: function getAddressListFn(isLoading) {
      var data = {
        that: this,
        page: this.page };

      if (isLoading) {
        this.page = 1;
        this.setAddressList([]);
      }
      uni.showNavigationBarLoading();
      this.getAddressList(data).then(function () {
        if (isLoading) uni.hideLoading();
        uni.hideNavigationBarLoading();
        uni.stopPullDownRefresh();
      });
    },
    // 删除地址列表
    onDeleteFn: function onDeleteFn(id, index) {
      var that = this;
      var data = {
        that: this,
        id: id };

      uni.showModal({
        content: '确定移除地址?',
        confirmColor: '#ff4040',
        success: function success(res) {
          if (res.confirm) {
            that.deletedAddressInfo(data).then(function (res) {
              if (res.ret === 1) {
                that.addressList.splice(index, 1);
                that.showToastFn('删除成功!');
              } else {
                that.showToastFn('删除失败!');
              }
            });
          }
        } });

    },
    // 选择地址
    onSelectAddressFn: function onSelectAddressFn(item) {
      var that = this;
      if (this.isAddressBack === 'true') {
        this.setAffirmSiteInfo(item);
        uni.showModal({
          content: '是否设置成默认地址?',
          cancelText: '否',
          confirmText: '是',
          confirmColor: '#e1564f',
          success: function success(res) {
            if (res.confirm) that.onSetDefaultAddressFn(item.id);
            uni.navigateBack();
          } });

      } else {
        this.onSetDefaultAddressFn(item.id);
      }
    },
    // 设置默认地址
    onSetDefaultAddressFn: function onSetDefaultAddressFn(id) {var _this = this;
      this.selectAddress({ that: this, id: id }).then(function () {
        _this.addressList.forEach(function (item) {
          if (id === item.id) {
            item.is_default = '1';
            if (_this.isAddressBack === 'false') _this.showToastFn('设置为默认地址');
          } else {
            item.is_default = '0';
          }
        });
      });
    },
    // 编辑地址
    onSkipPageFn: function onSkipPageFn() {var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      uni.navigateTo({
        url: "/pages/me/myAddress/addressDetails/index?data=".concat(JSON.stringify(data)) });

    },
    showToastFn: function showToastFn(title) {
      uni.showToast({
        title: title,
        icon: 'none',
        duration: 2000 });

    } }),

  components: {
    LoadingMore: LoadingMore } };exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 260:
/*!**************************************************************************************************************************************!*\
  !*** C:/Users/tizi-05/Desktop/uni_app_pgsw/pages/me/myAddress/index.vue?vue&type=style&index=0&id=3e51d1fe&lang=stylus&scoped=true& ***!
  \**************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_11_oneOf_1_1_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_index_js_ref_11_oneOf_1_2_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_3_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_stylus_loader_index_js_ref_11_oneOf_1_4_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_11_oneOf_1_5_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_style_index_0_id_3e51d1fe_lang_stylus_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!./node_modules/mini-css-extract-plugin/dist/loader.js??ref--11-oneOf-1-0!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--11-oneOf-1-1!./node_modules/css-loader??ref--11-oneOf-1-2!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--11-oneOf-1-3!./node_modules/stylus-loader??ref--11-oneOf-1-4!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--11-oneOf-1-5!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./index.vue?vue&type=style&index=0&id=3e51d1fe&lang=stylus&scoped=true& */ 261);
/* harmony import */ var _D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_11_oneOf_1_1_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_index_js_ref_11_oneOf_1_2_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_3_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_stylus_loader_index_js_ref_11_oneOf_1_4_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_11_oneOf_1_5_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_style_index_0_id_3e51d1fe_lang_stylus_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_11_oneOf_1_1_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_index_js_ref_11_oneOf_1_2_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_3_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_stylus_loader_index_js_ref_11_oneOf_1_4_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_11_oneOf_1_5_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_style_index_0_id_3e51d1fe_lang_stylus_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_11_oneOf_1_1_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_index_js_ref_11_oneOf_1_2_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_3_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_stylus_loader_index_js_ref_11_oneOf_1_4_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_11_oneOf_1_5_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_style_index_0_id_3e51d1fe_lang_stylus_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_11_oneOf_1_1_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_index_js_ref_11_oneOf_1_2_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_3_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_stylus_loader_index_js_ref_11_oneOf_1_4_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_11_oneOf_1_5_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_style_index_0_id_3e51d1fe_lang_stylus_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_11_oneOf_1_1_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_index_js_ref_11_oneOf_1_2_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_3_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_stylus_loader_index_js_ref_11_oneOf_1_4_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_11_oneOf_1_5_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_D_HBuilderX_HBuilderX_1_7_0_20190314_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_style_index_0_id_3e51d1fe_lang_stylus_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 261:
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--11-oneOf-1-0!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--11-oneOf-1-1!./node_modules/css-loader??ref--11-oneOf-1-2!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--11-oneOf-1-3!./node_modules/stylus-loader??ref--11-oneOf-1-4!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--11-oneOf-1-5!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!C:/Users/tizi-05/Desktop/uni_app_pgsw/pages/me/myAddress/index.vue?vue&type=style&index=0&id=3e51d1fe&lang=stylus&scoped=true& ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ })

},[[254,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/me/myAddress/index.js.map