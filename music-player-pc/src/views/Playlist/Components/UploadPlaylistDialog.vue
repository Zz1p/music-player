<template>
  <el-dialog
      title="上传歌单"
      :visible.sync="show"
      @close="$emit('update:visible', false)"
      width="50%"
      top="5vh">
    <el-form :model="playlistForm" label-width="80px" :rules="rules" ref="playlistForm">
      <el-form-item label="歌单名" prop="name">
        <el-input v-model="playlistForm.name" placeholder="歌单名"></el-input>
      </el-form-item>
      <el-form-item label="歌单封面" prop="pic">
        <el-upload
            ref="upload"
            class="avatar-uploader"
            action=""
            :limit="1"
            :before-upload="beforeUpload"
            :http-request="httpRequest"
            :on-remove="handleRemove">
          <img v-if="imgUrl" :src="imgUrl" class="avatar" alt="">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="upload('playlistForm')">上传</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  export default {
    name: "uploadPlaylistDialog",
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        playlistForm: {
          name: '',
          pic: '',
          songs: []
        },
        imgUrl: '',
        rules: {
          name: [
            {required: true, message: '请输入歌单名', trigger: 'blur'},
          ],
          pic: [
            {required: true, message: '请上传封面图片', trigger: 'blur'},
          ],
        }
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
      handleRemove() {
        this.playlistForm.pic = '';
        this.imgUrl = ''
      },
      beforeUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 4;
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 4MB!');
        }
        return isJPG && isLt2M;
      },

      upload(formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) return false;
          let formData = new FormData();
          for (let [key, value] of Object.entries(this.playlistForm)) {
            formData.append(key, value);
          }
          axios.post('uploadPlaylist', formData)
              .then(res => {
                if (res.data.errMessage === 'ok') {
                  this.$message.success('上传成功');
                  this.$emit('update:visible', false);
                  this.$emit('update');
                  this.$refs[formName].resetFields();
                  this.$refs.upload.clearFiles();
                  this.imgUrl = '';
                }
              })
              .catch(err => {
                this.$message.error('上传失败，请检查歌单名是否重复');
              })
        });
      },

      httpRequest(data) {
        const file = data.file;
        this.playlistForm.pic = file;
        let rd = new FileReader();
        const _this = this;
        rd.readAsDataURL(file);
        rd.onloadend = function () {
          _this.imgUrl = this.result;
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
