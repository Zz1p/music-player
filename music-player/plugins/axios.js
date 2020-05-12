export default function(options) {
	const baseURL = 'http://coconutmilk.club:3000/api/';
	return uni.request({
		url: baseURL + options.url || '',
		method: options.method || 'GET',
		data: options.data || '',
		header: {
			Authorization: uni.getStorageSync('token').length ? uni.getStorageSync('token') : ''
		}
	})
}