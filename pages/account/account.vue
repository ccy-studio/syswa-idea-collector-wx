<template>
	<view class="content">
		<z-paging ref="paging" v-model="state.list" @query="getMyArticle" auto-show-back-to-top lower-threshold="200rpx"
			:safe-area-inset-bottom="true" :use-safe-area-placeholder="true" :show-scrollbar="false">

			<view class="userinfo">
				<image class="head" :src="getAvatar()" mode="aspectFill"></image>
				<text class="nick-name" v-text="state.userInfo.nickName"></text>
			</view>

			<uni-section type="line" title="我的创意文章">
				<template #right>
					<button type="primary" size="mini" @click="onCreateIdea">新建创意</button>
				</template>
				<view v-for="(item ,index) in state.list" :key="index">
					<article-list :data="item"></article-list>
				</view>
			</uni-section>
		</z-paging>
	</view>
</template>

<script setup>
	import {
		get,
	} from "@/util/api.js";

	import {
		getAutoUserInfo
	} from "@/util/userinfo.js"

	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app";

	import {
		reactive,
		ref
	} from "vue"

	const paging = ref(null)

	const state = reactive({
		userInfo: {

		},
		list: [],
	})

	onLoad(() => {
		getAutoUserInfo().then(res => {
			state.userInfo = res;
			console.log(res);
		})
	})


	/**
	 * 获取头像
	 */
	const getAvatar = () => {
		if (!state.userInfo.avatar) {
			return "/static/logo.png";
		}
		return state.userInfo.avatar;
	}

	const getMyArticle = (pageSize, pageNo) => {
		get("/article/page-list", {
			size: pageNo,
			current: pageSize,
			sortType: -1,
			self: 1
		}).then(res => {
			paging.value.complete(res.rows, true);
		}).catch(e => {
			console.log("获取列表失败", e);
			paging.value.complete(false);
		})
	}

	const onCreateIdea = () => {
		uni.navigateTo({
			url: '/pages/create/create'
		});
	}
</script>

<style lang="scss" scoped>
	.content {
		.userinfo {
			display: flex;
			flex-direction: column;
			align-items: center;

			.nick-name {
				margin-top: 25rpx;
				font-size: 35rpx;
				color: #3a3a3a;
				font-weight: 600;
			}

			.head {
				border-radius: 20%;
				height: 200rpx;
				width: 200rpx;
			}
		}

	}
</style>