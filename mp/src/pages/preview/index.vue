<template>
  <div class="main">
    <web-view :src="url"></web-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      url: '',
    }
  },
  onLoad(options) {
    if (options.scene) {
      this.url = decodeURIComponent(options.scene)
    } else {
      this.url = 'https://tiaocaoer.com/preview?url=' + this.$root.$mp.query.url
    }
  },
}
</script>

<style lang="less" scoped>
page {
  background: #fff;
}
</style>