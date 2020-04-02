<template>
	<view>
		<view class="searchTopBox">
			<view class="searchBoxRadius">
				<view class="grace-search-icon searchBoxIcon"></view>
				<input class="searchBoxIpt" type="search" v-model="key" @focus="showHistory = true" @confirm="searchNow"
				 placeholder="关键字"></input>
			</view>
		</view>
		<view class="searchBotBox" v-show="showHistory" @blur="showHistory = false">
			<view class="ov">
				<view>搜索历史</view>
				<view @click="clearHistory" class="grace-more-r grace-search-remove"></view>
			</view>
			<view class="searchHistoryBox">
				<view class="searchHistoryBoxItem" v-for="(item,index) in searchHistory" :key='index' @click=show(item)>
					{{item}}
				</view>
				<view class="cancel" @tap="showHistory = false"></view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				searchHistory: [],
				key: '',
				showHistory: false
			}
		},
		created() {length
			this.searchHistory = uni.getStorageSync('searchLocal').length ? uni.getStorageSync('searchLocal').split('-') : [];
		},
		methods: {
			clearHistory() {
				uni.showModal({
					title: '提示',
					content: '点击确定将删除所有历史信息，确定删除吗？',
					success: (res) => {
						if (res.confirm) {
							this.searchHistory = [];
							uni.setStorageSync('searchLocal', this.searchHistory);
						}
					}
				});
			},
			setHistory(key) {
				this.searchHistory.includes(key) ? '' : this.searchHistory.unshift(key)
				uni.setStorageSync('searchLocal', this.searchHistory.join('-'));
			},
			searchNow() {
				this.showHistory = false;
				if (this.key == '') {
					uni.showToast({
						title: '未输入搜索关键字',
						icon: 'none',
						duration: 1000
					});
					return false;
				}
				this.setHistory(this.key);
			},
			show(item) {
				this.key = item;
				this.searchNow();
			}
		}
	}
</script>
<style lang="scss">
	page {
		background: #FFF;
	}

	.ov {
		display: flex;
		justify-content: space-between;
	}

	.searchTopBox {
		width: 100%;
		background-color: $theme-bg-color;
		height: 100upx;
		box-sizing: border-box;
		padding-top: 15upx;
	}

	.searchBoxRadius {
		display: flex;
		width: 90%;
		height: 70upx;
		background-color: #fff;
		margin-left: 5%;
		border-radius: 35upx;
	}

	.searchBoxIcon {
		margin-left: 10upx;
		height: 100%;
		width: 40upx;
		background: url(/static/img/search.png) 50% 50% / contain no-repeat;
	}

	.searchBoxIpt {
		height: 70upx;
		line-height: 70upx;
		margin-right: 20upx;
		flex: 1;
	}

	.searchBotBox {
		width: 100%;
		margin-top: 30upx;
		padding: 15upx 3%;
		box-sizing: border-box;
	}

	.searchHistoryBox {
		width: 100%;
		box-sizing: border-box;
		overflow: hidden;
		margin-top: 40upx;
		display: flex;
		flex-wrap: wrap;
	}

	.searchHistoryBoxItem {
		font-size: 26upx;
		color: #666;
		line-height: 46upx;
		height: 46upx;
		padding: 0 20upx;
		border-radius: 23upx;
		margin-left: 15upx;
		margin-bottom: 20upx;
		border: 1px solid #ccc;
	}

	.grace-search-remove {
		height: 40upx;
		width: 40upx;
		background: url(../../static/img/delete.png) 50% 50% / contain no-repeat;
	}

	.cancel {
		height: 60upx;
		width: 100%;
		background: url(../../static/img/cancel.png) 50% 50% / contain no-repeat;
	}
</style>
