
export default {
  data() {
    return {

      loading: false,
      xloading: false,
      cardType: 'all',

      // 课程状态
      status: '1',

      form: {
        name: '',
        note: ''
      },

      rules: {
        name: [{ required: true, message: " ", trigger: "blur" }]
      },

      card_consume_rule: [],

      /**
       * 储值卡
       */
      cz_cardlist: [],
      cz_checkAll: false,
      cz_checkAll_value: false,
      cz_checkedCardList: [],
      cz_allchecked: [],
      cz_allnum: "",
      cz_isIndeterminate: false,

      /**
       * 课时卡
       */
      ks_cardlist: [],
      ks_checkAll: false,
      ks_checkAll_value: false,
      ks_checkedCardList: [],
      ks_allchecked: [],
      ks_allnum: "",
      ks_isIndeterminate: false,

      /**
       * 期限卡
       */
      qx_cardlist: [],
      qx_checkAll: false,
      qx_checkedCardList: [],
      qx_allchecked: [],
      qx_isIndeterminate: false
    };
  },

  computed: {
    yx_config() {
      return this.$store.state.yx_config;
    }
  },

  watch: {
    cz_allnum(v) {
      this.formatNum_none(v, '1')
    },

    cz_cardlist: {
      deep: true,
      handler(val) {
        this.formatNum('1')
      }
    },

    ks_allnum(v) {
      this.formatNum_none(v, '2')
    },

    ks_cardlist: {
      deep: true,
      handler(val) {
        this.formatNum('2')
      }
    },

    cz_checkAll(v) {
      if (!v) {
        this.cz_checkAll_value = false
      }
    },

    ks_checkAll(v) {
      if (!v) {
        this.ks_checkAll_value = false
      }
    }

  },

  methods: {
    // 每个值 处理
    formatNum(type) {

      if (type == '1') {
        this.cz_cardlist.map(item => {
          item.num = this.$utils.priceFormat(item.num);
        });
      }

      if (type == '2') {
        this.ks_cardlist.map(item => {
          item.num = this.$utils.priceFormat(item.num, 5, 1);
        });
      }

    },

    // 全选 值处理
    formatNum_none(v, type) {

      if (!v) return

      if (type == '1') {
        v = this.$utils.priceFormat(v);
        this.cz_allnum = v
        this.cz_cardlist.map(item => {
          item.num = v;
        });
      }

      if (type == '2') {
        v = this.$utils.priceFormat(v, 5, 1);
        this.ks_allnum = v
        this.ks_cardlist.map(item => {
          item.num = v;
        });
      }

    },
    /**
     * 有效期输入
     */
    timeInput(v) {
      v = v.replace(/[^\d]/gi, "");
      v = v ? parseInt(v) : "";
      if (v > 99) v = 99;
      if (v < 0) v = 0;
      this.cardTime = v;
    },

    changeMonth(v) {
      this.cardTime = v;
    },

    /**
     * 储值卡
     */
    cz_handleCheckAllChange(val) {
      this.cz_checkedCardList = val ? this.cz_allchecked : [];
      this.cz_isIndeterminate = false;
    },
    cz_handlecheckedsubjectChange(value) {
      let checkedCount = value.length;
      this.cz_checkAll = checkedCount === this.cz_cardlist.length;
      this.cz_isIndeterminate =
        checkedCount > 0 && checkedCount < this.cz_cardlist.length;
    },

    /**
     * 课时卡
     */
    ks_handleCheckAllChange(val) {
      this.ks_checkedCardList = val ? this.ks_allchecked : [];
      this.ks_isIndeterminate = false;
    },
    ks_handlecheckedsubjectChange(value) {
      let checkedCount = value.length;
      this.ks_checkAll = checkedCount === this.ks_cardlist.length;
      this.ks_isIndeterminate =
        checkedCount > 0 && checkedCount < this.ks_cardlist.length;
    },

    /**
     * 期限卡
     */
    qx_handleCheckAllChange(val) {
      this.qx_checkedCardList = val ? this.qx_allchecked : [];
      this.qx_isIndeterminate = false;
    },
    qx_handlecheckedsubjectChange(value) {
      let checkedCount = value.length;
      this.qx_checkAll = checkedCount === this.qx_cardlist.length;
      this.qx_isIndeterminate =
        checkedCount > 0 && checkedCount < this.qx_cardlist.length;
    },

    getmsg(type) {
      let msg = ''
      if (type == '1') {
        msg = '消课金额'
      }
      if (type == '2') {
        msg = '消课课时'
      }
      if (type == '3') {
        msg = '有效期'
      }
      return msg
    },

    verification() {
      if (!this.form.name || !this.form.name.trim()) {
        this._alert({
          type: "warning",
          msg: "课程名称不能为空"
        });
        return false;
      }

      this.card_consume_rule = []
      let checkedList = this.cz_checkedCardList.concat(this.ks_checkedCardList, this.qx_checkedCardList)
      let cardlist = this.cz_cardlist.concat(this.ks_cardlist, this.qx_cardlist)
      for (let j = 0; j < checkedList.length; j++) {
        let item = checkedList[j]
        for (let k = 0; k < cardlist.length; k++) {
          let list = cardlist[k]
          if (item == list.id) {
            if ((!list.num || list.num == '') && list.card_type != '3') {
              this._alert({
                type: "warning",
                msg: `请填写${list.name}的${this.getmsg(list.card_type)}`
              });
              return false;
            }
            this.card_consume_rule.push({
              card_type_id: item,
              num: list.num
            })
          }
        }
      }

      return true;
    },

    /**
     * 获取所有卡
     */
    getCardlist(courselist) {
      this.xloading = true;
      this._NET
        .jw_card_list({
          merchant_id: this.mymange,
          limit: 1000,
          page: 1
        })
        .then(data => {
          this.xloading = false;
          if (data.code == "1") {
            let list = data.data.item
            let cz_cardlist = []
            let cz_allchecked = []
            let ks_cardlist = []
            let ks_allchecked = []
            let qx_cardlist = []
            let qx_allchecked = []

            if (courselist && courselist.length > 0) {
              list.map(item => {
                item.num = ''
                courselist.map(lists => {
                  if (item.id == lists.card_type_id) {
                    item.num = lists.num
                  }
                })
                if (item.card_type == '1') {
                  cz_cardlist.push(item)
                  cz_allchecked.push(item.id)
                }
                if (item.card_type == '2') {
                  ks_cardlist.push(item)
                  ks_allchecked.push(item.id)
                }
                if (item.card_type == '3') {
                  qx_cardlist.push(item)
                  qx_allchecked.push(item.id)
                }
              })

            } else {
              list.map(item => {
                item.num = ''
                if (item.card_type == '1') {
                  cz_cardlist.push(item)
                  cz_allchecked.push(item.id)
                }
                if (item.card_type == '2') {
                  ks_cardlist.push(item)
                  ks_allchecked.push(item.id)
                }
                if (item.card_type == '3') {
                  qx_cardlist.push(item)
                  qx_allchecked.push(item.id)
                }
              })
            }

            this.cz_cardlist = cz_cardlist
            this.cz_allchecked = cz_allchecked
            this.ks_cardlist = ks_cardlist
            this.ks_allchecked = ks_allchecked
            this.qx_cardlist = qx_cardlist
            this.qx_allchecked = qx_allchecked

            this.cz_handlecheckedsubjectChange(this.cz_checkedCardList)
            this.ks_handlecheckedsubjectChange(this.ks_checkedCardList)
            this.qx_handlecheckedsubjectChange(this.qx_checkedCardList)

          }
        })
        .catch(err => {
          this.xloading = false;
        })
    },

    postData(isEditor) {
      if (!this.verification()) return;
      this.loading = true;
      let data = {
        merchant_id: this.mymange,
        name: this.form.name,
        note: this.form.note
      };
      this.card_consume_rule.map((item, index) => {
        data['card_consume_rule[' + index + '][card_type_id]'] = item.card_type_id
        data['card_consume_rule[' + index + '][num]'] = item.num
      })

      if (isEditor) {
        data.id = this.$route.params.id
        data.status = this.status
        this.editorCoureseFunc(data)
      } else {
        this.addCoureseFunc(data)
      }
    },

    addCoureseFunc(data) {
      this._NET
        .jw_course_add(data)
        .then(data => {
          this.loading = false;
          if (data.code == "1") {
            this._alert({
              type: "success",
              msg: "添加成功"
            });
            this.$router.push({ name: 'edu_course_list' })
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },

    editorCoureseFunc(data) {
      this._NET
        .jw_course_update(data)
        .then(data => {
          this.loading = false;
          if (data.code == "1") {
            this._alert({
              type: "success",
              msg: "修改成功"
            });
            this.$router.push({ name: 'edu_course_info', params: { id: this.$route.params.id } })
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },

    /**
     * 详情
     */
    getInfo() {
      this.xloading = true;
      this._NET
        .jw_course_info({
          merchant_id: this.mymange,
          id: this.$route.params.id
        })
        .then(data => {
          if (data.code == "1") {
            let info = data.data;
            this.form.name = info.name
            this.form.note = info.note
            this.status = info.status

            let cz_checkedCardList = []
            let ks_checkedCardList = []
            let qx_checkedCardList = []
            info.card_consume_rule.map(item => {
              // 储值卡
              if (item.card_type == '1') {
                cz_checkedCardList.push(item.card_type_id)
              }
              // 课时卡
              if (item.card_type == '2') {
                ks_checkedCardList.push(item.card_type_id)
              }
              // 期限卡
              if (item.card_type == '3') {
                qx_checkedCardList.push(item.card_type_id)
              }
            })

            this.cz_checkedCardList = cz_checkedCardList
            this.ks_checkedCardList = ks_checkedCardList
            this.qx_checkedCardList = qx_checkedCardList

            this.getCardlist(info.card_consume_rule)

          }
        })
        .catch(err => {
          this.xloading = false;
        });
    },

    // 跳转到添加卡片
    tolinkaddcard() {
      this.$router.push({ name: 'edu_setting_addcard' })
    }
  },

  created() {
    if (this.$route.name == 'edu_course_editor') {
      this.getInfo()
    } else {
      this.getCardlist()
    }
  },
};
