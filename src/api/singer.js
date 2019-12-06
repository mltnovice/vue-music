import jsonp from '@/common/js/jsonp'
import { commonParams, options } from '@/api/config'
import axios from 'axios'

export function getSingerList () {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  const data = Object.assign({}, commonParams, {
    g_tk: '1928093487',
    platform: 'yqq',
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0
  })
  return jsonp(url, data, options)
}

export function getSingerSong (singerId) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    order: 'listen',
    begin: 0,
    num: 100,
    songstatus: 1,
    g_tk: 1928093487,
    singermid: singerId
  })
  return jsonp(url, data, options)
}

export function getPurl () {
  const url = 'api/getPurl'

  let comdata = {
    req: {
      module: 'CDN.SrfCdnDispatchServer',
      method: 'GetCdnDispatch',
      param: {
        guid: '451698687',
        calltype: 0,
        userip: ''
      }
    },
    req_0: {
      module: 'vkey.GetVkeyServer',
      method: 'CgiGetVkey',
      param: {
        guid: '451698687',
        songmid: [
          '001Qu4I30eVFYb'
        ],
        songtype: [
          0
        ],
        uin: '2315163785',
        loginflag: '1',
        platform: '20'
      }
    },
    comm: {
      uin: '2315163785',
      format: 'json',
      ct: '24',
      cv: '0'
    }
  }

  const data = Object.assign({}, {
    '-': 'getplaysongvkey2997907846860117',
    g_tk: '1137758600',
    loginUin: '2315163785',
    hostUin: '0',
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: '0',
    platform: 'yqq.json',
    needNewCode: '0',
    data: comdata
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
