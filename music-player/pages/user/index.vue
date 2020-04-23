<template>
	<view class="content">
		<view v-if="hasLogin" class="info">
			<view class="item userInfo">
				<view class="left avatar"></view>
				<view class="right username">{{user.username}}</view>
			</view>
			<view class="item collect" @tap="bindCollect" hover-class="item--active">
				<view class="left collect-img"></view>
				<view class="right collect-num">{{user.collect}} 首歌</view>
			</view>
		</view>
		<view class="btn-row">
			<button v-if="hasLogin === false" class="theme-button-color" hover-class="theme-button-color--active" @tap="bindLogin">登录</button>
			<button v-if="hasLogin" class="theme-button-color" hover-class="theme-button-color--active" @tap="bindLogout">退出登录</button>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		data() {
			return {
				collectNum: 0
			}
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		methods: {
			...mapMutations(['logout']),
			bindLogin() {
				uni.navigateTo({
					url: '../login/index',
				});
			},
			bindLogout() {
				this.logout();
			},
			bindCollect() {
				uni.navigateTo({
					url: './collect/index',
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: $uni-bg-color-grey;
	}

	.content {

		.info {
			padding-top: 20rpx;
			color: $theme-bg-color;
			
			.item {
				display: flex;
				align-items: center;
				margin: 0 20rpx;
				height: 120rpx;
				background-color: #fff;
				border-bottom: 1px solid $uni-bg-color-grey;
				
				&.item--active {
					background-color: $uni-bg-color-hover;
				}

				.left {
					flex: 1;
					height: 50%;
					width: 50rpx;

					&.avatar {
						background: url(../../static/img/account.png) 50% 50% / contain no-repeat;
					}

					&.collect-img {
						background: url(../../static/img/collect.png) 50% 50% / contain no-repeat;
					}
				}

				.right {
					flex: 3;
					padding-left: 20rpx;
					position: relative;
					&.collect-num::after {
						position: absolute;
						right: 10rpx;
						width: 40rpx;
						height: 100%;
						content: '';
						background: url(../../static/img/forward.png) 50% 50% / contain no-repeat;
					}
				}
			}
		}
	}
</style>
