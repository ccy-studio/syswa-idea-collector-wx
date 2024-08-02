<template>
	<view class="conatiner">
		<image class="logo" src="@/static/logo.png"></image>
		<button v-if="state.isLogin" class="btn" @click="onLoginClick" size="default">微信一键登录</button>
	</view>
</template>

<script setup>
	import {
		reactive
	} from "vue";

	import {
		login
	} from "@/util/api.js"
	import {
		getAutoUserInfo
	} from "@/util/userinfo.js"

	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app";

	const state = reactive({
		isLogin: false
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

	const onLoginClick = () => {
		uni.showLoading({
			title: "登录中..."
		})

		//获取用户信息
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
</script>

<style lang="scss">
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
</style>