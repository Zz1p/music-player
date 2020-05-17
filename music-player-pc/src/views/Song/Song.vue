<template>
  <div id="song">
    <el-form :inline="true" class="demo-form-inline search"
             @submit.native.prevent>
      <el-form-item>
        <el-input v-model="key" placeholder="搜索歌曲" clearable @keyup.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item class="right">
        <el-button type="text" @click="showUploadSongDialog">上传歌曲</el-button>
      </el-form-item>
    </el-form>
    <div class="table my-form">
      <el-table
          :data="songs"
          style="width: 100%">
        <el-table-column
            prop="id"
            label="ID"
            width="120">
        </el-table-column>
        <el-table-column
            prop="name"
            label="歌名"
            width="180">
        </el-table-column>
        <el-table-column
            label="封面"
            width="180">
          <template slot-scope="scope">
            <img :src="scope.row.picUrl" alt="" class="picture">
          </template>
        </el-table-column>
        <el-table-column
            prop="author"
            label="作者"
            width="180">
        </el-table-column>
        <el-table-column
            prop="url"
            label="音乐"
            show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button
                size="mini"
                type="danger"
                @click="open(scope.row.id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <upload-song-dialog :visible.sync="uploadSongDialogVisible" @update="search"></upload-song-dialog>
  </div>
</template>

<script>
  import UploadSongDialog from "./Components/UploadSongDialog";

  export default {
    name: "Song",
    components: {
      UploadSongDialog
    },
    data() {
      return {
        songs: [],
        key: this.$route.query.key || '',
        uploadSongDialogVisible: false
      }
    },
    watch: {
      '$route': {
        handler(to) {
          this.key = to.query.key || '';
          this.search();
        },
        immediate: true
      }
    },
    methods: {
      search() {
        axios.get('getSongByName', {params: {name: this.key}})
            .then(res => {
              this.songs = res.data;
              this.$router.push({query: {key: this.key}})
            }).catch(err => console.log(err))
      },
      deleteSong(id) {
        axios.post('deleteSong', {id})
            .then(res => {
              if (res.data.affectedRows === 1) {
                this.$message.success('删除成功');
                this.search()
              } else {
                this.$message.error('删除失败');
              }
            })
            .catch(err => console.log(err))
      },
      showUploadSongDialog() {
        this.uploadSongDialogVisible = true;
      },
      open(id) {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteSong(id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    },
  }
</script>

<style scoped lang="less">

  #song {
    .search {
      display: flex;
      justify-content: center;
      padding-top: 22px;
    }

    .right {
      position: absolute;
      right: 10px;
    }

    .table {
      margin: 0 20px;
      position: relative;

      .picture {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        padding: 10px;
        box-sizing: border-box;
      }
    }
  }

</style>
