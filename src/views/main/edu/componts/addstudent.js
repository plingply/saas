import lianxiList from "@/util/contact_list"
import addAfter from "./addAfter";
export default {

    props: ["show", "editor", "info"],

    data() {
        return {
            dialogVisible: false,
            loading: false,
            ismore: false,
            gutter: 20,
            lianxiList,
            title: '添加学员',
            form: {
                name: "",
                phone: "",
                age: "",
                sex: "",
                status: "1",
                birthday: "",
                school: "",
                class: "",
                phone_by: "",
                wechat: "",
                hobby: "",
                course_consultant: "",
                source: "",
                address: "",
                remark: "",
                phone_belong: '1',
                standby_phone_belong: '2',
                entry_time: ''
            },

            rules: {
                name: [{ required: true, message: " ", trigger: "blur" }],
                phone: [{ required: true, message: " ", trigger: "blur" }],
                sex: [{ required: true, message: " ", trigger: "blur" }],
                entry_time: [{ required: true, message: " ", trigger: "blur" }]
            },

            pickerOptions: {
                disabledDate(v) {
                    if (
                        v.getTime() > new Date().getTime() || v.getTime() < 0
                    ) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },

            // 引导
            showtime: 0,
            studentInfo: {}
        };
    },

    components: {
        addAfter
    },

    watch: {
        show() {
            this.dialogVisible = true;
            if (this.editor) {
                this.title = '编辑学员'
                this.form = {
                    name: this.info.name,
                    phone: this.info.phone,
                    age: this.info.age,
                    sex: this.info.sex,
                    status: this.info.status,
                    birthday: this.info.birthday ? new Date(this.info.birthday * 1000) : '',
                    school: this.info.school,
                    class: this.info.class,
                    phone_by: this.info.phone_by,
                    wechat: this.info.wechat,
                    hobby: this.info.hobby,
                    course_consultant: this.info.course,
                    source: this.info.sources,
                    address: this.info.address,
                    remark: this.info.remark,
                    phone_belong: this.info.phone_belong,
                    standby_phone_belong: this.info.standby_phone_belong,
                    entry_time: this.info.entry_time && this.info.entry_time > 0 ? new Date(this.info.entry_time * 1000) : ''
                }
            } else {
                this.title = '添加学员'
                this.form = {
                    name: "",
                    phone: "",
                    age: "",
                    sex: "",
                    status: "1",
                    birthday: "",
                    school: "",
                    class: "",
                    phone_by: "",
                    wechat: "",
                    hobby: "",
                    course_consultant: "",
                    source: "",
                    address: "",
                    remark: "",
                    phone_belong: '1',
                    standby_phone_belong: '2',
                    entry_time: new Date()
                }
            }
        }
    },

    computed: {
        yx_config() {
            return this.$store.state.yx_config;
        },
        qdlist() {
            return this.$store.state.yx_qudao;
        },
        yx_cclist() {
            return this.$store.state.yx_cclist;
        }
    },

    methods: {

        /**
         * 添加学员
         */
        addfun() {

            if (!this.verification()) return;

            this.loading = true
            let form = {}

            for (let key in this.form) {
                form[key] = this.form[key]
            }

            form.birthday = form.birthday ? parseInt(form.birthday.getTime() / 1000) : ''
            form.entry_time = form.entry_time ? parseInt(form.entry_time.getTime() / 1000) : ''
            form.campus_id = this.campus_id

            if (this.editor) {
                form.id = this.info.id
                this.editorStudent(form)
            } else {
                this.addNewStudent(form)
            }
        },

        addNewStudent(form) {
            this._NET.jw_student_add(form).then(data => {
                this.loading = false
                if (data.code == "1") {
                    this._alert({
                        type: 'success',
                        msg: '添加成功'
                    })

                    this.dialogVisible = false;
                    this.callback()

                    this.studentInfo = data.data
                    this.showtime = Date.now()

                }
            }).catch(err => {
                this.loading = false
            })
        },

        editorStudent(form) {
            this._NET
                .jw_student_update(form)
                .then(data => {
                    this.loading = false;
                    if (data.code == "1") {
                        this._alert({
                            type: "success",
                            msg: "修改成功"
                        });

                        this.dialogVisible = false;
                        this.callback()
                    }
                })
                .catch(err => {
                    this.loading = false;
                });
        },

        callback() {
            this.$emit('callback')
        },

        /**
         * 添加学员字段 验证
         */
        verification() {
            if (!this.form.name || !this.form.name.trim()) {
                this._alert({
                    type: "warning",
                    msg: "学员姓名不能为空"
                });
                return false
            }

            if (!this.form.phone || !this.form.phone.trim()) {
                this._alert({
                    type: "warning",
                    msg: "学员电话不能为空"
                });
                return false
            }

            if (!this.phoneReg.test(this.form.phone)) {
                this._alert({
                    type: "warning",
                    msg: "学员电话格式不正确"
                });
                return false
            }

            if (!this.form.sex || (this.form.sex != '男' && this.form.sex != '女' && this.form.sex != '保密')) {
                this._alert({
                    type: "warning",
                    msg: "请选择学员性别"
                });
                return false
            }

            if (!this.form.entry_time) {
                this._alert({
                    type: "warning",
                    msg: "请选择入学时间"
                });
                return false
            }

            return true
        },

        /**
         * 年龄字段
         */
        ageInput(v) {
            this.form.age = this.form.age.replace(/[^\d]/gi, "");

            // if (this.form.age.indexOf('.') > -1) {
            //     let p = this.form.age.split('.')[0]
            //     let f = this.form.age.split('.')[1]
            //     if (p && f) {
            //         this.form.age = parseInt(p) + '.' + parseInt(f.substr(0, 2))
            //     } else if (!p && f) {
            //         this.form.age = '0.' + parseInt(f.substr(0, 2))
            //     } else if (p && !f) {
            //         this.form.age = parseInt(p) + '.'
            //     } else if (!p && !f) {
            //         this.form.age = '0.'
            //     }
            // }

            if (this.form.age < 0) {
                this.form.age = ''
            }
            if (this.form.age > 99) {
                this.form.age = 99
            }
        },

        /**
         * 电话
         */
        phoneInput() {
            this.form.phone = this.form.phone.replace(/[^\d]/gi, "");
        },
        phone1Input() {
            this.form.phone_by = this.form.phone_by.replace(/[^\d]/gi, "");
        },
        // 生日
        changeBirth(v) {
            if (v) {
                let now = Date.now()
                let b = v.getTime()
                let time = now - b
                let yc = 1000 * 60 * 60 * 24 * 365
                let year = parseInt(time / yc)
                this.form.age = year < 1 ? 1 : year
            }
        }
    }
};