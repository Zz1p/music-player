<template>
	<view class="content">
		<search></search>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import search from '@/components/jm-search/jm-search.vue'

	export default {
		components: {
			search
		},
		computed: mapState(['forcedLogin', 'hasLogin', 'userName']),
		onLoad() {
			uni.request({
				url: 'http://120.77.176.21:3000/top/list?idx=1',
			}).then(res => {
				console.log(res[1])
			}).catch(err => {
				console.log(err);
			})
			if (!this.hasLogin) {
				uni.showModal({
					title: '未登录',
					content: '您未登录，需要登录后才能使用更多功能',
					success: (res) => {
						if (res.confirm) {
							uni.navigateTo({
								url: '../login/index'
							});
						}
					}
				});
			}
		}
	}
</script>

<style>
	.hello {
		display: flex;
		flex: 1;
		flex-direction: column;
	}

	.title {
		color: #8f8f94;
		margin-top: 25px;
	}

	.ul {
		font-size: 15px;
		color: #8f8f94;
		margin-top: 25px;
	}

	.ul>view {
		line-height: 25px;
	}
</style>
