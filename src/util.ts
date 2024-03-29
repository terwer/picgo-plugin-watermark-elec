import fs from 'fs-extra'
import Color from 'color'
import { OFFSET } from './attr'
import { type IPicGo } from './types'

export enum PositionType {
  lt = 'left-top',
  ct = 'center-top',
  rt = 'right-top',
  lm = 'left-middle',
  cm = 'center-middle',
  rm = 'right-middle',
  lb = 'left-bottom',
  cb = 'center-bottom',
  rb = 'right-bottom'
}

interface ICoordinate {
  left: number
  top: number
}

export const getCoordinateByPosition = (prop: {
  width: number
  height: number
  waterMark: {
    width: number
    height: number
    position: PositionType
  }
}): ICoordinate => {
  const { width, height, waterMark } = prop
  const p = waterMark.position.split('-')
  return p.reduce(
    (acc, pos) => {
      switch (pos) {
        case 'left':
          acc.left = OFFSET.X
          break
        case 'center':
          acc.left = Math.floor((width - waterMark.width) / 2)
          break
        case 'right':
          acc.left = Math.floor(width - OFFSET.X - waterMark.width)
          break
        case 'top':
          acc.top = OFFSET.Y
          break
        case 'middle':
          acc.top = Math.floor((height - waterMark.height) / 2)
          break
        case 'bottom':
          acc.top = Math.floor(height - OFFSET.Y - waterMark.height)
          break
      }
      return acc
    },
    { left: 0, top: 0 }
  )
}

export interface IConfig {
  text: string
  textColor: string
  position: string
  fontSize: string
  image: string
  fontFamily: string
  minSize: string
  minWidth?: number
  minHeight?: number
  parsedFontSize?: number
}

export const isEmptyString = (str: any): boolean => {
  if (!str) {
    return true
  }
  if (!(typeof str === 'string')) {
    return true
  }
  return str.trim().length === 0
}

export const parseAndValidate: (
  config: IConfig
) => [string[], IConfig] = config => {
  let position, fontSize, minSize, textColor
  if (config) {
    position = config.position
    fontSize = config.fontSize
    minSize = config.minSize
    textColor = config.textColor
  }
  const parsedConfig: IConfig = { ...config }
  const errors = []
  // 无效数字且不为空
  if (!isEmptyString(fontSize)) {
    if (isNaN(parseInt(fontSize))) {
      errors.push('fontSize')
    }
    parsedConfig.parsedFontSize = parseInt(fontSize)
  } else {
    parsedConfig.parsedFontSize = 14
  }
  if (!isEmptyString(position) && !PositionType[position]) {
    errors.push('position')
  } else {
    parsedConfig.position = position || 'rt'
  }
  if (!isEmptyString(minSize)) {
    const [minWidth, minHeight] = minSize.split('*').map((v: string) => +v)
    if (!minWidth || !minHeight) {
      errors.push('minSize')
    } else {
      parsedConfig.minHeight = minHeight
      parsedConfig.minWidth = minWidth
    }
  }
  if (!isEmptyString(textColor)) {
    try {
      parsedConfig.textColor = Color(textColor).hex()
    } catch (error) {
      errors.push('textColor')
    }
  } else {
    parsedConfig.textColor = Color('#af36c2').hex()
  }
  return [
    errors,
    {
      ...config,
      ...parsedConfig
    }
  ]
}

// 是否是网络图片
export const isUrl: (url: string) => boolean = (url) => {
  return /^https?:\/\//.test(url)
}

function isBlob (val: any): boolean {
  return toString.call(val) === '[object Blob]'
}

function isFile (val: any): boolean {
  return toString.call(val) === '[object File]'
}

export const isFileOrBlob = (val: any): boolean => {
  return isBlob(val) || isFile(val)
}

export const isBuffer = (val: any): boolean => {
  return toString.call(val) === '[object Buffer]'
}

export const downloadImage: (ctx: IPicGo, url: string) => Promise<Buffer> = async (ctx, url): Promise<any> => {
  const res = await ctx.request({ method: 'GET', url, encoding: null })
  ctx.log.error(res)
  return res
}

export const getImageBufferData: (ctx: IPicGo, imageUrl: any) => Promise<Buffer> = async (ctx, imageUrl: any) => {
  try {
    if (isBuffer(imageUrl)) {
      return imageUrl
    } else if (isFileOrBlob(imageUrl)) {
      const buf = await imageUrl.arrayBuffer()
      return Buffer.from(buf)
    } else if (isUrl(imageUrl)) {
      return await downloadImage(ctx, imageUrl)
    } else {
      return await fs.readFile(imageUrl)
    }
  } catch (e: any) {
    throw new Error('get buffer error =>' + e.toString())
  }
}
