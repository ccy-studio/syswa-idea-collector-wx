<template>
	<view class="content">
		<view v-if="props.showTitle" class="title" v-text="props.data.title"></view>
		<view v-if="props.showAbout" class="about">
			<image @click="onClickCover" class="img" mode="aspectFill" :src="getImagePath(props.data.cover)"></image>
			<view class="right-content">
				<text>作者： {{props.data.userNickName}}</text>
				<text>发布时间： {{props.data.createTime}}</text>
				<text>修改时间： {{props.data.updateTime}}</text>
				<view>话题状态：
					<view style="display: inline;" v-if="props.data.status == 1">
						<uni-icons type="circle" size="12"></uni-icons>
						<text>已结束</text>
					</view>
					<view v-else style="display: inline;">
						<uni-icons type="circle-filled" color="orangered" size="12"></uni-icons>
						<text style="color: indianred;">进行中</text>
					</view>
				</view>
				<view class="stat">
					<text>阅读量：{{props.data.see}}</text>
					<text>点赞量：{{props.data.give}}</text>
				</view>
			</view>
		</view>

		<uni-section title="创意内容" type="line">
			<view class="html-v" v-if="isHtml()" v-html="props.data.content"></view>
			<text user-select class="text-v" v-else v-text="props.data.content"></text>
		</uni-section>

	</view>
</template>

<script setup>
	import {
		reactive,
		nextTick,
		onMounted,
		ref
	} from "vue"

	import {
		getImagePath
	} from "@/util/api.js"

	const emits = defineEmits(["onClickCover"])

	const props = defineProps({
		data: {
			type: Object,
			required: true,
		},
		showTitle: {
			type: Boolean,
			required: false,
			default: false
		},
		showAbout: {
			type: Boolean,
			required: false,
			default: false
		}
	})

	const state = reactive({

	})

	const isHtml = () => {
		const regex = /<([A-Za-z][A-Za-z0-9]*)\b[^>]*>(.*?)<\/\1>/;
		return regex.test(props.data.content);
	}

	const onClickCover = () => {
		emits('onClickCover', props.data.cover)
	}
</script>

<style lang="scss" scoped>
	.content {
		padding: 10rpx;

		.title {
			color: black;
			font-size: 40rpx;
			text-align: center;
			margin-bottom: 40rpx;
			margin-top: 20rpx;
			font-weight: bold;
		}

		.html-v {
			padding: 0 10rpx;
			color: #3a3a3a;
		}

		.text-v {
			color: #3a3a3a;
			font-size: 25rpx;
			padding: 0 10rpx;
		}

		.about {
			display: flex;
			flex-direction: row;
			margin-bottom: 40rpx;

			.img {
				height: 250rpx;
				flex: 3;
				border-radius: 30rpx;
			}

			.right-content {
				flex: 4;
				color: #909399;
				font-size: 25rpx;
				display: flex;
				flex-direction: column;
				align-items: start;
				padding-left: 20rpx;
				padding-top: 20rpx;


				text {
					margin-bottom: 10rpx;
				}

				.stat {
					display: flex;
					flex-direction: row;
					justify-content: space-between;

					text {
						margin-right: 15rpx;
					}
				}
			}
		}
	}
</style>