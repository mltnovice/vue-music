const path = require('path')
const axios = require('axios')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  devServer: {
    before (app) {
      app.get('/api/getDiscList', function (req, res) {
        let url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'

        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch((err) => {
          console.log(err)
        })
      })
      app.get('/recommend/api/getCdInfo', function (req, res) {
        let url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'

        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          let ret = response.data
          if (typeof ret === 'string') {
            let reg = /^\w+\(({.*})\)$/
            let matches = ret.match(reg)
            if (matches) {
              ret = JSON.parse(matches[1])
            }
          }
          res.json(ret)
        }).catch((err) => {
          console.log(err)
        })
      })
      app.get('/api/search', function (req, res) {
        let url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'

        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          let ret = response.data
          if (typeof ret === 'string') {
            let reg = /^\w+\(({.*})\)$/
            let matches = ret.match(reg)
            if (matches) {
              ret = JSON.parse(matches[1])
            }
          }
          res.json(ret)
        }).catch((err) => {
          console.log(err)
        })
      })
      app.get('/api/getPurl', function (req, res) {
        let url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'

        axios.get(url, {
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch((err) => {
          console.log(err)
        })
      })
    }
  },
  chainWebpack (config) {
    config.resolve.alias
      .set('components', resolve('src/components'))
      .set('common', resolve('src/common'))
      .set('api', resolve('src/api'))
      .set('base', resolve('src/base'))
  }
}
