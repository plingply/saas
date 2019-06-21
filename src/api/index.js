
import user from './user'
import edu from './edu'
import set from './setting'

let assign = Object.assign(user,edu,set)
export default {
    install: function (Vue, name = '_NET') {
        Object.defineProperty(Vue.prototype, name, { value: assign });
    }
}
