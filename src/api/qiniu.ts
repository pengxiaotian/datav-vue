import CryptoJS from 'crypto-js'
import axios, { AxiosRequestConfig } from 'axios'
import request from '@/utils/request'

export function getToken() {
  return request.get('/qiniu/upload/token')
}

export function upload(url: string, data: any, config?: AxiosRequestConfig) {
  return axios.create().post(url, data,
    {
      withCredentials: false,
      ...(config || {}),
    },
  )
}


/** ************以下是前端用于测试，本地生成token的方法，不可用于生产环境************* */

function utf16to8(str: string) {
  let c = 0
  let out = ''
  for (let i = 0, len = str.length; i < len; i++) {
    c = str.charCodeAt(i)
    if ((c >= 0x0001) && (c <= 0x007F)) {
      out += str.charAt(i)
    } else if (c > 0x07FF) {
      out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F))
      out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F))
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
    } else {
      out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F))
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
    }
  }
  return out
}

function base64encode(str: string) {
  const base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
  let c1
  let c2
  let c3
  const len = str.length
  let i = 0
  let out = ''
  while (i < len) {
    c1 = str.charCodeAt(i++) & 0xff
    if (i === len) {
      out += base64EncodeChars.charAt(c1 >> 2)
      out += base64EncodeChars.charAt((c1 & 0x3) << 4)
      out += '=='
      break
    }
    c2 = str.charCodeAt(i++)
    if (i === len) {
      out += base64EncodeChars.charAt(c1 >> 2)
      out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4))
      out += base64EncodeChars.charAt((c2 & 0xF) << 2)
      out += '='
      break
    }
    c3 = str.charCodeAt(i++)
    out += base64EncodeChars.charAt(c1 >> 2)
    out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4))
    out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6))
    out += base64EncodeChars.charAt(c3 & 0x3F)
  }
  return out
}

function safe64(base64: string) {
  return base64.replace(/\+/g, '-').replace(/\//g, '_')
}

export function genToken() {
  const accessKey = import.meta.env.VITE_APP_QINIU_AK || ''
  const secretKey = import.meta.env.VITE_APP_QINIU_SK || ''
  const bucket = import.meta.env.VITE_APP_QINIU_BUCKET || ''
  try {
    const putPolicy = JSON.stringify({
      scope: bucket,
      deadline: Math.round(new Date().getTime() / 1000) + 3600,
    })
    const encoded = base64encode(utf16to8(putPolicy))
    const hash = CryptoJS.HmacSHA1(encoded, secretKey)
    const encodedSigned = hash.toString(CryptoJS.enc.Base64)
    const token = `${accessKey}:${safe64(encodedSigned)}:${encoded}`
    return { data: token }
  } catch (error) {
    throw error
  }
}

export async function getTokenByEnv(): Promise<string> {
  try {
    let res
    if (__DEV__) {
      res = genToken()
    } else {
      res = await getToken()
    }

    return res.data
  } catch (error) {
    throw error
  }
}
