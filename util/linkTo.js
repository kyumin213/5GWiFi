import Language from './language.js';
let navTo = (url, type = "pop-in") => {
	uni.navigateTo({
		url,
		animationType: type
	})
}


let backTo = (delta = 1, type = "pop-out") => {
	uni.navigateBack({
		url,
		delta,
		animationType: type
	})
}

let $noToast = (title, icon = "none") => {
	uni.showToast({
		title,
		icon
	})
}

let showLanguage = () => {
	let type = uni.getStorageSync('lang');
	let languageInfo;
	switch (type) {
		case 'zh-cn':
			languageInfo = Language.ChinaLanguage;
			break;
		case 'en-us':
			languageInfo = Language.EnglisghLanguage;
			break;
		case 'ko-kr':
			languageInfo = Language.KoreanLanguage;
			break;
		case 'ja-jp':
			languageInfo = Language.JapanLanguage;
			break;
		case 'th-th':
			languageInfo = Language.ThaiLanguage;
			break;
		case 'zh-tw':
			languageInfo = Language.TraditionalChineseLanguage;
			break;
		default:
			break;
	}
	return languageInfo;
}
let showHtml = (str) => { //富文本解析
	return str

		.replace(str ? /&(?!#?\w+;)/g : /&/g, '&amp;')

		.replace(/&amp;nbsp;/g, "")

		.replace(/&lt;/g, "<")

		.replace(/&gt;/g, ">")

		.replace(/&quot;/g, "\"")

		.replace(/&#39;/g, "\'")

}
// 手机号
// let validatePhone = (rule, value, callback) => {
// 	const reg = /^[1][3,4,5,7,8,9][0-9]{9}$/
// 	if (reg.test(value)) {
// 		callback()
// 	} else {
// 		callback(new Error('请输入正确的手机号'))
// 	}
// }

export default {
	navTo,
	backTo,
	showHtml,
	$noToast,
	showLanguage
}
