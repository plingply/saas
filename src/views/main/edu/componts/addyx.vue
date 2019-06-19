<template>
  <el-dialog title="添加线索" :visible.sync="dialogVisible" width="900px">
    <div class="xs_content">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <div class="jichu">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="学员姓名" prop="name">
                <el-input v-model="form.name" placeholder="请输入学员姓名" maxlength="10"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="学员电话" prop="phone">
                <el-input
                  v-model="form.phone"
                  maxlength="11"
                  @input="phoneInput"
                  placeholder="请输入学员手机号"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="年龄">
                <el-input v-model="form.age" @input="ageInput" type="text" placeholder="请输入年龄"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="性别">
                <el-radio v-model="form.sex" label="男">男</el-radio>
                <el-radio v-model="form.sex" label="女">女</el-radio>
                <el-radio v-model="form.sex" label="保密">保密</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="意向课程">
                <el-input v-model="form.intention_course" maxlength="20" placeholder="请输入意向课程"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="意向级别">
                <el-select v-model="form.intention_level" placeholder="请选择">
                  <el-option
                    :label="item"
                    :value="key"
                    v-for="(item,key) in yx_config.intention_config"
                    :key="key"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="more_c" v-show="ismore">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="生日">
                <el-date-picker
                  style="width:100%"
                  v-model="form.birthday"
                  type="date"
                  placeholder="请选择日期"
                  :picker-options="pickerOptions"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="学校">
                <el-input v-model="form.school" maxlength="20" placeholder="请输入学校名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="年级班级">
                <el-input v-model="form.class" maxlength="20" placeholder="请输入年级班级"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="家长姓名">
                <el-input v-model="form.parent_name" maxlength="10" placeholder="请输入家长姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="备用电话">
                <el-input
                  v-model="form.phone_by"
                  @input="phone1Input"
                  maxlength="11"
                  placeholder="请输入备用手机号"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="QQ/微信">
                <el-input v-model="form.wechat" maxlength="20" placeholder="请输入QQ/微信"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="爱好">
                <el-input v-model="form.hobby" maxlength="20" placeholder="请输入爱好"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="课程顾问">
                <el-select v-model="form.course_consultant" placeholder="请选择课程顾问">
                  <el-option
                    :label="item.user_remark"
                    :value="item.id"
                    v-for="(item,index) in yx_cclist"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="渠道来源">
                <el-select v-model="form.source" placeholder="请选择渠道来源">
                  <el-option
                    :label="item.remark"
                    :value="item.id"
                    v-for="(item,index) in qdlist"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="详细地址">
                <el-input v-model="form.address" maxlength="100" placeholder="请输入详细地址"></el-input>
              </el-form-item>
            </el-col>
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

        <div class="btnbox">
          <el-button type="text" v-show="ismore" @click="ismore = !ismore">收起</el-button>
          <el-button type="text" v-show="!ismore" @click="ismore = !ismore">更多</el-button>
        </div>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="addfun" :loading="loading">添加</el-button>
    </span>
  </el-dialog>
</template>

<script src="./addyx.js"></script>

<style lang="less" scoped>
@import "../../../../less/style.less";

.xs_content {
}

.btnbox {
  text-align: right;
}

.jichu {
  border-bottom: 1px solid @bd1;
}

.more_c {
  margin-top: 20px;
}
</style>
