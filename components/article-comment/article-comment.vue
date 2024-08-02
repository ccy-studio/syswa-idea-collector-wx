<template>
	<view class="content">
		<image class="head" :src="getAvater()" mode="aspectFill" lazy-load></image>
		<view class="body">
			<text class="nick-name" v-text="prors.obj.userNickName"></text>
			<view class="second-info secondary-color">
				<text v-text="prors.obj.createTime"></text>
				<uni-badge absolute="rightTop" :text="prors.obj.give" type="primary">
					<uni-icons @click="onGiveClick" color="red" type="heart-filled" size="20"></uni-icons>
				</uni-badge>
			</view>

			<view v-if="prors.obj.parentId" class="parent-text">
				@{{prors.obj.parentUserName}}{{prors.authorId===prors.obj.userId?'(作者)':''}}:
			</view>
			<text user-select class="comment base-color">
				{{prors.obj.content}}
			</text>

			<view class="reply" @click="onReplyClick">
				<uni-icons color="#6a6a6a" type="chat-filled" size="20">
				</uni-icons>
				<text class="secondary-color">回复</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		reactive,
		nextTick,
		onMounted
	} from "vue"

	const emit = defineEmits(["onReply", 'onGive'])

	const prors = defineProps({
		obj: {
			type: Object,
			required: true
		},
		authorId: {
			type: Number,
			required: false
		}
	})

	const state = reactive({

	})

	const getAvater = () => {
		if (!prors.obj.userAvatar || prors.obj.userAvatar == '') {
			return "/static/default_head.png";
		}
		return prors.obj.userAvatar;
	}

	const onReplyClick = () => {
		emit("onReply", prors.obj);
	}

	const onGiveClick = () => {
		emit("onGive", prors.obj);
	}
</script>

<style lang="scss" scoped>
	.content {
		padding: 5rpx;
		display: flex;
		flex-direction: row;
		justify-content: start;
		height: 100%;
		border-bottom: 0.2px solid #dcdcdc;

		.head {
			height: 100rpx;
			width: 100rpx;
			border-radius: 20rpx;
			align-self: center;
			padding: 0 10rpx;
		}

		.body {
			margin-left: 20rpx;
			flex: 1;
			display: flex;
			flex-direction: column;

			.nick-name {
				color: #3a3a3a;
				font-size: 25rpx;
				font-weight: 600;
			}

			.parent-text {
				color: #2979ff;
				font-weight: 600;
				font-size: 25rpx;
			}

			.second-info {
				padding-right: 32rpx;
				font-size: 23rpx;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
			}
		}

		.comment {
			font-size: 25rpx;
		}

		.reply {
			align-self: flex-end;
			padding-right: 20rpx;
			margin: 10rpx 0;
		}
	}

	.base-color {
		color: #6a6a6a;
	}

	.secondary-color {
		color: #909399;
	}
</style>