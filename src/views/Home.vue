<template>
  <div class="home">
    <span class="icon-add"></span>
    <span class="icon-clock"></span>

  </div>
</template>

<script>
  import Epub from 'epubjs'

  global.epub = Epub
  export default {
    name: 'Home',
    mounted () {
    }
  }
</script>
<style scope>

</style>
