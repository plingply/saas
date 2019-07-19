
import { MessageBox } from 'element-ui'
function mbox(obj) {
    let title = obj.messageHead ? obj.messageHead : '提示'
    let message = obj.message ? obj.message : ''
    let msg = `<div class='y_msgbox'><h1>${ title }</h1><p>${ message }</p></div>`;
    let option = {
        title: "提示",
        message: msg,
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        showCancelButton: true,
        showConfirmButton: true
    }
    delete obj.message
    delete obj.dangerouslyUseHTMLString
    let options = Object.assign(option, obj)
    return MessageBox(options)
}
export default {
    install: function (Vue, name = 'mbox') {
        Object.defineProperty(Vue.prototype, name, { value: mbox });
    }
}