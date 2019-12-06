import jsonp from '@/common/js/jsonp'
import axios from 'axios'
import { commonParams, options } from '@/api/config'

export function getRecommend () {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  return jsonp(url, data, options)
}

export function getDiscList () {
  const url = 'api/getDiscList'

  const data = Object.assign({}, commonParams, {
    format: 'json',
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random()
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getCdInfo (discid) {
  const url = 'api/getCdInfo'

  const data = Object.assign({}, commonParams, {
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    disstid: discid,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    g_tk: 1928093487
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
