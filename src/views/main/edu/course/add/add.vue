<template>
  <div class="box">
    <div class="banner_title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'edu_course_list' }">课程管理</el-breadcrumb-item>
        <el-breadcrumb-item v-if="$route.name != 'edu_course_editor'">添加课程</el-breadcrumb-item>
        <el-breadcrumb-item v-if="$route.name == 'edu_course_editor'">编辑课程</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="infobox" v-loading="xloading">
      <div class="topbox">
        <el-form ref="form" :model="form" label-width="100px" :rules="rules">
          <el-form-item label="课程名称" prop="name">
            <el-input v-model="form.name" maxlength="50" size="medium" style="width:450px"></el-input>
          </el-form-item>
          <el-form-item label="课程状态" prop="name" v-if="$route.name == 'edu_course_editor'">
            <el-radio v-model="status" label="1">启用</el-radio>
            <el-radio v-model="status" label="2">停用</el-radio>
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="form.note"
              type="textarea"
              maxlength="500"
              size="medium"
              style="width:450px"
              :rows="4"
            ></el-input>
          </el-form-item>

          <!-- 课程操作区域 -->
          <el-form-item label>
            <el-tabs v-model="cardType" @tab-click="handleClick">
              <el-tab-pane label="全部" name="all"></el-tab-pane>
              <el-tab-pane
                :label="item"
                :name="index"
                v-for="(item,index) in yx_config.card_type_list"
                :key="index"
              ></el-tab-pane>
            </el-tabs>

            <div
              class="courseBox"
              v-show=" cz_cardlist.length > 0 && (cardType == 'all' || cardType == '1')"
            >
              <div class="row">
                <div class="col1">
                  <el-checkbox
                    :indeterminate="cz_isIndeterminate"
                    v-model="cz_checkAll"
                    @change="cz_handleCheckAllChange"
                  >全部储值卡</el-checkbox>
                  <div v-show="cz_checkAll">
                    <el-checkbox v-model="cz_checkAll_value" style="margin-right:0px">统一设置：</el-checkbox>
                    <el-input
                      :disabled="!cz_checkAll_value"
                      style="width: 100px"
                      v-model="cz_allnum"
                    ></el-input>
                    <span>&nbsp;元&nbsp;&nbsp;&nbsp;</span>
                  </div>
                </div>
              </div>
              <el-checkbox-group
                v-model="cz_checkedCardList"
                @change="cz_handlecheckedsubjectChange"
              >
                <div v-for="(item,index) in cz_cardlist" :key="index" class="row">
                  <div class="col">
                    <el-checkbox :label="item.id">
                      <textbox :len="10" :text="item.name"></textbox>
                    </el-checkbox>
                    <div>
                      <div>每课：</div>
                      <el-input
                        :disabled="cz_checkAll_value"
                        style="width: 100px"
                        v-model="item.num"
                      ></el-input>
                      <div>&nbsp;元&nbsp;&nbsp;&nbsp;</div>
                    </div>
                  </div>
                </div>
              </el-checkbox-group>
            </div>
            <div
              class="courseBox"
              v-show=" ks_cardlist.length > 0 && (cardType == 'all' || cardType == '2')"
            >
              <div class="row">
                <div class="col1">
                  <el-checkbox
                    :indeterminate="ks_isIndeterminate"
                    v-model="ks_checkAll"
                    @change="ks_handleCheckAllChange"
                  >全部课时卡</el-checkbox>
                  <div v-show="ks_checkAll">
                    <el-checkbox v-model="ks_checkAll_value" style="margin-right:0px">统一设置：</el-checkbox>
                    <el-input
                      :disabled="!ks_checkAll_value"
                      style="width: 100px"
                      v-model="ks_allnum"
                    ></el-input>
                    <span>&nbsp;课时</span>
                  </div>
                </div>
              </div>
              <el-checkbox-group
                v-model="ks_checkedCardList"
                @change="ks_handlecheckedsubjectChange"
              >
                <div v-for="(item,index) in ks_cardlist" :key="index" class="row">
                  <div class="col">
                    <el-checkbox :label="item.id">
                      <textbox :len="10" :text="item.name"></textbox>
                    </el-checkbox>
                    <div>
                      <div>每课：</div>
                      <el-input
                        :disabled="ks_checkAll_value"
                        style="width: 100px"
                        v-model="item.num"
                      ></el-input>
                      <div>&nbsp;课时</div>
                    </div>
                  </div>
                </div>
              </el-checkbox-group>
            </div>
            <div
              class="courseBox"
              v-show=" qx_cardlist.length > 0 && (cardType == 'all' || cardType == '3')"
            >
              <div class="row">
                <div class="col1">
                  <el-checkbox
                    :indeterminate="qx_isIndeterminate"
                    v-model="qx_checkAll"
                    @change="qx_handleCheckAllChange"
                  >全部期限卡</el-checkbox>
                </div>
              </div>
              <el-checkbox-group
                v-model="qx_checkedCardList"
                @change="qx_handlecheckedsubjectChange"
              >
                <div v-for="(item,index) in qx_cardlist" :key="index" class="row">
                  <div class="col">
                    <el-checkbox :label="item.id">
                      <textbox :len="10" :text="item.name"></textbox>
                    </el-checkbox>
                  </div>
                </div>
              </el-checkbox-group>
            </div>

            <div class="zanwucard" v-show="cz_cardlist.length == 0 && cardType == '1'">
              暂无卡片，
              <el-button plain @click="tolinkaddcard">立即添加</el-button>
            </div>
            <div class="zanwucard" v-show="ks_cardlist.length == 0 && cardType == '2'">
              暂无卡片，
              <el-button plain @click="tolinkaddcard">立即添加</el-button>
            </div>
            <div class="zanwucard" v-show="qx_cardlist.length == 0 && cardType == '3'">
              暂无卡片，
              <el-button plain @click="tolinkaddcard">立即添加</el-button>
            </div>
            <div
              class="zanwucard"
              v-show="cz_cardlist.length == 0 && ks_cardlist.length == 0 && qx_cardlist.length == 0 && cardType == 'all'"
            >
              暂无卡片，
              <el-button type="primary" @click="tolinkaddcard">立即添加</el-button>
            </div>
          </el-form-item>

          <!-- 操作按钮区域 -->
          <el-form-item>
            <el-button plain @click="$router.go(-1)">取 消</el-button>
            <el-button
              type="primary"
              v-if="$route.name != 'edu_course_editor'"
              @click="postData(false)"
              :loading="loading"
            >添 加</el-button>
            <el-button
              type="primary"
              v-if="$route.name == 'edu_course_editor'"
              @click="postData(true)"
              :loading="loading"
            >保 存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script src="./add.js"></script>

<style lang="less" scoped>
@import "../../../../../less/style.less";

.tishi {
  font-size: 12px;
  color: @c;
  line-height: 1;
  padding-top: 8px;
}

.row {
  margin-top: 8px;
  width: 450px;
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
  border-bottom: 1px solid @bd1;
  padding-bottom: 16px;
  margin-bottom: 16px;
}

.zanwucard {
  text-align: center;
  font-size: 14px;
  color: @c3;
  padding: 32px 0;
}
</style>
