import http from "../plugin/ajax/ajax"
export default {

	// 用户登录
	authLogin(data, hideError){
		return http.post("/api/auth/login", {
			data,
		})
	},
	
	// 用户登录
	codeAuthLogin(data, hideError){
		return http.post("/api/auth/login/vcode", {
			data,
		})
	},

	// 注册用户
	register(data, hideError){
		return http.post("/api/auth/register", {
			data,
			hideError
		})
	},

	// 获取验证码
	getVcode(data, hideError){
		return http.post("/api/auth/vcode", {
			data,
			hideError
		})
	},

	// 忘记密码
	forgot(data, hideError){
		return http.post("/api/forgot", {
			data,
			hideError
		})
	},

	// 忘记密码 发送验证码
	forgotVcode(data, hideError){
		return http.post("/api/forgot/vcode", {
			data,
			hideError
		})
	},

	// 修改密码
	REpassword(data, hideError){
		return http.post("/api/user/re_password", {
			data,
			hideError
		})
	},
	

	// 获取用户信息
	getUserInfo(data, hideError){
		return http.get("/api/user", {
			data,
			hideError
		})
	},

	// 获取学校信息
	getSchool(data, hideError){
		return http.get("/api/school", {
			data,
			hideError
		})
	},

	// 获取校区信息
	getCampus(data, hideError){
		return http.get("/api/campus", {
			data,
			hideError
		})
	},

	
}