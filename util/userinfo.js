import {
	getCurrentUserInfo
} from "./api.js"

export const USER_INFO_KEY = "USINFO";

export const getLocalUserInfo = () => {
	return uni.getStorageSync(USER_INFO_KEY);
}

export const setLocalUserInfo = (userinfo) => {
	uni.setStorageSync(USER_INFO_KEY, userinfo);
}

export const removeLocalUserInfo = () => {
	uni.removeStorageSync(USER_INFO_KEY);
}


export const getAutoUserInfo = () => {
	return new Promise((resovle, reject) => {
		let userInfo = getLocalUserInfo();
		if (!userInfo) {
			getCurrentUserInfo().then(cu => {
				setLocalUserInfo(cu);
				resovle(cu);
				// if (!cu.nickName) {
				// uni.showModal({
				// 	title: '登录',
				// 	content: '请接受授权获取您的微信昵称、头像、地区信息自动为您注册账户',
				// 	success: function(res) {
				// 		if (res.confirm) {
				// 			console.log('用户点击确定');
				// 			getCurrentUserInfo().then(res2 => {
				// 				console.log("获取成功", res2);
				// 				setLocalUserInfo(res2);
				// 				resovle(res2);
				// 			})
				// 		} else if (res.cancel) {
				// 			console.log('用户点击取消');
				// 			reject(null);
				// 		}
				// 	}
				// });
				// }
			}).catch(e => reject(e));
		} else {
			resovle(userInfo);
		}
	});
}