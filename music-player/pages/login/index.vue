<template>
	<view class="content">
		<view class="input-group">
			<view class="input-row border">
				<text class="title">账号：</text>
				<m-input type="text" clearable focus v-model="username" placeholder="请输入账号"></m-input>
			</view>
			<view class="input-row">
				<text class="title">密码：</text>
				<m-input type="password" displayable v-model="password" placeholder="请输入密码"></m-input>
			</view>
		</view>
		<view class="btn-row">
			<button class="theme-button-color" hover-class="theme-button-color--active" @tap="bindLogin">登录</button>
		</view>
		<view class="action-row">
			<navigator url="../reg/index">注册账号</navigator>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'
	import mInput from '../../components/m-input.vue'
	import md5 from '@/components/md5.js'
	
	export default {
		components: {
			mInput
		},
		data() {
			return {
				providerList: [],
				hasProvider: false,
				username: '',
				password: '',
				positionTop: 0,
				isDevtools: false,
			}
		},
		computed: {
			...mapState(['hasLogin'])
		},
		methods: {
			...mapActions(['login']),
			initPosition() {
				/**
				 * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
				 * 反向使用 top 进行定位，可以避免此问题。
				 */
				this.positionTop = uni.getSystemInfoSync().windowHeight - 100;
			},
			bindLogin() {
				if (this.username.length < 5) {
					uni.showToast({
						icon: 'none',
						title: '账号最短为 5 个字符'
					});
					return;
				}
				if (this.password.length < 6) {
					uni.showToast({
						icon: 'none',
						title: '密码最短为 6 个字符'
					});
					return;
				}
				const account = {
					username: this.username,
					password: md5(this.password)
				};
				this.login(account)
					.then(res => {
						if (res.validUser === true && res.userInfo.role === 'member') {
							this.jump2Main();
						} else {
							uni.showToast({
								icon: 'none',
								title: '用户账号或密码不正确',
							});
						}
					})
					.catch(err => console.log(err))
			},
			jump2Main() {
				uni.reLaunch({
					url: '../index/index',
				});
			},
		},
		onReady() {
			if (this.hasLogin) {
				uni.reLaunch({
					url: '../index/index'
				})
			}
			this.initPosition();
			// #ifdef MP-WEIXIN
			this.isDevtools = uni.getSystemInfoSync().platform === 'devtools';
			// #endif
		},

	}
</script>

<style lang="scss">
	.action-row {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.action-row navigator {
		color: $theme-bg-color;
		padding: 0 20rpx;
	}
</style>
