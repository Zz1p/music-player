<template>
	<view>
		<image src="../static/img/loading.gif" mode="aspectFill" v-if="loading" class="img"></image>
		<image :src="src" :mode="mode" class="img" v-else></image>
	</view>
</template>

<script>
	export default {
		name: 'preloadImg',
		props: {
			src: {
				type: String,
				default: ''
			},
			mode: {
				type: String,
				default: 'aspectFit'
			}
		},
		data() {
			return {
				loading: true
			}
		},
		watch: {
			src: {
				handler(newVal, oldVal) {
					this.loading = true;
					uni.getImageInfo({
						src: newVal,
						success: () => {
							// #ifdef H5
							this.loading = false
							// #endif
							// #ifndef H5
							setTimeout(() => {
								this.loading = false
							}, 500)
							// #endif
						}
					});
				},
				immediate: true
			}

		}

	}
</script>

<style scoped>
	.img {
		width: 100%;
		height: 100%;
	}
</style>
