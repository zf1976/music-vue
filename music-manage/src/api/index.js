/* eslint-disable*/
import { get, post, deletes } from './http'

// =======================> 管理员 API
// 是否登录成功
export const getLoginStatus = (params) => post(`api/admin/login/status`,params)


// =======================> 用户 API
// 返回所有用户
export const getAllUser = (params) => post(`api/admin/user`, params)
// 返回指定ID的用户
export const getUserOfId = (id) => get(`api/admin/user/detail?id=${id}`)
// 添加用户
export const addUser = (params) => post(`api/admin/user/add`, params)
// 更新用户信息
export const updateUserMsg = (params) => post(`api/admin/user/update`, params)
// 删除用户
export const deleteUser = (id) => get(`api/admin/user/delete?id=${id}`)

export const selectEmail = (email) => post(`api/admin/user/select_email?email=${email}`)
export const selectPhone = (phone) => post(`api/admin/user/select_phone?phone=${phone}`)

// =======================> 收藏列表 API
// 返回的指定用户ID收藏列表
export const getCollectionOfUser = (userId) => get(`api/admin/collection/detail?userId=${userId}`)
// 删除收藏的歌曲
export const deleteCollection = (userId, songId) => get(`api/admin/collection/delete?userId=${userId}&songId=${songId}`)

// =======================> 评论列表 API
// 获得指定歌曲ID的评论列表
export const getCommentOfSongId = (songId) => get(`api/admin/comment/song/detail?songId=${songId}`)
// 获得指定歌单ID的评论列表
export const getCommentOfSongListId = (songListId) => get(`api/admin/comment/song_list/detail?songListId=${songListId}`)
// 更新评论
export const updateCommentMsg = (params) => post(`api/admin/comment/update`, params)
// 删除评论
export const deleteComment = (id) => get(`api/admin/comment/delete?id=${id}`)


// =======================> 歌手 API
// 返回所有歌手
export const getAllSinger = (params) => post(`api/admin/singer`,params)
// 添加歌手
export const setSinger = (params) => post(`api/admin/singer/add`, params)
// 更新歌手信息
export const updateSingerMsg = (params) => post(`api/admin/singer/update`, params)
// 删除歌手
export const deleteSinger = (id) => get(`api/admin/singer/delete?id=${id}`)


// =======================> 歌曲 API
// 返回所有歌曲
export const getAllSong = () => get(`api/admin/song`)
// 返回指定歌手ID的歌曲
export const getSongOfSingerId = (id) => get(`api/admin/song/singer/detail?singerId=${id}`)
// 返回的指定用户ID收藏列表
export const getSongOfId = (id) => get(`api/admin/song/detail?id=${id}`)
// 返回指定歌手名的歌曲
export const getSongOfSingerName = (name) => get(`api/admin/song/singer_name?name=${name}`)
// 更新歌曲信息
export const updateSongMsg = (params) => post(`api/admin/song/update`, params)
// 删除歌曲
export const deleteSong = (id) => get(`api/admin/song/delete?id=${id}`)
// 添加歌曲
export const addSong = (form) => post('/api/admin/song/add',form)



// =======================> 歌单 API
// 添加歌单
export const setSongList = (params) => post(`api/admin/song_list/add`, params)
// 获取全部歌单
export const getSongList = (params) => post(`api/admin/song_list`,params)
// 更新歌单信息
export const updateSongListMsg = (params) => post(`api/admin/song_list/update`, params)
// 删除歌单
export const deleteSongList = (id) => get(`api/admin/song_list/delete?id=${id}`)


// =======================> 歌单歌曲 API
// 给歌单添加歌曲
export const setListSong = (params) => post(`api/admin/list_song/add`, params)
// 返回歌单里指定歌单ID的歌曲
export const getSongBySongListId = (songListId) => get(`api/admin/list_song/detail?songListId=${songListId}`)
// 删除歌单里的歌曲
export const deleteListSong = (songId,songListId) => get(`api/admin/list_song/delete?songId=${songId}&songListId=${songListId}`)
