<template>
	<view class="content">
		<view :style="{ height: iStatusBarHeight + 'px'}"></view>
		<search></search>
	</view>
</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	import {
		mapState
	} from 'vuex'
	import search from '@/components/jm-search/jm-search.vue'

	export default {
		components: {
			search
		},
		data() {
			return {
				iStatusBarHeight: 0
			}
		},
		computed: {
			...mapState(['hasLogin']),
		},
		onLoad() {
			this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
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
