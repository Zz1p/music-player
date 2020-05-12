<template>
	<view id="collect">
		<view class="list" v-if="userInfo.collection">
			<view class="item" @tap="playAll">
				<view class="play"></view>播放全部({{collectSongs.length}})
			</view>
			<song-list :songs="collectSongs" @updateSongs="getCollectSongs"></song-list>
		</view>
		<view class="none" v-else>还没有收藏歌曲，去首页看看吧！</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex';
	import songList from '@/components/song-list.vue'

	export default {
		components: {
			songList
		},
		data() {
			return {
				collectSongs: []
			}
		},
		watch: {
			hasLogin(newValue, oldValue) {
				if (newValue) {
					this.getCollection();
				}
			}
		},
		computed: {
			...mapState(['hasLogin', 'userInfo', 'currentSong'])
		},
		methods: {
			...mapMutations(['updateCurrentPlaylist', 'setCurrentSong']),
			...mapActions(['getCollection']),
			playAll() {
				this.setCurrentSong(this.collectSongs[0]);
				this.updateCurrentPlaylist({
					songId: this.userInfo.collection,
					t: 1
				})
				uni.switchTab({
					url: '../../player/player'
				})
			},
			getCollectSongs() {
				this.getCollection()
					.then(res => {
						this.collectSongs = res
					}).catch(err => console.log(err));
			},
		},
		onReady() {
			if (this.hasLogin === false) {
				uni.reLaunch({
					url: '../../index/index'
				})
			}
			if (this.hasLogin) {
				this.getCollectSongs();
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: $uni-bg-color-grey;
	}

	#collect {
		width: 100%;
		padding-top: 20rpx;

		.item {
			padding: 0 40rpx;
			display: flex;
			align-content: space-around;
			flex-wrap: wrap;
			height: 100rpx;
			background-color: $uni-bg-color;
			border-bottom: 1px solid $uni-bg-color-grey;

			.play {
				padding-left: 30rpx;
				background: url(../../../static/img/play.png) 0 50% / 30rpx 30rpx no-repeat;
			}
		}

		.none {
			width: 100%;
			height: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			color: $uni-text-color-grey;
		}
	}
</style>
