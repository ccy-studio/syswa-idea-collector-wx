<template>
	<view>
		<view class="a-container" @click="onClick">
			<view class="img-content">
				<view class="hot" v-if="props.hot">
					<uni-icons color="red" type="fire" size="25"></uni-icons>
				</view>
				<image class="img" lazy-load :src="getImagePath(props.data.cover)" mode="aspectFill"></image>
			</view>
			<view class="left-body">
				<view class="title">{{props.data.title}}</view>
				<view class="flex-all"></view>
				<view class="tip-text">
					<view v-if="props.data.status == 1">
						<uni-icons type="circle" size="12"></uni-icons>
						<text>已结束</text>
					</view>
					<view v-else>
						<uni-icons type="circle-filled" color="orangered" size="12"></uni-icons>
						<text class="text-red">进行中</text>
					</view>
				</view>
				<view class="tip-text">{{props.data.userNickName}} - {{props.data.createTime}}</view>
				<view class="rows">
					<view class="tip-text">阅读: {{props.data.see}}</view>
					<view class="tip-text">点赞: {{props.data.give}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		getImagePath
	} from "@/util/api.js";

	import {
		reactive,
		nextTick,
		onMounted
	} from "vue"

	const props = defineProps({
		data: {
			type: Object,
			required: true,
		},
		hot: {
			type: Boolean,
			required: false,
			default: false
		}
	});

	onMounted(() => {

	});

	const onClick = () => {
		uni.navigateTo({
			url: "/pages/article/article?id=" + props.data.id + "&title=" + props.data.title,
		})
	}
</script>

<style lang="scss">
	.a-container {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 20rpx;
	}

	.rows {
		display: flex;
		flex-direction: row;
		justify-content: left;
	}

	.flex-all {
		flex: 2;
	}

	.left-body {
		flex: 2;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin-left: 15rpx;
		padding: 20rpx;

		.title {
			font-size: 30rpx;
			color: black;
			font-weight: bold;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
		}

		.tip-text {
			color: #909399;
			font-size: 22rpx;
			padding: 0rpx 10rpx;
		}
	}

	.text-red {
		color: orangered;
	}

	.img-content {
		flex: 1;
		height: 250rpx;
		position: relative;
		border-radius: 15rpx;

		.hot {
			position: absolute;
			top: 0;
			left: 0;
			border-radius: 20%;
			background-color: #fff
		}

		.img {
			height: 250rpx;
			width: 100% !important;
			border-radius: 15rpx;
		}
	}
</style>