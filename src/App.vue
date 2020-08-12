<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import { FONT_FILE_LIST } from './utils/book'
  export default {
    data() {
      return {
        fontFileList: FONT_FILE_LIST, // 字体实体文件名列表
        themeList: ['default', 'eye', 'gold', 'night'] // 主题文件名
      }
    },
    methods: {
      openIndexedDB(name = 'bookDB', version = 1) {
        // indexedDB缓存当前书籍，保证刷新时能够继续阅读
        const request = indexedDB.open(name, version) // @params: dbName, version
        request.onsuccess = e => {
          this.db = e.target.result
        }
        request.onupgradeneeded = e => { // IDBVersionChangeEvent
          let db = e.target.result
          if (!db.objectStoreNames.contains('currentBook')) {
            db.createObjectStore('currentBook', { keyPath: 'id' })
          }
        }
      },
      closeIndexedDB() {
        this.db.close()
      },
      prefetchFonts() { // 预加载字体资源文件
        const head = document.getElementsByTagName('head')[0]
        this.fontFileList.forEach(item => {
          const link = document.createElement('link')
          link.rel = 'prefetch'
          link.as = 'font'
          link.href = `${process.env.VUE_APP_RES_URL}/fonts/${item}`
          head.appendChild(link)
        })
      },
      prefetchTheme() { // 预加载主题文件
        const head = document.getElementsByTagName('head')[0]
        this.themeList.forEach(item => {
          const link = document.createElement('link')
          link.rel = 'prefetch'
          link.href = `${process.env.VUE_APP_RES_URL}/theme/theme_${item}.css`
          head.appendChild(link)
        })
      }
    },
    created() {
      this.openIndexedDB('bookDB', 1)
      this.prefetchFonts()
      this.prefetchTheme()
    },
    destroyed() {
      this.closeIndexedDB()
    }
  }
  // rem计算
  function recalc () {
    const html = document.querySelector('html')
    let fontSize = window.innerWidth / 10
    fontSize = fontSize > 60 ? 60 : fontSize
    html.style.fontSize = fontSize + 'px'
  }
  document.addEventListener('DOMContentLoaded', recalc, false)
  window.addEventListener('resize', recalc, false)
</script>
<style lang='scss' scope>
  #app {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>
