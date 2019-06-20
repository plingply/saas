import http from "../plugin/ajax/ajax";
export default {

	/**
	 *  意向学员
	 */
	// 意向学员列表
	jw_yx_getlist(data, hideError) {
		return http.get("/api/intention/list", {
			data,
			hideError
		})
	},

	// 意向学员编辑
	jw_yx_editor(data, hideError) {
		return http.post("/api/intention/update", {
			data,
			hideError
		})
	},

	// 意向学员添加
	jw_yx_add(data, hideError) {
		return http.post("/api/intention/add", {
			data,
			hideError
		})
	},

	// 意向学员详情
	jw_yx_info(data, hideError) {
		return http.get("/api/intention/info", {
			data,
			hideError
		})
	},

	// 教务配置
	jw_getConfig(data, hideError) {
		return http.get("/api/config", {
			data,
			hideError
		})
	},

	// 意向学员跟进列表
	jw_yx_gjlist(data, hideError) {
		return http.get("/api/intention/follow/list", {
			data,
			hideError
		})
	},

	// 意向学员跟进记录添加
	jw_yx_addgj(data, hideError) {
		return http.post("/api/intention/follow/add", {
			data,
			hideError
		})
	},

	// 意向学员跟进记录 删除
	jw_yx_delgj(data, hideError) {
		return http.post("/api/intention/follow/delete", {
			data,
			hideError
		})
	},

	// 意向学员导入
	yw_yz_fileImport(data, hideError) {
		return http.post("/api/member/Intention_member/fileImport", {
			data,
			hideError
		})
	},

	// 意向学员转正
	yw_yz_zhuanzheng(data, hideError) {
		return http.post("/api/member/Intention_member/changeType", {
			data,
			hideError
		})
	},

	// 批量分配
	yw_yz_batchallocation(data, hideError) {
		return http.post("/api/member/Intention_member/batchallocation", {
			data,
			hideError
		})
	},
	// 单条删除
	yw_yz_delete(data, hideError) {
		return http.post("/api/intention/delete", {
			data,
			hideError
		})
	},

	// 批量删除
	yw_yz_batchDelete(data, hideError) {
		return http.post("/api/member/Intention_member/batchDelete", {
			data,
			hideError
		})
	},

	// 课程顾问
	yw_yz_intention_cc(data, hideError) {
		return http.get("/api/role/intention_cc", {
			data,
			hideError
		})
	},

	/**
	 * 学员相关
	 */

	// 学员列表
	jw_student_getlist(data, hideError) {
		return http.get("/api/student/list", {
			data,
			hideError
		})
	},

	jw_student_class_list(data, hideError) {
		return http.get("/api/member/member/gradeList", {
			data,
			hideError
		})
	},

	jw_student_add(data, hideError) {
		return http.post("/api/student/add", {
			data,
			hideError
		})
	},

	jw_student_delete(data, hideError) {
		return http.post("/api/student/delete", {
			data,
			hideError
		})
	},

	jw_student_info(data, hideError) {
		return http.get("/api/student/info", {
			data,
			hideError
		})
	},

	jw_student_update(data, hideError) {
		return http.post("/api/student/update", {
			data,
			hideError
		})
	},

	jw_student_bringadd(data, hideError) {
		return http.post("/api/member/bring/add", {
			data,
			hideError
		})
	},

	jw_student_bringdelete(data, hideError) {
		return http.post("/api/member/bring/delete", {
			data,
			hideError
		})
	},

	jw_student_bringlist(data, hideError) {
		return http.get("/api/member/bring/list", {
			data,
			hideError
		})
	},

	jw_student_fileImport(data, hideError) {
		return http.post("/api/member/member/fileImport", {
			data,
			hideError
		})
	},

	jw_student_jfjilu(data, hideError) {
		return http.get("/api/member/order/list", {
			data,
			hideError
		})
	},

	jw_student_cardlist(data, hideError){
		return http.get("/api/member/card/list", {
			data,
			hideError
		})
	},

	jw_student_cardinfo(data, hideError){
		return http.get("/api/member/card/info", {
			data,
			hideError
		})
	},

	jw_student_card_open(data, hideError){
		return http.post("/api/member/card/active", {
			data,
			hideError
		})
	},

	jw_student_card_nullify(data, hideError){
		return http.post("/api/member/card/nullify", {
			data,
			hideError
		})
	},

	jw_student_card_recharge(data, hideError){
		return http.post("/api/member/card/recharge", {
			data,
			hideError
		})
	},

	jw_student_card_deduct(data, hideError){
		return http.post("/api/member/card/deduct", {
			data,
			hideError
		})
	},

	jw_student_card_delay(data, hideError){
		return http.post("/api/member/card/delay", {
			data,
			hideError
		})
	},

	jw_student_card_delaylist(data, hideError){
		return http.get("/api/member/card/deductList", {
			data,
			hideError
		})
	},

	jw_student_signlist(data, hideError){
		return http.get("/api/member/sign/list", {
			data,
			hideError
		})
	},

	jw_student_signupdate(data, hideError){
		return http.post("/api/member/sign/update", {
			data,
			hideError
		})
	},

	/**
	 * 教务设置
	 */
	jw_qdset_getlist(data, hideError) {
		return http.get("/api/qudao/list", {
			data,
			hideError
		})
	},
	jw_qdset_delete(data, hideError) {
		return http.post("/api/qudao/delete", {
			data,
			hideError
		})
	},
	jw_qdset_update(data, hideError) {
		return http.post("/api/qudao/update", {
			data,
			hideError
		})
	},
	jw_qdset_add(data, hideError) {
		return http.post("/api/qudao/add", {
			data,
			hideError
		})
	},

	/**
	 * 班级相关
	 */
	jw_class_list(data, hideError) {
		return http.get("/api/class/list", {
			data,
			hideError
		})
	},
	jw_class_info(data, hideError) {
		return http.get("/api/class/info", {
			data,
			hideError
		})
	},
	jw_class_add(data, hideError) {
		return http.post("/api/class/add", {
			data,
			hideError
		})
	},
	jw_class_update(data, hideError) {
		return http.post("/api/class/update", {
			data,
			hideError
		})
	},
	jw_class_delete(data, hideError) {
		return http.post("/api/class/delete", {
			data,
			hideError
		})
	},
	jw_class_member(data, hideError) {
		return http.get("/api/edu/grade/memberList", {
			data,
			hideError
		})
	},
	jw_class_addMember(data, hideError) {
		return http.post("/api/edu/grade/addMember", {
			data,
			hideError
		})
	},
	jw_class_moveMember(data, hideError) {
		return http.post("/api/edu/grade/moveMember", {
			data,
			hideError
		})
	},

	jw_class_changeMember(data, hideError) {
		return http.post("/api/edu/grade/changeMember", {
			data,
			hideError
		})
	},

	jw_class_notStudent(data, hideError) {
		return http.get("/api/edu/grade/addMemberList", {
			data,
			hideError
		})
	},

	/**
	 * 教室相关
	 */
	jw_classroom_list(data, hideError) {
		return http.get("/api/edu/classroom/list", {
			data,
			hideError
		})
	},
	jw_classroom_add(data, hideError) {
		return http.post("/api/edu/classroom/add", {
			data,
			hideError
		})
	},
	jw_classroom_update(data, hideError) {
		return http.post("/api/edu/classroom/update", {
			data,
			hideError
		})
	},
	jw_classroom_delete(data, hideError) {
		return http.post("/api/edu/classroom/delete", {
			data,
			hideError
		})
	},

	/**
	 * 校区相关
	 */
	jw_campus_list(data, hideError) {
		return http.get("/api/campus/list", {
			data,
			hideError
		})
	},
	jw_campus_add(data, hideError) {
		return http.post("/api/campus/add", {
			data,
			hideError
		})
	},
	jw_campus_update(data, hideError) {
		return http.post("/api/campus/update", {
			data,
			hideError
		})
	},
	jw_campus_delete(data, hideError) {
		return http.post("/api/campus/delete", {
			data,
			hideError
		})
	},

	/**
	 * 学员卡
	 */

	jw_card_add(data, hideError) {
		return http.post("/api/edu/card_type/add", {
			data,
			hideError
		})
	},

	jw_card_list(data, hideError) {
		return http.get("/api/edu/card_type/list", {
			data,
			hideError
		})
	},

	jw_card_update(data, hideError) {
		return http.post("/api/edu/card_type/update", {
			data,
			hideError
		})
	},

	jw_card_delete(data, hideError) {
		return http.post("/api/edu/card_type/delete", {
			data,
			hideError
		})
	},

	jw_card_info(data, hideError) {
		return http.get("/api/edu/card_type/info", {
			data,
			hideError
		})
	},

	jw_card_open(data, hideError) {
		return http.post("/api/member/card/add", {
			data,
			hideError
		})
	},

	/**
	 * 课程
	 */

	jw_course_list(data, hideError){
		return http.get("/api/course/list", {
			data,
			hideError
		})
	},

	jw_course_update(data, hideError){
		return http.post("/api/course/update", {
			data,
			hideError
		})
	},

	jw_course_add(data, hideError){
		return http.post("/api/course/add", {
			data,
			hideError
		})
	},

	jw_course_delete(data, hideError){
		return http.post("/api/course/delete", {
			data,
			hideError
		})
	},

	jw_course_info(data, hideError){
		return http.get("/api/course/info", {
			data,
			hideError
		})
	},

	// 排课
	jw_paike_add(data, hideError){
		return http.post("/api/edu/coursetable/add", {
			data,
			hideError
		})
	},

	jw_paike_check(data, hideError){
		return http.post("/api/edu/coursetable/check", {
			data,
			hideError
		})
	},

	jw_paike_list(data, hideError){
		return http.get("/api/edu/coursetable/list", {
			data,
			hideError
		})
	},

	jw_paike_del(data, hideError){
		return http.post("/api/edu/coursetable/delete", {
			data,
			hideError
		})
	},

	jw_paike_update(data, hideError){
		return http.post("/api/edu/coursetable/update", {
			data,
			hideError
		})
	}

}