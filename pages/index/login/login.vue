<template>
	<view class="container">
		<tab-top left-icon="back" :title="languageInfo.loginPlsase"></tab-top>
		<view class="content">
			<view>
				<text class="txtItem">{{languageInfo.enterUserName}}</text>
			</view>
			<view>
				<input type="text" v-model="userName" class="inp" :placeholder="languageInfo.enterUserName">
			</view>
			<view class="mt50">
				<text class="txtItem">{{languageInfo.enterPwd}}</text>
			</view>
			<view>
				<input type="password" v-model="pwd" class="inp" :placeholder="languageInfo.enterPwd">
			</view>
			<!-- 图形码 -->
			<!-- 		<view class="mt50">
				<text class="txtItem">请输入图形验证码</text>
			</view>
			<view class="flexCode">
				<input type="text" v-model="imgCode" class="inp codeInp" placeholder="请输入图形验证码">
				<view>
					<image class="codeIcon" :src="codeImgs" @tap="refCode"></image>
				</view>
			</view> -->
			<!-- 记住密码 -->
			<view class="pwdBox">
				<view class="itemLeft">
					<label class="remIcon" @tap="selectRem">
						<label class='remSelect' v-show="rememberStatus"></label>
					</label>
					<text class="remTxt">{{languageInfo.rememberPassword}}</text>
				</view>
				<view @tap="goTo('../forgetPwd/forgetPwd')">
					<text class="forgetTxt">{{languageInfo.forgetPassword}}</text>
				</view>
			</view>
			<!-- 按钮 -->
			<view class="btnBox">
				<button class="btns" hover-class="none" type="submit" @tap="logoSubmit">{{languageInfo.logIn}}</button>
				<button hover-class="none" class="btns mt30" @tap="goTo('../register/register')">{{languageInfo.registered}}</button>
			</view>
		</view>
	</view>
</template>

<script>
	import tabTop from '@/components/tabTop.vue'
	var _this;
	export default {
		data() {
			return {
				rememberStatus: true, //记住密码
				userName: '', //用户名
				pwd: '', //密码
				imgCode: '', //图形码
				// codeImgs: 'http://8.129.172.166:7091/api/getCaptcha', //图形验证码测试
				// codeImgs: 'http://8.210.16.34/api/getCaptcha', //图形验证码正式
				languageInfo: {} //语言包
			}
		},
		components: {
			tabTop
		},
		onLoad(option) {
			_this = this
			if (option.uid) {
				_this.userName = option.uid
			}
			// this.selectRem()
		},
		onShow() {
			let uids = uni.getStorageSync('uid')
			_this.userName = uids
			_this.languageInfo = this.linkTo.showLanguage();
			// this.refCode()
		},
		methods: {
			// 跳转
			goTo(url) {
				this.linkTo.navTo(url);
			},
			// 刷新图形码
			// getImgs(){
			// 	let ss = Math.random()
			// 	_this.codeImgs  = 'http://8.129.172.166:7091/api/getCaptcha?t='+ss //测试
			// 	// _this.codeImgs  = 'http://8.210.16.34/api/getCaptcha?t='+ss
			// },
			// 记住密码
			selectRem() {
				let rem = _this.rememberStatus
				let pwd = _this.pwd
				if (rem) {
					_this.rememberStatus = false
					// uni.removeStorageSync('pwd')

				} else {
					// uni.setStorageSync('pwd', pwd)
					_this.rememberStatus = true
				}
			},
			// 登录
			logoSubmit() {
				let names = _this.userName
				let pwds = _this.pwd
				uni.setStorageSync('pwd', pwds)
				// let code = _this.imgCode
				let data = {
					uid: names,
					password: pwds
					// code:code
				}
				if (names == '' || pwds == '') {
					_this.linkTo.$noToast(_this.languageInfo.informationEmpty)
					return
				} else {
					_this.post('api/login', data).then(res => {
						let token = res.data.res.token
						uni.setStorageSync('token', token)
						uni.setStorageSync('uid', names)
						uni.showToast({
							icon: 'success',
							duration: 1000
						})
						setTimeout(() => {
							uni.switchTab({
								url: '../index'
							})
						}, 1500)

					}).catch(err => {
						console.log(err)
					})
				}
			},
			// 获取图形验证码
			// refCode() {
			// 	let ss = Math.random()
			// 	_this.codeImgs  = 'http://8.129.172.166:7091/api/getCaptcha?t='+ss
			// 	// _this.codeImgs  = 'http://8.210.16.34/api/getCaptcha?t='+ss
			// }
		}
	}
</script>
<style lang="scss" scoped>
	.container {
		height: 100%;
		@include bg();
	}

	.mt50 {
		margin-top: 50rpx;
	}

	.mt30 {
		margin-top: 30rpx;
	}

	.content {
		padding: 0 30rpx 148rpx 30rpx;

		.txtItem {
			width: 100%;
			@include colF();
			@include font30();
		}

		.inp {
			@include borRadius();
			@include font26();
			@include borCol();
			@include mainCol();
			height: 80rpx;
			padding: 0 30rpx;
			margin-top: 30rpx;
		}

		.pwdBox {
			@include flexBet();
			margin-top: 32rpx;
		}

		.remTxt {
			@include font24();
			@include colF();
		}

		.forgetTxt {
			@include font24();
			@include mainCol();
		}

		.remIcon {
			@include borCol();
			display: inline-block;
			width: 22rpx;
			height: 22rpx;
			border-radius: 50%;
			margin-right: 10rpx;
			position: relative;
			text-align: center;
			position: relative;
		}

		.remSelect {
			display: inline-block;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 10rpx;
			height: 10rpx;
			background: #3CF8FF;
			border-radius: 50%;
		}

		.itemLeft {
			display: flex;
		}

		.flexCode {
			@include flexBet();

			.codeInp {
				width: 60%;
			}

			.codeIcon {
				width: 160rpx;
				height: 80rpx;
				margin-top: 30rpx;
			}
		}

		.btnBox {
			margin-top: 150rpx;

			.btns {
				@include borCol();
				@include font26();
				@include mainCol();
				border-radius: 30rpx;
				text-align: center;

			}
		}
	}
</style>
