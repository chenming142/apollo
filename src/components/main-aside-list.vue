<template>
  <div class="main-aside-list">
    <div v-for="item in wechats" :key="item.personalid">
      <span v-text="item.getNickname()"></span>
    </div>
  </div>
</template>

<script>
  import WechatFactory from '../model/wechat';
  export default {
    data () {
      return {

      }
    },
    computed: {
      wechats () {
        return WechatFactory.getWechats();
      }
    },
    created () {
      console.log('\n- components.main-aside-list -------------');
    }
  }
</script>

<style>
  .main-aside-list {}
</style>