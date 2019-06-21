
var oneMinute = 1 * 60 * 1000
var oneDay = 24 * 60 * 60 * 1000;
var oneWeek = 7 * oneDay;
let format = {
	formatNumber(v) {
		let s = "";
		for (let i = 0; i < v.length; i++) {
			if ("0123456789".indexOf(v.substr(i, 1)) > -1) s += v.substr(i, 1);
		}
		let str = s.substr(0, 11);
		return str
	},

	formatNumberInt(v, num = 5) {
		let s = v.toString().replace(/[^\d]/gi, "");
		s = parseInt(s) ? parseInt(s) : ''
		return s.toString().substr(0, num)
	},

	formatNumberInt99(v, num = 5) {
		let s = v.toString().replace(/[^\d]/gi, "");
		if(s != 0){
			s = parseInt(s) 
		}
		if (s > 99) {
			s = 99
		}
		return s
	},

	formatphone(v) {
		let s = v.toString().replace(/[^\d]/gi, "");
		return s
	},

	priceFormat(val, num = 5, float = 2) {
		val = val.toString().replace(/[^\d.]/gi, "");
		if (val.indexOf(".") != -1) {
			let s = parseInt(val.split(".")[0]) ? parseInt(val.split(".")[0]) + "" : '0';
			if (s.length > num) {
				s = s.substr(0, num);
			}
			let f = val.split(".")[1];
			if (val.split(".")[1] && val.split(".")[1].length > float) {
				f = val.split(".")[1].substr(0, float);
			}
			return s + "." + f;
		} else {
			if (val && val != "") {
				let result = parseInt(val) + "";
				if (result.length > num) {
					result = result.substr(0, num);
				}
				return result;
			}
			return val;
		}
	},
	setUrlFunc(data) {
		let url = '?'
		for (let key in data) {
			url += key + '=' + data[key] + '&'
		}
		url = url.slice(0, url.length - 1)
		return url
	},
	filtersItem(arr, str, type, index) {

		let result = arr
		if (type == 'add') {
			if (result.indexOf(str) == -1) {
				if (index) {
					result.splice(index + 1, 0, str);
				} else {
					result.push(str)
				}
			}

			return result
		}

		if (type == 'edd') {
			result.forEach((item, index) => {
				if (item == str) {
					result.splice(index, 1)
				}
			})
			return result
		}
	},

	getWeek(date) {
		var week = '日一二三四五六'
		return '星期' + week.charAt(date.getDay())
	},

	// 时间格式化
	formatUserDate(milliseconds) {
		var date = new Date(milliseconds);
		var now = new Date();
		var nowMilliseconds = now.getTime()
		var dateStr = format.formatYYYYMMDD(date, '/')
		var nowStr = format.formatYYYYMMDD(now, '/')
		var str = ''
		var interval = nowMilliseconds - milliseconds
		if (interval < oneMinute) {
			str = '刚刚'
		} else if (interval >= oneMinute && interval <= 5 * oneMinute) {
			str = Math.floor(interval / oneMinute) + '分钟内'
		} else if (interval > 5 * oneMinute && interval <= 20 * oneMinute) {
			str = '20分钟内'
		} else if (interval > 20 * oneMinute && interval <= 60 * oneMinute) {
			str = '1小时内'
		} else if (dateStr === nowStr) {
			str = format.formatHHMM(date, ':')
		} else if (now - milliseconds <= oneDay) {
			str = '昨天 ' + format.formatHHMM(date, ':')
		} else if (now - milliseconds <= oneWeek) {
			str = format.getWeek(date) + ' ' + format.formatHHMM(date, ':')
		} else {
			var nowYear = now.getFullYear()
			var year = date.getFullYear()
			if (nowYear === year) {
				str = format.formatMMDD(date, '/') + ' ' + format.formatHHMM(date, ':')
			} else {
				str = format.formatYYYYMMDD(date, '/') + ' ' + format.formatHHMM(date, ':')
			}
		}
		return str
	},
	formatHHMM: function (date, delimiter) {
		var hour = date.getHours()
		hour = format.leftExtend(hour)
		var minute = date.getMinutes()
		minute = format.leftExtend(minute)
		if (!delimiter) {
			delimiter = ':'
		}
		return hour + delimiter + minute
	},
	formatMMDD: function (date, delimiter) {
		var month = date.getMonth() + 1
		month = format.leftExtend(month)

		var day = date.getDate()
		day = format.leftExtend(day)

		if (!delimiter) {
			delimiter = '-'
		}
		return month + delimiter + day
	},
	formatYYYYMMDD: function (date, delimiter) {
		var year = date.getFullYear()

		var month = date.getMonth() + 1
		month = format.leftExtend(month)

		var day = date.getDate()
		day = format.leftExtend(day)

		if (!delimiter) {
			delimiter = '-'
		}
		return year + delimiter + month + delimiter + day
	},
	leftExtend: function (num) {
		return num > 9 ? num : '0' + num
	},
}

export default {
	install: function (Vue, name = '$utils') {
		Object.defineProperty(Vue.prototype, name, { value: format });
	}
}