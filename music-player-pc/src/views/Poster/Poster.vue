<template>
  <div id="poster">
    <el-form :inline="true" class="demo-form-inline"
             @submit.native.prevent>
      <el-form-item class="right">
        <el-button type="text" @click="addPosterDialogVisible = true">添加推荐</el-button>
      </el-form-item>
    </el-form>
    <div class="table my-form">
      <el-table
          :data="poster"
          style="width: 100%">
        <el-table-column
            prop="id"
            label="ID"
            width="120">
        </el-table-column>
        <el-table-column
            prop="name"
            label="推荐理由"
            width="180">
        </el-table-column>
        <el-table-column
            prop="songName"
            label="歌曲">
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
                size="mini"
                type="danger"
                @click="openDeleteConfirm(scope.row.id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <add-poster-dialog :visible.sync="addPosterDialogVisible" @update="search"></add-poster-dialog>
  </div>
</template>

<script>
  import addPosterDialog from "./Components/addPosterDialog";

  export default {
    name: "Poster",
    components: {
      addPosterDialog
    },
    data() {
      return {
        poster: [],
        addPosterDialogVisible: false
      }
    },
    methods: {
      openDeleteConfirm(id) {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deletePoster(id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      deletePoster(id) {
        axios.post('deletePoster', {id})
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
      search() {
        axios.get('getPosters')
            .then(res => {
              this.poster = res.data;
            })
            .catch(err => console.log(err));
      }
    },
    created() {
      this.search();
    }
  }
</script>

<style scoped lang="less">
  #poster {
    .demo-form-inline {
      padding-top: 22px;
      height: 63px;

      .right {
        position: absolute;
        right: 10px;
      }
    }

    .table {
      margin: 0 20px;
    }
  }

</style>
