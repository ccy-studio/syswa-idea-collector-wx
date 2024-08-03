<template>
	<view class="content">
		<uni-section title="筛选提交日期" type="line">
			<uni-data-select v-model="state.idx" :localdata="state.filter"></uni-data-select>
		</uni-section>
		<uni-section v-if="state.list.length!=0" title="版本内容" :sub-title="state.list[state.idx].comment" type="line">
			<text class="view-text" v-text="state.list[state.idx].content"></text>
		</uni-section>
	</view>
</template>

<script setup>
	import {
		reactive,
		ref
	} from "vue"

	import {
		onLoad,
	} from "@dcloudio/uni-app";


	import {
		get,
		getImagePath,
	} from "@/util/api.js"


	const state = reactive({
		id: null,
		list: [],
		filter: [

		],
		idx: null
	})


	onLoad((option) => {
		state.id = option.id;
		get("/article/history/" + state.id).then(res => {
			state.list = res;
			//初始化filter
			res.forEach((item, index) => {
				state.filter.push({
					value: index,
					text: item.createTime
				})
			})
			state.idx = 0;
		})
	})
</script>

<style lang="scss">
	.content {
		padding: calc(var(--status-bar-height) + 15rpx) 30rpx;

		.view-text {
			color: #3a3a3a;
			font-size: 25rpx;
			padding: 0 10rpx;
		}
	}
</style>