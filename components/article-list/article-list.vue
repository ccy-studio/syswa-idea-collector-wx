<template>
	<view>
		<view class="a-container" @click="onClick">
			<image class="img" lazy-load :src="getImagePath(props.data.cover)" mode="aspectFill"></image>
			<view class="left-body">
				<view class="title">{{props.data.title}}</view>
				<view class="flex-all"></view>
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
		}
	});

	onMounted(() => {

	});

	const onClick = () => {
		console.log("点击事件");
	}


	// export default {
	// 	name: "article-list",
	// 	prors: {
	// 		data: {
	// 			type: Object,
	// 			required: true,
	// 		}
	// 	},
	// 	data() {
	// 		return {

	// 		};
	// 	},
	// 	methods: {

	// 	}
	// }
</script>

<style lang="scss">
	.a-container {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 20rpx;
	}

	.img {
		flex: 1;
		height: 250rpx;
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
</style>