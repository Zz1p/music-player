<template>
	<view class="content">
		<view v-if="hasLogin" class="info">
			<view class="item userInfo">
				<view class="left avatar"></view>
				<view class="right username">{{user.username}}</view>
			</view>
			<view class="item collect">
				<view class="left collect-img"></view>
				<view class="right collect-num">{{collectNum}}</view>
			</view>
		</view>
		<view class="btn-row">
			<button v-if="!hasLogin" class="theme-button-color" hover-class="theme-button-color--active" @tap="bindLogin">登录</button>
			<button v-if="hasLogin"  class="theme-button-color" hover-class="theme-button-color--active" @tap="bindLogout">退出登录</button>
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
				/**
				 * 如果需要强制登录跳转回登录页面
				 */
				if (this.forcedLogin) {
					uni.reLaunch({
						url: '../login/index',
					});
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: $uni-bg-color-grey;
	}

	.item {
		display: flex;
		align-items: center;
		margin: 20rpx;
		height: 100rpx;
		background-color: #fff;

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
</style>
