<template>
	<view id="player">
		<view class="info">
			<view>{{currentSong.name}}</view>
			<image :src="currentSong.picUrl" mode="aspectFill"></image>
		</view>
	
		<view class="bottom">
			<slider :value="currentTime" @change="sliderChange" block-size="12" :max="duration" />
			<view>{{duration | ss2mmss}}/{{currentTime | ss2mmss}}</view>
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
				<view class="item" :class="{active: currentSongId === item.id}" v-for="(item, index) in comuptedCurrentPlaylist" :key="item.id" @tap="playThisSong(item.id)">
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
	page {
		background-color: #333;
		color: #fff;
	}

	#player {
		width: 100%;
		
		
		.bottom {
			position: absolute;
			bottom: 0;
			width: 100%;
			padding: 30rpx;
			box-sizing: border-box;
			
			.operation {
				display: flex;
				align-items: center;
				justify-content: space-around;
				
				.playMode {
					height: 60rpx;
					width: 60rpx;
					padding: 10rpx;
				}
				
				.play {
					height: 80rpx;
					width: 80rpx;
					background: url(../../static/img/play.svg) center center / contain no-repeat;
				}
				
				.pause {
					height: 80rpx;
					width: 80rpx;
					background: url(../../static/img/pause.svg) center center / contain no-repeat;
				}
				
				.next {
					height: 80rpx;
					width: 80rpx;
					background: url(../../static/img/next.svg) center center / 50% 50% no-repeat;
				}
				
				.prev {
					height: 80rpx;
					width: 80rpx;
					background: url(../../static/img/back.svg) center center / 50% 50% no-repeat;
				}
				
				.playlist {
					height: 80rpx;
					width: 80rpx;
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
