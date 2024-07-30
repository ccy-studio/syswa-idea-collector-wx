import {removeLocalUserInfo} from "./userinfo.js"
const base_url = "https://wx.saisaiwa.com";

/**
 * 返回Token
 */
function get_token() {
	try {
		return uni.getStorageSync('token');
	} catch (e) {
		console.error(e);
		return "";
	}
}

const baseRequest = (url, data, method) => {
	return new Promise((resolve, reject) => {
		uni.request({
			method,
			url: base_url + url,
			data,
			header: {
				'Authorization': get_token()
			},
			success: (res) => {
				let code = res.data.code;
				if (code == 4001 || code == 4003) {
					//重新登录
					uni.removeStorageSync('token');
					removeLocalUserInfo();
					login();
					reject(res.data.msg);
				} else if (code == 200) {
					resolve(res.data.data);
				} else {
					console.log("系统异常: ", res.data);
					reject(res.data.msg);
				}
			},
			fail: (err) => {
				console.error("Request Error", e);
				reject(err);
			}
		});

	});
}

export const post = (url, data) => {
	return baseRequest(url, data, "POST");
}

export const get = (url, data) => {
	return baseRequest(url, data, "GET");
}


/**
 * 微信授权登录
 */
export const loginWx = () => {
	return new Promise((resovle, reject) => {
		uni.login({
			provider: "weixin",
			onlyAuthorize: true,
			success: (res) => {
				resovle(res.code);
			},
			fail: (e) => {
				console.error("微信登录失败", e);
				reject(e);
			}
		})
	});
}


/**
 * 系统登录
 */
export const sysLogin = (code) => {
	return new Promise((resovle, reject) => {
		get("/wx/user/login", {
			code
		}).then((res) => {
			resovle(res);
		}).catch((e) => {
			reject(e);
		})
	})
}


export const login = () => {
	return new Promise((resovle, reject) => {
		loginWx().then((code) => {
			sysLogin(code).then((user) => {
				console.log("登录成功:", user);
				uni.setStorageSync('token', user.token);
				resovle(user);
			}).catch(e => reject(e));
		}).catch(e => {
			reject(e);
		})
	})
}

export const getCurrentUserInfo = () => {
	return new Promise((resovle, reject) => {
		get("/wx/user/current").then(res => {
			if (!res.nickName) {
				//完善用户的信息
				uni.getUserProfile({
					desc: "获取你的昵称、头像、地区及性别",
					lang: "zh_CN",
					success: (res1) => {
						console.log("授权获取微信资料:", res1)
						//更新到服务器
						get("/wx/user/info", {
							sessionKey: get_token(),
							signature: res1.signature,
							rawData: res1.rawData,
							encryptedData: res1.encryptedData,
							iv: res1.iv
						}).then(res2 => {
							resovle(res2);
						})
					},
					fail: (e) => {
						console.error("授权获取用户资料失败:", e);
						resovle(res);
					}
				})
			} else {
				resovle(res);
			}
		}).catch(e => reject(e));
	});
}