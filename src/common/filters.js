
import phone_belong from "../util/contact_list"
export default function (vue) {
    vue.filter("yyyy_mm_dd_H_M_S", function (val) { //1989-01-11 11:05:12
        if (!val || val == 0 || val == '') return "--";
        var date = new Date(val * 1000);
        return date.getFullYear() + "-" + ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1)) + '-' + (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate()) + " " + (date.getHours() < 10 ? ("0" + date.getHours()) : date.getHours()) + ":" + (date.getMinutes() < 10 ? ("0" + date.getMinutes()) : date.getMinutes()) + ":" + (date.getSeconds() < 10 ? ("0" + date.getSeconds()) : date.getSeconds());
    })

    vue.filter("yyyy_mm_dd_H_M", function (val) { //1989-01-11 11:05
        if (!val || val == 0 || val == '') return "--";
        var date = new Date(val * 1000);
        return date.getFullYear() + "-" + ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1)) + '-' + (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate()) + " " + (date.getHours() < 10 ? ("0" + date.getHours()) : date.getHours()) + ":" + (date.getMinutes() < 10 ? ("0" + date.getMinutes()) : date.getMinutes());
    })

    vue.filter("H_M", function (val) { // 11:05
        if (!val || val == 0 || val == '') return "--";
        var date = new Date(val * 1000);
        return (date.getHours() < 10 ? ("0" + date.getHours()) : date.getHours()) + ":" + (date.getMinutes() < 10 ? ("0" + date.getMinutes()) : date.getMinutes());
    })

    vue.filter("yyyy_mm_dd", function (val) { //1989-01-11
        if (!val || val == 0 || val == '') return "--";
        var date = new Date(val * 1000);
        return date.getFullYear() + "-" + ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1)) + '-' + (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate())
    })

    vue.filter("yyyy_mm_dd1", function (val) { //1989年01月11日
        if (!val || val == 0 || val == '') return "--";
        var date = new Date(val * 1000);
        return date.getFullYear() + "年" + ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1)) + '月' + (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate()) + "日"
    })

    vue.filter("currency", function (val) {
        if (val === "CNY") {
            return "￥";
        } else {
            return "";
        }
    })

    vue.filter('format', function (val) {
        if (!val || val == '') return val
        // 手机号
        if (val.length == 11) {
            let result = val.substr(0, 3) + '****' + val.substr(val.length - 4)
            return result
        }

        if (val.length >= 15) {
            let result = val.substr(0, 1) + '****************' + val.substr(val.length - 1)
            return result
        }
    })

    vue.filter('bankcardnom', function (val) {
        if (!val || val == "") return val;
        let result = "";
        result = val.substr(0, 4) + '******' + val.substr(val.length - 4)
        return result;
    })
    vue.filter('bankcardnoms', function (val) {
        if (val == "") return val;
        let result = "";
        for (let i = 1; i <= val.length; i++) {
            if (i % 4 == 0 && i > 0) {
                result += val[i - 1] + " ";
            } else {
                result += val[i - 1];
            }
        }
        return result;
    })

    vue.filter("formatNum", function (val) {
        switch (val) {
            case 1:
                return '一';
            case 2:
                return '二';
            case 3:
                return '三';
            case 4:
                return '四';
            case 5:
                return '五';
            default:
                return val
        }
    })

    vue.filter("phone_belong", function (val) {
        for (let k = 0; k < phone_belong.length; k++) {
            if (val === phone_belong[k].value) {
                return phone_belong[k].label
            }
        }
        return val
    })

    vue.filter("unit", function (val) {
        let res = "";
        if (val == "1") {
            res = "元";
        }
        if (val == "2") {
            res = "课时";
        }
        if (val == "3") {
            res = "个月";
        }
        return res;
    })

    vue.filter("time_yu_e", function (val) {
        if(val <= 0)return '0天'
        let month = 60 * 60 * 24 * 30
        let day = 60 * 60 * 24
        let res = ''
        val = parseInt(val)
        let m = parseInt(val / month)
        if (m > 0) {
            let d = Math.floor((val - m * month) / day)
            if (d > 0) {
                res = m + '个月' + d + '天'
            } else {
                res = m + '个月'
            }
        } else {
            let d = Math.floor(val / day)
            res = d + '天'
        }
        return res;
    })
}