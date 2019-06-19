<template>
  <el-dialog title="批量导入线索" :visible.sync="dialogVisible" width="550px">
    <div class="xs_content">
      <el-form ref="form" :model="{}" label-width="80px">
        <el-form-item label="选择文件">
          <input type="file" ref="files">
          <p class="ts">只支持固定格式的Excel文件</p>
          <p class="error" style="padding-left:0">重复数据或者非法数据将直接被忽略。</p>
          <a
            :href="src"
            class="link"
            target="__blank"
          >下载Excel模块</a>
        </el-form-item>
        <el-form-item label="课程顾问">
          <el-select v-model="course_consultant" placeholder="请选择课程顾问">
            <el-option
              :label="item.user_remark"
              :value="item.id"
              v-for="(item,index) in yx_cclist"
              :key="index"
            ></el-option>
          </el-select>
          <p class="ts">若没有该课程顾问，请管理员在对应权限组添加被分配线索（课程顾问）权限。</p>
        </el-form-item>
        <el-form-item label="渠道来源">
          <el-select v-model="source" placeholder="请选择渠道来源">
            <el-option
              :label="item.note"
              :value="item.id"
              v-for="(item,index) in qdlist"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="daorufun" :loading="loading">导入</el-button>
    </span>
  </el-dialog>
</template>

<script>
import tokenFun from "../../../../plugin/token/index"
export default {
  props: ["show"],
  data() {
    return {
      dialogVisible: false,
      loading: false,
      course_consultant: "",
      source: "",
      src:''
    };
  },

  watch: {
    show() {
      this.dialogVisible = true;
    },
    yx_cclist(){
      this.initcourse_consultant()
    }
  },

  computed: {
    qdlist() {
      return this.$store.state.yx_qudao;
    },
    userInfo() {
      return this.$store.state.userInfo;
    },
    yx_cclist() {
      return this.$store.state.yx_cclist;
    }
  },

  methods: {

    initcourse_consultant(){
      this.yx_cclist.map(item=>{
        if(item.id == this.userInfo.id){
          this.course_consultant = item.id
        }
      })
    },

    daorufun() {
      let input = this.$refs.files;
      let file = input.files[0];

      if (!file) {
        this._alert({
          type: "warning",
          msg: "请上传文件"
        });
        return;
      }

      if (file.name.substr(file.name.length - 5) != '.xlsx') {
        this._alert({
          type: "warning",
          msg: "请上传正确的execl文件"
        });
        return;
      }

      this.loading = true;

      this.$ga.event("线索管理SaaS端", "批量导入-导入", "merchant_id", this.mymange);

      this._NET
        .yw_yz_fileImport({
          merchant_id: this.mymange,
          file,
          course_consultant: this.course_consultant,
          source: this.source
        })
        .then(data => {
          this.loading = false;
          if (data.status == "ok") {
            this.dialogVisible = false;
            this._alert({
              type: "success",
              msg: `导入成功${ data.data.success_num }条,失败${ data.data.failed_num }条`
            });

            this.$refs.files.value = ''

            this.$emit('callback')
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },

    changefile(e) {
      var name = e.target.files[0];
      var reader = new FileReader();
      reader.onload = function(e) {
        var data = e.target.result;
        var wb = XLSX.read(data, { type: "binary" });

        console.log(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]));
      };
      reader.readAsBinaryString(e.target.files[0]);
    }

    // 导入
  },

  created() {

    let token = tokenFun.getToken("token");
    this.src = `https://api-dev.imxyb.com/api/member/Intention_member/templateUpload?merchant_id=${
      this.mymange
    }&type=intention&authorization=${token}`;

    this.initcourse_consultant()
  },
};
</script>


<style lang="less" scoped>
@import "../../../../less/style.less";

.xs_content {
  width: 400px;
  margin: 0 auto;
}

.ts {
  font-size: 14px;
  color: @c3;
  line-height: 22px;
  margin-top: 5px;
}

.link {
  color: @info;
  font-size: 14px;
  text-decoration: underline;
}
</style>
