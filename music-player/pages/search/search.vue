<template>
	<view id="search-result">
		<song-list :songs="songList"></song-list>
		<view v-if="!songList.length" class="errMessage">没有搜索到结果，换个关键词试试吧</view>
	</view>
</template>

<script>
	import songList from '@/components/song-list.vue'
	export default {
		props: {
			songsId: {
				type: Array,
				default () {
					return [];
				}
			}
		},
		components: {
			songList
		},
		data() {
			return {
				songName: '',
				songList: []
			};
		},
		methods: {
			getSongByName() {
				this.$axios({
					url: 'getSongByName',
					data: {
						name: this.songName
					},
					method: 'GET'
				}).then(res => {
					this.songList = res[1].data
				}).catch(err => console.log(err));
			}
		},
		onLoad(option) {
			this.songName = option.name;
			this.getSongByName();
		}
	}
</script>

<style lang="scss">
	#search-result {
		width: 100%;
		
		.errMessage {
			padding: 400rpx 60rpx;
			text-align: center;
			color: $uni-bg-color-mask;
		}
	}
</style>
