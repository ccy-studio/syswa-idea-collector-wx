<template>
	<view>
		<z-paging ref="paging" v-model="state.comment.list" @query="getComment" auto-show-back-to-top
			lower-threshold="200rpx" show-scrollbar="false">
			<view v-for="(item ,index) in state.comment.list" :key="index">
				<view class="comment-item">
					
				</view>
			</view>
		</z-paging>
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
		get
	} from "@/util/api.js"

	const paging = ref(null)

	const state = reactive({
		id: null,
		title: null,
		data: {},

		comment: {
			list: [],
			total: 0,
			pageSize: 10,
			pageIndex: 1,
		}
	})

	onLoad((option) => {
		console.log("load:", option);
		state.id = option.id;
		state.title = option.title;
		uni.setNavigationBarTitle({
			title: state.title
		});
		get("/article/get/" + state.id)
			.then(res => {
				console.log("详情信息: ", res);
				state.data = res;
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
</script>

<style lang="scss">

	.comment-item{
		
	}

</style>