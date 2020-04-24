<template>
	<view class="content">
		<view class="input-group">
			<view class="input-row border">
				<text class="title">账号：</text>
				<m-input type="text" focus clearable v-model="username" placeholder="请输入账号"></m-input>
			</view>
			<view class="input-row border">
				<text class="title">密码：</text>
				<m-input type="password" displayable v-model="password" placeholder="请输入密码"></m-input>
			</view>
		</view>
		<view class="btn-row">
			<button type="primary" class="primary" @tap="bindRegister">注册</button>
		</view>
	</view>
</template>

<script>
	import mInput from '../../components/m-input.vue';
	import {mapActions} from 'vuex'
	
	export default {
		components: {
			mInput
		},
		data() {
			return {
				username: '',
				password: '',
				email: ''
			}
		},
		methods: {
			...mapActions(['register']),
			bindRegister() {
				/**
				 * 客户端对账号信息进行一些必要的校验。
				 * 实际开发中，根据业务需要进行处理，这里仅做示例。
				 */
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

				const data = {
					username: this.username,
					password: this.password,
					role: 'member'
				}
				this.register(data);
				uni.showToast({
					title: '注册成功'
				});
				// uni.navigateBack({
				// 	delta: 1
				// });
			}
		}
	}
</script>

<style>

</style>
