import http from "../plugin/ajax/ajax"
export default {

	addRoleList(data, hideError){
		return http.post("/api/role/add", {
			data
		})
    },

    editorRole(data, hideError){
		return http.post("/api/role/update", {
			data
		})
    },

    delRole(data, hideError){
		return http.post("/api/role/delete", {
			data
		})
    },

    getRoleList(data, hideError){
		return http.get("/api/role", {
			data
		})
    },
}