<template>
  <div>
    <div class="banner_title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'edu_setting_zs' }">
          <span>教务设置</span>
        </el-breadcrumb-item>
        <el-breadcrumb-item v-if="$route.name == 'edu_setting_zs'">招生管理</el-breadcrumb-item>
        <el-breadcrumb-item v-if="$route.name == 'edu_setting_classroow'">教室设置</el-breadcrumb-item>
        <el-breadcrumb-item v-if="$route.name == 'edu_setting_card'">学员卡设置</el-breadcrumb-item>
        <el-breadcrumb-item
          :to="{ name: 'edu_setting_card' }"
          v-if="$route.name == 'edu_setting_addcard' || $route.name == 'edu_setting_editorcard' || $route.name == 'edu_setting_info'"
        >学员卡设置</el-breadcrumb-item>
        <el-breadcrumb-item v-if="$route.name == 'edu_setting_addcard'">添加学员卡</el-breadcrumb-item>
        <el-breadcrumb-item v-if="$route.name == 'edu_setting_editorcard'">编辑学员卡</el-breadcrumb-item>
        <el-breadcrumb-item v-if="$route.name == 'edu_setting_info'">学员卡详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <tabs>
      <template #head>
        <router-link
          :class="{ active: $route.meta == 'edu_setting_zs' }"
          tag="span"
          :to="{ name:'edu_setting_zs' }"
        >招生管理</router-link>
        <router-link
          :class="{ active: $route.meta == 'edu_setting_classroow' }"
          tag="span"
          :to="{ name:'edu_setting_classroow' }"
        >教室设置</router-link>
        <router-link
          :class="{ active: $route.meta == 'edu_setting_card' }"
          tag="span"
          :to="{ name:'edu_setting_card' }"
        >学员卡设置</router-link>
      </template>
      <template #main>
          <router-view></router-view>
      </template>
    </tabs>
    
  </div>
</template>
