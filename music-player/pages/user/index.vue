<template>
	<view class="content">
		<view v-if="hasLogin" class="info">
			<view class="avatar"></view>
			<view class="username">{{user.username}}</view>
		</view>
		<view class="btn-row">
			<button v-if="!hasLogin" type="primary" class="primary" @tap="bindLogin">登录</button>
			<button v-if="hasLogin" type="default" @tap="bindLogout">退出登录</button>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
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
	.info {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 20rpx;
		height: 100rpx;
		border-radius: 10rpx;
		background-color: #fff;
		.avatar {
			height: 100%;
			width: 60rpx;
			background: url(../../static/img/account.png) 50% 50% / contain no-repeat;
		}
	}
</style>
