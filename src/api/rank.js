import jsonp from '@/common/js/jsonp'
import { commonParams, options } from '@/api/config'

export function getTopList () {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    g_tk: 67232076,
    needNewCode: 1
  })
  return jsonp(url, data, options)
}

export function getRankDisc (topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'

  const data = Object.assign({}, commonParams, {
    g_tk: 1928093487,
    uin: 0,
    needNewCode: 1,
    topid,
    tpl: 3,
    page: 'detail',
    type: 'top',
    platform: 'h5'
  })
  return jsonp(url, data, options)
}
