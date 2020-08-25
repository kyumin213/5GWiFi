import Vue from 'vue'
import App from './App'
import request from './util/request.js'
import linkTo from './util/linkTo.js'
import Language from './util/language.js'
import Language2 from './util/language2.js'
Vue.config.productionTip = false
App.mpType = 'app';
Vue.prototype.fnc = request;
Vue.prototype.get = request.get;
Vue.prototype.post = request.post;
Vue.prototype.linkTo = linkTo;
Vue.prototype.Language = Language;

// 语言切换
Vue.prototype._getLge = function(attribute){
	return Language2[uni.getStorageSync('lang')][attribute]
}
// 语言切换
Vue.prototype._lge = Language2

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
