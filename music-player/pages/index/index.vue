<template>
	<view class="index">
		<view :style="{ height: statusBarHeight + 'px'}"></view>
		<search @search="search"></search>
		<view class="content">
			<view class="swiper" v-if="posterList.length">
				<swiper :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
					<swiper-item v-for="item in songList" :key="item.id">
						<view class="swiper-item">
							<image class="img" :src="item.picUrl" mode="aspectFill" @tap="jump2Player(item)"></image>
						</view>
					</swiper-item>
				</swiper>
			</view>
			<h3 class="title">歌单列表</h3>
			<view class="playlist" v-if="playlist.length" :style="{height: playlistHeight}">
				<view class="wrapper" :style="{width: playlistWrapperWidth}">
					<view class="item" v-for="item in playlist" :key="item.id" @tap="showPlaylist(item)">
						<view class="img" :style="{background: `url(${item.picUrl}) center center / cover`}"></view>
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
	import {
		mapState,
		mapActions,
		mapMutations
	} from 'vuex'
	import search from '@/components/jm-search/jm-search.vue'

	export default {
		components: {
			search,
			songList
		},
		data() {
			return {
				statusBarHeight: 0,
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
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
				return 130 + this.playlist.length % 5 * 130 + 'px';
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
			this.getPosters();
			this.getPlaylist();
			this.getSongs();
		}
	}
</script>

<style scoped lang="scss">
	.index {
		flex: 1;
		padding-top: 100rpx;
		.swiper {
			border-radius: 20rpx;
			margin: 20rpx 0;

			.swiper-item {
				margin: 0 30rpx;
				height: 100%;

				.img {
					height: 100%;
					width: 100%;
					border-radius: 20rpx;
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
