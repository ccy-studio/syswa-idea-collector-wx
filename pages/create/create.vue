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
					<uni-file-picker v-if="state.imgSource == 0" :sizeType="['compressed']"
						v-model="state.imgUploadMode" limit="1" fileMediatype="image" mode="grid"
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
		<button type="primary" :disabled="state.saveBtn" @click="submitForm">提交保存</button>

		<uni-popup ref="messg" type="message">
			<uni-popup-message :type="state.tipType" :message="state.tipMessage" :duration="2000"></uni-popup-message>
		</uni-popup>

		<uni-popup ref="refAi">
			<view class="select-ai-container" v-if="state.aiStatus == 1 && state.imgSource == 1">
				<view class="ai-item" v-for="(item,index) in state.aiResult" :key="item.id">
					<image @click="openPreview(getImagePath(item.genImgLocal))" class="ai-img" mode="aspectFill"
						:src="getImagePath(item.genImgLocal)"></image>
					<button type="primary" size="mini" @click="onSelectAiImg(item.id)">选择</button>
				</view>
			</view>
		</uni-popup>
		<q-previewImage v-if="state.aiStatus == 1 && state.imgSource == 1" ref="previewImage"
			:urls="state.aiPreviewImages"></q-previewImage>
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
	const refAi = ref(null);
	const previewImage = ref(null);

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
		},
		saveBtn: false,
		aiRetryCount: 0,
		aiResult: [],
		aiStatus: 0,
		aiPreviewImages: []
	})

	onLoad((option) => {
		state.id = option.id;
		uni.setNavigationBarTitle({
			title: state.id ? "编辑" : "新建"
		});
		state.aiRetryCount = 0;
		state.aiResult = [];
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

	const onGeneratorAi = async () => {
		uni.showLoading({
			title: "正在AI生图",
			mask: true
		})

		try {
			await get("/img/generator-ai/" + state.id)
			requestAiResult()
		} catch (e) {
			console.error("提交AI任务失败：", e);
			uni.hideLoading();
			showMessage("error", "Ai生图失败: " + e)
		}
	}


	const requestAiResult = () => {
		if (state.aiRetryCount > 60) {
			uni.hideLoading();
			showMessage("error", "Ai生图失败,任务超时")
			return
		}
		uni.showLoading({
			title: "正在AI生图" + aiRetryCount + "/s",
			mask: true
		})
		get("/img/get-ai-info/" + state.id).then(res => {
			//任务状态：0执行中,1已结束
			if (res.status == 1) {
				res.items.forEach(item => {
					//任务状态：0执行中,1生成成功,2生成失败
					if (item.status == 1) {
						state.aiResult.push(item)
						state.aiPreviewImages.push(getImagePath(item.genImgLocal))
					}
				})
				uni.hideLoading();
				state.aiStatus = 1
				showSelectAiImage()
			} else {
				state.aiRetryCount++;
				setTimeout(requestAiResult, 1000);
			}
		})
	}

	const showSelectAiImage = () => {
		refAi.value.open('top')
	}


	const openPreview = (url) => {
		previewImage.value.open(url);
	}


	const onSelectAiImg = (id) => {
		refAi.value.close();
		get("/img/activity-image/" + id).then(res => {
			showMessage("success", "提交成功")
			setTimeout(() => {
				uni.navigateBack()
			}, 1500)
		})
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
		if (!state.id) {
			if (state.imgSource == 0 && (state.data.title.length == 0 || state.data.cover.length == 0)) {
				showMessage("error", "错误：请完善标题和封面")
				return;
			}
			if (state.imgSource == 1 && (state.data.title.length < 5 || state.data.content.length < 10)) {
				showMessage("error", "错误：标题必须大于5个字，内容必须大于10个字。");
				return
			}
		}
		if (state.data.content.length == 0) {
			showMessage("error", "错误：请完善内容")
			return;
		}
		if (state.data.comment.length == 0) {
			showMessage("error", "错误：请完善本次版本提交日志")
			return;
		}

		state.saveBtn = true;
		uni.showLoading({
			title: "请稍等..."
		})

		post("/article/publish", {
			id: state.id,
			title: state.data.title,
			cover: state.data.cover,
			content: state.data.content,
			comment: state.data.comment
		}).then(res => {
			if (state.imgSource == 0) {
				showMessage("success", "提交成功")
				setTimeout(() => {
					uni.navigateBack()
				}, 1500)
			} else {
				//选择AI生图
				showMessage("success", "提交成功,请等待AI生图的结果,违禁词将生成失败")
				state.id = res;
				onGeneratorAi();
			}

		}).catch(e => {
			showMessage("error", "失败:" + e)
			state.saveBtn = false;
		}).finally(() => {
			uni.hideLoading();
		})
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

	.select-ai-container {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 50rpx 10rpx;
		background-color: white;
		border-radius: 0 0 20rpx 20rpx;

		.ai-item {
			margin: 0 5rpx;
			display: flex;
			flex-direction: column;
			justify-content: start;
			align-items: center;
			flex: 1;

			.ai-img {
				width: 100%;
				height: 300rpx;
				margin-bottom: 30rpx;
				border-radius: 20rpx;
			}
		}
	}
</style>