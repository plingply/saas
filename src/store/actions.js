import user from "../api/user"
import edu from "../api/edu"
export default {
    // 获取用户信息
    getUserInfo(context, next) {
        user.getUserInfo()
            .then(data => {
                if (data.code == '1') {
                    context.commit('setUserInfo', data.data)
                    context.dispatch("getCampus", next)
                } else {
                    next ? next({ name: 'login' }) : ""
                }
            })
    },

    // 获取配置文件
    getConfig(context) {
        edu.jw_getConfig()
            .then(data => {
                if (data.code == '1') {
                    context.commit('setConfig', data.data)
                }
            })
    },

    // 获取学校信息
    getSchool(context) {
        user.getSchool()
            .then(data => {
                if (data.code == '1') {
                    context.commit('setSchool', data.data)
                }
            })
    },

    // 获取校区信息
    getCampus(context, next) {
        edu.jw_campus_list()
            .then(data => {
                if (data.code == '1') {
                    var arr = data.data ? data.data : []
                    context.commit("setCampusId", arr[0] ? arr[0].id : "")
                    context.commit('setCampus', arr)
                    next ? next() : ''
                }
            })
    },

    // 获取渠道
    getQudao(context, campus_id) {
        edu.jw_qdset_getlist({ campus_id})
            .then(data => {
                if (data.code == '1') {
                    context.commit('setQudao', data.data)
                }
            })
    },

    getRoleConfig(context){
        user.getRolePower().then(data => {
            if (data.code == "1") {
              context.commit("setRoleConfig",data.data)
            }
          });
    }
}
