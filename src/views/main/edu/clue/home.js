import theadlist from "@/util/clur_table_head";

import tablehead from "../componts/tablehead";
import daoru from "../componts/yx_daoru";
import fenpei from "../componts/fenpei";
import addyx from "../componts/addyx.vue";

let thead = [];

for (let key in theadlist) {
    if (theadlist[key].checked) {
        thead.push(theadlist[key].value);
    }
}

export default {
    name: 'clue_home',
    data() {
        return {
            moretj: false,
            loading: false,

            /**
             * 搜索参数
             */
            s_luru_time: [], // 录入时间
            s_genjin_time: [], // 跟进时间
            s_source: "", //  渠道
            s_intention: "", // 意向级别 
            s_follow_status: "", // 跟进状态
            s_course_consultant: "", // 课程顾问
            s_search: "", // 搜索
            s_follow_num: "", // 跟进次数
            page: 1,
            limit: 10,
            pickerOptions: {
                disabledDate(v) {
                    if (
                        v.getTime() < new Date(2018, 5, 20).getTime() ||
                        v.getTime() > new Date().getTime()
                    ) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },

            /**
             * 列表参数
             */
            list: [],
            count: 0,
            canload: true,
            multipleSelection: [],

            headObj: {},
            checkarr: thead,
            tableheadshow: 0,

            cluetime: 0,
            fenpeitime: 0,
            addyxtime: 0

        };
    },

    components: {
        tablehead,
        daoru,
        fenpei,
        addyx
    },

    computed: {
        userInfo() {
            return this.$store.state.userInfo;
        },
        yx_config() {
            return this.$store.state.yx_config;
        },
        qdlist() {
            return this.$store.state.yx_qudao;
        },
        yx_cclist() {
            return this.$store.state.yx_cclist;
        },
        edum_status() {
            return this.$store.state.edum_status;
        }
    },

    methods: {

        openaddxs(){
            this.addyxtime = +new Date()
        },

        openpldr(){
            this.cluetime = +new Date()
        },

        opentablehead(){
            this.tableheadshow = +new Date()
        },

        setLocalStorage() {

            window.sessionStorage.setItem("s_luru_time", JSON.stringify(this.s_luru_time))
            window.sessionStorage.setItem("s_genjin_time", JSON.stringify(this.s_genjin_time))
            window.sessionStorage.setItem("s_source", this.s_source)
            window.sessionStorage.setItem("s_intention", this.s_intention)
            window.sessionStorage.setItem("s_follow_status", this.s_follow_status)
            window.sessionStorage.setItem("s_course_consultant", this.s_course_consultant)
            window.sessionStorage.setItem("s_search", this.s_search)
            window.sessionStorage.setItem("s_follow_num", this.s_follow_num)
            window.sessionStorage.setItem("page", this.page)
            window.sessionStorage.setItem("limit", this.limit)
        },

        getLocalStorage() {
            this.s_luru_time = window.sessionStorage.getItem("s_luru_time") ? JSON.parse(window.sessionStorage.getItem("s_luru_time")) : this.s_luru_time
            this.s_genjin_time = window.sessionStorage.getItem("s_genjin_time") ? JSON.parse(window.sessionStorage.getItem("s_genjin_time")) : this.s_genjin_time
            this.s_source = window.sessionStorage.getItem("s_source") ? window.sessionStorage.getItem("s_source") : this.s_source
            this.s_intention = window.sessionStorage.getItem("s_intention") ? window.sessionStorage.getItem("s_intention") : this.s_intention
            this.s_follow_status = window.sessionStorage.getItem("s_follow_status") ? window.sessionStorage.getItem("s_follow_status") : this.s_follow_status
            this.s_course_consultant = window.sessionStorage.getItem("s_course_consultant") ? window.sessionStorage.getItem("s_course_consultant") : this.s_course_consultant
            this.s_search = window.sessionStorage.getItem("s_search") ? window.sessionStorage.getItem("s_search") : this.s_search
            this.s_follow_num = window.sessionStorage.getItem("s_follow_num") ? window.sessionStorage.getItem("s_follow_num") : this.s_follow_num
            this.page = window.sessionStorage.getItem("page") ? window.sessionStorage.getItem("page") : this.page
            this.limit = window.sessionStorage.getItem("limit") ? window.sessionStorage.getItem("limit") : this.limit
        },

        moretjfun() {
            this.moretj = !this.moretj;
            this.s_genjin_time = [];
            this.s_follow_num = "";
        },
        serachFuns() {
            this.page = 1;
            this.getlist();
        },
        reset() {
            this.s_luru_time = [];
            this.s_genjin_time = [];
            this.s_source = "";
            this.s_intention = "";
            this.s_follow_status = "";
            this.s_course_consultant = "";
            this.s_search = "";
            this.s_follow_num = "";
            this.page = 1;
            this.getlist();
        },
        handleCurrentChange(v) {
            this.page = v;
            this.getlist();
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        getTableHead() {
            this._NET
                .getTips({
                    campus_id: this.campus_id,
                    key: "cluetabhead"
                })
                .then(data => {
                    if (data.code == "1") {
                        this.headObj =
                            data.data && data.data.cluetabhead != "" ?
                                JSON.parse(data.data.cluetabhead) :
                                {};

                        this.checkarr = this.headObj[this.mymange] ?
                            this.headObj[this.mymange] :
                            thead;
                    }
                });
        },

        // 批量删除意向学员
        deletefun() {
            const h = this.$createElement;
            let self = this;
            this.$msgbox({
                title: "批量删除意向学员",
                message: h("div", { class: "deletestyle" }, [
                    h("p", null, [
                        h("em", null, "已选择"),
                        h("span", null, this.multipleSelection.length),
                        h("em", null, "名意向学员。")
                    ]),
                    h("p", null, "删除学员后，该学员所有数据将被删除，且不可恢复。")
                ]),
                showCancelButton: true,
                confirmButtonText: "删除",
                cancelButtonText: "取消"
            })
                .then(action => {
                    self.deleall();
                })
                .catch(() => { });
        },

        deleall() {
            let arr = [];
            this.multipleSelection.map(item => {
                arr.push(item.member_id);
            });

            this._NET
                .yw_yz_batchDelete({
                    campus_id: this.campus_id,
                    member_ids: arr.join(",")
                })
                .then(data => {
                    if (data.code == "1") {
                        this._alert({
                            type: "success",
                            msg: "删除成功"
                        });

                        this.getlist()
                    }
                });
        },

        sizeChange(val) {
            this.page = 1
            this.limit = val
            this.getlist()
        },
        /**
         * 列表
         */
        getlist() {
            this.setLocalStorage()
            this.loading = true;
            this.canload = false;
            let add_start_time = "";
            let add_end_time = "";
            let follow_start_time = "";
            let follow_end_time = "";

            if (this.s_luru_time && this.s_luru_time.length == 2) {
                add_start_time = parseInt(new Date(this.s_luru_time[0]).getTime() / 1000);
                add_end_time = parseInt(new Date(this.s_luru_time[1]).getTime() / 1000) + 60 * 60 * 24 - 1;
            }

            if (this.s_genjin_time && this.s_genjin_time.length == 2) {
                follow_start_time = parseInt(new Date(this.s_genjin_time[0]).getTime() / 1000);
                follow_end_time = parseInt(new Date(this.s_genjin_time[1]).getTime() / 1000);
            }

            this._NET
                .jw_yx_getlist({
                    campus_id: this.campus_id,
                    page: this.page,
                    limit: this.limit,
                    add_start_time, //录入开始时间
                    add_end_time, //录入结束时间
                    search: this.s_search ? this.s_search : '', //姓名/电话
                    source: this.s_source ? this.s_source : '', //渠道来源
                    intention_level: this.s_intention ? this.s_intention : '', //意向度
                    follow_status: this.s_follow_status ? this.s_follow_status : '', //跟进状态
                    follow_start_time, //跟进开始时间
                    follow_end_time, //跟进结束时间
                    follow_num: this.s_follow_num ? this.s_follow_num : '', //跟进次数
                    course_consultant: this.s_course_consultant ? this.s_course_consultant : '' //课程顾问
                })
                .then(data => {
                    this.loading = false;
                    this.canload = true;
                    if (data.code == "1") {
                        this.list = data.data.item;
                        this.count = data.data.count;
                        console.log(count)
                    }
                })
                .catch(err => {
                    this.loading = false;
                    this.canload = true;
                });
        }

        
    },
    created() {

        // 判断是否通过返回进入
        if (this.$route.query.callback) {
            this.getLocalStorage()
        } else {
            this.setLocalStorage()
        }

        this.getlist();
        this.getTableHead();

    }
};