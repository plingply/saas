<template>
  <div class="tabstyle">
    <div class="tabhead">
      <slot name="head"></slot>
    </div>
    <div class="tabcontent" style="minWidth: 880px;">
      <slot name="main"></slot>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import "../../less/style";
.tabstyle {
  margin-top: 20px;

  .tabhead {
    display: flex;
    overflow: hidden;
    position: relative;
    top: 1px;
    > * {
      display: block;
      height: 50px;
      line-height: 50px;
      text-align: center;
      background-color: #fff;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 16px;
      color: @c2;
      padding: 0 24px;
      position: relative;
      border: 1px solid @bd1;
      border-right: none;
      font-weight: 400;
      border-radius: 0;
      &:first-child {
        border-top-left-radius: 4px;
      }
      &:last-child {
        border-right: 1px solid @bd1;
        border-top-right-radius: 4px;
      }
      &.active {
        color: @c;
        background-color: #fff;
        border-bottom: 1px solid #fff;
        &::after {
          content: "";
          width: 100%;
          height: 2px;
          background-color: #fff;
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          margin: 0 auto;
        }
      }
    }
  }

  .tabcontent {
    display: block;
    width: 100%;
    min-height: 400px;
    min-width: 1024px;
    background-color: #fff;
    border-radius: 0 4px 4px 4px;
    box-sizing: border-box;
    padding: 24px 24px;
    border: 1px solid @bd1;
  }
}
</style>
