<template>
  <div>
    <transition name="slide-down">
    <div class="home-previous-wrapper" v-if="!uploadStatus && prevCover && prevMetadata && flag">
      <div class="left">{{prevText}}</div>
      <div class="center">
        <img class="previous-cover" :src="prevCover" alt="prevCover">
        <div class="previous-metadata-wrapper">
          <div class="previous-metadata-title">
            <span>{{prevMetadata.title}}</span>
          </div>
          <div class="previous-metadata-author">
            <span>{{prevMetadata.creator}}</span>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="continue-read">
          <a href="javascript:;" @click="continueReadHandle()">
            {{continueRead}}
          </a>
        </div>
      </div>
    </div>
    </transition>
    <div class="home-uploader-wrapper">
      <div
        class="home-content-text-wrapper"
        v-if="uploadStatus === false">
        <span class="home-content-text">
          {{title}}
        </span>
      </div>
      <div
        class="home-uploader"
        v-if="uploadStatus === false"
        @click.stop="clickUpload()">
        <span
          class="icon-add">
        </span>
        <input
          id="file-input"
          style="display: none"
          type="file"
          accept="application/*"
          @change="fileUpload">
      </div>
      <div
        class="home-uploader-loaded-content"
        v-else>
        <div>
          <img class="home-uploader-loaded-cover" :src="cover" alt="cover">
        </div>
        <div class="home-uploader-loaded-title">
          <span class="text">
            {{metadata ? metadata.title : ''}}
          </span>
        </div>
        <div class="home-uploader-loaded-author">
          <span class="text">
            {{metadata ? metadata.creator : ''}}
          </span>
        </div>
        <div class="home-uploader-loaded-operation">
          <button
            @click="loadedConfirm()">
            {{confirm}}
          </button>
          <button
            @click="loadedCancel()"
            >
            {{cancel}}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ebookMixin } from '../../utils/mixin'
import Epub from 'epubjs'
window.epub = Epub
export default {
  mixins: [ebookMixin],
  data() {
    return {
      title: this.$t('home.select'),
      uploadMetadata: false, // 是否加载完封面
      uploadCover: false, // 是否加载完相关信息
      confirm: this.$t('book.confirm'),
      cancel: this.$t('book.cancel'),
      prevCover: null, // 上次观看的书籍封面
      prevMetadata: null, // 上次观看的书籍信息
      prevText: this.$t('detail.prevText'), // “上次观看”文本
      continueRead: this.$t('detail.continueRead'), // “继续观看”文本
      flag: true // 标记位，帮助上次观看快速收起来，如果选择完文件立即置为false；点cancel时置为true
    }
  },
  computed: {
    uploadStatus() {
      return this.uploadMetadata && this.uploadCover
    }
  },
  methods: {
    clickUpload() { // 自定义的a标签触发上传文件的input
      const fileInput = document.getElementById('file-input')
      if (fileInput) {
        fileInput.click()
      }
    },
    updateData(dbName, objectStoreName, key, value) {
      // 打开数据库
      const request = indexedDB.open(dbName)
      request.onsuccess = function(success) {
        // 获取数据库实例对象
        let db = success.target.result
        // 对某个表进行事务操作的事务权限控制
        let transaction = db.transaction(objectStoreName, 'readwrite')
        // 对表进行操作
        let objectStore = transaction.objectStore(objectStoreName)
        // 更新记录信息
        let getResult = objectStore.put({ id: 1, ...value })
        getResult.onerror = function(e) {
          objectStore.add({ id: 1, ...value })
        }
      }
    },
    // 查询上次观看记录
    selectPrevBook(dbName, objectStoreName, key) {
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
          if (e.target.result) {
            const bookData = e.target.result.book
            const bookName = e.target.result.name
            _this.book = new Epub()
            _this.book.open(bookData)
            _this.bookName = bookName
            // 获取上次的封面、相关信息
            _this.book.loaded.cover.then(cover => {
              _this.book.archive.createUrl(cover).then(url => {
                _this.prevCover = url
              })
            }).catch(() => {
              _this.prevCover = require('../../assets/noCover.jpg')
            })
            _this.book.loaded.metadata.then(metadata => {
              _this.prevMetadata = metadata
              }).catch(() => {
                _this.prevMetadata = { title: _this.$t('book.noneTitle'), creator: _this.$t('book.noneCreator') }
            })
          }
        }
      }
    },
    continueReadHandle() { // 继续阅读操作
      this.setCurrentBook(this.book)
      this.setFileName(this.bookName)
      this.setCover(this.prevCover)
      this.setMetadata(this.prevMetadata)
      this.$router.push(`/book/${this.fileName}`)
    },
    fileUpload(e) {
      let file = e.target.files[0]
      let fileReader = new FileReader()
      if (/\/epub/.test(file.type)) {
        fileReader.readAsArrayBuffer(file)
        fileReader.onload = fileReaderEvent => { // 文件加载成功
          const bookData = fileReaderEvent.target.result
          this.book = new Epub()
          this.book.open(bookData).then(() => { // 读取ePub文件成功
            this.flag = false // 快速弹回'上次阅读'的标记位,置为false
          }).catch(() => { // 读取ePub文件失败
            this.setIsTips(1)
            this.setTipsContent(this.$t('home.selectWarning'))
          })
          this.bookData = bookData
          this.setFileName(file.name)
          this.setCurrentBook(this.book)
          // 获取封面、相关信息
          this.book.loaded.cover.then(cover => {
            this.book.archive.createUrl(cover).then(url => {
              this.setCover(url)
              this.uploadCover = true
            })
          }).catch(() => {
            this.setCover(require('../../assets/noCover.jpg'))
            this.uploadCover = true
          })
          this.book.loaded.metadata.then(metadata => {
            this.setMetadata(metadata)
            this.uploadMetadata = true
          }).catch(() => {
            this.setMetadata({ title: this.$t('book.noneTitle'), creator: this.$t('book.noneCreator') })
            this.uploadMetadata = true
          })
        }
      } else { // 读取文件类型不为ePub
        this.setIsTips(0)
        this.setTipsContent(this.$t('home.selectTip'))
      }
    },
    loadedConfirm() {
      // indexedDB存的是二进制缓冲数组
      this.updateData('bookDB', 'currentBook', 1, { name: this.fileName, book: this.bookData })
      this.$router.push(`/book/${this.fileName}`)
    },
    loadedCancel() { // 取消选择
      this.uploadCover = false
      this.uploadMetadata = false
      this.flag = true
    }
  },
  mounted() {
    this.selectPrevBook('bookDB', 'currentBook', 1) // 查询并加载上次阅读书籍信息
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/mixin.scss';
.home-previous-wrapper {
  display: flex;
  position: relative;
  z-index: 1;
  height: px2rem(120);
  width: 100%;
  align-items: center;
  padding: px2rem(10) px2rem(10) px2rem(10) px2rem(10);
  border: px2rem(5) solid #FCC800;
  border-top: none;
  box-sizing: border-box;
  .left {
    color: #455A64;
    font-size: px2rem(17);
    line-height: 1.5;
    flex: 0 0 px2rem(50);
    padding-right: px2rem(5);
  }
  .center {
    flex: 1;
    @include left;
    .previous-cover {
      flex: 0 0 px2rem(64);
      width: px2rem(64);
    }
    .previous-metadata-wrapper {
      flex: 1;
      width: px2rem(180);
      @include left;
      flex-direction: column;
      padding: 0 px2rem(10);
      box-sizing: border-box;
      font-size: px2rem(14);
      line-height: 1.5;
      .previous-metadata-title {
        width: 100%;
        color: #212121;
        text-align: left;
        padding: px2rem(2);
        overflow: hidden;
        span {
          @include ellipsis2(3);
        }
      }
      .previous-metadata-author {
        color: #607D8B;
        padding-top: px2rem(10);
        width: 100%;
        @include ellipsis;
      }
    }
  }
  .right {
    flex: 0 0 px2rem(40);
    font-size: px2rem(18);
    .continue-read {
      line-height: 1.5;
      text-align: center;
      a {
        color: #455A64;
        border-bottom: px2rem(2) solid #9da4a7;
        text-decoration: none;
      }
    }
  }
}
.home-uploader-wrapper {
  position: relative;
  top: px2rem(30);
  flex-direction: column;
  @include center;
  transition: all .15 linear;
  .home-content-text-wrapper {
    font-size: px2rem(20);
    margin-bottom: px2rem(20);
  }
  .home-uploader {
    padding: px2rem(2) px2rem(4) px2rem(1);
    border: px2rem(2) solid #999;
    border-radius: px2rem(8);
    box-sizing: border-box;
    font-size: px2rem(60);
    color: #555;
    font-weight: bold;
  }
  .home-uploader-loaded-content {
    flex-direction: column;
    @include center;
    .home-uploader-loaded-cover {
      height: px2rem(360);
      box-shadow: px2rem(3) px2rem(3) px2rem(8) px2rem(3) rgba(#000, .2);
    }
    .home-uploader-loaded-title {
      text-align: center;
      line-height: 1.5;
      padding: px2rem(5) px2rem(40);
      .text {
        @include ellipsis2(3)
      }
    }
    .home-uploader-loaded-author {
      padding: px2rem(5) px2rem(40);
      line-height: 1.5;
      text-align: center;
      .text {
        @include ellipsis2(1)
      }
    }
    .home-uploader-loaded-operation {
      @include center;
      margin-top: px2rem(16);
      button {
        font-size: px2rem(18);
        background-color: #FCC800;
        padding: px2rem(6) px2rem(20);
        border: px2rem(2) solid rgba(0, 0, 0, .1);
        border-radius: px2rem(8);
        box-sizing: border-box;
        margin-left: px2rem(50);
        // box-shadow: px2rem(2) px2rem(2) px2rem(2) px2rem(2) rgba(#000, .1);
        text-shadow: 0 px2rem(-1) px2rem(1) rgba(#c29b00, 1);
        &:first-child {
          margin-left: 0;
        }
        &:focus {
          outline: none;
        }
      }
    }
  }
}

</style>
