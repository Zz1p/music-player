<template>
	<view id="collect">
		<view class="list" v-if="userInfo.collection">
			<view class="item" @click="playAll">
				<view class="play"></view>播放全部({{playlist.length}})
			</view>
			<view class="item music-info" v-for="(item, index) in playlist" :key="item.id + item.name" @click="jump2Player(item.id)">
				<view class="left">
					<view class="top">{{item.name}}</view>
					<view class="bottom">
						<view class="author">{{item.author}}</view>
					</view>
				</view>
				<view class="right">
					<view class="favourite--active" @click.stop="deleteCollection(item.id)"></view>
				</view>
			</view>
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

	export default {
		data() {
			return {
				playlist: []
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
			...mapMutations(['setCurrentSong']),
			...mapActions(['getCollection','updateCollection']),
			jump2Player(id) {
				this.setCurrentSong(id);
				uni.switchTab({
					url: '../../player/index'
				})
			},
			playAll() {
				this.jump2Player(this.playlist[0].id);
			},
			setPlaylist() {
				this.getCollection()
					.then(res => {
						this.playlist = res
					}).catch(err => console.log(err));
			},
			deleteCollection(id) {
				this.updateCollection({
					songId: id,
					t: '2'
				})
			}
		},
		onReady() {
			if (this.hasLogin === false) {
				uni.reLaunch({
					url: '../../index/index'
				})
			}
			if (this.hasLogin) {
				this.setPlaylist();
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: $uni-bg-color-grey;
	}

	.favourite {
		height: 100%;
		width: 40rpx;
		background: url(../../../static/img/favourite.png) 50% 50% / contain no-repeat;
	}

	.favourite--active {
		height: 100%;
		width: 40rpx;
		background: url(../../../static/img/favourite--active.png) 50% 50% / contain no-repeat;
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

			&.music-info {
				justify-content: space-between;
			}

			.play {
				padding-left: 30rpx;
				background: url(../../../static/img/play.png) 0 50% / 30rpx 30rpx no-repeat;
			}

			.left {
				.top {
					color: $theme-bg-color;
				}

				.bottom {
					.author {
						font-size: 80%;
						color: $uni-text-color-grey;
					}
				}
			}

			.right {
				padding: 0 20rpx;

				.more {
					height: 100%;
					width: 40rpx;
					background: url(../../../static/img/more.png) 50% 50% / contain no-repeat;
				}
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
