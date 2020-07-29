<template>
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
      v-if="uploadStatus === false">
      <span
        class="icon-add"
        @click.stop="clickUpload()">
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
          >
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
    }
  },
  computed: {
    uploadStatus() {
      return this.uploadMetadata && this.uploadCover
    }
  },
  methods: {
    clickUpload() {
      const fileInput = document.getElementById('file-input')
      if (fileInput) {
        fileInput.click()
      }
    },
    fileUpload(e) {
      let file = e.target.files[0]
      let fileReader = new FileReader()
      if (/\/epub/.test(file.type)) {
        fileReader.readAsArrayBuffer(file)
        fileReader.onload = fileReaderEvent => {
          let bookData = fileReaderEvent.target.result
          let book = new Epub()
          book.open(bookData)
          console.log(book)
          this.setFileName(file.name)
          this.setCurrentBook(book)
          // 获取封面、相关信息
          book.loaded.cover.then(cover => {
            book.archive.createUrl(cover).then(url => {
              this.setCover(url)
              this.uploadCover = true
            })
          })
          book.loaded.metadata.then(metadata => {
            this.setMetadata(metadata)
            this.uploadMetadata = true
          })
        }
      } else {
        alert('请选择epub类型的文件')
      }
    },
    loadedCancel() { // 取消选择
      this.uploadCover = false
      this.uploadMetadata = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/mixin.scss';
.home-uploader-wrapper {
  flex-direction: column;
  @include center;
  .home-content-text-wrapper {
    font-size: px2rem(20);
    margin-bottom: px2rem(20);
    .home-content-text {}
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
      width: px2rem(260);
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
