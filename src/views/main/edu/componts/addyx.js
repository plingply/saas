export default {

    props: ["show"],

    data() {
        return {
            dialogVisible: false,
            loading: false,
            ismore: false,
            form: {
                name: "",
                phone: "",
                age: "",
                sex: "",
                intention_course: "",
                intention_level: "",
                birthday: "",
                school: "",
                class: "",
                parent_name: "",
                phone_by: "",
                wechat: "",
                hobby: "",
                course_consultant: "",
                source: "",
                address: "",
                remark: ""
            },

            rules: {
                name: [{ required: true, message: " ", trigger: "blur" }],
                phone: [{ required: true, message: " ", trigger: "blur" }]
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
            }
        };
    },

    watch: {
        show() {
            this.dialogVisible = true;
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
         * 添加线索
         */
        addfun() {
            if (!this.verification()) return;

            this.loading = true
            let form = {}
            this.form.merchant_id = this.mymange

            for (let key in this.form) {
                form[key] = this.form[key]
            }
            form.birthday = form.birthday ? parseInt(form.birthday.getTime()/1000) : ''

            this._NET.jw_yx_add(form)
                .then(data => {
                    this.loading = false
                    if (data.code == '1') {
                        this._alert({
                            type: 'success',
                            msg: '添加成功'
                        })

                        this.form = {
                            name: "",
                            phone: "",
                            age: "",
                            sex: "",
                            intention_course: "",
                            intention_level: "",
                            birthday: "",
                            school: "",
                            class: "",
                            parent_name: "",
                            phone_by: "",
                            wechat: "",
                            hobby: "",
                            course_consultant: "",
                            source: "",
                            address: "",
                            remark: ""
                        }

                        this.dialogVisible = false;

                        this.$emit('addcallback')
                    }
                }).catch(err => {
                    this.loading = false
                })
        },

        /**
         * 添加线索字段 验证
         */
        verification() {
            if (!this.form.name.trim()) {
                this._alert({
                    type: "warning",
                    msg: "学员姓名不能为空"
                });
                return false
            }

            if (!this.form.phone.trim()) {
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

            if (this.form.phone_by && !this.phoneReg.test(this.form.phone_by)) {
                this._alert({
                    type: "warning",
                    msg: "备用电话格式不正确"
                });
                return false;
            }

            return true
        },

        /**
         * 年龄字段
         */
        ageInput(v) {
            this.form.age = this.form.age.replace(/[^\d]/gi, "");
            if (this.form.age < 0) {
                this.form.age = 0
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
        }
    }
};