<template>
  <div class="ebook-reader">
    <div id="read"></div>
    <div
      class="ebook-reader-mask"
      @touchstart.prevent="moveStart"
      @touchend.prevent="moveEnd">
    </div>
  </div>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'
  import Epub from 'epubjs'
  import { flatten } from '../../utils/book'
  import {
    getFontFamily, saveFontFamily,
    getFontSize, saveFontSize,
    getTheme, saveTheme, getLocation
  } from '../../utils/localStorage'
  window.epub = Epub // 不加这个会报找不到epub的错误
  export default {
    mixins: [ebookMixin],
    data() {
      return {
      }
    },
    computed: {
    },
    methods: {
      onMaskClick(e) { // 模拟点击事件
        const offsetX = e.changedTouches[0].clientX
        const width = window.innerWidth
        if (offsetX > 0 && offsetX < width * 0.25) {
          this.prevPage()
        } else if (offsetX > 0 && offsetX > width * 0.75) {
          this.nextPage()
        } else {
          this.toggleTitleAndMenu()
        }
      },
      moveStart(e) {
          // 触摸开始时的X坐标
          this.touchStartX = e.changedTouches[0].clientX
          // 触摸开始的时间
          this.touchStartTime = e.timeStamp
      },
      moveEnd(e) {
          // 移动的X轴距离
          const offsetX = e.changedTouches[0].clientX - this.touchStartX
          // 触摸的时间
          const time = e.timeStamp - this.touchStartTime
          if (time < 500 && offsetX > 40) {
            this.prevPage()
          } else if (time < 500 && offsetX < -40) {
            this.nextPage()
          } else if (time < 500 && offsetX <= 40 && offsetX >= -40) {
            this.onMaskClick(e) // 触发点击事件
          } else {
            this.toggleTitleAndMenu()
          }
      },
      prevPage() {
        if (this.rendition) {
          this.rendition.prev().then(() => {
            this.refreshLocation()
          })
          this.hideTitleAndMenu()
        }
      },
      nextPage() {
        if (this.rendition) {
          this.rendition.next().then(() => {
            this.refreshLocation()
          })
          this.hideTitleAndMenu()
        }
      },
      toggleTitleAndMenu() {
        if (this.menuVisible) { // 判断将要隐藏底部菜单时
          this.setSettingVisible(-1) // 同时隐藏设置菜单
          this.setFontFamilyVisible(false) // 同时隐藏字体选择菜单
        }
        this.setMenuVisible(!this.menuVisible)
      },
      hideTitleAndMenu() {
        this.setMenuVisible(false)
        this.setSettingVisible(-1)
        this.setFontFamilyVisible(false)
      },
      initTheme() {
        let defaultTheme = getTheme(this.fileName)
        if (!defaultTheme) {
          defaultTheme = this.themeList[0].name
          saveTheme(this.fileName, defaultTheme)
        }
        this.setDefaultTheme(defaultTheme)
        this.themeList.forEach(theme => {
          this.rendition.themes.register(theme.name, theme.style)
        })
        this.rendition.themes.select(defaultTheme)
      },
      initFontSize() {
        let fontSize = getFontSize(this.fileName)
        if (!fontSize) {
          saveFontSize(this.fileName, this.defaultFontSize)
        } else {
          this.rendition.themes.fontSize(fontSize + 'px')
          this.setDefaultFontSize(fontSize)
        }
      },
      initFontFamily() {
        let font = getFontFamily(this.fileName)
        if (!font) {
          saveFontFamily(this.fileName, this.defaultFontFamily)
        } else {
          this.rendition.themes.font(font)
          this.setDefaultFontFamily(font)
        }
      },
      reloadCurrentBook(dbName, objectStoreName, key) {
        const _this = this
        const request = indexedDB.open(dbName)
        request.onsuccess = function(success) {
          // 获取数据库实例对象
          let db = success.target.result
          // 对某个表进行事务操作的事务权限控制
          let transaction = db.transaction(objectStoreName, 'readwrite')
          // 对表进行操作
          let objectStore = transaction.objectStore(objectStoreName)
          // 更新记录信息
          let getResult = objectStore.get(key)
          getResult.onsuccess = function(e) {
            const bookData = e.target.result.book
            const bookName = e.target.result.name
            _this.book = new Epub()
            _this.book.open(bookData)
            _this.setFileName(bookName)
            _this.setCurrentBook(_this.book)
            _this.initEpub()
          }
        }
      },
      initRendition() {
        this.rendition = this.book.renderTo('read', {
          width: window.innerWidth,
          height: window.innerHeight,
          method: 'default'
        })
        this.rendition.themes.font('Arial')
        // 获取保存的当前阅读记录并渲染
        const location = getLocation(this.fileName) || null
        this.display(location, () => {
          // 将localStorage里的数据初始化到vuex中
          this.initTheme()
          this.initFontSize()
          this.initFontFamily()
          this.initGlobalStyle()
        })
        // 让rendition加载字体css(必须使用url的方式)
        this.rendition.hooks.content.register(contents => {
          Promise.all([
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`)
          ]).then(() => {})
        })
      },
      initGesture() {
        // epub绑定事件
        this.rendition.on('touchstart', e => {
          // 利用changedTouches判断操作
          // 触摸开始时的X坐标
          this.touchStartX = e.changedTouches[0].clientX
          // 触摸开始的时间
          this.touchStartTime = e.timeStamp
        })
        this.rendition.on('touchend', e => {
          // 移动的X轴距离
          const offsetX = e.changedTouches[0].clientX - this.touchStartX
          // 触摸的时间
          const time = e.timeStamp - this.touchStartTime
          if (time < 500 && offsetX > 40) {
            this.prevPage()
          } else if (time < 500 && offsetX < -40) {
            this.nextPage()
          } else {
            this.toggleTitleAndMenu()
          }
          e.stopPropagation()
          // e.preventDefault() // 使用阻止默认事件会使页面卡顿，先不使用
        }, { passive: false }) // 在这里处理阻止默认事件
      },
      parseBook() { // 获取封面、书籍信息、目录信息
        if (!this.cover) {
          this.book.loaded.cover.then(cover => {
            this.book.archive.createUrl(cover).then(url => {
              this.setCover(url)
            })
          }).catch(() => {
            this.setCover(require('../../assets/noCover.jpg'))
          })
        }
        if (!this.metadata) {
          this.book.loaded.metadata.then(metadata => {
            this.setMetadata(metadata)
          }).catch(() => {
            this.setMetadata({ title: this.$t('book.noneTitle'), creator: this.$t('book.noneCreator') })
            this.uploadMetadata = true
          })
        }
        this.book.loaded.navigation.then(nav => {
          const navItem = flatten(nav.toc)
          function find(item, level = 0) { // 给每个项添加level属性，表示目录等级(start=0)
            return !item.parent ? level : find(navItem.filter(parentItem => parentItem.id === item.parent)[0], ++level)
          }
          navItem.forEach(item => {
            item.level = find(item)
          })
          this.setNavigation(navItem)
        })
      },
      initSectionOffset() {
        // 由于每本书分页情况不同会有目录和section对不上的情况，这里进行偏移量判断
        const currentLocation = this.currentBook.rendition.currentLocation()// 获取当前按照分页的页数
        for (let i = -5; i <= 5; i++) { // 一般上下浮动5以内
          if (this.navigation[this.section + i] && currentLocation.start) {
            if (this.navigation[this.section + i].href === currentLocation.start.href) {
              this.setSectionOffset(i) // 保存偏移量到vuex
              break
            }
          }
        }
      },
      initEpub() {
        // const url = `${process.env.VUE_APP_RES_URL}/epub/${this.fileName}.epub`
        this.book = this.currentBook
        // this.setCurrentBook(this.book) // 将book实例传入vuex
        this.initRendition() // 初始化rendition
        // this.initGesture() // 初始化手势
        this.parseBook() // 解析电子书
        this.book.ready.then(() => { // 将书籍分页
          return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16)).then(locations => {
            // console.log(locations)
            this.initSectionOffset() // 页数和目录之间偏移量计算
            this.refreshLocation() // 分页之后要重新刷新当前章节的进度
            this.setBookAvailable(true)
          })
        })
      }
    },
    mounted() {
      this.setBookAvailable(false)
      if (!this.book) {
        // 从indexedDB中获取数据重新加载book
        this.reloadCurrentBook('bookDB', 'currentBook', 1)
      } else {
        this.initEpub()
      }
    }
  }
</script>

<style lang='scss' scoped>
  @import '../../assets/styles/mixin';
  .ebook-reader {
    position: absolute;
    z-index: 100;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .ebook-reader-mask {
      position: absolute;
      top: 0;
      left: 0;
      background: transparent;
      z-index: 150;
      width: 100%;
      height: 100%;
    }
  }
</style>
