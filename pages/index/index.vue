<template>
	<view class="content">
		<z-paging ref="paging" v-model="state.dataList" @query="queryList" auto-show-back-to-top
			lower-threshold="200rpx" :show-scrollbar="false">

			<view class="select">
				<uni-data-select class="select-item" :clear="false" v-model="state.sortType" label="排序"
					:localdata="selectSort" @change="onSelectChange"></uni-data-select>
				<uni-data-select class="select-item" :clear="false" v-model="state.status" label="状态"
					:localdata="selectStatus" @change="onSelectChange"></uni-data-select>
			</view>


			<view v-for="(item ,index) in state.dataList" :key="index">
				<article-list :data="item" :hot="index < 3"></article-list>
			</view>
			<template #top>
				<view>
					<z-swiper v-model="state.swiper" :options="options">
						<z-swiper-item class="mswiper-item" v-for="(item,index) in state.swiper" :key="index">
							<view class="mswiper-content">
								<image :src="item.img" mode="aspectFill"></image>
								<view class="mswiper-title-text">{{item.title}}</view>
							</view>
						</z-swiper-item>
					</z-swiper>
				</view>
			</template>
		</z-paging>
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
		autoplay: true,
		slidesPerView: 'auto',
		loopedSlides: 5,
		disableOnInteraction: false,
		loop: true,
		centeredSlides: true,
		effect: 'coverflow',
		coverflowEffect: {
			rotate: 50,
			stretch: 0,
			depth: 100,
			modifier: 1,
			slideShadows: true,
		},
	})

	const selectStatus = [{
			value: 0,
			text: "进行中"
		},
		{
			value: 1,
			text: "已结束"
		},
		{
			value: -1,
			text: "全部"
		},
	]

	const selectSort = [{
			value: 0,
			text: "综合"
		},
		{
			value: 1,
			text: "点赞"
		},
		{
			value: 2,
			text: "时间"
		},
	]


	const state = reactive({
		swiper: [{
				img: "/static/swiper/sw_1.png",
				title: "贡献天马行空的创意想法"
			},
			{
				img: "/static/swiper/sw_2.gif",
				title: "2024星火计划"
			}
		],
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
			state.loading = false;
			paging.value.complete(res.rows, true);
		}).catch(e => {
			console.log("获取列表失败", e);
			paging.value.complete(false);
			state.loading = false;
		})
	}


	const queryList = (pageNo, pageSize) => {
		state.pageIndex = pageNo;
		state.pageSize = pageSize;
		if (pageNo == 1) {
			state.dataList.length = 0;
		}
		requestArticle();
	}

	const onSelectChange = (e) => {
		paging.value.reload()
	}
</script>

<style lang="scss" scoped>
	.content {
		height: 100%;
		position: relative;
		overflow: hidden;
	}

	.select {
		display: flex;
		flex-direction: row;
		justify-content: start;
		margin: 20rpx;

		.select-item {
			margin-right: 20rpx;
			width: 200rpx;
		}
	}

	.mswiper-item {
		width: 100%;
	}

	.mswiper-content {
		position: relative;

		image {
			width: 100%;
			height: 300rpx;
		}
	}

	.mswiper-title-text {
		position: absolute;
		bottom: 0;
		left: 0;
		padding: 15rpx 10rpx;
		background-color: rgb(44 44 44 / 65%);
		font-size: 25rpx;
		color: white;
		text-overflow: ellipsis;
		right: 0;
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