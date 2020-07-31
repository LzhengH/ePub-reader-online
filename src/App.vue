<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    methods: {
      openIndexedDB(name = 'bookDB', version = 1) {
        // indexedDB缓存当前书籍，保证刷新时能够继续阅读
        const request = indexedDB.open(name, version) // @params: dbName, version
        request.onsuccess = e => {
          this.db = e.target.result
        }
        request.onerror = err => {
          console.error(err)
        }
        request.onupgradeneeded = e => { // IDBVersionChangeEvent
          let db = e.target.result
          if (!db.objectStoreNames.contains('currentBook')) {
            db.createObjectStore('currentBook', { keyPath: 'id' })
          }
        }
      },
      colseIndexedDB() {
        this.db.close()
      }
    },
    created() {
      this.openIndexedDB('bookDB', 1)
    },
    destroyed() {
      this.colseIndexedDB()
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
