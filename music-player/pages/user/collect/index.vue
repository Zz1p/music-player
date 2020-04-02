<template>
	<view id="collect">
		<view class="list" v-if="user.collect !== 0">
			<view class="item">
				<view class="left music-img"></view>
				<view class="right music-info">
					<view class="name"></view>
					<view class="singer"></view>
				</view>
			</view>
		</view>
		<view class="none" v-else>还没有收藏歌曲，去首页看看吧！</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';

	export default {

		data() {
			return {

			}
		},
		computed: {
			...mapState(['hasLogin', 'user'])
		},
		methods: {
			getCollection() {
				this.$axios({
					url: '/user/collection',
					method: 'GET',
					data: {
						userId: this.user.userId.toString()
					}
				}).then(res => {
					console.log(res[1].data)
				}).catch(err => {
					console.log(err);
				})
			}
		},
		onReady() {
			if (this.hasLogin === false) {
				uni.reLaunch({
					url: '../../index/index'
				})
			}
			this.getCollection();
		}
	}
</script>

<style lang="scss">
	page {
		background-color: $uni-bg-color-grey;
	}

	#collect {
		padding: 20rpx;
		width: 100%;

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
