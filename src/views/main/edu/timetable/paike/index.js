
import editorpk from "../editor.vue"
export default {
    props: ["showtime", "time", "classlist", "teacherlist", "classroomlist"],
    data() {
        return {
            show: false,
            loading: false,
            paikeText: "加载中...",

            /**
             * 编辑相关
             */
            edshow: 0,
            pkdata: {},
            edtindex: 0,

            step: "1",
            form: {
                class: "",
                subject: "",
                teacher: '',
                start_time: "",
                time: "",
                chongfu: "1",
                endtime: "",
                sc: "",
                classroom: "",
                end_time: ""
            },

            checkCode: 0,

            /**
             * 待排课数组
             */
            waitArr: [],

            // 记录小时
            hours_time: '',

            rules: {
                class: [{ required: true, message: " ", trigger: "blur" }],
                subject: [{ required: true, message: " ", trigger: "blur" }],
                teacher: [{ required: true, message: " ", trigger: "blur" }],
                start_time: [{ required: true, message: " ", trigger: "blur" }],
                sc: [{ required: true, message: " ", trigger: "blur" }]
            },

            subjectlist: [],

            pickerOptions: {
                disabledDate(v) {
                    return true
                }
            },
            pickerOptions_1: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 1000 * 3600 * 24;
                }
            }
        };
    },

    watch: {
        showtime() {
            this.step = "1";
            let start = ''
            if (this.time && this.time.getTime() < new Date().getTime()) {
                start = new Date()
            } else {
                start = this.time?this.time:''
            }
            this.form.start_time = start ? start : ''
            this.show = true;
            this.startChange()
        }
    },

    components: {
        editorpk
    },

    methods: {

        startChange() {
            this.form.end_time = ''
            this.typeChange()
        },

        typeChange() {
            let _self = this
            if (this.form.start_time && this.form.start_time != 'null') {
                this.pickerOptions.disabledDate = function (v) {
                    if(!_self.form.start_time.getTime){
                        return true
                    }
                    let time = _self.form.start_time.getTime()
                    let c = 1000 * 3600 * 24 * 60
                    let end = time + c

                    if (v > end || v < time) {
                        return true
                    } else {
                        return false
                    }
                }
            } else {
                return true
            }
        },

        // 本地检测冲突
        localCheck(indexs) {
            let curent = this.waitArr[indexs]
            let start = curent.start_time * 1000
            let end = start + curent.len * 60
            this.waitArr.map((item, index) => {
                if (indexs != index) {
                    let s = item.start_time * 1000
                    let e = s + item.len * 60
                    if ((start < s && end > s) || (start >= s && start < e)) {
                        // 冲突
                        if (curent.grade_id == item.grade_id) {
                            item.class_ct = true
                        }

                        if (curent.classroom_id == item.classroom_id) {
                            item.classroom_ct = true
                        }

                        if (curent.teacher_ids == item.teacher_ids) {
                            item.teacher_ct = true
                        }
                    }
                }
            })
        },
        // 列表修改排课
        editorfunc(obj, index) {
            this.pkdata = obj
            this.edtindex = index
            this.edshow = Date.now()
        },

        edtcallback(data) {
            for (let key in data) {
                this.waitArr[this.edtindex][key] = data[key]
            }
            this.paikeText = `冲突检查中(${0}/1)`
            this.paikeCheck(this.waitArr[this.edtindex])
                .then(res => {
                    this.paikeText = `冲突检查中(1/1)`
                    this.waitArr[this.edtindex].classroom_ct = false
                    this.waitArr[this.edtindex].class_ct = false
                    this.waitArr[this.edtindex].teacher_ct = false
                    // 0:正常,1000:教室冲突1001:年级冲突1002:老师冲突
                    if (res.code == 1000) {
                        this.waitArr[this.edtindex].classroom_ct = true
                    }

                    if (res.code == 1001) {
                        this.waitArr[this.edtindex].class_ct = true
                    }

                    if (res.code == 1002) {
                        this.waitArr[this.edtindex].teacher_ct = true
                    }

                    this.localCheck(this.edtindex)

                })

        },

        delpaike(index) {
            this.waitArr.splice(index, 1)
        },

        nextFunc() {

            // 不重复
            if (this.form.chongfu == "1") {
                if (!this.verification()) return
                let time = new Date(this.form.time)
                this.hours_time = time.getTime() - time.setHours(0, 0, 0)
                this.singlePaike()
            } else {
                if (!this.verification()) return
                this.waitArr = this.repeatFun()
                this.loading = true
                let count = 0
                this.paikeText = `冲突检查中(${count}/${this.waitArr.length})`
                this.waitArr.map((item, index) => {
                    this.paikeCheck(item)
                        .then(data => {
                            count++
                            this.paikeText = `冲突检查中(${count}/${this.waitArr.length})`
                            if (count >= this.waitArr.length) this.loading = false
                            // 0:正常,1000:教室冲突1001:年级冲突1002:老师冲突
                            if (data.code == 1000) {
                                this.waitArr[index].classroom_ct = true
                            }

                            if (data.code == 1001) {
                                this.waitArr[index].class_ct = true
                            }

                            if (data.code == 1002) {
                                this.waitArr[index].teacher_ct = true
                            }
                        })

                })
                this.step = "2";
            }
        },

        singlePaike(type) {
            let data = {
                merchant_id: this.mymange,
                grade_id: this.form.class,
                course_id: this.form.subject,
                teacher_ids: this.form.teacher,
                start_time: parseInt((this.form.start_time.setHours(0, 0, 0) + this.hours_time) / 1000),
                len: this.form.sc,
                classroom_id: this.form.classroom,
                ignore_conflict: type == '1' ? '1' : '0'
            }

            this.loading = true

            this.paikeAdd(data)
                .then(res => {
                    this.loading = false
                    if (res.status == 'ok') {
                        this.show = false
                        this._alert({
                            type: "success",
                            msg: "添加成功"
                        });
                        this.$emit('callback')

                        this.form = {
                            class: "",
                            subject: "",
                            teacher: '',
                            start_time: "",
                            time: "",
                            chongfu: "1",
                            endtime: "",
                            sc: "",
                            classroom: "",
                            end_time: ""
                        }
                    } else {
                        if (res.code == 1000 || res.code == 1001 || res.code == 1002) {
                            this.checkCode = res.code
                            this.step = '3'
                        } else {
                            this._alert({
                                type: "warning",
                                msg: res.msg
                            });
                        }

                    }
                })
                .catch(err => {
                    this.loading = false
                })
        },

        // 重复添加 确认
        addfunc() {

            if (this.waitArr.length == 0) {
                this._alert({
                    type: "warning",
                    msg: "请添加排课信息"
                });
                return
            }
            let count = 0
            this.loading = true
            this.paikeText = `排课中(${count}/${this.waitArr.length})`
            this.waitArr.map(item => {
                this.paikeAdd({
                    merchant_id: item.merchant_id,
                    grade_id: item.grade_id,
                    course_id: item.course_id,
                    teacher_ids: item.teacher_ids,
                    start_time: item.start_time,
                    len: item.len,
                    classroom_id: item.classroom_id,
                    ignore_conflict: '1'
                })
                    .then(data => {
                        count++
                        this.paikeText = `排课中(${count}/${this.waitArr.length})`
                        if (count > this.waitArr.length - 1) {
                            this.show = false
                            this.$emit("callback")
                            this.loading = false
                            this._alert({
                                type: "success",
                                msg: "排课成功"
                            });

                            this.form = {
                                class: "",
                                subject: "",
                                teacher: '',
                                start_time: "",
                                time: "",
                                chongfu: "1",
                                endtime: "",
                                sc: "",
                                classroom: "",
                                end_time: ""
                            }

                            return
                        }
                        if (data.status != 'ok') {
                            this._alert({
                                type: "warning",
                                msg: data.msg
                            });
                        }
                    })
            })

        },

        paikeCheck(obj) {
            return this._NET.jw_paike_check(obj, true)
        },

        /**
         * 重复排课计算
         */
        repeatFun() {

            let count = 0
            let time = new Date(this.form.time)
            this.hours_time = time.getTime() - time.setHours(0, 0, 0)
            let start = this.form.start_time.setHours(0, 0, 0) + this.hours_time
            let end = this.form.end_time.setHours(23, 59, 59)
            //   按日重复
            if (this.form.chongfu == '2') {
                count = 1
            }
            //   按周重复
            if (this.form.chongfu == '3') {
                count = 7
            }

            let step = 1000 * 3600 * 24 * count
            let len = parseInt((end - start) / step) + 1
            let timeArr = []
            for (let i = 0; i < len; i++) {

                timeArr.push({
                    merchant_id: this.mymange,
                    grade_id: this.form.class,
                    course_id: this.form.subject,
                    teacher_ids: this.form.teacher,
                    start_time: parseInt(new Date(start + i * step).getTime() / 1000),
                    len: this.form.sc,
                    classroom_id: this.form.classroom,
                    class_ct: false,
                    teacher_ct: false,
                    classroom_ct: false
                })
            }

            return timeArr
        },

        paikeAdd(obj) {
            return this._NET.jw_paike_add(obj, true)
        },

        backstep(v) {
            this.step = v;
        },

        scInput(v) {
            v = this.$utils.formatNumberInt(v);
            this.form.sc = v;
        },


        classChange(id) {
            this.form.subject = "";
            this.classlist.map(item => {
                if (item.id == id) {
                    this.subjectlist = item.course_list;
                }
            });
        },


        verification() {
            if (!this.form.class) {
                this._alert({
                    type: "warning",
                    msg: "请选择班级"
                });
                return false;
            }

            if (!this.form.subject) {
                this._alert({
                    type: "warning",
                    msg: "请选择课程"
                });
                return false;
            }

            if (!this.form.teacher) {
                this._alert({
                    type: "warning",
                    msg: "请选择授课老师"
                });
                return false;
            }

            if (!this.form.start_time) {
                this._alert({
                    type: "warning",
                    msg: "请选择上课日期"
                });
                return false;
            }

            if (!this.form.time) {
                this._alert({
                    type: "warning",
                    msg: "请选择上课时间"
                });
                return false;
            }

            let house = this.form.time.getHours();
            let min = this.form.time.getMinutes();
            let len = house * 1000 * 60 * 60 + min * 60 * 1000

            if (this.form.start_time.getTime() <= new Date().getTime()) {
                if (this.form.start_time.getTime() + len <= new Date().getTime()) {
                    this._alert({
                        type: "warning",
                        msg: "上课时间必须大于当前时间"
                    });
                    return false
                }
            }

            if (!this.form.sc) {
                this._alert({
                    type: "warning",
                    msg: "请填写上课时长"
                });
                return false;
            }

            if (this.form.sc <= 0) {
                this._alert({
                    type: "warning",
                    msg: "上课时长必须大于0"
                });
                return false;
            }

            if (this.form.chongfu != "1") {
                if (!this.form.end_time) {
                    this._alert({
                        type: "warning",
                        msg: "请选择结束日期"
                    });
                    return false;
                }

                if (this.form.end_time <= this.form.start_time) {
                    this._alert({
                        type: "warning",
                        msg: "结束日期必须大于开始日期"
                    });
                    return false;
                }

                let day = parseInt(
                    (this.form.end_time.getTime() - this.form.start_time.getTime()) /
                    (1000 * 3600 * 24)
                );

                if (day > 60) {
                    this._alert({
                        type: "warning",
                        msg: "开始时间和结束时间最大间隔60天"
                    });
                    return false;
                }
            }

            return true;
        }
    }
};