<template>
  <div class="ebook" ref='ebook'>
    <ebook-title></ebook-title>
    <ebook-reader></ebook-reader>
    <ebook-menu></ebook-menu>
    <ebook-bookmark></ebook-bookmark>
  </div>
</template>

<script>
  import EbookReader from '../../components/ebook/EbookReader.vue'
  import EbookTitle from '../../components/ebook/EbookTitle.vue'
  import EbookMenu from '../../components/ebook/EbookMenu.vue'
  import EbookBookmark from '../../components/ebook/EbookBookmark.vue'
  import { ebookMixin } from '../../utils/mixin'
  import { getReadTime, saveReadTime } from '../../utils/localStorage'
  export default {
    mixins: [ebookMixin],
    components: {
      EbookReader,
      EbookTitle,
      EbookMenu,
      EbookBookmark
    },
    watch: {
      offsetY(v) {
        if (!this.menuVisible && this.bookAvailable) { // 菜单隐藏且目录加载完毕才能下拉
          if (v > 0) {
            this.move(v)
          } else if (v === 0) {
            this.restore()
          }
        }
      }
    },
    methods: {
      restore() {
        this.$refs.ebook.style.top = 0
        this.$refs.ebook.style.transition = 'all .2s linear'
        setTimeout(() => {
          this.$refs.ebook.style.transition = ''
        }, 200)
      },
      move(v) {
        this.$refs.ebook.style.top = v + 'px'
      },
      startLoopReadTime() {
        let readTime = getReadTime(this.fileName)
        if (!readTime) {
          readTime = 0
        }
        this.task = setInterval(() => {
          readTime++
          if (readTime % 30 === 0) {
            saveReadTime(this.fileName, readTime)
          }
        }, 1000)
      }
    },
    mounted() {
      this.startLoopReadTime()
    },
    beforeDestroy() {
      if (this.task) {
        clearInterval(this.task)
      }
    }
  }
</script>

<style lang='scss' scope>
  .ebook {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
