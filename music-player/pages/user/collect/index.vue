<template>
	<view id="collect">
		<view class="list" v-if="userInfo.collection !== 0">
			<view class="item" @click="playAll"><view class="play"></view>播放全部({{playlist.length}})
			</view>
			<view class="item music-info" v-for="(item, index) in playlist" :key="item.id + item.name" @click="jump2Player(item.id)">
				<view class="left">
					<view class="top">{{item.name}}</view>
					<view class="bottom">
						<view class="author">{{item.author}}</view>
					</view>
				</view>
				<view class="right">
					<view class="favourite" v-if="item.unCollect" @click.stop="bindCollect(item)"></view>
					<view class="favourite--active" @click.stop="bindCollect(item)" v-else></view>
				</view>
			</view>
		</view>
		<view class="none" v-else>还没有收藏歌曲，去首页看看吧！</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
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
			getCollection() {
				this.$axios({
					url: '/user/collection',
					method: 'GET',
					data: {
						userId: this.userInfo.id
					}
				}).then(res => {
					this.playlist = res[1].data;
				}).catch(err => {
					console.log(err);
				})
			},
			open() {
				this.$refs.popup.open()
			},
			bindCollect(item) {
				item.unCollect ? this.deleteCollect(item) : this.addCollect(item);
			},
			addCollect(item) {
				uni.showLoading({
					title: '加载中'
				})
				// @todo addCollect 发送请求 /user/collect/sub data: userId,songId(歌的id) t = 1 收藏，其他为取消
				setTimeout(() => {
					this.$set(item, 'unCollect', true);
					uni.hideLoading();
				}, 1000)
			},
			deleteCollect(item) {
				uni.showLoading({
					title: '加载中'
				})
				// @todo deleteCollet 发送请求 /user/collect/sub data: userId,songId(歌的id) t = 1 收藏，其他为取消
				setTimeout(() => {
					this.$set(item, 'unCollect', false);
					uni.hideLoading();
				}, 1000)
			},
			jump2Player(id) {
				this.setCurrentSong(id);
				uni.switchTab({
					url: '../../player/index'
				})
			},
			playAll() {
				this.jump2Player(this.playlist[0].id);
				
			}
		},
		onReady() {
			if (this.hasLogin === false) {
				uni.reLaunch({
					url: '../../index/index'
				})
			}
			if (this.hasLogin) {
				this.getCollection();
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
