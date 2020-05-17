<template>
	<view class="song-list">
		<h3 class="title">音乐列表</h3>
		<view class="item music-info" v-for="(item, index) in songs" :key="item.id" @tap="jump2Player(item)">
			<view class="left">
				<view class="top">{{item.name}}</view>
				<view class="bottom">
					<view class="author">{{item.author}}</view>
				</view>
			</view>
			<view class="right">
				<view class="more" @tap.stop="open(item)"></view>
			</view>
		</view>
		<uni-popup ref="popup" type="bottom" class="pop">
			<view class="list" :style="{'padding-bottom': windowBottom + 'px'}">
				<view class="item" v-if="iscollected(popItem.id) &&hasLogin"  @tap="uncollect(popItem.id)">
					<view class="favourite--active"></view>
					<view class="text">取消收藏</view>
				</view>
				<view class="item" v-if="!iscollected(popItem.id) &&hasLogin" @tap="collect(popItem.id)">
					<view class="favourite"></view>
					<view class="text">收藏</view>
				</view>
				<view class="item" @tap="push2Playlist(popItem.id)">
					<view class="text">加入播放列表</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		mapState,
		mapActions,
		mapMutations
	} from 'vuex'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	
	export default {
		name: 'songList',
		props: {
			songs: {
				type: Array,
				default () {
					return [];
				}
			}
		},
		components: {
			uniPopup
		},
		data() {
			return {
				popItem: {},
				windowBottom: 0
			};
		},
		computed: {
			...mapState({
				userCollection: state => state.userInfo.collection,
				hasLogin: 'hasLogin'
			}),
		},
		methods: {
			...mapMutations(['setCurrentSong', 'updateCurrentPlaylist']),
			...mapActions(['updateCollection']),
			iscollected(id) {
				return this.userCollection.includes(id);
			},
			jump2Player(item) {
				this.setCurrentSong(item.id);
				uni.switchTab({
					url: '/pages/player/player'
				})
			},
			uncollect(id) {
				this.updateCollection({
					songId: id,
					t: '2'
				}).then(res => {
					if (res === 'ok') {
						this.$emit('updateSongs');
						uni.showToast({
							title: '已取消收藏'
						})
					}
				}).catch(err => console.log(err))
				this.$refs.popup.close();
			},
			collect(id) {
				this.updateCollection({
					songId: id,
					t: '1'
				}).then(res => {
					if (res === 'ok') {
						this.$emit('updateSongs');
						uni.showToast({
							title: '已收藏'
						})
					}
				}).catch(err => console.log(err))
				this.$refs.popup.close();
			},
			open(item) {
				this.popItem = item;
				this.$refs.popup.open()
			},
			push2Playlist(id) {
				this.updateCurrentPlaylist({
					t: 1,
					songId: id
				})
				uni.showToast({
					title: '已加入播放列表'
				})
				this.$refs.popup.close();
			}
		},
		mounted() {
			this.windowBottom = uni.getSystemInfoSync().windowBottom
		}
	}
</script>

<style lang="scss" scoped>
	.song-list {
		.title {
			padding-left: 30rpx;
			color: $uni-color-title;
		}

		.item {
			padding: 0 30rpx;
			display: flex;
			align-content: space-around;
			flex-wrap: wrap;
			height: 100rpx;
			background-color: $uni-bg-color;
			border-bottom: 1px solid $uni-bg-color-grey;

			&.music-info {
				justify-content: space-between;
			}

			.left {
				padding: 10rpx 0;
				.top {
					color: $uni-text-color;
				}

				.bottom {
					.author {
						font-size: 80%;
						color: $uni-text-color-grey;
					}
				}
			}

			.right {
				height: 100%;
				padding: 0 20rpx;

				.more {
					height: 100%;
					width: 40rpx;
					background: url(../static/img/more.png) 50% 50% / contain no-repeat;
				}
			}
		}
	}

	.pop {
		.list {
			display: flex;
			height: 100rpx;
			background-color: #fff;

			.item {
				display: flex;
				justify-content: center;
				flex: 1;
				height: 100%;
				border: none;
				align-items: center;
				
				.favourite {
					height: 40rpx;
					width: 40rpx;
					background: url(../static/img/like.svg) 50% 50% / contain no-repeat;
				}

				.favourite--active {
					height: 40rpx;
					width: 40rpx;
					background: url(../static/img/like-fill.svg) 50% 50% / contain no-repeat;
				}
			}


		}
	}
</style>
