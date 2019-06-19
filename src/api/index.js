
import user from './user'
import edu from './edu'

let assign = Object.assign(user,edu)
export default {
    install: function (Vue, name = '_NET') {
        Object.defineProperty(Vue.prototype, name, { value: assign });
    }
}
