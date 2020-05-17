<template>
  <el-dialog
      title="上传歌曲"
      :visible.sync="show"
      @close="$emit('update:visible', false)"
      width="50%"
      top="5vh">
    <el-form :model="songForm" label-width="80px" :rules="rules" ref="songForm">
      <el-form-item label="歌曲名" prop="name">
        <el-input v-model="songForm.name" placeholder="歌曲名"></el-input>
      </el-form-item>
      <el-form-item label="作者名" prop="author">
        <el-input v-model="songForm.author" placeholder="作者"></el-input>
      </el-form-item>
      <el-form-item label="歌曲封面" prop="pic">
        <el-upload
            ref="uploadImg"
            class="avatar-uploader"
            action=""
            :limit="1"
            :before-upload="beforeUpload('pic')"
            :http-request="httpRequest('pic')"
            :on-remove="handleRemove('pic')">
          <img v-if="imgUrl" :src="imgUrl" class="avatar" alt="">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="音乐文件" prop="file">
        <el-upload
            ref="uploadMp3"
            class="upload-demo"
            action=""
            :limit="1"
            :on-remove="handleRemove('file')"
            :http-request="httpRequest('file')"
            :before-upload="beforeUpload('file')">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button
            type="primary"
            @click="upload('songForm')"
            v-loading.fullscreen.lock="fullscreenLoading">
          上传
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  export default {
    name: "UploadSongDialog",
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        songForm: {
          name: '',
          author: '',
          pic: '',
          file: '',
        },
        imgUrl: '',
        rules: {
          name: [
            {required: true, message: '请输入歌名', trigger: 'blur'},
          ],
          author: [
            {required: true, message: '请输入作者名', trigger: 'blur'},
          ],
          pic: [
            {required: true, message: '请上传封面图片', trigger: 'blur'},
          ],
          file: [
            {required: true, message: '请上传mp3文件', trigger: 'blur'},
          ]
        },
        fullscreenLoading: false
      }
    },
    computed: {
      show: {
        get() {
          return this.visible
        },
        set() {
        }
      }
    },
    methods: {
      handleRemove(type) {
        return _ => {
          this.songForm[type] = '';
          if (type === 'pic') {
            this.imgUrl = ''
          }
        }
      },
      beforeUpload(type) {
        return (file) => {
          if (type === 'pic') {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 4;
            if (!isLt2M) {
              this.$message.error('上传头像图片大小不能超过 4MB!');
            }
            if (!isJPG) {
              this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            return isJPG && isLt2M;
          }
          const isMp3 = file.type === 'audio/mpeg';
          if (!isMp3) {
            this.$message.error('上传音乐格式只能是 MP3 格式!');
          }
          return isMp3;
        }
      },
      upload(formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) return false;
          this.fullscreenLoading = true;
          let formData = new FormData();
          for (let [key, value] of Object.entries(this.songForm)) {
            formData.append(key, value);
          }
          axios.post('uploadSong', formData)
              .then(res => {
                if (res.data.errMessage === 'ok') {
                  this.fullscreenLoading = false;
                  this.$message.success('上传成功');
                  this.$emit('update:visible', false);
                  this.$emit('update');
                  this.$refs[formName].resetFields();
                  this.$refs.uploadImg.clearFiles();
                  this.$refs.uploadMp3.clearFiles();
                  this.imgUrl = '';
                }
              })
              .catch(err => {
                this.fullscreenLoading = false;
                console.log(err)
              })
        });
      },
      httpRequest(type) {
        return (data) => {
          const file = data.file;
          this.songForm[type] = file;
          if (type !== 'pic') return;
          let rd = new FileReader();
          const _this = this;
          rd.readAsDataURL(file);
          rd.onloadend = function () {
            _this.imgUrl = this.result;
          }
        }
      },
    }
  }
</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
