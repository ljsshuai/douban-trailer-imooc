//在tasks/movie.js中爬取到电影列表信息(里面含有poster),取得某个电影的doubanId,再由doubanId在trailer中爬取video和cover,组成下面的数组
const qiniu=require('qiniu');
const nanoid=require('nanoid');
const config=require('../config');

// 七牛api
const bucket = config.qiniu.bucket
const mac = new qiniu.auth.digest.Mac(config.qiniu.AK, config.qiniu.SK)
const cfg = new qiniu.conf.Config()
const client = new qiniu.rs.BucketManager(mac,cfg)

//拿到指定的url,将内容上传到七牛上
const uploadToQiniu = async (url, key) => {
    return new Promise((resolve, reject) => {
        client.fetch(url, bucket, key, (err, ret, info) => {
            if (err) {
                reject(err)
            } else {
                if (info.statusCode === 200) {
                    resolve({ key })
                } else {
                    reject(info)
                }
            }
        })
    })
}
;(async()=>{
    let movies = [
        {
            video: 'http://vt1.doubanio.com/201809041039/d006607f7382538b0c35a49bf5c69b12/view/movie/M/402320087.mp4',
            doubanId: '4058933',
            poster: 'https://img3.doubanio.com/view/photo/l_ration_poster/public/p2524354600.jpg',
            cover: '"https://img3.doubanio.com/img/trailer/medium/2524216073.jpg"'
        }
    ]

    movies.map(async movie=>{
        if(movie.video&&!movie.key){
            try{
                console.log('正在传video');
                let videoData=await uploadToQiniu(movie.video,nanoid()+'.mp4')
                console.log('正在传cover');
                let coverData = await uploadToQiniu(movie.cover, nanoid() + '.png')
                console.log('开始传 poster')
                let posterData = await uploadToQiniu(movie.poster, nanoid() + '.png')

                if(videoData.key){
                   movie.videoKey=videoData.key
                }
                if(coverData.key){
                    movie.coverKey=videoData.key
                }
                if(posterData.key){
                    movie.posterKey=posterData.key
                }
                console.log(movie)
                // {
                //     video: 'http://vt1.doubanio.com/201809041039/d006607f7382538b0c35a49bf5c69b12/view/movie/M/402320087.mp4',
                //     doubanId: '4058933',
                //     poster: 'https://img3.doubanio.com/view/photo/l_ration_poster/public/p2524354600.jpg',
                //     cover: '"https://img3.doubanio.com/img/trailer/medium/2524216073.jpg"',
                //     videoKey: 'rpX34e1vJ5MZjkqNp6lXq.mp4',
                //     coverKey: 'rpX34e1vJ5MZjkqNp6lXq.mp4',
                //     posterKey: '7A-8ZTwHe6HTkVt_ubjtY.png'
                // }
            }catch (err){
                console.log('出错了',err)
            }
        }
    })


})()
