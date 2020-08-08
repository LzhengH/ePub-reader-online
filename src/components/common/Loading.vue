<template>
  <div class="loading-rotate-full"></div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/mixin.scss';
.loading-rotate-full {
  border: px2rem(2) solid #777;
  border-top-color: transparent;
  border-radius: 50%;
  animation: rotate 1s linear infinite;
  box-sizing: border-box;
}
@keyframes rotate{
  from{
    transform: rotate(0);
  }
  to{
    transform: rotate(360deg);
  }
}
</style>
