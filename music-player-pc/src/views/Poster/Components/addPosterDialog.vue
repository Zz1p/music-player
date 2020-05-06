<template>
  <el-dialog
      title="添加推荐"
      :visible.sync="show"
      @close="$emit('update:visible', false)"
      width="50%"
      top="5vh">
    <el-form :model="posterForm" label-width="80px" :rules="rules" ref="posterForm">
      <el-form-item label="描述" prop="name">
        <el-input v-model="posterForm.name" placeholder="描述"></el-input>
      </el-form-item>
      <el-form-item label="对应歌曲" prop="songId">
        <el-select
            v-model="posterForm.songId"
            filterable
            remote
            reserve-keyword
            placeholder="请输入歌曲名">
          <el-option
              v-for="item in allSongs"
              :key="item.filename"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="upload('posterForm')">添加</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

</template>

<script>
  export default {
    name: "addPosterDialog",
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        posterForm: {
          name: '',
          songId: '',
          songName: ''
        },
        allSongs: [],
        rules: {
          songId: [
            {required: true, message: '请输入歌曲名', trigger: 'blur'},
          ],
          name: [
            {required: true, message: '请输入描述', trigger: 'blur'},
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
      getAllSongs() {
        axios.get('song')
            .then(res => {
              this.allSongs = res.data;
            }).catch(err => console.log(err))
      },
      upload(formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) return false;
          this.posterForm.songName = this.getSongName(this.posterForm.songId);
          axios.post('addPoster', this[formName])
              .then(res => {
                if (res.data.affectedRows === 1) {
                  this.$message.success('上传成功');
                  this.$emit('update:visible', false);
                  this.$emit('update');
                  this.$refs[formName].resetFields();
                }
              })
              .catch(err => {
                this.$message.error('上传失败，请检查歌单名是否重复');
              })
        });
      },
      getSongName(id) {
        console.log(id);
        for (let i of this.allSongs) {
          if (i.id === id) {
            console.log(i)
             return i.name;
          }
        }
        return '';
      }
    },
    created() {
      this.getAllSongs()
    }
  }
</script>

<style scoped>

</style>
