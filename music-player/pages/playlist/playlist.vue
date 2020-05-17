<template>
	<view id="playlist-detail">
		<view class="list" v-if="songList.length">
			<view class="item" @tap="playAll">
				<view class="play"></view>播放全部({{songList.length}})
			</view>
			<song-list :songs="songList"></song-list>
		</view>
		<view v-else class="errMessage">该歌单下没有歌曲！</view>
	</view>
</template>

<script>
	import {
		mapMutations,
		mapActions
	} from 'vuex'
	import songList from '@/components/song-list.vue'

	export default {
		components: {
			songList
		},
		data() {
			return {
				option: {},
				songList: []
			};
		},
		methods: {
			...mapMutations(['updateCurrentPlaylist', 'setCurrentSong']),
			...mapActions(['getSongsById']),
			playAll() {
				this.setCurrentSong(this.option.songs[0]);
				this.updateCurrentPlaylist({
					songId: this.option.songs,
					t: 1
				})
				uni.switchTab({
					url: '../player/player'
				})
			}
		},
		onLoad(option) {
			option.songs = option.songs.length ? JSON.parse(option.songs) : [];
			this.option = option;
			this.getSongsById(option.songs).then(res => this.songList = res).catch(err => console.log(err));
		}
	}
</script>

<style lang="scss">
	#playlist-detail {
		width: 100%;

		.item {
			padding: 0 40rpx;
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			height: 100rpx;
			background-color: $uni-bg-color;
			border-bottom: 1px solid $uni-bg-color-grey;

			.play {
				padding: 20rpx;
				background: url(../../static/img/play.png) 0 50% / 30rpx 30rpx no-repeat;
			}
		}

		.errMessage {
			padding: 400rpx 60rpx;
			text-align: center;
			color: $uni-bg-color-mask;
		}
	}
</style>
