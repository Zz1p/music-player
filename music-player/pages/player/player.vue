<template>
	<view class="wrapper" :style="{ 'margin-top': statusBarHeight + 'px'}">
		<view :style="{ height: statusBarHeight + 'px', position: 'absolute'}"></view>
		<image class="blur" :src="currentSong.picUrl" mode="aspectFill"></image>
		<view id="player">
			<view class="info">
				<preload-img class="songImg" :src="currentSong.picUrl" :mode="'aspectFill'"></preload-img>
				<view class="name">{{currentSong.name}}</view>
				<view class="author">{{currentSong.author}}</view>
			</view>
			<view class="bottom">
				<slider class="progress-bar" :value="currentTime" @change="sliderChange" block-size="16" :max="duration"
				 backgroundColor="#999" activeColor="#fff" />
				<view class="song-time">
					<view class="currentTime">{{currentTime | ss2mmss}}</view>
					<view class="duration">{{duration | ss2mmss}}</view>
				</view>
				<view class="operation">
					<image class="item playMode" @tap="updatePlayModeIndex" :src="`../../static/img/${playMode}.svg`" mode="aspectFit"></image>
					<image class="item prev" @tap="prev" :src="'../../static/img/back.svg'" mode="aspectFit"></image>
					<image class="item pause" v-show="!innerAudioContext.paused" @tap="play" :src="'../../static/img/pause.svg'" mode="aspectFit"></image>
					<image class="item play" v-show="innerAudioContext.paused" @tap="play" :src="'../../static/img/play.svg'" mode="aspectFill"></image>
					<image class="item next" :src="'../../static/img/next.svg'" mode="aspectFit" @tap="next"></image>
					<image class="item playlist" @tap="open" :src="'../../static/img/list.svg'" mode="aspectFit"></image>
				</view>
			</view>
			<uni-popup ref="popup" type="bottom" class="pop">
				<view class="list" v-if="currentPlaylist && currentPlaylist.length" :style="{'padding-bottom': windowBottom + 'px'}">
					<view class="item" :class="{active: currentSongId === item.id}" v-for="(item, index) in computedCurrentPlaylist"
					 :key="item.id" @tap="playThisSong(item.id)">
						<view class="left">{{item.name}}
							<view class="author">- {{item.author}}</view>
						</view>
						<image class="right" v-show="currentSongId !== item.id" :src="'../../static/img/delete.svg'" mode="aspectFit"
						 @tap.stop="deleteSongFromPlaylist(item.id)"></image>
					</view>
				</view>
				<view class="err-message" v-else>
					当前播放列表下没有歌曲，快去添加吧
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import preloadImg from '@/components/preload-img.vue'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'

	export default {
		components: {
			uniPopup,
			preloadImg
		},
		data() {
			return {
				currentSong: {
					name: ''
				},
				innerAudioContext: '',
				duration: 200,
				currentTime: 0,
				playModeIndex: 0,
				currentPlaylist: [],
				statusBarHeight: 0,
				windowBottom: 0
			}
		},
		computed: {
			...mapState(['currentSongId', 'playlist']),
			playMode() {
				return ['loop', 'repeat', 'shuffle'][this.playModeIndex];
			},
			computedCurrentPlaylist() {
				const temp = []
				for (let i of this.playlist) {
					for (let j of this.currentPlaylist) {
						if (j.id === i) {
							temp.push(j)
						}
					}
				}
				return temp;
			}
		},
		watch: {
			currentSongId: {
				handler() {
					this.getCurrentSong()
					this.getCurrentPlaylit()
				},
				immediate: true
			},
			playlist() {
				this.getCurrentPlaylit()
			},
		},
		methods: {
			...mapMutations(['unshiftSong2Playlist', 'updateCurrentSongId', 'updateCurrentPlaylist', 'setCurrentSong']),
			...mapActions(['getSongsById']),
			createAudio() {
				if (!this.currentSong || !this.currentSong.hasOwnProperty('url')) return;
				uni.showLoading({
					title: '加载mp3...'
				})
				if (this.innerAudioContext) {
					this.innerAudioContext.destroy();
				}
				this.innerAudioContext = uni.createInnerAudioContext();
				this.innerAudioContext.src = this.currentSong.url;
				this.innerAudioContext.autoplay = true;
				this.innerAudioContext.onCanplay(() => {
					this.duration = this.innerAudioContext.duration
					uni.hideLoading();
				});
				this.innerAudioContext.onError(res => {
					uni.showToast({
						title: 'mp3文件不存在',
						icon: 'none'
					})
					setTimeout(_ => {
						this.next()
					}, 1000)
				});
				this.innerAudioContext.onTimeUpdate(_ => {
					this.currentTime = this.innerAudioContext.currentTime
					this.duration = this.innerAudioContext.duration
				});
				this.innerAudioContext.onEnded(_ => {
					if (this.playMode === 'loop') {
						this.next()
					}
					if (this.playMode === 'shuffle') {
						this.random()
					}
				})
			},
			updatePlayModeIndex() {
				this.playModeIndex = (this.playModeIndex + 1) % 3
				this.innerAudioContext.loop = this.playMode === 'repeat';
			},
			getCurrentSong() {
				this.getSongsById(this.currentSongId)
					.then(res => {
						this.currentSong = res[0]
						this.createAudio()
					})
					.catch(err => console.log(err))
			},
			play() {
				this.innerAudioContext.paused ? this.innerAudioContext.play() : this.innerAudioContext.pause();
			},
			sliderChange(e) {
				this.innerAudioContext.pause();
				e.detail.value < this.innerAudioContext.buffered ? this.innerAudioContext.seek(e.detail.value) :
					this.innerAudioContext.seek(this.innerAudioContext.buffered)
				this.innerAudioContext.play()
			},
			prev() {
				this.updateCurrentSongId(-1)
			},
			next() {
				this.updateCurrentSongId(1)
			},
			random() {
				this.updateCurrentSongId(0)
			},
			open() {
				this.getCurrentPlaylit();
				this.$refs.popup.open()
			},
			getCurrentPlaylit() {
				if (this.playlist.indexOf(this.currentSongId) === -1) {
					this.unshiftSong2Playlist()
				}
				this.getSongsById(this.playlist).then(res => {
					this.currentPlaylist = res
				}).catch(err => console.log(err))
			},
			deleteSongFromPlaylist(id) {
				this.updateCurrentPlaylist({
					t: 0,
					songId: id
				})
			},
			playThisSong(id) {
				this.setCurrentSong(id)
			}
		},
		filters: {
			ss2mmss(ss) {
				ss = parseInt(ss);
				let mm = parseInt(ss / 60);
				ss %= 60;
				mm = mm < 10 ? '0' + mm : mm;
				ss = ss < 10 ? '0' + ss : ss;
				return mm + ':' + ss
			}
		},
		mounted() {
			this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
			this.windowBottom = uni.getSystemInfoSync().windowBottom;
		}
	}
</script>

<style lang="scss" scoped>
	.wrapper {
		position: relative;
		overflow: hidden;
		width: 100%;
		color: #fff;
		background-color: rgba($color: #000, $alpha: .5);

		.blur {
			width: 100%;
			height: 100%;
			position: absolute;
			z-index: -1;
			filter: blur(20rpx);
		}
	}

	#player {
		width: 100%;
		height: 100%;
		position: relative;

		.info {
			display: flex;
			justify-content: center;
			flex-wrap: wrap;
			padding: 60rpx;

			.songImg {
				height: 45vh;
				width: 100%;
				box-sizing: border-box;
				overflow: hidden;
				border-radius: 20rpx;
				box-shadow: 0 0 20px 3px #333;
			}

			.name {
				padding: 20rpx 0 10rpx;
				font-size: 120%;
				width: 100%;
			}

			.author {
				width: 100%;
				font-size: 80%;
				color: rgba($color: $uni-bg-color-grey, $alpha: .5);
			}
		}

		.bottom {
			position: absolute;
			bottom: 0;
			width: 100%;
			padding: 60rpx;
			box-sizing: border-box;

			.progress-bar {
				margin: 20rpx 0;
			}

			.song-time {
				display: flex;
				justify-content: space-between;
			}

			.operation {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.item {
					height: 60rpx;
					width: 60rpx;
					padding: 20rpx;

					&.play,
					&.pause {
						width: 100rpx;
						height: 100rpx;
						padding: 0;
					}

				}

			}
		}

	}

	.pop {
		.list {
			position: relative;
			max-height: 700rpx;
			overflow: scroll;
			background-color: #1d232c;

			.item {
				display: flex;
				justify-content: space-between;
				padding: 20rpx 30rpx;
				height: 60rpx;
				line-height: 60rpx;

				&:not(:last-child) {
					border-bottom: 2px solid #2a2e38;
				}

				&.active {
					color: $theme-bg-color--active;
				}

				.left {
					display: flex;

					.author {
						padding-left: 40rpx;
						font-size: 80%;
						color: rgba($color: #ddd, $alpha: .5);
					}
				}

				.right {
					padding: 0 20rpx;
					width: 20rpx;
					height: 100%;
				}
			}
		}

		.err-message {
			padding: 100rpx;
			height: 500rpx;
			background-color: #1d232c;
			color: $uni-bg-color-grey;
		}
	}
</style>
