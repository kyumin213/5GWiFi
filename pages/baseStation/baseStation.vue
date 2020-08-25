<template>
	<view class="content">
		<!-- top -->
		<view class="headTop">
			<view class="leftTitle">
				<image class="logoIcon" src="../../static/baseStation/baseStationLogo.png"></image>
				<text class="logoTxt ml20">{{language['globalBaseStation']}}</text>
			</view>
			<view class="release fx">
				<image class="icon11" src="~@/static/index/icon11.png" @tap="baseList"></image>
			</view>
		</view>
		<!-- 通告栏 -->
		<view class="noticeBar">
			<an-notice-bar :switchTime="7" :text="noticeText" :showSerial="false"></an-notice-bar>
		</view>
		<!-- 资金池 -->
		<view class="capitalPool">
			<view class="capitalMain">
				<text class="title">{{language['fundPool']}}</text>
				<text class="count">{{capitalPoolNum}}</text>
				<text class="name">USDT</text>
			</view>
			<!-- 奖金池介绍标签 -->
			<view class="capitalLabel fx">
				<view class="cplLabelItem fx item1" @click="toCapital">
					<image class="cplIcon" src="../../static/baseStation/distribution.png"></image>
					<text class="cplText">{{language['fundDistribution']}}</text>
				</view>
				<view class="cplLabelItem fx" @tap="myLevelSearch">
					<image class="cplIcon" src="../../static/baseStation/level.png"></image>
					<text class="cplText">{{language['personalLevelQuery']}}</text>
				</view>
			</view>
		</view>
		<!-- 卡片项 -->
		<view class="cardList">
			<view class="cardItem" :style="{borderTop:index == 0?'none':''}" v-for="(item,index) in contentList" :key="item.id">
				<view class="cardTitle fx">
					<!-- <image class="titleIcon" :src="item.imgSrc"></image> -->
					<image class="titleIcon" src="../../static/baseStation/Alevel.png"></image>
					<text class="title">{{baseNameList[index] + ' ' + _getLge('levelModel')}}</text>
				</view>
				<image class="cardBorder" src="../../static/baseStation/borderBottom.png"></image>
				<view class="labelContent fx">
					<text class="label">{{language['sharedModule']}}:</text>
					<text class="value">{{item.usdt_num}} U</text>
				</view>
				<view class="labelContent fx">
					<text class="label">{{language['contractPeriod']}}:</text>
					<text class="value">{{item.cycle}} {{language['round']}}</text>
				</view>
				<view class="labelContent fx mb0">
					<text class="label">{{language['releaseCoefficient']}}:</text>
					<text class="value">{{item.sf_billie * 100}} %</text>
				</view>
				<button @click="autoShoot(item.base_name,item.usdt_num,item.id)" class="cardButton fx" type="default">
					<image src="../../static/baseStation/shout.png"></image>
					<text>{{language['automaticLaunch']}}</text>
				</button>
			</view>
		</view>
		<!-- 等级查询弹窗 -->
		<uni-popup ref="popup" type="center">
			<view class="modalBox" @click="closeModal" v-show="modelType == 'search'">
				<view class="modalCon" @click.stop="stopPropagation">
					<view class="title">
						<text>{{language['personalLevelQuery']}}</text>
					</view>
					<view>
						<input class="inp" v-model="userId" :placeholder="language['pleaseEnterUserID']">
					</view>
					<view @tap="searhLevelByUserId">
						<button class="btn">{{language['confirm']}}</button>
					</view>
					<view class="tc" @click="searchMyLevel">
						<text class="txtSearch">{{language['queryTheAccountLevel']}}</text>
					</view>
				</view>
			</view>
			<view class="modalBox" @click="closeModal" v-show="modelType == 'mine' || modelType == 'user'">
				<view class="modalCon" @click.stop="stopPropagation">
					<view class="title">
						<text>{{language['personalLevelQuery']}}</text>
					</view>
					<view class="fx tc levelNum">
						<view class="levelInfo fx">
							<text class="txtLevelShow" v-show="modelType == 'mine'">{{language['yourLevel']}} :</text>
							<text class="txtLevelShow" v-show="modelType == 'user'">{{userId}}{{language['level']}} :</text>
							<image class="levelV" src="../../static/baseStation/levelV.png"></image>
						</view>
						<text class="txtLevelNum">{{levelNum}}</text>
					</view>
					<view class="tc">
						<text class="text2" style="padding: 0 10rpx;">{{language['community']}}</text>
					</view>
					<view class="tc fx" style="justify-content: center;align-items: baseline;margin-bottom: 43rpx;">
						<text class="text3">{{communityCount}}</text>
						<text class="text4">{{language['people']}}</text>
					</view>
					<view @tap="closeModal">
						<button class="btn">{{language['confirm']}}</button>
					</view>
				</view>
			</view>
		</uni-popup>
		<!-- 自动发射弹窗 -->
		<uni-popup ref="popupShoot" type="center">
			<view class="modalBox" @click="closeShootModal">
				<view class="modalCon" @click.stop="stopPropagation">
					<view class="title">
						<text>{{language['tips']}}</text>
					</view>
					<view class="tc" style="margin-bottom: 30rpx;">
						<text class="text2" style="margin:50rpx 0 10rpx 0;">{{language['turnOnAutoLaunch']}} {{baseName}}</text>
						<text class="text2">{{language['contractSharingModule']}}</text>
					</view>
					<view class="tc fx" style="justify-content: center;align-items: baseline;margin-bottom: 43rpx;">
						<text class="text3">{{usdtNum * 4}}</text>
						<text class="text4">USDT</text>
					</view>
					<view @tap="confirmShoot">
						<button class="btn">{{language['confirm']}}</button>
					</view>
					<view @tap="closeShootModal">
						<button class="btn">{{language['cancel']}}</button>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import AnNoticeBar from '@/components/an-notice-bar/an-notice-bar.vue'
	export default {
		data() {
			return {
				baseNameList:['A','C','S','RS'],
				contentList: [{
						id: 1,
						base_name: 'A级模块',
						imgSrc: '../../static/baseStation/Alevel.png',
						usdt_num: '50',
						cycle: '30',
						sf_billie: '3',
					},
					{
						id: 2,
						base_name: 'C级模块',
						imgSrc: '../../static/baseStation/Clevel.png',
						usdt_num: '100',
						cycle: '30',
						sf_billie: '3',
					},
					{
						id: 3,
						base_name: 'S级模块',
						imgSrc: '../../static/baseStation/Slevel.png',
						usdt_num: '300',
						cycle: '30',
						sf_billie: '3',
					},
					{
						id: 4,
						base_name: 'RS级模块',
						imgSrc: '../../static/baseStation/RSlevel.png',
						usdt_num: '500',
						cycle: '30',
						sf_billie: '3',
					}
				],
				userId: '',
				modelType: 'mine', //弹窗的类型
				communityCount: 0, //社区人数
				levelNum: 0, //等级
				usdtNum: 0, //usdt数量
				baseName: '', //基站名称
				currentShootId: '', //当前打开的基站id
				capitalPoolNum: 0,
				noticeText: '',
				language:{}
			}
		},
		components: {
			AnNoticeBar
		},
		onShow() {
			this.language = this._lge[uni.getStorageSync('lang')]
			this.$forceUpdate()
			this.noticeText = ''
			// 基站列表
			this.get('api/baseStationList', {}).then(res => {
				if (res.data.code == 200) {
					this.contentList = res.data.res
				} else {
					this.linkTo.$noToast(res.data.message)
				}
			})
			// 资金池
			this.get('api/capitalPool', {}).then(res => {
				if (res.data.code == 200) {
					this.capitalPoolNum = res.data.res.num
				} else {
					this.linkTo.$noToast(res.data.message)
				}
			})
			// 公告
			this.get('api/affiche', {page:1,rowNum:100}).then(res => {
				if (res.data.code == 200) {
					let data = res.data.res.data
					data.map((item,index)=>{
							this.noticeText += `${this.language['congratulations']} ${item.uid} ${this.language['user']},${this.language['upgradeTo']} V${item.type}`
						if(index != data.length){
							this.noticeText+='|'
						}
					})
				} else {
					this.linkTo.$noToast(res.data.message)
				}
			})
		},
		methods: {
			toCapital() {
				this.linkTo.navTo('./capitalDistribution/capitalDistribution')
			},
			// 基站列表
			baseList(){
				this.linkTo.navTo('./baseList/baseList')
			},
			myLevelSearch() {
				this.modelType = 'search'
				this.$refs.popup.open()
			},
			searhLevelByUserId() {
				if (this.userId == '') {
					this.linkTo.$noToast(this._getLge('pleaseEnterUserID'))
					return
				}
				this.get('api/gradeQuery', {
					uid: this.userId
				}).then(res => {
					if (res.data.code == 200) {
						let data = res.data.res
						this.levelNum = data.level
						this.communityCount = data.num
						// 验证通过 查询等级
						this.modelType = 'user'
					} else {
						this.linkTo.$noToast(res.data.message)
					}
				})
			},
			searchMyLevel() {
				// 查询本人等级
				let uid = uni.getStorageSync('uid')
				this.get('api/gradeQuery', {
					uid: uid
				}).then(res => {
					if (res.data.code == 200) {
						let data = res.data.res
						this.levelNum = data.level
						this.communityCount = data.num
						this.modelType = 'mine'
					} else {
						this.linkTo.$noToast(res.data.message)
					}
				})
			},
			autoShoot(name, usdt, id) {
				this.baseName = name
				this.usdtNum = usdt
				this.currentShootId = id
				this.$refs.popupShoot.open()
			},
			closeShootModal() {
				this.$refs.popupShoot.close()
			},
			confirmShoot() {
				this.post('api/buyBaseStation', {
					id: this.currentShootId
				}).then(res => {
					console.log(res);
					if (res.data.code == 200) {
						let data = res.data.res
						uni.showToast({
							icon: 'success',
							duration: 1000,
							title:this._getLge('launchWasSuccessful')
						})
						this.$refs.popupShoot.close()
					} else {
						this.linkTo.$noToast(res.data.message)
					}
				})
			},
			// 关闭弹窗
			closeModal(e) {
				let _this = this
				this.$refs.popup.close()
				_this.userId = ''
			},
			stopPropagation(e) {
				e.stopPropagation()
			}
		}
	}
</script>

<style scoped lang="scss">
	.ml20 {
		margin-left: 20rpx;
	}

	.mb0 {
		margin-bottom: 0 !important;
	}

	.fx {
		display: flex;
		flex-direction: row;
	}

	.tc {
		text-align: center;
	}

	.content {
		@include bg();
		height: 100%;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;

		
		.headTop {
			position: fixed;
			top: 0;
			width: 100%;
			height: calc(var(--status-bar-height) + 100rpx);
			padding-top: calc(var(--status-bar-height) + 50rpx);
			padding-left: 30rpx;
			padding-bottom: 40rpx;
			padding-right: 28rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: space-between;
			z-index: 10;
			background: #0d1424;
			.leftTitle{
				display: flex;
				align-items: center;
				
			}
			.release{
				justify-content: center;
				align-items: center;
				.icon1 {
					width: 44rpx;
					height: 48rpx;
				}
				text{
					display: block;
					margin-left: 15rpx;
					font-size: 28rpx;
					color: #3CF8FF;
				}
			}
		}
		.icon11{
			width: 44rpx;
			height: 48rpx;
		}
		.logoIcon {
			width: 40rpx;
			height: 40rpx;
		}

		.logoTxt {
			font-size: 35rpx;
			@include colF();
			font-weight: bold;
		}

		.noticeBar {
			padding: 0 20rpx;
		}


		.capitalPool {
			.capitalMain {
				width: 325rpx;
				height: 335rpx;
				background: url('../../static/baseStation/shield.png');
				background-size: 100% 100%;
				background-repeat: no-repeat;
				margin: 0 auto;
				margin-bottom: 14rpx;
				display: flex;
				flex-direction: column;
				align-items: center;

				.title {
					font-size: 24rpx;
					margin-top: 104rpx;
					margin-bottom: 19rpx;
					color: #FFFFFF;
				}

				.count {
					font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
					font-size: 48rpx;
					margin-bottom: 4rpx;
					font-weight: 800;
					background: linear-gradient(to bottom, #3CF7FF, #009AF0);
					-webkit-background-clip: text;
					color: transparent;
				}

				.name {
					font-size: 24rpx;
					background: linear-gradient(to bottom, #3CF7FF, #009AF0);
					-webkit-background-clip: text;
					color: transparent;
				}
			}

			.capitalLabel {
				justify-content: center;
				margin-bottom: 40rpx;
			}

			.item1 {
				margin-right: 51rpx;
			}

			.cplLabelItem {
				align-items: center;

				.cplIcon {
					width: 44rpx;
					height: 48rpx;
					margin-right: 12rpx;
				}

				.cplText {
					color: #FFFFFF;
					font-size: 24rpx;
				}
			}
		}

		.cardList {
			flex: 1;
			min-height: 100rpx;
			overflow: auto;
			padding: 0 0 10rpx 0;
			margin: 0 20rpx;
			border-top-left-radius: 10rpx;
			border-top-right-radius: 10rpx;
			border-top: 1px solid #3BF7FF;

			.cardItem {
				border-radius: 10rpx;
				border: 1px solid #3BF7FF;
				padding: 40rpx;
				position: relative;
				margin-bottom: 10rpx;

				.cardTitle {
					height: 69rpx;
					align-items: center;
					padding-bottom: 20rpx;

					.titleIcon {
						width: 46rpx;
						height: 49rpx;
						margin: 20rpx;
					}

					.title {
						font-size: 30rpx;
						color: #3BF7FF;
					}
				}

				.cardBorder {
					height: 2rpx;
					margin-bottom: 30rpx;
				}

				.labelContent {
					font-size: 24rpx;
					margin-bottom: 19rpx;

					.label {
						color: #3BF7FF;
						margin-right: 11rpx;
					}

					.value {
						color: #FFFFFF;
					}
				}

				.cardButton {
					min-width: 180rpx;
					height: 44rpx;
					position: absolute;
					bottom: 43rpx;
					right: 41rpx;
					padding: 0 10rpx;
					line-height: inherit;
					align-items: center;
					justify-content: center;
					background: linear-gradient(to bottom, #3CF7FF, #009AF0);
					border-radius: 22rpx;

					image {
						width: 28rpx;
						height: 28rpx;
						margin-right: 11rpx;
					}

					text {
						font-size: 19rpx;
					}
				}
			}
		}

		// 弹窗
		.modalBox {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: rgba(0, 0, 0, .7);
			z-index: 9;
		}

		.modalCon {
			@include borCol();
			border-radius: 10rpx;
			background: #021628;
			position: absolute;
			top: 50%;
			left: 154rpx;
			right: 154rpx;
			transform: translateY(-50%);
			padding-bottom: 49rpx;
			z-index: 10;

			.title {
			@include font30();
				@include colF();
				height: 90rpx;
				line-height: 90rpx;
				background-color: #042848;
				text-align: center;
				border-top: 2rpx solid #3CF8FF;
				border-bottom: 2rpx solid #3CF8FF;
			}

			.inp {
				@include font24();
				margin: 20rpx 40rpx;
				height: 60rpx;
				line-height: 54rpx;
				background-color: #0E1725;
			}

			.btn {
				height: 60rpx;
				line-height: 54rpx;
				@include borCol();
				@include font24();
				@include colF();
				margin: 20rpx 40rpx;
				border-radius: 4rpx;
				position: inherit;
			}

			uni-button:after {
				position: relative;
			}

			.txtSearch {
				display: block;
				margin-top: 39rpx;
				color: #3CF8FF;
				@include font20();
			}

			.levelNum {
				justify-content: center;
				align-items: flex-end;
				margin-top: 30rpx;
				margin-bottom: 21rpx;

				.levelInfo {
					align-items: center;
					justify-content: center;

					.txtLevelShow {
						font-size: 24rpx;
						color: #3CF8FF;
					}

					.levelV {
						width: 39rpx;
						height: 42rpx;
						margin-left: 6rpx;
					}
				}

				.txtLevelNum {
					color: #3CF8FF;
					font-size: 30rpx;
					position: relative;
					left: 2rpx;
					top: 2rpx;
				}
			}

			.text2 {
				display: block;
				font-size: 22rpx;
				color: #FFFFFF;
				margin-bottom: 19rpx;
			}

			.text3 {
				display: block;
				font-size: 45rpx;
				color: #3CF8FF;
			}

			.text4 {
				font-size: 30rpx;
				color: #3CF8FF;
				margin-left: 4rpx;
			}
		}
	}
</style>
