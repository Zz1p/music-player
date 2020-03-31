<template>
	<view class="content">
		<search></search>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	import search from '@/components/jm-search/jm-search.vue'

	export default {
		components: {
			search
		},
		computed: {
			...mapState(['hasLogin']),
		},
		onLoad() {
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
