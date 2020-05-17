<template>
  <div id="playlist">
    <el-form :inline="true" class="demo-form-inline search"
             @submit.native.prevent>
      <el-form-item>
        <el-input v-model="key" placeholder="搜索歌单" clearable @keyup.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item class="right">
        <el-button type="text" @click="uploadPlaylistDialogVisible = true">创建歌单</el-button>
      </el-form-item>
    </el-form>
    <div class="table my-form">
      <el-table
          :data="playlists"
          style="width: 100%">
        <el-table-column
            prop="id"
            label="ID"
            width="120">
        </el-table-column>
        <el-table-column
            prop="name"
            label="歌单名"
            width="180">
        </el-table-column>
        <el-table-column
            label="封面">
          <template slot-scope="scope">
            <img :src="scope.row.picUrl" alt="" class="picture">
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
                size="mini"
                type="primary"
                @click="openEditDialog(scope.row)">编辑
            </el-button>
            <el-button
                size="mini"
                type="danger"
                @click="openDeleteConfirm(scope.row.id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <upload-playlist-dialog :visible.sync="uploadPlaylistDialogVisible" @update="search"></upload-playlist-dialog>
    <transfer-dialog :visible.sync="transferDialogVisible"
                     :allSongs="allSongs"
                     :playlist="currentPlaylist"
                     @update="search"></transfer-dialog>
  </div>
</template>

<script>
  import uploadPlaylistDialog from "./Components/UploadPlaylistDialog";
  import transferDialog from './Components/TransferDialog';

  export default {
    name: "Playlist",
    components: {
      uploadPlaylistDialog,
      transferDialog
    },
    data() {
      return {
        key: this.$route.query.key || '',
        playlists: [],
        allSongs: [],
        uploadPlaylistDialogVisible: false,
        transferDialogVisible: false,
        currentPlaylist: {},
        currentSongs: []
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
        axios.get('playlist', {params: {name: this.key}})
            .then(res => {
              this.playlists = res.data;
              this.$router.push({query: {key: this.key}})
            })
            .catch(err => console.log(err));
      },
      openEditDialog(row) {
        this.currentPlaylist = JSON.parse(JSON.stringify(row));
        this.currentPlaylist.songs = row.songs.length ? JSON.parse(row.songs) : [];
        this.transferDialogVisible = true;
      },
      getAllSongs() {
        axios.get('song')
            .then(res => {
              this.allSongs = res.data;
            }).catch(err => console.log(err))
      },
      openDeleteConfirm(id) {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deletePlaylist(id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      deletePlaylist(id) {
        axios.post('deletePlaylist', {id})
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
    },
    created() {
      this.getAllSongs();
    }
  }
</script>

<style scoped lang="less">

  #playlist {
    .search {
      display: flex;
      justify-content: center;
      padding-top: 22px;
    }

    .right {
           position: absolute;
           right: 10px;
         }

    .picture {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      padding: 5px;
      box-sizing: border-box;
    }

    .table {
      margin: 0 20px;
    }
  }

</style>

