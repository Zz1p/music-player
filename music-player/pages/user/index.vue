<template>
	<view class="content">
		<view class="title">个人中心</view>
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
			<button v-if="!hasLogin" class="theme-button-color" hover-class="theme-button-color--active" @tap="bindLogin">登录</button>
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
			...mapState(['hasLogin', 'user'])
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
		.title {
			font-size: 40rpx;
			font-weight: bolder; 
			padding: 20rpx;
		}
		.item {
			display: flex;
			align-items: center;
			margin: 20rpx;
			height: 100rpx;
			background-color: #fff;

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
			}
		}
	}
</style>
