<template>
  <div>
    <div class="banner_title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'edu_student_home' }">学员管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="infobox" v-loading="loading">
      <studentinfo :info="info" @callback="getinfo"></studentinfo>
      <tabs>
        <template #head>
          <router-link
            tag="span"
            :to="{ name:'edu_student_pay',params:{ id: $route.params.id } }"
            :class="{ active:$route.name == 'edu_student_pay' }"
          >缴费记录</router-link>
          <router-link
            tag="span"
            :to="{ name:'edu_student_class',params:{ id: $route.params.id } }"
            :class="{ active:$route.name == 'edu_student_class' }"
          >班级</router-link>
          <router-link
            tag="span"
            :to="{ name:'edu_student_classRecord',params:{ id: $route.params.id } }"
            :class="{ active:$route.name == 'edu_student_classRecord' }"
          >上课记录</router-link>
          <router-link
            tag="span"
            :to="{ name:'edu_student_Growup',params:{ id: $route.params.id } }"
            :class="{active:$route.name == 'edu_student_Growup' }"
          >成长记录</router-link>
          <router-link
            tag="span"
            :to="{ name:'edu_student_card',params:{ id: $route.params.id } }"
            :class="{ active:$route.name == 'edu_student_card' || $route.name == 'edu_student_card_record' }"
          >学员卡</router-link>
        </template>
        <template #main>
          <router-view @change="ischange" :info="info"></router-view>
        </template>
      </tabs>
    </div>
  </div>
</template>

<script>
import studentinfo from "../componts/studentinfo.vue";
export default {
  data() {
    return {
      title: "",
      info: {},
      canEditor: false,
      loading: false
    };
  },

  components: {
    studentinfo
  },

  watch: {
    $route() {
      this.setBread();
    }
  },

  methods: {
    /**
     * 设置面包屑
     */
    setBread() {
      if (this.$route.name == "edu_student_pay") {
        this.title = "缴费记录";
      }
      if (this.$route.name == "edu_student_class") {
        this.title = "班级";
      }
      if (this.$route.name == "edu_student_classRecord") {
        this.title = "上课记录";
      }
      if (this.$route.name == "edu_student_Growup") {
        this.title = "成长记录";
      }
      if (
        this.$route.name == "edu_student_card" ||
        this.$route.name == "edu_student_card_record"
      ) {
        this.title = "学员卡";
      }
    },

    getinfo() {
      this.loading = true;
      this._NET
        .jw_student_info({
          campus_id: this.campus_id,
          id: this.$route.params.id
        })
        .then(data => {
          this.loading = false;
          if (data.code == "1") {
            data.data.birthday =
              data.data.birthday == "0" ? "" : data.data.birthday;
            data.data.birthday_time = data.data.birthday
              ? new Date(data.data.birthday * 1000)
              : "";
            this.info = data.data;
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },

    ischange(data) {
      this.canEditor = data;
    }
  },

  created() {
    this.getinfo();
    this.setBread();
    this.$scroll()
  }
};
</script>



