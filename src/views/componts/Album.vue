<template>
  <div class="album" v-show="show">
    <div class="albumbox" ref="albumbox">
      <div class="albumimgbox" @mousedown="mousedown" @mouseup="mouseup" @mousemove="mousemove">
        <img :src="imgSrc" alt ref="albumBigImg" :style="{left:x+'px',top:y+'px'}">
      </div>
      <span @click="show = false" class="close">
        <i class="el-icon-close"></i>
      </span>
      <span @click="toleftfun" class="left">
        <i class="el-icon-arrow-left"></i>
      </span>
      <span @click="torightfun" class="right">
        <i class="el-icon-arrow-right"></i>
      </span>
      <div class="czbox">
        <div class="step1">
          <el-slider v-model="value4" :format-tooltip="formatTooltip"></el-slider>
        </div>
      </div>
    </div>
    <div class="albumbottom">
      <div ref="albumbottom">
        <span
          v-for="(item,indx) in list"
          :key="indx"
          :class="{active:index == indx}"
          :style="{ backgroundImage:'url('+ item +')' }"
          @click="changeImg(indx)"
        ></span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["list", "change"],
  watch: {
    change() {
      this.show = true;
      this.index = 0;
    },
    list() {
      this.$refs.albumbottom.style.width = this.list.length * 90 + "px";
      this.imgSrc = this.list[0];
    },
    value4(v) {
      this.sc = v / 100 + 0.5;
      this.$refs.albumBigImg.style.transform = "scale(" + this.sc + ")";
    },

    index(){
      this.value4 = 50
    }
  },
  data() {
    return {
      show: false,
      imgSrc: "",
      canmove: false,
      ismover: false,
      lx: 0,
      ly: 0,
      x: 0,
      y: 0,

      sc: "",
      xcount: 2,
      index: 0,

      value4: 50
    };
  },


  methods: {
    formatTooltip(val) {
      return parseFloat(val / 100 + 0.5).toFixed(1);
    },
    mousedown(e) {
      this.canmove = true;
      this.lx = e.clientX;
      this.ly = e.clientY;
      this.ismover = false;
    },
    mousemove(e) {
      e.stopPropagation();
      e.preventDefault();
      this.ismover = true;
      if (this.canmove) {
        this.x += (e.clientX - this.lx) * this.xcount;
        this.y += (e.clientY - this.ly) * this.xcount;

        this.lx = e.clientX;
        this.ly = e.clientY;
      }
    },
    mouseup() {
      this.canmove = false;
      if (!this.ismover) {
        this.show = false;
      }
    },
    changeImg(index) {
      this.index = index;
      this.imgSrc = this.list[index];
    },

    toleftfun() {
      this.index--;
      this.index = this.index <= 0 ? 0 : this.index;
      this.imgSrc = this.list[this.index];
    },

    torightfun() {
      this.index++;
      this.index =
        this.index >= this.list.length - 1 ? this.list.length - 1 : this.index;
      this.imgSrc = this.list[this.index];
    }
  },

  mounted() {
    var self = this;
    self.$nextTick(function() {
      self.$refs.albumbottom.style.width = self.list.length * 90 + "px";
      self.$refs.albumbox.style.height =
        document.documentElement.clientHeight - 100 + "px";

      window.onresize = function() {
        if (self.$refs.albumbottom) {
          self.$refs.albumbottom.style.width = self.list.length * 90 + "px";
          self.$refs.albumbox.style.height =
            document.documentElement.clientHeight - 100 + "px";
        }
      };
    });
    var box = document.getElementsByClassName("album")[0];
    box.onmouseup = function() {
      self.canmove = false;
    };
  }
};
</script>
<style lang="less" scoped>
@import "../../less/style";
.czbox {
  position: absolute;
  right: 60px;
  top: 7px;
  display: flex;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 0 10px;
  justify-content: flex-end;
  align-items: flex-end;
  box-sizing: border-box;
  .step1 {
    width: 100px;
  }
}
.album {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 3000;
  .albumbox {
    width: 100%;
    height: 100%;
    background-color: #000;
    overflow: hidden;
    position: absolute;
    left: 0;
    right: 0;
    margin: 0 auto;
    top: 0;
    > .albumimgbox {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      img {
        display: block;
        max-width: 100%;
        max-height: 100%;
        .autocenter();
        cursor: move;
      }
    }

    > .close {
      display: block;
      width: 50px;
      height: 50px;
      position: absolute;
      right: 0;
      top: 0;
      background-size: 100% 100%;
      cursor: pointer;
      font-size: 20px;
      color: #fff;
      line-height: 50px;
      text-align: center;
      cursor: pointer;
    }

    > .left {
      display: block;
      width: 50px;
      height: 50px;
      position: absolute;
      left: 0;
      top: 50%;
      background-size: 100% 100%;
      cursor: pointer;
      font-size: 20px;
      color: #fff;
      line-height: 50px;
      text-align: center;
      cursor: pointer;
    }

    > .right {
      display: block;
      width: 50px;
      height: 50px;
      position: absolute;
      right: 0;
      top: 50%;
      background-size: 100% 100%;
      cursor: pointer;
      font-size: 20px;
      color: #fff;
      line-height: 50px;
      text-align: center;
      cursor: pointer;
    }
  }
  .albumbottom {
    height: 100px;
    width: 100%;
    overflow: hidden;
    background-color: #000;
    position: fixed;
    bottom: 0;
    left: 0;
    overflow-x: auto;
    padding: 10px;
    box-sizing: border-box;
    > div {
      height: 80px;
      width: 100%;
      span {
        display: block;
        width: 80px;
        height: 80px;
        overflow: hidden;
        margin-right: 10px;
        float: left;
        box-sizing: border-box;
        cursor: pointer;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;
        &.active {
          border: 1px solid red;
        }
      }
    }
  }
}
</style>
