<template>
  <div>
    <el-dialog
      title="排课"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :visible.sync="show"
      width="800px"
    >
      <div class="pk_content" :element-loading-text="paikeText" v-loading="loading">
        <div class="formbox" v-show="step == '1'">
          <el-form ref="form" :model="form" :rules="rules" label-width="260px">
            <el-form-item label="班级" prop="class">
              <el-select
                style="width: 272px"
                @change="classChange"
                size="medium"
                v-model="form.class"
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
            </el-form-item>
            <el-form-item label="课程" prop="subject">
              <el-select
                style="width: 272px"
                size="medium"
                v-model="form.subject"
                placeholder="请选择课程"
                filterable
              >
                <el-option
                  :label="item.name"
                  :value="item.id"
                  v-for="(item,index) in subjectlist"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="授课老师" prop="teacher">
              <el-select
                style="width: 272px"
                size="medium"
                v-model="form.teacher"
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
            </el-form-item>
            <el-form-item label="上课时间" prop="start_time">
              <el-date-picker
                style="width: 150px"
                size="medium"
                v-model="form.start_time"
                type="date"
                placeholder="上课日期"
                @change="startChange"
                :picker-options="pickerOptions_1"
              ></el-date-picker>
              <el-time-picker
                size="medium"
                style="width: 118px"
                format="HH:mm"
                v-model="form.time"
                placeholder="上课时间"
              ></el-time-picker>
            </el-form-item>
            <el-form-item label="上课时长" prop="sc">
              <el-input
                style="width: 272px"
                size="medium"
                @input="scInput"
                v-model="form.sc"
                placeholder="上课时长(分钟)"
                maxlength="5"
              ></el-input>
            </el-form-item>
            <el-form-item label="教室">
              <el-select
                style="width: 272px"
                size="medium"
                v-model="form.classroom"
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
            </el-form-item>
            <el-form-item style="margin-bottom: 0px" label="重复" prop="expiry_time">
              <el-select
                style="width: 100px"
                size="medium"
                v-model="form.chongfu"
                @change="typeChange"
              >
                <el-option label="不重复" value="1"></el-option>
                <el-option label="每日" value="2"></el-option>
                <el-option label="每周" value="3"></el-option>
              </el-select>
              <el-date-picker
                :disabled="form.chongfu == '1'"
                style="width: 168px"
                size="medium"
                v-model="form.end_time"
                type="date"
                placeholder="结束日期"
                :picker-options="pickerOptions"
              ></el-date-picker>
              <p class="tishi">开始时间和结束时间最大间隔60天</p>
            </el-form-item>
          </el-form>
        </div>
        <div class="tablebox" v-show="step == '2'">
          <el-table :data="waitArr" style="width: 100%">
            <el-table-column prop="grade_id" label="班级">
              <template slot-scope="scope">
                <div
                  v-for="(item,index) in classlist"
                  :key="index"
                  v-show="item.id == scope.row.grade_id"
                >
                  {{ item.name }}
                  <span class="chongtu" v-if="scope.row.class_ct">[冲突]</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="teacher_ids" label="老师">
              <template slot-scope="scope">
                <div
                  v-for="(item,index) in teacherlist"
                  :key="index"
                  v-show="item.user_id == scope.row.teacher_ids"
                >
                  {{ item.user_remark }}
                  <span class="chongtu" v-if="scope.row.teacher_ct">[冲突]</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="classroom_id" label="教室">
              <template slot-scope="scope">
                <div
                  v-for="(item,index) in classroomlist"
                  :key="index"
                  v-show="item.id == scope.row.classroom_id"
                >
                  {{ item.name }}
                  <span class="chongtu" v-if="scope.row.classroom_ct">[冲突]</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="start_time" label="上课时间">
              <template slot-scope="scope">{{ scope.row.start_time | yyyy_mm_dd_H_M }}</template>
            </el-table-column>
            <el-table-column prop="date" label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="editorfunc(scope.row, scope.$index)">编辑</el-button>
                <el-button type="text" @click="delpaike(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="tablebox" v-show="step == '3'">
          <div class="tixing">
            <div v-for="(item,index) in subjectlist" :key="index">
              <span v-if="form.subject == item.id">课程：{{ item.name }}</span>
            </div>
            <div v-for="(item,index) in classlist" :key="index">
              <span v-if="form.class == item.id">班级：{{ item.name }}</span>
            </div>
            <div v-for="(item,index) in teacherlist" :key="index">
              <span v-if="form.teacher == item.user_id">授课老师：{{ item.user_remark }}</span>
            </div>
            <div v-for="(item,index) in classroomlist" :key="index">
              <span v-if="form.classroom == item.id">教室：{{ item.name }}</span>
            </div>
            <div v-if="form.start_time && form.time">
              <span>上课时间：{{ parseInt(form.start_time.getTime()/1000) | yyyy_mm_dd }}&nbsp;{{ parseInt(form.time.getTime()/1000) | H_M }}</span>
            </div>
            <p class="tishi1">新建的排课存在冲突</p>
            <p class="paikeinfo">
              冲突的排课信息：
              <span v-show="checkCode == 1001" class="active">班级冲突</span>
              <span v-show="checkCode == 1000" class="active">教室冲突</span>
              <span v-show="checkCode == 1002" class="active">授课老师冲突</span>
            </p>
          </div>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button v-if="step == '1'" @click="show = false">取 消</el-button>
          <el-button v-if="step == '1'" type="primary" :loading="xloading" @click="nextFunc">确 定</el-button>
          <el-button v-if="step == '2'" @click="backstep('1')">返回修改</el-button>
          <el-button v-if="step == '2'" type="primary" @click="addfunc" :loading="xloading">确认添加</el-button>
          <el-button v-if="step == '3'" @click="backstep('1')">返回修改</el-button>
          <el-button v-if="step == '3'" type="primary" @click="singlePaike('1')" :loading="xloading">仍然创建</el-button>
        </span>
      </div>
    </el-dialog>

    <editorpk
      :showtime="edshow"
      :pkdata="pkdata"
      :classlist="classlist"
      :teacherlist="teacherlist"
      :classroomlist="classroomlist"
      @callback="edtcallback"
    ></editorpk>
  </div>
</template>

<script src="./index.js"></script>

<style lang="less" scoped>
@import "./index.less";
</style>
