<template>
  <el-dialog title="批量导入学员" :visible.sync="dialogVisible" width="550px">
    <div class="xs_content">
      <el-form ref="form" :model="{}" label-width="80px">
        <el-form-item label="选择文件">
          <input type="file" ref="files">
          <p class="ts">只支持固定格式的Excel文件</p>
          <p class="error" style="padding-left:0">重复数据或者非法数据将直接被忽略。</p>
          <a :href="src" target="__blank" class="link">下载Excel模块</a>
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
import tokenFun from "../../../../plugin/token/index";
export default {
  props: ["show"],
  data() {
    return {
      dialogVisible: false,
      loading: false,
      src: ""
    };
  },

  watch: {
    show() {
      this.dialogVisible = true;
    }
  },

  methods: {
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

      if (file.name.substr(file.name.length - 5) != ".xlsx") {
        this._alert({
          type: "warning",
          msg: "请上传正确的execl文件"
        });
        return;
      }

      this.loading = true;
      this._NET
        .jw_student_fileImport({
          merchant_id: this.mymange,
          file
        })
        .then(data => {
          this.loading = false;
          if (data.status == "ok") {
            this.dialogVisible = false;
            this._alert({
              type: "success",
              msg: `导入成功${data.data.success_num}条,失败${
                data.data.failed_num
              }条`
            });

            this.$refs.files.value = "";

            this.$emit("callback");
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },

    changefile(e) {
      var name = e.target.files[0].name;
      var reader = new FileReader();
      reader.onload = function(e) {
        var data = e.target.result;
        var wb = XLSX.read(data, { type: "binary" });

        console.log(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]));
      };
      reader.readAsBinaryString(e.target.files[0]);
    }
  },

  created() {
    let token = tokenFun.getToken("token");
    this.src = `https://api-dev.imxyb.com/api/member/Intention_member/templateUpload?merchant_id=${
      this.mymange
    }&type=member&authorization=${token}`;
  }
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
