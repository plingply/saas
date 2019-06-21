export default {
    //教务管理
    path: 'Edu',
    name: 'edu',
    component: resolve => require.ensure([], () => resolve(require("../views/main/edu/index.vue")), 'edu'),
    children: [
        // 线索管理
        {
            path: 'Clue',
            name: 'edu_clue',
            component: resolve => require.ensure([], () => resolve(require("../views/main/edu/clue/index.vue")), 'clue'),
            children: [
                {
                    path: 'Home',
                    name: 'edu_clue_home',
                    component: resolve => require.ensure([], () => resolve(require("../views/main/edu/clue/home.vue")), 'clue')
                }, {
                    path: 'Detail',
                    name: 'edu_clue_detail',
                    component: resolve => require.ensure([], () => resolve(require("../views/main/edu/clue/detail.vue")), 'clue'),
                    children: [
                        {
                            path: 'Follow/:id',
                            name: 'edu_clue_Follow',
                            component: resolve => require.ensure([], () => resolve(require("../views/main/edu/clue/genjin.vue")), 'clue')
                        }, {
                            path: 'Info/:id',
                            name: 'edu_clue_info',
                            component: resolve => require.ensure([], () => resolve(require("../views/main/edu/clue/info.vue")), 'clue')
                        }
                    ]
                }
            ]
        },
        // 学员管理
        {
            path: 'Student',
            name: 'edu_student',
            component: resolve => require.ensure([], () => resolve(require("../views/main/edu/student/index.vue")), 'student'),
            children: [
                {
                    path: 'Home',
                    name: 'edu_student_home',
                    component: resolve => require.ensure([], () => resolve(require("../views/main/edu/student/home.vue")), 'student')
                }, {
                    path: 'Detail',
                    name: 'edu_student_detail',
                    component: resolve => require.ensure([], () => resolve(require("../views/main/edu/student/detail.vue")), 'student'),
                    children: [
                        {
                            path: 'Growup/:id',
                            name: 'edu_student_Growup',
                            component: resolve => require.ensure([], () => resolve(require("../views/main/edu/student/czjlu.vue")), 'student')
                        }, {
                            path: 'Class/:id',
                            name: 'edu_student_class',
                            component: resolve => require.ensure([], () => resolve(require("../views/main/edu/student/class.vue")), 'student')
                        }, {
                            path: 'ClassRecord/:id',
                            name: 'edu_student_classRecord',
                            component: resolve => require.ensure([], () => resolve(require("../views/main/edu/student/skjilu/skjilu.vue")), 'student')
                        }, {
                            path: 'Pay/:id',
                            name: 'edu_student_pay',
                            component: resolve => require.ensure([], () => resolve(require("../views/main/edu/student/jiaofeijilu.vue")), 'student')
                        }, {
                            path: 'Card/:id',
                            name: 'edu_student_card',
                            component: resolve => require.ensure([], () => resolve(require("../views/main/edu/student/card/card.vue")), 'student')
                        }, {
                            path: 'Card/Record/:id/:card_id',
                            name: 'edu_student_card_record',
                            component: resolve => require.ensure([], () => resolve(require("../views/main/edu/student/card/koufeilist.vue")), 'student')
                        }
                    ]
                }
            ]
        },
        // 班级管理
        {
            path: 'Class',
            name: 'edu_class',
            component: resolve => require.ensure([], () => resolve(require("../views/main/edu/class/index.vue")), 'class'),
            children: [
                {
                    path: 'List',
                    name: 'edu_class_list',
                    component: resolve => require.ensure([], () => resolve(require("../views/main/edu/class/list.vue")), 'class')
                }, {
                    path: 'Info/:id',
                    name: 'edu_class_info',
                    component: resolve => require.ensure([], () => resolve(require("../views/main/edu/class/info.vue")), 'class')
                }
            ]
        },
        // 课程管理
        {
            path: 'Course',
            name: 'edu_course',
            component: resolve => require.ensure([], () => resolve(require("../views/main/edu/course/index.vue")), 'course'),
            children: [
                {
                    path: 'List',
                    name: 'edu_course_list',
                    component: resolve => require.ensure([], () => resolve(require("../views/main/edu/course/list.vue")), 'course'),
                }, {
                    path: 'Add',
                    name: 'edu_course_add',
                    component: resolve => require.ensure([], () => resolve(require("../views/main/edu/course/add/add.vue")), 'course'),
                }, {
                    path: 'Editor/:id',
                    name: 'edu_course_editor',
                    component: resolve => require.ensure([], () => resolve(require("../views/main/edu/course/add/add.vue")), 'course'),
                }, {
                    path: 'Info/:id',
                    name: 'edu_course_info',
                    component: resolve => require.ensure([], () => resolve(require("../views/main/edu/course/info.vue")), 'course'),
                }
            ]
        },
        // 课表
        {
            path: 'TimeTable',
            name: 'edu_timetable',
            component: resolve => require.ensure([], () => resolve(require("../views/main/edu/timetable/index.vue")), 'tab'),
            children: [
                {
                    path: 'List',
                    name: 'edu_timetable_list',
                    component: resolve => require.ensure([], () => resolve(require("../views/main/edu/timetable/list/index.vue")), 'tab'),
                    meta: 'edu_timetable'
                }
            ]
        },
        // 员工
        {
            path: 'Staff',
            name: 'staff',
            component: resolve => require.ensure([], () => resolve(require("../views/main/edu/staff/main.vue")), 'staff'),
            children: [{
                path: 'List',
                name: 'stafflist',
                component: resolve => require.ensure([], () => resolve(require("../views/main/edu/staff/list.vue")), 'staff'),
            }, {
                path: 'Info/:id',
                name: 'staffinfo',
                component: resolve => require.ensure([], () => resolve(require("../views/main/edu/staff/info.vue")), 'staff'),
            }]
        },
        // 设置
        {
            path: 'Setting',
            name: 'edu_setting',
            component: resolve => require.ensure([], () => resolve(require("../views/main/edu/setting/index.vue")), 'set'),
            children: [
                {
                    path: 'Campus',
                    name: 'edu_setting_campus',
                    component: resolve => require.ensure([], () => resolve(require("../views/main/edu/setting/campus/index.vue")), 'set'),
                    meta: 'edu_setting_campus'
                },
                {
                    path: 'Recruit',
                    name: 'edu_setting_zs',
                    component: resolve => require.ensure([], () => resolve(require("../views/main/edu/setting/zhaosheng/zs.vue")), 'set'),
                    meta: 'edu_setting_zs'
                }, {
                    path: 'Classroom',
                    name: 'edu_setting_classroow',
                    component: resolve => require.ensure([], () => resolve(require("../views/main/edu/setting/classroom/classroom.vue")), 'set'),
                    meta: 'edu_setting_classroow'
                }, {
                    path: 'Role',
                    name: 'edu_setting_role',
                    component: resolve => require.ensure([], () => resolve(require("../views/main/edu/setting/role/index.vue")), 'set'),
                    meta: 'edu_setting_role'
                }, {
                    path: 'Card/List',
                    name: 'edu_setting_card',
                    component: resolve => require.ensure([], () => resolve(require("../views/main/edu/setting/card/list.vue")), 'set'),
                    meta: 'edu_setting_card'
                }, {
                    path: 'Card/add',
                    name: 'edu_setting_addcard',
                    component: resolve => require.ensure([], () => resolve(require("../views/main/edu/setting/card/add/add.vue")), 'set'),
                    meta: 'edu_setting_card'
                }, {
                    path: 'Card/Editor/:id',
                    name: 'edu_setting_editorcard',
                    component: resolve => require.ensure([], () => resolve(require("../views/main/edu/setting/card/add/add.vue")), 'set'),
                    meta: 'edu_setting_card'
                }, {
                    path: 'Card/Info/:id',
                    name: 'edu_setting_info',
                    component: resolve => require.ensure([], () => resolve(require("../views/main/edu/setting/card/info.vue")), 'set'),
                    meta: 'edu_setting_card'
                }
            ]
        }
    ]
}