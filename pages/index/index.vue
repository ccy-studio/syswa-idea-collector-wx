<template>
	<view class="content">
		<uni-swiper-dot :info="info" :current="current" field="content" mode="nav">
			<swiper class="swiper-box" @change="change">
				<swiper-item v-for="(item ,index) in info" :key="index">
					<image class="swiper-item" src="http://imgapi.xl0408.top/index.php" mode="aspectFill"></image>
				</swiper-item>
			</swiper>
		</uni-swiper-dot>


	</view>
</template>

<script>
	import {
		getAutoUserInfo
	} from "../../util/userinfo.js"
	export default {
		data() {
			return {
				info: [{
					content: '内容 A'
				}, {
					content: '内容 B'
				}, {
					content: '内容 C'
				}],
				current: 0,
			}
		},
		onLoad() {
			getAutoUserInfo().then(res => {
				console.log(res)
			})
		},
		methods: {
			change(e) {
				this.current = e.detail.current;
			}
		}
	}
</script>

<style lang="scss">
	.content {
		min-height: 100%;
		/* display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center; */
	}

	.swiper-box {
		height: 30%;

		.swiper-item {
			width: 100%;
		}
	}
</style>