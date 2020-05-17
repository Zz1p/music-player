<template>
  <el-dialog
      title="修改歌单"
      :visible.sync="show"
      @close="$emit('update:visible', false)"
      width="50%"
      top="5vh">
    <el-transfer
        filterable
        filter-placeholder="请输入歌曲名"
        :props="{key: 'id', label: 'name'}"
        :titles="['可添加的歌曲', '歌单中的歌曲']"
        v-model="songs"
        @change="handleChange"
        :data="allSongs">
    </el-transfer>
  </el-dialog>

</template>

<script>
  export default {
    name: "transfer",
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      allSongs: {
        type: Array,
        default() {
          return [];
        }
      },
      playlist: {
        type: Object,
        default() {
          return {};
        }
      },
    },
    data() {
      return {
        songs: this.playlist.songs,
      }
    },
    computed: {
      show: {
        get() {
          return this.visible
        },
        set() {
        }
      },
    },
    watch: {
      playlist: {
        handler(newValue) {
          this.songs = newValue.songs
        },
        immediate: true,
        deep: true
      }
    },
    methods: {
      handleChange(value, direction, movedKeys) {
        axios.post('updatePlaylist', {
          id: this.playlist.id,
          t: direction === 'right' ? '1' : '2',
          songs: movedKeys
        }).then(_ => {
          this.$message.success('操作成功');
          this.$emit('update')
        }).catch(err => console.log(err))
      }
    }
  }
</script>

<style scoped>

</style>
