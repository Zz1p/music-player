import multer from 'koa-multer'

const storage = multer.diskStorage({
  //定义文件保存路径
  destination(req,file,cb){
    cb(null,'./static/');
  },
  //修改文件名
  filename(req,file,cb){
    const fileFormat = (file.originalname).split(".");
    cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
});


const upload = multer({ storage: storage });
