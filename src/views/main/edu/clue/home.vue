<template>
  <div class="autobox">
    <div class="banner_title">
      <span>线索管理</span>
    </div>

    <div class="btnbox">
      <el-button type="primary" @click="openaddxs">
        <i class="el-icon-plus"></i>添加线索
      </el-button>
      <el-button plain @click="openpldr">批量导入</el-button>
      <el-button
        plain
        v-show="multipleSelection.length > 0"
        @click="fenpeitime = +new Date()"
      >批量分配</el-button>
      <el-button
        plain
        v-show="multipleSelection.length > 0"
        @click="deletefun"
      >批量删除</el-button>
    </div>

    <div class="searchbox">
      <div>
        <span style="margin-right:5px">录入时间</span>
        <el-date-picker
          class="mb15"
          v-model="s_luru_time"
          type="daterange"
          style="width:240px;margin-right:10px;position:relative;top:1px"
          align="left"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </div>

      <el-select
        v-model="s_source"
        filterable
        placeholder="选择渠道"
        style="width:150px;margin-right:10px"
        class="mb15"
      >
        <el-option label="全部渠道" value></el-option>
        <el-option :label="item.name" :value="item.id" v-for="(item,index) in qdlist" :key="index"></el-option>
      </el-select>

      <el-select
        v-model="s_intention"
        filterable
        placeholder="选择意向级别"
        style="width:150px;margin-right:10px"
        class="mb15"
      >
        <el-option label="全部意向级别" value></el-option>
        <el-option
          :label="item"
          :value="key"
          v-for="(item,key) in yx_config.intention_config"
          :key="key"
        ></el-option>
      </el-select>

      <el-select
        v-model="s_follow_status"
        filterable
        placeholder="选择跟进状态"
        style="width:150px;margin-right:10px"
        class="mb15"
      >
        <el-option label="全部跟进状态" value></el-option>
        <el-option
          :label="item"
          :value="key"
          v-for="(item,key) in yx_config.follow_config"
          :key="key"
        ></el-option>
      </el-select>

      <el-select
        v-model="s_course_consultant"
        clearable
        placeholder="选择课程顾问"
        style="width:150px;margin-right:10px"
        class="mb15"
      >
        <el-option label="全部课程顾问" value></el-option>
        <el-option
          :label="item.user_remark"
          :value="item.id"
          v-for="(item,index) in yx_cclist"
          :key="index"
        ></el-option>
      </el-select>

      <el-input
        class="mb15"
        placeholder="学员姓名/电话"
        clearable
        maxlength="11"
        prefix-icon="el-icon-search"
        style="width:150px;margin-right:10px"
        v-model="s_search"
      ></el-input>

      <div>
        <span style="margin-right:5px" v-if="moretj">跟进时间</span>
        <el-date-picker
          class="mb15"
          v-model="s_genjin_time"
          type="daterange"
          style="width:240px;margin-right:10px;position:relative;top:1px"
          align="left"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          v-if="moretj"
          :default-time="['00:00:00','23:59:59']"
        ></el-date-picker>
      </div>
      <div>
        <span style="margin-right:5px" v-if="moretj">跟进次数≤</span>
        <el-input
          class="mb15"
          placeholder
          clearable
          maxlength="10"
          style="width:73px;position:relative;top:1px;margin-right:10px"
          v-model="s_follow_num"
          v-if="moretj"
        ></el-input>
      </div>

      <div style="margin-right:20px">
        <el-button type="text" class="mb15" v-show="!moretj" @click="moretj = true">更多查询条件</el-button>
        <el-button
          type="text"
          style="margin-left:0"
          class="mb15"
          v-show="moretj"
          @click="moretjfun"
        >收起查询条件</el-button>
      </div>

      <div class="btnbox">
        <el-button type="primary" @click="serachFuns" :disabled="!canload">查询</el-button>
        <el-button plain @click="reset" :disabled="!canload">重置</el-button>
      </div>
    </div>

    <div class="s_btn">
      <ui-button type="danger text" size="mini" @click="opentablehead">设置表头</ui-button>
    </div>

    <div class="tablestyle" v-loading="loading" element-loading-text="加载中">
      <el-table
        :data="list"
        style="width: 100%"
        class="table_moban"
        size="medium"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="学员姓名" prop="name"></el-table-column>
        <el-table-column label="学员电话" prop="phone"></el-table-column>
        <el-table-column v-if="checkarr.indexOf('age') > -1" label="年龄" prop="age"></el-table-column>
        <el-table-column v-if="checkarr.indexOf('qudao') > -1" label="招生渠道">
          <template slot-scope="scope">{{ scope.row.source }}</template>
        </el-table-column>
        <el-table-column label="意向级别" v-if="checkarr.indexOf('yxjb') > -1">
          <template slot-scope="scope">
            <div v-if="yx_config.intention_config">
              <p>{{ yx_config.intention_config[scope.row.intention_level]?yx_config.intention_config[scope.row.intention_level]:'--' }}</p>
            </div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column label="跟进状态" v-if="checkarr.indexOf('gjzt') > -1">
          <template slot-scope="scope">
            <div v-if="scope.row.follow_status">
              <p>{{ yx_config.follow_config[scope.row.follow_status]?yx_config.follow_config[scope.row.follow_status]:'--' }}</p>
            </div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column label="录入时间" width="150px" v-if="checkarr.indexOf('ctime') > -1">
          <template slot-scope="scope">{{ scope.row.add_time | yyyy_mm_dd_H_M }}</template>
        </el-table-column>
        <el-table-column label="最新跟进时间" v-if="checkarr.indexOf('uptime') > -1">
          <template slot-scope="scope">{{ scope.row.follow_time | yyyy_mm_dd_H_M }}</template>
        </el-table-column>
        <el-table-column label="下次跟进时间" v-if="checkarr.indexOf('nxtime') > -1">
          <template slot-scope="scope">{{ scope.row.follow_next_time | yyyy_mm_dd_H_M }}</template>
        </el-table-column>
        <el-table-column label="跟进次数" v-if="checkarr.indexOf('count') > -1" prop="follow_num"></el-table-column>
        <el-table-column label="课程顾问" v-if="checkarr.indexOf('kcgw') > -1">
          <template slot-scope="scope">{{ scope.row.course_consultant_name }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <ui-button
              type="danger text"
              size="mini"
              @click="$router.push({ name:'edu_clue_Follow',params:{ id: scope.row.id } })"
            >跟进记录</ui-button>
            <ui-button
              type="danger text"
              size="mini"
              @click="$router.push({ name:'edu_clue_info',params:{ id: scope.row.id } })"
            >学员详情</ui-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="fenye" v-show="count > fysize">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-size="limit"
          @size-change="sizeChange"
          :page-sizes="pageSizes"
          :layout="fy_layout"
          :total="count"
        ></el-pagination>
      </div>
    </div>

    <!-- 设置表头 -->
    <tablehead :show="tableheadshow" :head-obj="headObj" @callback="getTableHead"></tablehead>
    <!-- 批量导入线索 -->
    <daoru :show="cluetime" @callback="reset"></daoru>
    <!-- 批量分配 -->
    <fenpei :show="fenpeitime" :list="multipleSelection" @callback="getlist"></fenpei>
    <!-- 添加意向学员 -->
    <addyx :show="addyxtime" @addcallback="serachFuns"></addyx>
  </div>
</template>
<script src="./home.js"></script>
<style lang="less" scoped>
@import "../../../../less/style.less";
.imgbox12 {
  height: 24px;
  img {
    height: 24px;
  }
}

.searchbox {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0;
}

.s_btn {
  text-align: right;
  padding: 10px 0;
  button {
    cursor: pointer;
  }
}

.mb15 {
  margin-bottom: 15px;
}
.blue {
  color: @info;
}

.tablestyle {
  position: relative;
}

.deletestyle {
  p {
    font-size: 14px;
    color: @c2;
    margin-top: 5px;
    span {
      color: @c;
    }
  }
}

.fenye {
  padding: 0;
  margin-top: 24px;
  margin-bottom: 24px;
}
</style>


