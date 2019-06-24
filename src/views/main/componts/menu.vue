<template>
  <div class="menu">
    <div class="userinfobox">
      <span>
        <img src="static/img/loginbj.jpg" alt>
      </span>
      <div>{{ user.name }}</div>
      <p>{{ user.phone }}</p>
      <div>
        <el-button plain size="mini" @click="LoginOut">退出登录</el-button>
      </div>
    </div>
    <el-menu
      default-active="2"
      class="el-menu-vertical"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      :router="true"
      v-if="user.school_id > 0"
    >
      <div v-for="(item,index) in menu" :key="index">
        <el-menu-item v-if="item.children.length == 0" :index="item.path">
          <i :class="item.icon"></i>
          <span :class="{activestyle: $route.path.indexOf(item.keyword) != -1}">{{ item.label }}</span>
        </el-menu-item>
        <el-submenu :index="item.path" v-if="item.children.length > 0">
          <template slot="title">
            <i class="item.icon"></i>
            <span>{{ item.text }}</span>
          </template>
          <div v-for="(list,ids) in item.children" :key="ids">
            <el-menu-item style="padding-left:50px" :index="list.path">
              <span :class="{activestyle: $route.path.indexOf(list.keyword) != -1}">{{ list.label }}</span>
            </el-menu-item>
          </div>
        </el-submenu>
      </div>
    </el-menu>
  </div>
</template>

<script>
import menu from "@/common/menu.js";
export default {
  data() {
    return {
      menu
    };
  },
  computed: {
    user() {
      return this.$store.state.userInfo;
    }
  },

  methods:{
    LoginOut(){
      this._NET.LoginOut()
      .then(data=>{
        if(data.code == '1'){
          window.location = "/#/Login"
        }
      })
    }
  }
};
</script>


<style lang="less" scoped>
@import "../../../less/style";

.menu {
  width: 200px;
  background-color: @menu_bj;
  overflow: hidden;
  .userinfobox {
    width: 100%;
    height: 230px;
    padding-top: 30px;
    box-sizing: border-box;
    > span {
      display: block;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      overflow: hidden;
      margin: 0 auto;
      margin-bottom: 12px;
      img {
        display: block;
        width: 100%;
        min-height: 100%;
      }
    }
    > div {
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      color: #fff;
      line-height: 1.5;
    }
    > p {
      font-size: 14px;
      text-align: center;
      color: #fff;
      line-height: 1;
      margin: 0;
      margin-bottom: 8px;
    }
  }

  .el-menu-vertical {
    width: 200px;
  }
}
</style>
