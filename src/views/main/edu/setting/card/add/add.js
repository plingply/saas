export default {
  data() {
    return {

      loading: false,
      xloading: false,

      form: {
        card_type: "1",
        name: "",
        expiry_date: "",
        note: ""
      },

      card_consume_rule: [],

      rules: {
        card_type: [{ required: true, message: " ", trigger: "blur" }],
        name: [{ required: true, message: " ", trigger: "blur" }],
        expiry_date: [{ required: true, message: " ", trigger: "blur" }]
      },

      courselist: [],
      allchecked: [],
      allnum: "",
      checkAll: false,
      checkAll_v: false,
      checkedList: [],
      isIndeterminate: false

    };
  },

  computed: {
    yx_config() {
      return this.$store.state.yx_config;
    }
  },

  watch: {
    allnum(v) {
      this.formatNum_none(v)
    },

    checkAll(v) {
      if (!v) {
        this.checkAll_v = false
      }
    },

    courselist: {
      deep: true,
      handler(val) {
        this.formatNum()
      }
    },

    /**
     * 解决切换卡类型 影响课程的值
     */
    form: {
      deep: true,
      handler(val) {
        this.formatNum()
        this.formatNum_none(this.allnum)
      }
    }
  },

  methods: {
    // 每个值 处理
    formatNum() {

      this.courselist.map(item => {
        if (this.form.card_type == '1') {
          item.num = this.$utils.priceFormat(item.num);
        }
        if (this.form.card_type == '2') {
          item.num = this.$utils.priceFormat(item.num, 5, 1);
        }
        if (this.form.card_type == '3') {
          item.num = this.$utils.formatNumberInt99(item.num);
        }
      });
    },

    // 全选 值处理
    formatNum_none(v) {
      if (!v) return
      if (this.form.card_type == '1') {
        v = this.$utils.priceFormat(v);
      }
      if (this.form.card_type == '2') {
        v = this.$utils.priceFormat(v, 5, 1);
      }
      if (this.form.card_type == '3') {
        v = this.$utils.formatNumberInt99(v);
      }
      this.allnum = v
      this.courselist.map(item => {
        item.num = v;
      });
    },
    /**
     * 有效期输入
     */
    timeInput(v) {
      v = v.replace(/[^\d]/gi, "");
      v = v ? parseInt(v) : "";
      if (v > 99) v = 99;
      if (v < 0) v = 0;
      this.form.expiry_date = v;
    },

    /**
     * 全选
     */
    handleCheckAllChange(val) {
      this.checkedList = val ? this.allchecked : [];
      this.isIndeterminate = false;
    },

    /**
     * 单选
     */
    handlecheckedListChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.courselist.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.courselist.length;
    },

    /**
     * 参数校验
     */
    verification() {
      if (!this.form.name || !this.form.name.trim()) {
        this._alert({
          type: "warning",
          msg: "学员卡名称不能为空"
        });
        return false;
      }

      if (!this.form.expiry_date) {
        this._alert({
          type: "warning",
          msg: "请填写有效期"
        });
        return false;
      }

      this.card_consume_rule = []

      let msg = ''

      if (this.form.card_type == '1') {
        msg = '消课金额'
      }
      if (this.form.card_type == '2') {
        msg = '消课课时'
      }
      if (this.form.card_type == '3') {
        msg = '有效期'
      }

      for (let j = 0; j < this.checkedList.length; j++) {
        let item = this.checkedList[j]
        for (let k = 0; k < this.courselist.length; k++) {
          let list = this.courselist[k]
          if (item == list.id) {
            if ((!list.num || list.num == '') && this.form.card_type != '3') {
              this._alert({
                type: "warning",
                msg: `请填写${list.name}的${msg}`
              });
              return false;
            }

            this.card_consume_rule.push({
              course_id: item,
              num: list.num
            })
          }
        }
      }
      return true;
    },

    /**
     * 格式化 参数
     */
    postData(idEditor) {
      if (!this.verification()) return;
      this.loading = true;
      let expiry_date = !this.form.expiry_date || this.form.expiry_date == '-1' ? '0' : this.form.expiry_date
      let data = {
        merchant_id: this.mymange,
        name: this.form.name,
        note: this.form.note,
        expiry_date,
        card_type: this.form.card_type
      };
      this.card_consume_rule.map((item, index) => {
        data['card_consume_rule[' + index + '][course_id]'] = item.course_id
        data['card_consume_rule[' + index + '][num]'] = item.num
      })
      if (idEditor) {
        data.id = this.$route.params.id
        this.editorpostData(data)
      } else {
        this.addpostData(data)
      }
    },

    /**
     * 新增
     */
    addpostData(data) {
      this._NET
        .jw_card_add(data)
        .then(data => {
          this.loading = false;
          if (data.status == "ok") {
            this._alert({
              type: "success",
              msg: "添加成功"
            });
            this.$router.push({ name: 'edu_setting_card' })
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },

    /**
     * 编辑
     */
    editorpostData(data) {
      this._NET
        .jw_card_update(data)
        .then(data => {
          this.loading = false;
          if (data.status == "ok") {
            this._alert({
              type: "success",
              msg: "更新成功"
            });
            this.$router.push({ name: 'edu_setting_card' })
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },

    /**
     * 课程列表
     */

    getCourseList(courseArr) {
      this.xloading = true
      this._NET
        .jw_course_list({
          merchant_id: this.mymange,
          page: 1,
          limit: 1000,
          status: '1'
        })
        .then(data => {
          this.loading = false;
          this.xloading = false
          if (data.status == "ok") {
            let allchecked = []
            let checkedList = []
            if (courseArr) {
              data.data.item.map(item => {
                item.num = ''
                courseArr.map(list => {
                  if (item.id == list.course_id) {
                    item.num = list.num
                    checkedList.push(item.id)
                  }
                })
                allchecked.push(item.id)
              })
            } else {
              data.data.item.map(item => {
                item.num = ''
                allchecked.push(item.id)
              })
            }
            this.allchecked = allchecked
            this.checkedList = checkedList
            this.courselist = data.data.item;
            this.handlecheckedListChange(this.checkedList)
          }
        })
        .catch(err => {
          this.loading = false;
          this.xloading = false
        });
    },

    /**
     * 卡详情
     */
    getInfo() {
      this.xloading = true
      this._NET.jw_card_info({
        merchant_id: this.mymange,
        id: this.$route.params.id
      }).then(data => {
        if (data.status == 'ok') {
          let info = data.data
          this.form.card_type = info.card_type
          this.form.name = info.name
          this.form.expiry_date = info.expiry_date == '0' ? '-1' : info.expiry_date
          this.form.note = info.note
          this.getCourseList(info.card_consume_rule)
        }
      }).catch(err => {
        this.xloading = false
      })
    },

    // 添加课程
    tolinkaddcard() {
      this.$router.push({ name: "edu_course_add" });
    }
  },

  created() {

    // 编辑
    if (this.$route.name == 'edu_setting_editorcard') {
      this.getInfo()
    } else {
      this.getCourseList()
    }
  },
};