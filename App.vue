<script>
	import {
		login,
		checkToken
	} from "@/util/api.js"
	const interceptor = {
		invoke(args) {
			// console.log("拦截器:", args);
		},
		success(args) {},
		fail(err) {
			// console.log('interceptor-fail', err)
		},
		complete(res) {
			// console.log('interceptor-complete', res)
		}
	};



	export default {
		onLaunch: function() {
			console.log('App Launch')
			//设置API的全局拦截器
			uni.addInterceptor('request', interceptor);
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>