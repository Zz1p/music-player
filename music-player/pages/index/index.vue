<template>
	<view class="index" :style="{'padding-top': 50 + statusBarHeight + 'px'}">
		<view :style="{ height: statusBarHeight + 'px', 'background-color': '#fff', position: 'fixed', top:'0', 'z-index': 999, 'width': '100%'}"></view>
		<search @search="search"></search>
		<view class="content">
			<view class="swiper" v-if="posterList.length">
				<swiper :indicator-dots="indicatorDots" autoplay :interval="interval" :duration="duration" circular>
					<swiper-item v-for="(item, index) in songList" :key="item.id">
						<view class="swiper-item" @tap="jump2Player(item)">
							<preload-img class="blur" :src="item.picUrl" :mode="'widthFix'"></preload-img>
							<view class="name">{{posterList[index].name}}</view>
						</view>
					</swiper-item>
				</swiper>
			</view>
			<h3 class="title" v-if="playlist.length">歌单列表</h3>
			<view class="playlist" v-if="playlist.length" :style="{height: playlistHeight}">
				<view class="wrapper" :style="{width: playlistWrapperWidth}">
					<view class="item" v-for="item in playlist" :key="item.id" @tap="showPlaylist(item)">
						<preload-img class="img" :src="item.picUrl" :mode="'aspectFill'"></preload-img>
						<view class="name">{{item.name}}</view>
					</view>
				</view>
			</view>
			<song-list :songs="allSongs"></song-list>
		</view>
	</view>
</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	import songList from "@/components/song-list.vue"
	import search from '@/components/jm-search/jm-search.vue'
	import preloadImg from '@/components/preload-img.vue'
	import {
		mapState,
		mapActions,
		mapMutations
	} from 'vuex'
	
	export default {
		components: {
			search,
			songList,
			preloadImg
		},
		data() {
			return {
				statusBarHeight: 0,
				indicatorDots: true,
				interval: 3000,
				duration: 500,
				songList: [],
				posterList: [],
				playlist: [],
				allSongs: []
			}
		},
		computed: {
			...mapState(['hasLogin', ]),
			playlistWrapperWidth() {
				const length = this.playlist.length <= 5 ? this.playlist.length : 5
				return length * 110 + 'px';
			},
			playlistHeight() {
				return 130 + parseInt(this.playlist.length / 5) * 130 + 'px';
			}
		},
		methods: {
			...mapActions(['getSongsById']),
			...mapMutations(['setCurrentSong']),
			getPosters() {
				this.$axios({
						url: 'getPosters',
						method: 'GET'
					}).then(res => {
						const data = res[1].data;
						const songIdList = [];
						for (let i of data) {
							songIdList.push(i.songId)
						}
						this.posterList = data;
						this.getSongsById(songIdList)
							.then(res => this.songList = res)
							.catch(err => console.log(err))
					})
					.catch(err => console.log(err))
			},
			getPlaylist() {
				this.$axios({
					url: 'playlist',
					mthode: 'GET'
				}).then(res => {
					this.playlist = res[1].data;
				}).catch(err => console.log(err));
			},
			getSongs() {
				this.$axios({
					url: 'song',
					method: 'GET'
				}).then(res => {
					this.allSongs = res[1].data
				}).catch(err => console.log(err));
			},
			jump2Player(item) {
				this.setCurrentSong(item.id);
				uni.switchTab({
					url: '../player/player'
				})
			},
			search(name) {
				uni.navigateTo({
					url: '../search/search?name=' + name
				})
			},
			showPlaylist(item) {
				uni.navigateTo({
					url: `../playlist/playlist?id=${item.id}&name=${item.name}&picUrl=${item.picUrl}&songs=${item.songs}`
				})
			}
		},
		mounted() {
			this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
			uni.showLoading({
				title: 'loading'
			})
			Promise.all([this.getPosters(), this.getPlaylist(), this.getSongs()])
				.then(res => {
					uni.hideLoading()
				}).catch(_ => {
					uni.hideLoading()
				})
		},
	}
</script>

<style lang="scss">
	page {
		background-color: $uni-bg-color-grey;
	}
</style>

<style scoped lang="scss">

	.index {
		flex: 1;
		.swiper {
			border-radius: 20rpx;
			margin: 20rpx 0;

			.swiper-item {
				position: relative;
				margin: 0 30rpx;
				height: 100%;
				border-radius: 20rpx;
				overflow: hidden;
				
				.blur {
					position: absolute;
					z-index: -1;
					height: 100%;
					width: 100%;
				}
				
				.name {
					position: absolute;
					right: 0;
					top: 20rpx;
					padding: 5rpx 20rpx;
					text-align: center;
					font-size: 80%;
					border-top-left-radius: 22rpx;
					border-bottom-left-radius: 22rpx;
					background: #fff;
					box-shadow: 0 0 5px 0 #ddd;
				}

			}
		}

		.title {
			color: $uni-color-title;
			padding-left: 30rpx;
		}

		.playlist {
			display: flex;
			margin: 0 30rpx;
			position: relative;
			height: 200px;
			overflow-x: scroll;

			.wrapper {
				position: absolute;
				display: flex;
				flex-wrap: wrap;

				.item {
					height: 120px;
					width: 100px;
					border-radius: 20rpx;
					margin: 5px 10px 5px 0;

					.img {
						height: 100px;
						width: 100%;
						border-radius: 10rpx;
					}

					.name {
						padding: 2px 5px;
						font-size: 10px;
						color: #333;
					}
				}
			}
		}
	}
</style>
