<template>
  <div>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="800px">
      <div class="xs_content">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <div class="jichu">
            <el-row :gutter="gutter">
              <el-col :span="12">
                <el-form-item label="学员姓名" prop="name">
                  <el-input v-model="form.name" size="medium" maxlength="10"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="gutter">
              <el-col :span="12">
                <el-form-item label="联系电话" size="medium" prop="phone">
                  <div class="flex">
                    <el-select v-model="form.phone_belong" size="medium">
                      <el-option
                        :label="item.label"
                        :value="item.value"
                        v-for="(item,index) in lianxiList"
                        :key="index"
                      ></el-option>
                    </el-select>
                    <el-input
                      v-model="form.phone"
                      maxlength="11"
                      @input="phoneInput"
                      placeholder="联系人手机号"
                    ></el-input>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="备用电话">
                  <div class="flex">
                    <el-select v-model="form.standby_phone_belong" size="medium">
                      <el-option
                        :label="item.label"
                        :value="item.value"
                        v-for="(item,index) in lianxiList"
                        :key="index"
                      ></el-option>
                    </el-select>
                    <el-input
                      v-model="form.phone_by"
                      @input="phone1Input"
                      maxlength="16"
                      size="medium"
                      placeholder="备用电话号码"
                    ></el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="gutter">
              <el-col :span="12">
                <el-form-item label="性别" prop="sex">
                  <el-radio v-model="form.sex" label="男">男</el-radio>
                  <el-radio v-model="form.sex" label="女">女</el-radio>
                  <el-radio v-model="form.sex" label="保密">保密</el-radio>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="详细地址">
                  <el-input
                    v-model="form.address"
                    size="medium"
                    maxlength="100"
                    placeholder="详细家庭地址"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="入学日期" prop="entry_time">
                  <el-date-picker
                    style="width:100%"
                    v-model="form.entry_time"
                    type="date"
                    size="medium"
                    placeholder="入学时间"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="学校">
                  <el-input
                    v-model="form.school"
                    size="medium"
                    maxlength="20"
                    placeholder="请输入学校名称"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="生日">
                  <el-date-picker
                    style="width:100%"
                    v-model="form.birthday"
                    type="date"
                    size="medium"
                    placeholder="学员生日"
                    @change="changeBirth"
                    :picker-options="pickerOptions"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="年龄">
                  <el-input
                    v-model="form.age"
                    size="medium"
                    @input="ageInput"
                    type="text"
                    placeholder="学员年龄"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="QQ/微信">
                  <el-input v-model="form.wechat" size="medium" maxlength="20"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="年级班级">
                  <el-input v-model="form.class" size="medium" maxlength="20" placeholder="请输入年级班级"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="渠道来源">
                  <el-select
                    v-model="form.source"
                    size="medium"
                    style="width:100%"
                    placeholder="请选择"
                  >
                    <el-option
                      :label="item.remark"
                      :value="item.id"
                      v-for="(item,index) in qdlist"
                      :key="index"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="爱好">
                  <el-input v-model="form.hobby" size="medium" maxlength="20" placeholder="请输入兴趣爱好"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="课程顾问">
                  <el-select
                    style="width:100%"
                    v-model="form.course_consultant"
                    size="medium"
                    placeholder="请选择"
                  >
                    <el-option
                      :label="item.user_remark"
                      :value="item.id"
                      v-for="(item,index) in yx_cclist"
                      :key="index"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="学员状态">
                  <el-select
                    v-model="form.status"
                    size="medium"
                    style="width:100%"
                    placeholder="请选择"
                  >
                    <el-option
                      :label="item"
                      :value="key"
                      :key="key"
                      v-for="(item,key) in yx_config.member_status"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="gutter">
              <el-col :span="24">
                <el-form-item label="备注">
                  <el-input
                    v-model="form.remark"
                    maxlength="200"
                    type="textarea"
                    placeholder="请输入200字内的备注"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addfun" v-show="!editor" :loading="loading">添 加</el-button>
        <el-button type="primary" @click="addfun" v-show="editor" :loading="loading">修 改</el-button>
      </span>
    </el-dialog>

    <!-- 添加学员后 指引操作 -->
    <add-after :showtime="showtime" :student-info="studentInfo" @callback="callback"></add-after>
  </div>
</template>

<script src="./addstudent.js"></script>


<style lang="less" scoped>
.xs_content {
  width: 650px;
  margin: 0 auto;
}
.flex {
  display: flex;
  .el-select {
    width: 80px;
    min-width: 80px;
    margin-right: 8px;
  }
}
</style>
