<template>
	<view>
		<z-paging ref="paging" v-model="state.comment.list" @query="getComment" auto-show-back-to-top
			lower-threshold="200rpx" :safe-area-inset-bottom="true" :use-safe-area-placeholder="true"
			:show-scrollbar="false" :refresher-enabled="false">
			<article-content :data="state.data" :showTitle="true" :showAbout="true"></article-content>

			<view class="p-stat-operate">
				<uni-badge size="small" :text="state.isGive?'+1':''" absolute="rightTop" type="primary">
					<view @click="give" class="stat-operate">
						<uni-icons type="hand-up-filled" size="30" color="red"></uni-icons>
						<text>给作者点赞</text>
					</view>
				</uni-badge>
			</view>

			<uni-section title="用户评论" type="line">
				<view class="comment-item" v-for="(item ,index) in state.comment.list" :key="index">
					<article-comment @onReply="onReply" :obj="item"></article-comment>
					<view class="comment-item-seconds" v-if="item.childComment.length != 0">
						<article-comment v-for="(item2,index2) in item.childComment" :key="item2.id" @onReply="onReply"
							@onGive="onCommentGive" :obj="item2" :authorId="state.data.userId"></article-comment>
					</view>
				</view>
			</uni-section>


			<template #bottom>
				<view class="input-edit">
					<uni-easyinput :focus="state.edit.focus" @clear="onEditClear" prefixIcon="chat"
						@confirm="onSubmitComment" confirmType="send" trim="both" type="text" v-model="state.edit.text"
						placeholder="说点什么吧"></uni-easyinput>
				</view>
			</template>
		</z-paging>
		<uni-fab ref="fab" :pattern="fabConfig.pattern" :content="fabConfig.content" horizontal="right"
			vertical="bottom" direction="vertical" @trigger="fabTrigger" />
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
		onLoad,
		onShow
	} from "@dcloudio/uni-app";


	import {
		get,
		post
	} from "@/util/api.js"

	const paging = ref(null)

	const fab = ref(null)

	const fabConfig = {
		pattern: {
			color: "#3c3e49",
			icon: "plusempty",
			selectedColor: "#007AFF"
		},
		content: [{
			iconPath: "",
			text: ""
		}]
	}

	const state = reactive({
		id: null,
		title: null,
		data: {},

		isGive: false,

		comment: {
			list: [],
			total: 0,
			pageSize: 10,
			pageIndex: 1,
		},

		edit: {
			focus: false,
			text: "",
			parentId: null,
			parentUserName: null
		}
	})

	onLoad((option) => {
		state.id = option.id;
		state.title = option.title;
		uni.setNavigationBarTitle({
			title: state.title
		});
		get("/article/get/" + state.id)
			.then(res => {
				state.data = res;
			});
		//增加阅读量
		get("/article/view", {
			id: state.id
		});
	})


	/**
	 * 获取评论
	 */
	const getComment = (pageNo, pageSize) => {
		state.comment.pageIndex = pageNo;
		state.comment.pageSize = pageSize;
		get("/article/comment/list", {
			articleId: state.id,
			size: state.comment.pageSize,
			current: state.comment.pageIndex
		}).then(res => {
			state.comment.total = res.total;
			paging.value.complete(res.rows, true);
		}).catch(e => {
			paging.value.complete(false);
		})
	}

	const give = () => {
		if (!state.isGive) {
			get("/article/give", {
				id: state.id
			});
		}
		state.isGive = true;
	}

	const onCommentGive = (obj) => {
		if (!obj.isGive) {
			obj.give++;
			get("/article/comment/give/" + obj.id);
		}
		obj.isGive = true;
	}

	const onSubmitComment = () => {
		console.log("onSubmitComment")
		if (state.edit.text.length == 0) {
			return;
		}
		let pattern = /^@.*@:/;
		let content = state.edit.text;
		if (pattern.test(content)) {
			content = content.replace(pattern, '').trim();
		} else {
			state.edit.parentId = null;
		}

		if (content.length == 0) {
			return;
		}

		post("/article/comment/add", {
			id: state.id,
			content,
			parentId: state.edit.parentId
		}).then(res => {
			state.edit.text = "";
			uni.showToast({
				title: "评论成功",
				position: "bottom"
			})
			paging.value.reload(true);
		})
	}

	const onReply = (obj) => {
		state.edit.parentId = obj.id;
		state.edit.parentUserName = obj.userNickName;
		state.edit.text = '@' + obj.userNickName + "@: ";
		state.edit.focus = true;
	}

	const onEditClear = () => {
		state.edit.parentUserName = null;
		state.edit.parentId = null;
		state.edit.focus = false;
	}


	const fabTrigger = (item) => {

	}
</script>

<style lang="scss" scoped>
	.p-stat-operate {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 50rpx;
		margin-top: 20rpx;
	}

	.stat-operate {
		height: 50rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;

		text {
			font-size: 25rpx;
			color: orangered;
		}
	}

	.comment-item {
		margin-bottom: 25rpx;

		.comment-item-seconds {
			margin-left: 60rpx;
			background-color: rgb(232 234 237 / 50%);
		}
	}

	.input-edit {
		margin-bottom: var(--status-bar-height);
		margin-top: 10rpx;
	}
</style>