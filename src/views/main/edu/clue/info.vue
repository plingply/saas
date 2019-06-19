<template>
  <div>
    <el-form ref="form"  :model="{}" :rules="rules" label-width="80px">
      <!-- 展示 -->
      <div v-if="!isEditor">
        <p class="yx_title" style="margin-top:0">基础信息</p>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="学员姓名">
              <div>{{ info.name }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="学员电话">
              <div>{{ info.phone }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="年龄">
              <div>{{ info.age }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="性别">
              <div>{{ info.sex }}</div>
            </el-form-item>
          </el-col>
        </el-row>

        <p class="yx_title">意向信息</p>

        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="意向课程">
              <div>{{ info.intention_course }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="意向级别">
              <div
                v-if="yx_config.intention_config"
              >{{ yx_config.intention_config[info.intention_level] }}</div>
              <div v-else>--</div>
            </el-form-item>
          </el-col>
        </el-row>

        <p class="yx_title">渠道信息</p>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="意向来源">
              {{ info.source_name }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="课程顾问">
              {{ info.course_consultant_name }}
            </el-form-item>
          </el-col>
        </el-row>

        <p class="yx_title">补充信息</p>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="生日">
              <div>{{ info.birthday | yyyy_mm_dd }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="学校">
              <div>{{ info.school }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="年级班级">
              <div>{{ info.class }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="家长姓名">
              <div>{{ info.parent_name }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="备用电话">
              <div>{{ info.phone_by }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="QQ/微信">
              <div>{{ info.wechat }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="爱好">
              <div>{{ info.hobby }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="详细地址">
              <div>{{ info.address }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <div>{{ info.remark }}</div>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label>
              <div class="btnbox">
                <el-button plain @click="delstudent" style="width:100px" :loading="deloading">删除</el-button>
              <el-button type="primary" style="width:100px" @click="editorfunc">编辑</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 编辑 -->
      <div v-if="isEditor">
        <p class="yx_title" style="margin-top:0">基础信息</p>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="学员姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入学员姓名" maxlength="10"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="学员电话" prop="phone">
              <el-input
                v-model="form.phone"
                placeholder="请输入学员手机号"
                @input="phoneInput"
                maxlength="11"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="年龄">
              <el-input v-model="form.age" @input="ageInput" placeholder="请输入年龄"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="性别">
              <el-radio v-model="form.sex" label="男">男</el-radio>
              <el-radio v-model="form.sex" label="女">女</el-radio>
              <el-radio v-model="form.sex" label="保密">保密</el-radio>
            </el-form-item>
          </el-col>
        </el-row>

        <p class="yx_title">意向信息</p>

        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="意向课程">
              <el-input v-model="form.intention_course" maxlength="20" placeholder="请输入意向课程"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="意向级别">
              <el-select v-model="form.intention_level" style="width:100%" placeholder="请选择意向级别">
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

        <p class="yx_title">渠道信息</p>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="意向来源">
              <el-select v-model="form.source" style="width:100%" placeholder="请选择意向来源">
                <el-option
                  :label="item.name"
                  :value="item.id"
                  v-for="(item,index) in qdlist"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="课程顾问">
              <el-select v-model="form.course_consultant" style="width:100%" placeholder="请选择课程顾问">
                <el-option
                  :label="item.user_remark"
                  :value="item.id"
                  v-for="(item,index) in yx_cclist"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <p class="yx_title">补充信息</p>
        <el-row :gutter="20">
          <el-col :span="6">
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
          <el-col :span="6">
            <el-form-item label="学校">
              <el-input v-model="form.school" maxlength="20" placeholder="请输入学校名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="年级班级">
              <el-input v-model="form.class" maxlength="20" placeholder="请输入年级班级"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="家长姓名">
              <el-input v-model="form.parent_name" maxlength="10" placeholder="请输入家长姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="备用电话">
              <el-input
                v-model="form.phone_by"
                maxlength="11"
                @input="phone1Input"
                placeholder="请输入备用手机号"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="QQ/微信">
              <el-input v-model="form.wechat" maxlength="20" placeholder="请输入QQ/微信"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="爱好">
              <el-input v-model="form.hobby" maxlength="20" placeholder="请输入爱好"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="详细地址">
              <el-input maxlength="100" v-model="form.address" placeholder="请输入详细地址"></el-input>
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

          <el-col :span="24">
            <el-form-item label>
              <div class="btnbox">
              <el-button plain style="width:100px" @click="cancelfun">取消</el-button>
              <el-button type="primary" style="width:100px" @click="savefun">保存</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ["info"],
  data() {
    return {
      isEditor: false,
      form: {
        member_id: "",
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
          if (v.getTime() > new Date().getTime() || v.getTime() < 0) {
            return true;
          } else {
            return false;
          }
        }
      },
      deloading: false
    };
  },

  watch: {
    info() {
      this.initform();
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
     * 年龄字段
     */
    ageInput(v) {
      this.form.age = this.form.age.replace(/[^\d]/gi, "");
      if (this.form.age < 0) {
        this.form.age = 0;
      }
      if (this.form.age > 99) {
        this.form.age = 99;
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
    },

    /**
     * 打开编辑
     */
    editorfunc() {

      this.isEditor = true;
      this.initform();
    },

    /**
     * 取消
     */

    cancelfun() {
      this.isEditor = false;
    },

    /**
     * 保存
     */

    savefun() {
      if (!this.verification()) return;

      let form = {};

      for (let key in this.form) {
        form[key] = this.form[key]?this.form[key]:'';
      }

      form.birthday = this.form.birthday
        ? parseInt(this.form.birthday.getTime() / 1000)
        : "";


      this._NET.jw_yx_editor(form).then(data => {
        if (data.code == "1") {
          this._alert({
            type: "success",
            msg: "修改成功"
          });
          this.isEditor = false;
          this.$emit("editorcallback");
        }
      });
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
        return false;
      }

      if (!this.form.phone.trim()) {
        this._alert({
          type: "warning",
          msg: "学员电话不能为空"
        });
        return false;
      }


      if (!this.phoneReg.test(this.form.phone)) {
        this._alert({
          type: "warning",
          msg: "学员电话格式不正确"
        });
        return false;
      }

      if (this.form.phone_by && !this.phoneReg.test(this.form.phone_by)) {
        this._alert({
          type: "warning",
          msg: "备用电话格式不正确"
        });
        return false;
      }

      return true;
    },

    initform() {
      for (let key in this.info) {
        this.form[key] = this.info[key];
      }

      this.form.birthday = this.info.birthday_time;
    },

    delstudent() {

      
      this.$confirm("是否删除该线索?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deloading = true;

          this._NET
            .yw_yz_delete({
              id: this.info.id
            })
            .then(data => {
              this.deloading = false;
              if (data.code == "1") {
                this._alert({
                  type: "success",
                  msg: "删除成功"
                });
                this.$router.push({ name: "edu_clue_home" });
              }
            })
            .catch(err => {
              this.deloading = false;
            });
        })
        .catch(() => {});
    }
  },

  created() {
    this.initform();
  }
};
</script>


<style lang="less" scoped>
@import "../../../../less/style.less";

.btnbox{
  text-align: right;
}
</style>
