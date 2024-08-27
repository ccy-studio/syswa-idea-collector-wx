<template>
	<view class="conatiner">
		<image v-if="!state.isRegister" class="logo" src="@/static/logo.png"></image>
		<button v-if="state.isLogin && !state.isRegister" class="btn" @click="onLoginClick"
			size="default">微信一键登录</button>
		<view v-if="state.isRegister" class="register-grup">
			<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
				<image class="avatar" :src="state.avatarUrl"></image>
			</button>
			<input @blur="onNicknameBlur" type="nickname" class="weui-input" v-model="state.nickName"
				placeholder="请输入昵称" />

			<button class="btn" @click="onRegisterClick" size="default">注册</button>
		</view>
	</view>
</template>

<script setup>
	import {
		reactive
	} from "vue";

	import {
		login,
		uploadImage,
		updateUserInfo,
		getCurrentUserInfo,
	} from "@/util/api.js"

	import {
		getAutoUserInfo,
		getLocalUserInfo,
		compareVersion,
		setLocalUserInfo
	} from "@/util/userinfo.js"

	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app";

	const state = reactive({
		isLogin: false,
		isRegister: false,
		nickName: "",
		avatarUrl: ""
	})

	onLoad(() => {
		login().then(res => {
			state.isLogin = true;
		}).catch(e => {
			console.error("登录失败", e);
			uni.showToast({
				title: "登录失败"
			})
		}).finally(() => {
			uni.hideLoading();
		})
	})


	const onChooseAvatar = (e) => {
		const {
			avatarUrl
		} = e.detail
		console.log(avatarUrl);
		state.avatarUrl = avatarUrl;
	}

	const onLoginClick = async () => {
		const version = uni.getSystemInfoSync().hostSDKVersion;
		if (compareVersion(version, "2.27.1") >= 0) {
			console.log("Version: ", version)
			let userInfo = getLocalUserInfo();
			if (!userInfo) {
				userInfo = await getCurrentUserInfo()
				if (!userInfo.nickName) {
					//需要用户输入账户信息
					state.isRegister = true
				} else {
					//跳转INDEX页面
					uni.reLaunch({
						url: '/pages/index/index'
					});
				}
			} else {
				//跳转INDEX页面
				uni.reLaunch({
					url: '/pages/index/index'
				});
			}
		} else {
			uni.showLoading({
				title: "登录中..."
			})
			//获取用户信息 旧版本基础库，新版不可用了
			getAutoUserInfo().then(rr => {
				console.log("用户信息获取成功:", rr);
				//跳转INDEX页面
				uni.reLaunch({
					url: '/pages/index/index'
				});
			}).catch(ee => {
				console.log("用户信息获取失败");
				uni.showToast({
					title: "登录失败"
				})
			}).finally(() => {
				uni.hideLoading();
			})
		}
	}

	const onNicknameBlur = (e) => {
		state.nickName = e.detail.value;
	}

	const onRegisterClick = () => {
		console.log(state);
		if (state.nickName.length == 0) {
			uni.showToast({
				icon: "fail",
				title: "请完善昵称"
			})
			return;
		}

		if (state.avatarUrl.length == 0) {
			uni.showToast({
				icon: "fail",
				title: "请完善头像"
			})
			return;
		}
		uni.showLoading({
			title: "注册中..."
		})
		//保存用户信息
		//上传头像
		uploadImage(state.avatarUrl).then(res => {
			updateUserInfo(res, state.nickName).then(resp => {
				setLocalUserInfo(resp);
				//跳转INDEX页面
				uni.reLaunch({
					url: '/pages/index/index'
				});
			}).catch(ee => {
				console.error(ee)
				uni.showToast({
					title: "注册失败"
				})
			}).finally(() => {
				uni.hideLoading();
			})
		}).catch(e => {
			uni.showToast({
				title: "注册失败"
			})
			uni.hideLoading();
		})
	}
</script>

<style lang="scss" scoped>
	.conatiner {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.logo {
		height: 500rpx;
		width: 500rpx;
		border-radius: 10rpx;
	}

	.btn {
		margin-top: 30rpx;
		width: 50%;
		font-size: 30rpx;
		color: white;
		background-color: #4fa228;
		border-color: #4fa228;
	}

	.register-grup {
		margin-top: 50rpx;
		width: 500rpx;

		.avatar-wrapper {
			height: 220rpx;
			width: 220rpx;
			padding: 0;
		}

		.avatar {
			height: 100%;
			width: 100%;
		}

		.weui-input {
			margin-top: 50rpx;
			margin-bottom: 50rpx;
			border: 1rpx solid #dcdcdc;
			padding: 10rpx;
			border-radius: 10rpx;
			width: 100%;
		}

		.btn {
			width: 100%;
		}
	}
</style>