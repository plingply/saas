import calendar from "c-calendar";
import paike from "../paike/index.vue"
import edtsubject from "../editor.vue"
export default {
  name:"timetable_list",
  data() {
    return {
      loading: false,
      calendar: {},
      calendarList: {},
      type: "month",
      calendarType: '1',
      popshow: 0,
      paiketime: 0,
      currentSubject: {},
      pkstartime: 0,

      // 修改
      edshow: 0,

      classlist: [],
      teacherlist: [],
      classroomlist: [],

      classroomid: '',
      classid: '',
      teacherid: ''

    };
  },

  filters: {
    weekUnit(v) {
      let result = "";
      switch (v) {
        case 1:
          result = "周一";
          break;
        case 2:
          result = "周二";
          break;
        case 3:
          result = "周三";
          break;
        case 4:
          result = "周四";
          break;
        case 5:
          result = "周五";
          break;
        case 6:
          result = "周六";
          break;
        case 7:
          result = "周日";
          break;
      }
      return result;
    }
  },

  components: {
    paike,
    edtsubject
  },

  computed: {
    edum_status() {
      return this.$store.state.edum_status;
    }
  },

  methods: {

    dbClickPaike(item, type) {
      
      if (type == 'month' && item.isCurrentMonth) {
        this.pkstartime = new Date(item.year, item.month - 1, item.day)
        this.paiketime = Date.now()
      }
      if (type == 'week') {
        this.pkstartime = new Date(item.year, item.month - 1, item.day)
        this.paiketime = Date.now()
      }

    },

    paikefunc() {
      this.pkstartime = ''
      this.paiketime = Date.now()
    },

    showPopfunc(list) {
      this.currentSubject = list
      this.popshow = Date.now();
    },

    weekandmonthFun(val) {
      if (val == 'month') {
        this.calendar = new calendar({
          time: new Date(),
          type: val,
          week: this.calendarType
        })
        this.calendarList = this.calendar.init()
        this.getList()
      }

      if (val == 'week') {
        this.calendar = new calendar({
          time: new Date(),
          type: val,
          week: this.calendarType
        })
        this.calendarList = this.calendar.init()
        this.getList()
      }
    },

    prew() {
      this.calendarList = this.calendar.prew()
      this.getList()
    },

    next() {
      this.calendarList = this.calendar.next()
      this.getList()
    },

    updateFun() {
      this.edshow = Date.now()
    },

    delcourse() {
      this.mbox({
        title: "删除排课",
        messageHead: "删除排课信息",
        message: "是否确定删除此课程？"
      })
        .then(() => {
          this._NET.jw_paike_del({
            merchant_id: this.mymange,
            ctid: this.currentSubject.ctid,
            grade_id: this.currentSubject.grade_id
          }).then(data => {
            if (data.status == 'ok') {

              this._alert({
                type: "success",
                msg: "删除成功"
              });
              this.getList()

            }
          })
        })
        .catch(err => {

        })
    },

    reset() {
      this.classroomid = ''
      this.classid = ''
      this.teacherid = ''
      this.getList()
    },

    getList() {

      this.loading = true

      let start = null
      let end = {}
      if (this.type == 'month') {
        this.calendarList.item.map((item, index) => {
          if (index < 15) {
            if (item.isCurrentMonth) {
              start = start ? start : item
            }
          } else {
            if (item.isCurrentMonth) {
              end = item
            }
          }
        })
      }

      if (this.type == 'week') {
        start = this.calendarList.item[0]
        end = this.calendarList.item[6]
      }


      let start_time = parseInt(new Date(start.year, start.month - 1, start.day).setHours(0, 0, 0) / 1000)
      let end_time = parseInt(new Date(end.year, end.month - 1, end.day).setHours(23, 59, 59) / 1000)

      this._NET.jw_paike_list({
        merchant_id: this.mymange,
        start_time,
        end_time,
        classroom_id: this.classroomid,
        grade_id: this.classid,
        teacher_id: this.teacherid
      }).then(data => {
        this.loading = false
        if (data.status == 'ok') {
          let result = data.data.item
          let arr = this.calendarList.item
          arr.map(item => {
            item.result = []
            result.map(list => {

              let time = new Date(parseInt(list.start_time * 1000))
              let year = time.getFullYear()
              let month = time.getMonth() + 1
              let day = time.getDate()
              let hourse = time.getHours()
              list.fmt = hourse >= 12 ? 'pm' : 'am'
              list.after = parseInt(new Date().getTime() / 1000) > list.start_time ? false : true
              if (item.year == year && item.month == month && item.day == day) {
                item.result.push(list)
              }
            })
          })

          this.calendarList.item = arr
        }
      }).catch(err => {
        this.loading = false
      })
    },

    /**
         * 班级列表
         */
    getclasslist() {
      this._NET
        .jw_class_list({
          limit: 1000,
          page: 1,
          search: "",
          merchant_id: this.mymange,
          manager: "",
          course: ""
        })
        .then(data => {
          if (data.status == "ok") {
            this.classlist = data.data.item;
          }
        });
    },

    /**
     * 获取老师
     */
    getTeacherlist() {
      this._NET
        .getRoleUserList({
          merchant_id: this.mymange,
          role_id: "",
          limit: 1000,
          page: 1,
          role_type: "1"
        })
        .then(data => {
          if (data.status == "ok") {
            this.teacherlist = data.data.item;
          }
        });
    },

    /**
     * 获取教室
     */
    getClassroom() {
      this._NET
        .jw_classroom_list({
          merchant_id: this.mymange,
          page: 1,
          limit: 1000
        })
        .then(data => {
          if (data.status == "ok") {
            this.classroomlist = data.data.item;
          }
        });
    },
  },

  created() {
    this.weekandmonthFun(this.type)
    this.getclasslist()
    this.getTeacherlist()
    this.getClassroom()
  }
};