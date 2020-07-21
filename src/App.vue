<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {}
  // rem计算
  function recalc () {
    const html = document.querySelector('html')
    let fontSize = window.innerWidth / 10
    fontSize = fontSize > 50 ? 50 : fontSize
    html.style.fontSize = fontSize + 'px'
  }
  document.addEventListener('DOMContentLoaded', recalc, false)
  window.addEventListener('resize', recalc, false)
</script>
<style lang='scss' scope>
  #app {
    widows: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>
