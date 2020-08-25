// const baseUrl = 'http://8.129.172.166:7091/' //测试
const baseUrl = 'http://8.210.16.34/' //正式
const token = uni.getStorageSync('token');
const showLoading = (val) => {
	uni.showLoading({
		title: val
	})
}
const showToast = (val) => {
	uni.showToast({
		title: val,
		icon: "none"
	})
}


const createdPromise = (url, data = {}, method, loading = true) => {
	const token = uni.getStorageSync('token');
	const languageType = uni.getStorageSync('lang');
	return new Promise((resolve, reject) => {
		if (loading) {
			showLoading('加载中')
		};
		uni.request({
			url: baseUrl + url,
			method,
			data,
			header: {
				'token': token, //自定义请求头token信息
				'lang': languageType //自定义请求头token信息
			},
			success: (res) => {
				uni.hideLoading();
				if (res.data.code == 1005) {
					uni.removeStorageSync('token');
					uni.reLaunch({
						url: '/pages/index/guidePages/guidePages'
					})

				} else if (res.data.code !== 200) {
					console.log('报错了嘛')
					showToast(res.data.message);
				} else {
					uni.hideLoading();
					resolve(res);
				}
			},
			fail: (err) => {
				uni.hideLoading();
				reject(err)
			}
		})
	});
}

const get = (url, data,loading) => {
	return createdPromise(url, data,'GET',loading);
}
const post = (url, data) => {
	return createdPromise(url, data, 'POST');
}

// let $request = (url, method = 'GET') => {
// 	return new Promise((resolve, reject) => {
// 		uni.request({
// 			url,
// 			method,
// 			header: {
// 				'token': token,//自定义请求头token信息
// 		 'lang': languageType 
// 			},
// 			success: (res) => {
// 				resolve(res)
// 			},
// 			fail: (err) => {
// 				reject(err)
// 			}
// 		})
// 	})
// }
export default {
	// $request,
	get,
	post
}
