<template>
  <div v-loading="xloading">
    <el-form ref="xform" :model="form" label-width="100px" :rules="rules">
      <el-form-item label="卡类型" prop="card_type">
        <el-select v-model="form.card_type" size="medium" style="width:250px">
          <el-option
            :label="item"
            :value="key"
            v-for="(item,key) in yx_config.card_type_list"
            :key="key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学员卡名称" prop="name">
        <el-input v-model="form.name" maxlength="50" size="medium" style="width:250px"></el-input>
      </el-form-item>
      <el-form-item label="有效期" prop="expiry_date">
        <div>
          <el-input v-show="form.expiry_date != '-1'"  v-model="form.expiry_date" @input="timeInput" size="medium" style="width:60px" :disabled="isDisabled"></el-input>
          <el-input v-show="form.expiry_date == '-1'" disabled size="medium" style="width:60px"></el-input>
          <span>个月&nbsp;&nbsp;</span>
          <el-radio-group v-model="form.expiry_date">
            <el-radio-button label="3">3个月</el-radio-button>
            <el-radio-button label="6">6个月</el-radio-button>
            <el-radio-button label="12">12个月</el-radio-button>
              <el-radio-button label="-1">无期限</el-radio-button>
          </el-radio-group>
        </div>
        <p class="tishi">此有效期仅为学员卡建议有效期，实际有效期以发卡时设置为准。</p>
      </el-form-item>
      <el-form-item label="备注">
        <div>
          <el-input
            v-model="form.note"
            type="textarea"
            maxlength="500"
            size="medium"
            style="width:450px"
            :rows="3"
          ></el-input>
        </div>
      </el-form-item>
      <el-form-item label="课程关联设置">
        <div class="courseBox" v-show="courselist.length > 0">
          <div class="row" style="margin-top:0px">
            <div class="col1">
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAllChange"
              >全选</el-checkbox>
              <div v-if="form.card_type != '3' && checkAll">
                <el-checkbox v-model="checkAll_v" style="margin-right:0px">统一设置：</el-checkbox>
                <el-input :disabled="!checkAll_v" style="width: 100px" v-model="allnum"></el-input>
                <span>&nbsp;{{ form.card_type | unit }}</span>
              </div>
            </div>
          </div>
          <el-checkbox-group v-model="checkedList" @change="handlecheckedListChange">
            <div v-for="(item,index) in courselist" :key="index" class="row">
              <div class="col">
                <el-checkbox :label="item.id">
                  <textbox :len="10" :text="item.name"></textbox>
                </el-checkbox>
                <div v-if="form.card_type != '3'">
                  <div v-show="form.card_type != '3'">每课：</div>
                  <el-input :disabled="checkAll_v" style="width: 100px" v-model="item.num"></el-input>
                  <div>&nbsp;{{ form.card_type | unit }}</div>
                </div>
              </div>
            </div>
          </el-checkbox-group>
        </div>

        <div class="zanwucard row" v-show="courselist.length == 0">
          暂无课程，
          <el-button plain @click="tolinkaddcard">立即添加</el-button>
        </div>
        <el-button plain @click="$router.go(-1)">取 消</el-button>
        <el-button
          type="primary"
          v-if="$route.name != 'edu_setting_editorcard'"
          @click="postData(false)"
          :loading="loading"
        >添 加</el-button>
        <el-button
          type="primary"
          v-if="$route.name == 'edu_setting_editorcard'"
          @click="postData(true)"
          :loading="loading"
        >保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script src="./add.js"></script>

<style lang="less" scoped>
@import "../../../../../../less/style.less";
.tishi {
  font-size: 12px;
  color: @c;
  line-height: 1;
  padding-top: 8px;
}

.row {
  margin-top: 8px;
}

.col {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  padding-left: 24px;
  > div {
    display: flex;
    > div {
      font-size: 14px;
    }
  }
}

.col1 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  flex-wrap: wrap;
  > div {
    display: flex;
  }
}

.courseBox {
  width: 450px;
  border-bottom: 1px solid @bd1;
  padding-bottom: 16px;
  margin-bottom: 16px;
}

.zanwucard {
  width: 450px;
  text-align: center;
  font-size: 14px;
  color: @c3;
  padding: 32px 0;
}
</style>
