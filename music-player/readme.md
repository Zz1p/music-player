music api

url: /playlist
playlist [{
		id: '',
		name： '' // playlist name
		picUrl: ''
	}]
	
获取歌单详情
url: /playlist/datail {
	id
}


url: /login
login {
	username,
	password
}

url: user/collection
getCollection  {
	
}

url: /user/collect/sub
addCollect & deleteCollect {
	userId,
	songId,
	t(t = 1 收藏，其他为取消)
}

getSong (addView 访问这个接口的时候该歌曲的播放量+1)
url: /song/url
 {
	songId
}

推荐(作为轮播图在首页展示)
url: /recommend [{
	id,
	picUrl,
	name
}]