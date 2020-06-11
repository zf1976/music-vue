/* eslint-disable*/
import axios from 'axios'
import { get, post } from './http'
import id from "element-ui/src/locale/lang/id";

// =======================> 用户 API
// 登录
export const loginIn = (params) => post(`api/app/user/login/status`, params)
// 注册
export const SignUp = (params) => post(`api/app/user/add`, params)
// 更新用户信息
export const updateUserMsg = (params) => post(`api/app/user/update`, params)
// 返回指定ID的用户
export const getUserOfId = (id) => get(`api/app/user/detail?id=${id}`)
// 返回指定id用户头像
export const getUserAvatar = (id) => get(`api/app/user/avatar?id=${id}`)
// 返回指定ID集合的用户
export const getUserOfIds = (ids) => get(`api/app/user/list/detail?ids=${ids}`)
export const changePass = (params) => post('api/app/user/security',params)

// =======================> 歌单 API
// 获取全部歌单
export const getSongList = () => get('api/app/song_list')
// 分页获取歌单
export const getSongListPage = (params) => post('api/app/song_list', params)
// 根据歌单类型获取歌单
export const getSongListOfStyle = (style) => get(`api/app/song_list/style/detail?style=${style}`)
// 根据歌单类型获取分页歌单
export const getSongListPageOfStyle = (params) => post('api/app/song_list/style/detail', params)
// 返回标题包含文字的歌单
export const getSongListOfLikeTitle = (keywords) => get(`api/app/song_list/like_title/detail?title=${keywords}`)
// 返回歌单里指定歌单ID的歌曲
export const getListSongOfSongId = (songListId) => get(`api/app/song_list/detail?songListId=${songListId}`)


// =======================> 歌手 API
// 返回所有歌手
export const getAllSinger = () => get('api/app/singer')
// 分页返回歌手
export const getSingerPage = (params) => post('api/app/singer', params)
// 通过性别对歌手分类
export const getSingerOfSex = (sex) => get(`api/app/singer/sex/detail?sex=${sex}`)
// 通过性别对歌手分页查询
export const getSingerPageOfSex = (params) => post('api/app/singer/sex/detail', params)


// =======================> 收藏 API
// 返回的指定用户ID的收藏列表
export const getCollectionOfUser = (userId) => get(`api/app/collection/detail?userId=${userId}`)
// 添加收藏的歌曲 type: 0 代表歌曲， 1 代表歌单
export const setCollection = (params) => post(`api/app/collection/add`, params)
// 取消收藏
export const deleteCollection = (params) => post(`api/app/collection/delete`, params)

// =======================> 评分 API
// 提交评分
export const setRank = (params) => post(`api/app/rank/add`, params)
// 获取指定歌单的评分
export const getRankOfSongListId = (songListId) => get(`api/app/rank?songListId=${songListId}`)


// =======================> 评论 API
// 添加评论
export const setComment = (params) => post(`api/app/comment/add`, params)
// 点赞
export const setLike = (params) => post(`api/app/comment/like`, params)
// 返回所有评论
export const getAllComment = (type, id) => {
  let url = null
  if (type === 1) {
    url = `api/app/comment/song_list/detail?songListId=${id}`
  } else if (type === 0) {
    url = `api/app/comment/song/detail?songId=${id}`
  }
  return get(url)
}


// =======================> 歌曲 API
// 返回指定歌曲ID的歌曲
export const getSongOfId = (id) => get(`api/app/song/detail?id=${id}`)
// 返回指定歌手ID的歌曲
export const getSongOfSingerId = (id) => get(`api/app/song/singer/detail?singerId=${id}`)
// 返回指定歌手名的歌曲
export const getSongOfSingerName = (keywords) => get(`api/app/song/singer_name/detail?name=${keywords}`)
// 歌曲下载量播放量
export const updateStatistical = (params) => post('api/app/song/update/statistical',params)
// 下载音乐
export const download = (url) => axios({
  method: 'get',
  url: url,
  responseType: 'blob'
})
