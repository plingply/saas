<template>
  <div class="timetable">
    <div class="selectbox">
      <el-select
        class="w150"
        v-model="classid"
        placeholder="请选择班级"
        filterable
      >
        <el-option
          :label="item.name"
          :value="item.id"
          v-for="(item,index) in classlist"
          :key="index"
        ></el-option>
      </el-select>

      <el-select
        class="w150"
        v-model="teacherid"
        placeholder="请选择授课老师"
        filterable
      >
        <el-option
          :label="item.user_remark"
          :value="item.user_id"
          v-for="(item,index) in teacherlist"
          :key="index"
        ></el-option>
      </el-select>

      <el-select
        class="w150"
        v-model="classroomid"
        placeholder="请选择教室"
        filterable
      >
        <el-option
          :label="item.name"
          :value="item.id"
          v-for="(item,index) in classroomlist"
          :key="index"
        ></el-option>
      </el-select>

      <el-button type="primary" @click="getList">查询</el-button>
      <el-button plain @click="reset">重置</el-button>
    </div>
    <el-button :disabled="!edum_status" type="primary" style="width:100px" @click="paikefunc">排课</el-button>
    <!-- 课表操作部分 -->
    <div class="btnbox">
      <div class="left">
        <span class="end">
          <i></i>已上课
        </span>
        <span class="wait">
          <i></i>待上课
        </span>
        <span class="chongtu">
          <i></i>冲突
        </span>
      </div>
      <div class="center" v-if="type == 'week'">
        <el-button @click="prew" plain icon="el-icon-arrow-left"></el-button>
        <div>
          <span>{{ calendarList.item[0].month }}月{{ calendarList.item[0].day }}日</span>
          -
          <span>{{ calendarList.item[6].month }}月{{ calendarList.item[6].day }}日</span>
        </div>
        <el-button @click="next" plain icon="el-icon-arrow-right"></el-button>
      </div>
      <div class="center" v-if="type == 'month'">
        <el-button @click="prew" plain icon="el-icon-arrow-left"></el-button>
        <div>
          <span>{{ calendarList.month }}月</span>
        </div>
        <el-button @click="next" plain icon="el-icon-arrow-right"></el-button>
      </div>
      <div class="right">
        <el-radio-group v-model="type" size="small" @change="weekandmonthFun">
          <el-radio-button label="week">周课表</el-radio-button>
          <el-radio-button label="month">月课表</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <!-- 周课表 -->
    <div v-loading="loading" class="week" v-if="type == 'week'">
      <div class="table_head">
        <span v-for="(item,index) in calendarList.item" :key="index">
          <em>{{ item.week | weekUnit }}</em>
          <s>{{ item.month }}月{{ item.day }}日</s>
        </span>
      </div>
      <div class="table_box">
        <div class="top">
          <div @dblclick="dbClickPaike(item,'week')" v-for="(item,index) in calendarList.item" :key="index">
            <div
              :class="{ await: list.after , end: !list.after, chongtu: list.is_conflict == 1 }"
              data-popover="popover"
              v-for="(list,index) in item.result"
              :key="index"
              @click="showPopfunc(list)"
              v-show="list.fmt == 'am'"
            >
              <p>{{ list.course_name }}</p>
              <p>{{ list.teacher_name }}</p>
              <em>{{ list.start_time | H_M }}-{{ list.end_time | H_M }}</em>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div @dblclick="dbClickPaike(item,'week')" v-for="(item,index) in calendarList.item" :key="index">
            <div
              :class="{ await: list.after , end: !list.after, chongtu: list.is_conflict == 1  }"
              data-popover="popover"
              v-for="(list,index) in item.result"
              :key="index"
              @click="showPopfunc(list)"
              v-show="list.fmt == 'pm'"
            >
              <p>{{ list.course_name }}</p>
              <p>{{ list.teacher_name }}</p>
              <em>{{ list.start_time | H_M }}-{{ list.end_time | H_M }}</em>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 月课表 -->
    <div v-loading="loading" class="month" v-if="type == 'month'">
      <div class="table_head">
        <span v-for="(item,index) in calendarList.week" :key="index">
          <em>{{ item | weekUnit }}</em>
        </span>
      </div>
      <div class="table_box">
        <div
          :class="{ currentMonth: item.isCurrentMonth , currentDay: item.isCurrentToday }"
          v-for="(item,index) in calendarList.item"
          :key="index"
          @dblclick="dbClickPaike(item,'month')"
        >
          <time>{{ item.day }}</time>
          <div
            :class="{ await: list.after , end: !list.after, chongtu: list.is_conflict == 1  }"
            data-popover="popover"
            @click="showPopfunc(list)"
            v-for="(list,index) in item.result"
            :key="index"
          >
            <p>{{ list.course_name }}</p>
            <p>{{ list.teacher_name }}</p>
            <em>{{ list.start_time | H_M }}-{{ list.end_time | H_M }}</em>
          </div>
        </div>
      </div>
    </div>
    <!-- 弹框 -->
    <ui-pop :canshow="popshow" pref="popover" width="300" positon="left">
      <div
        slot="header"
        :class="{ await: currentSubject.after , end: !currentSubject.after, chongtu: currentSubject.is_conflict == 1  }"
        class="popheader"
      >
        <p>{{ currentSubject.course_name }}</p>
      </div>
      <div slot="footer" class="popfooter">
        <p>
          上课班级：
          <span>{{ currentSubject.grade_name }}</span>
        </p>
        <p>
          授课老师：
          <span>{{ currentSubject.teacher_name }}</span>
        </p>
        <p>
          上课教室：
          <span>{{ currentSubject.classroom_name }}</span>
        </p>
        <p>
          上课时间：
          <span>{{ currentSubject.start_time | H_M }}-{{ currentSubject.end_time | H_M }}</span>
        </p>
        <div class="kbbtnbox">
          <el-button :disabled="!edum_status" plain v-if="currentSubject.start_time*1000 > new Date().getTime()"  @click="delcourse">删除</el-button>
          <el-button :disabled="!edum_status"  v-if="currentSubject.after" type="primary"  @click="updateFun">修改</el-button>
        </div>
      </div>
    </ui-pop>

    <!-- 排课 -->
    <paike
      :showtime="paiketime"
      @callback="getList"
      :time="pkstartime"
      :classlist="classlist"
      :teacherlist="teacherlist"
      :classroomlist="classroomlist"
    ></paike>

    <!-- 修改排课 -->
    <edtsubject
      :showtime="edshow"
      :pkdata="currentSubject"
      :classlist="classlist"
      :teacherlist="teacherlist"
      :classroomlist="classroomlist"
      @callback="getList"
    ></edtsubject>
  </div>
</template>
<script src="./index.js"></script>
<style lang="less" scoped>
@import "./index.less";
</style>
