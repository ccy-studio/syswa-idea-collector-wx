<template>
	<view class="content">
		<uni-forms :modelValue="state.data" label-width="80">
			<uni-forms-item required label="标题" name="title">
				<uni-easyinput :disabled="state.id" type="text" confirmType="next" v-model="state.data.title"
					placeholder="请输入标题" />
			</uni-forms-item>
			<uni-forms-item label="封面" name="cover">
				<view v-if="!state.id">
					<uni-data-checkbox mode="default" v-model="state.imgSource"
						:localdata="state.imgSourceList"></uni-data-checkbox>
					<button v-if="state.imgSource == 1" @click="onGeneratorAiClick" type="primary" size="mini"
						style="margin-top: 30rpx;">点击AI生图</button>
					<uni-file-picker v-else :sizeType="['compressed']" v-model="state.imgUploadMode" limit="1" fileMediatype="image" mode="grid"
						@select="onFileSelect" />
				</view>
				<image v-else :src="getImagePath(state.data.cover)" mode="aspectFill" class="cover-img"></image>
			</uni-forms-item>
			<uni-forms-item required name="content" label="内容">
				<uni-easyinput type="textarea" confirmType="next" v-model="state.data.content" trim="true"
					placeholder="请输入内容" clearable :maxlength="-1" autoHeight></uni-easyinput>
			</uni-forms-item>

			<uni-forms-item required name="content" label="提交日志">
				<uni-easyinput type="text" v-model="state.data.comment" trim="true" placeholder="请输入提交日志"
					confirmType="done"></uni-easyinput>
			</uni-forms-item>
		</uni-forms>
		<button type="primary" @click="submitForm">提交保存</button>

		<uni-popup ref="messg" type="message">
			<uni-popup-message :type="state.tipType" :message="state.tipMessage" :duration="2000"></uni-popup-message>
		</uni-popup>
	</view>
</template>

<script setup>
	import {
		reactive,
		nextTick,
		onMounted,
		ref,
	} from "vue"

	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app";


	import {
		get,
		post,
		uploadImage,
		getImagePath
	} from "@/util/api.js"

	import {
		getAutoUserInfo
	} from "@/util/userinfo.js"

	const messg = ref(null);

	const state = reactive({
		id: null,
		imgSource: 0,
		imgSourceList: [{
			text: "自行上传",
			value: 0,
			disable: false
		}, {
			text: "AI生图",
			value: 1,
			disable: false
		}],

		imgUploadMode: null,
		tipMessage: null,
		tipType: null,

		data: {
			title: "",
			cover: "",
			content: "",
			comment: "初次提交"
		}
	})

	onLoad((option) => {
		state.id = option.id;
		uni.setNavigationBarTitle({
			title: state.id ? "编辑" : "新建"
		});
		if (state.id) {
			get("/article/get/" + state.id)
				.then(res => {
					state.data.title = res.title;
					state.data.cover = res.cover;
					state.data.content = res.content;
					state.data.comment = res.comment;
				});
		}
	})

	const onGeneratorAiClick = () => {
		if (state.data.title.length > 5 && state.data.content.length > 10) {
			console.log("onGeneratorAiClick");
		} else {
			showMessage("error", "错误：标题必须大于5个字，内容必须大于10个字。")
		}
	}

	const onFileSelect = (f) => {
		console.log(f);
		uploadImage(f.tempFilePaths[0]).then(res => {
			console.log("上传文件成功", res);
			state.data.cover = res;
		}).catch(e => {
			console.error("文件上传失败", e)
		})
	}

	const submitForm = () => {

	}

	const showMessage = (type, msg) => {
		state.tipMessage = msg;
		state.tipType = type;
		messg.value.open();
	}
</script>

<style lang="scss">
	.content {
		padding: calc(var(--status-bar-height) + 15rpx) 30rpx;

		.cover-img {
			margin-top: 30rpx;
			height: 250rpx;
			width: 250rpx;
			border-radius: 20rpx;
		}
	}
</style>