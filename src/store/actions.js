import user from "../api/user"
import edu from "../api/edu"
export default {
    // 获取用户信息
    getUserInfo(context, next) {
        user.getUserInfo()
            .then(data => {
                if (data.code == '1') {
                    context.commit('setUserInfo', data.data)
                    next ? next() : ""
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

    getQudao(context){
        edu.jw_qdset_getlist()
            .then(data => {
                if (data.code == '1') {
                    context.commit('setQudao', data.data)
                }
            })
    }
}
