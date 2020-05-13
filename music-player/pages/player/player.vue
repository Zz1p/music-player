<template>
	<view class="wrapper">
		<image class="blur" :src="currentSong.picUrl" mode="aspectFill"></image>
		<view id="player">
			<view class="info">
				<image class="songImg" :src="currentSong.picUrl" mode="aspectFill"></image>
				<view class="name">{{currentSong.name}}</view>
				<view class="author">{{currentSong.author}}</view>
			</view>
			<view class="bottom">
				<slider class="progress-bar" :value="currentTime" @change="sliderChange" block-size="12" :max="duration" />
				<view class="song-time">
					<view class="currentTime">{{currentTime | ss2mmss}}</view>
					<view class="duration">{{duration | ss2mmss}}</view>
				</view>
				<view class="operation">
					<image class="playMode" @tap="updatePlayModeIndex" :src="`../../static/img/${playMode}.svg`" mode="aspectFit"></image>
					<view class="prev" @tap="prev"></view>
					<view class="play" @tap="play" v-show="innerAudioContext.paused"></view>
					<view class="pause" @tap="pause" v-show="!innerAudioContext.paused"></view>
					<view class="next" @tap="next"></view>
					<view class="playlist" @tap="open"></view>
				</view>
			</view>
			<uni-popup ref="popup" type="bottom" class="pop">
				<view class="list" v-if="currentPlaylist.length">
					<view class="item" :class="{active: currentSongId === item.id}" v-for="(item, index) in comuptedCurrentPlaylist"
					 :key="item.id" @tap="playThisSong(item.id)">
						<view class="left">{{item.name}}
							<view class="author">- {{item.author}}</view>
						</view>
						<view class="right" @tap.stop="deleteSongFromPlaylist(item.id)"></view>
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
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'

	export default {
		data() {
			return {
				currentSong: {
					name: ''
				},
				innerAudioContext: '',
				duration: 200,
				currentTime: 0,
				playModeIndex: 0,
				currentPlaylist: []
			}
		},
		computed: {
			...mapState(['currentSongId', 'playlist']),
			playMode() {
				return ['loop', 'repeat', 'shuffle'][this.playModeIndex];
			},
			comuptedCurrentPlaylist() {
				const temp = []
				for (let i of this.playlist) {
					for (let j of this.currentPlaylist) {
						if (j.id === i) {
							temp.push(j)
							continue
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
				this.innerAudioContext = uni.createInnerAudioContext();
				this.innerAudioContext.src = this.currentSong.url;
				this.innerAudioContext.onCanplay(() => {
					this.duration = this.innerAudioContext.duration
					this.innerAudioContext.play();
				});
				this.innerAudioContext.onError(res => {
					console.log(res);
					uni.showToast({
						title: 'mp3文件不存在'
					})
					setTimeout(_ => {
						this.next()
					}, 500)
				});
				this.innerAudioContext.onTimeUpdate(_ => {
					this.currentTime = this.innerAudioContext.currentTime
				});
				this.innerAudioContext.onEnded(_ => {
					console.log(this.playMode);
					if (this.playMode === 'loop') {
						this.next()
					}
					if (this.playMode === 'repeat') {
						this.innerAudioContext.seek(0)
					}
					if (this.playMode === 'shuffle') {
						this.random()
					}
				})
			},
			updatePlayModeIndex() {
				this.playModeIndex = (this.playModeIndex + 1) % 3
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
				this.innerAudioContext.paused && this.innerAudioContext.play();
			},
			pause() {
				!this.innerAudioContext.paused && this.innerAudioContext.pause();
			},
			sliderChange(e) {
				this.innerAudioContext.seek(e.detail.value)
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
	}
</script>

<style lang="scss" scoped>
	.wrapper {
		color: #fff;
		width: 100%;
		background-color: rgba($color: #111, $alpha: .6);

		.blur {
			width: 100%;
			height: 100%;
			position: absolute;
			z-index: -1;
			filter: blur(30px);
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
				height: 700rpx;
				width: 100%;
				box-sizing: border-box;
				border-radius: 20rpx;
				box-shadow: 0 0 20px 3px #333;
			}

			.name {
				padding: 60rpx 0 15rpx;
				font-size: 150%;
				width: 100%;
			}

			.author {
				width: 100%;
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
				
				.currentTime {
					
				}
				
				.duration {
					
				}
			}

			.operation {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.playMode {
					height: 100rpx;
					width: 100rpx;
				}

				.play {
					height: 100rpx;
					width: 100rpx;
					background: url(../../static/img/play.svg) center center / contain no-repeat;
				}

				.pause {
					height: 100rpx;
					width: 100rpx;
					background: url(../../static/img/pause.svg) center center / contain no-repeat;
				}

				.next {
					height: 100rpx;
					width: 100rpx;
					background: url(../../static/img/next.svg) center center / 50% 50% no-repeat;
				}

				.prev {
					height: 100rpx;
					width: 100rpx;
					background: url(../../static/img/back.svg) center center / 50% 50% no-repeat;
				}

				.playlist {
					height: 100rpx;
					width: 100rpx;
					background: url(../../static/img/list.svg) center center / 70% 70% no-repeat;
				}

			}
		}

	}

	.pop {
		.list {
			max-height: 70vh;
			overflow: scroll;
			background-color: #1d232c;
			padding-bottom: 100rpx;

			.item {
				display: flex;
				justify-content: space-between;
				border: none;
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
					background: url(../../static/img/delete.svg) 50% 50% / 50% 50% no-repeat;
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
