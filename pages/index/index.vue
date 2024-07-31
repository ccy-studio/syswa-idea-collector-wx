<template>
	<view class="content">

		<!-- <z-swiper class="mswiper" v-model="state.swiper" :options="options">
			<z-swiper-item class="mswiper-item" v-for="(item,index) in state.swiper" :key="index">
				<image class="mswiper-item" :src="getImagePath(item.cover)" mode="aspectFill"> </image>
			</z-swiper-item>
		</z-swiper>

		<scroll-view class="list-container" :scroll-top="state.scrollTop" scroll-y="true" @scrolltolower="scrollEnd"
			lower-threshold="100">
			<view v-for="(item ,index) in state.dataList" :key="index">
				<article-list :data="item"></article-list>
			</view>
		</scroll-view> -->


		<z-paging ref="paging" v-model="state.dataList" @query="queryList" auto-show-back-to-top>
			<!-- z-paging默认铺满全屏，此时页面所有view都应放在z-paging标签内，否则会被盖住 -->
			<!-- 需要固定在页面顶部的view请通过slot="top"插入，包括自定义的导航栏 -->
			<view v-for="(item ,index) in state.dataList" :key="index">
				<article-list :data="item"></article-list>
			</view>
			<template slot="top">
				<z-swiper class="mswiper" v-model="state.swiper" :options="options">
					<z-swiper-item class="mswiper-item" v-for="(item,index) in state.swiper" :key="index">
						<image class="mswiper-item" :src="getImagePath(item.cover)" mode="aspectFill"></image>
					</z-swiper-item>
				</z-swiper>
			</template>
		</z-paging>

		<!-- <uni-icons v-if="state.total>0" @click="setScrollTop" class="top-btn" type="up" size="30"></uni-icons> -->
	</view>
</template>

<script setup>
	import {
		checkToken,
		get,
		getImagePath
	} from "@/util/api.js";

	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app";

	import {
		reactive,
		ref
	} from "vue"

	const paging = ref(null)

	const options = reactive({
		height: 20,
		// swiperItemWidth: "100%",
		swiperItemHeight: 300,
		loop: true,
		effect: 'coverflow',
		centeredSlides: true,
		slidesPerView: 'auto',
		coverflowEffect: {
			rotate: 50,
			stretch: 0,
			depth: 100,
			modifier: 1,
			slideShadows: true,
		},
	})


	const state = reactive({
		swiper: [],
		scrollTop: 0,

		pageIndex: 1,
		pageSize: 10,
		dataList: [],
		sortType: 0,
		status: -1,
		total: 0,
		loading: false
	})

	onLoad(() => {
		state.current = 1;
		state.dataList = [];
		requestArticle();
	})

	const requestArticle = () => {
		state.loading = true;
		get("/article/page-list", {
			size: state.pageSize,
			current: state.pageIndex,
			sortType: state.sortType,
			status: state.status
		}).then(res => {
			state.total = res.total;
			state.dataList.push(...res.rows);
			state.dataList.push(...res.rows);
			state.dataList.push(...res.rows);
			state.loading = false;
			state.swiper = state.dataList.slice(0, 3);
			console.log("DataList: ", state.dataList);
			paging.value.complete(res.rows)
		}).catch(e => {
			console.log("获取列表失败", e);
			paging.value.complete(false);
		})
	}


	const queryList = (pageNo, pageSize) => {
		state.pageIndex = pageNo;
		state.pageSize = pageSize;
		requestArticle();
	}

	const scrollEnd = () => {
		console.log("滚动到底部")
	}

	const setScrollTop = () => {
		console.log("setScrollTop", state.scrollTop);
		state.scrollTop = 0;
	}
</script>

<style lang="scss">
	.content {
		height: 100%;
		position: relative;
		overflow: hidden;
	}

	.mswiper {
		height: 300rpx;
	}

	.mswiper-item {
		width: 100%;
		height: 300rpx;
	}

	.list-container {
		height: 950rpx;
	}

	.top-btn {
		padding: 8rpx;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
		border-color: black;
		border-radius: $uni-border-radius-circle;
		background-color: white;
		position: absolute;
		right: 15rpx;
		bottom: calc(var(--status-bar-height) + 20rpx);
	}
</style>