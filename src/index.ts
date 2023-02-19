import {type PicGo} from 'electron-picgo'

import {type IConfig, isEmptyString, parseAndValidate} from './util'
import {getSvg} from './text2svg'
import {config} from './config'
import {inputAddWaterMarkHandle} from './input'
import path from "path";
import * as buffer from "buffer";

const handle = async (ctx: PicGo): Promise<PicGo | boolean> => {
  const input = ctx.input
  const userConfig = ctx.getConfig<IConfig>('picgo-plugin-watermark-elec')

  const [
    errors,
    {
      text,
      position,
      parsedFontSize,
      image,
      fontFamily,
      minWidth,
      minHeight,
      textColor
    }
  ] = parseAndValidate(userConfig)

  // Verify configuration
  if (errors.length) {
    // To prevent the next step
    throw new Error(errors.join('，') + '设置错误，请检查')
  }

  let waterMark = null
  if (!isEmptyString(image)) {
    console.log('当前使用图片水印，水印图片路径=>', image)
    waterMark = image
  } else {
    console.log('当前使用文字水印')
    // const defaultFontFamily = path.join(ctx.baseDir, "Arial, Sans")
    const pluginPath = path.join(ctx.baseDir, "node_modules/picgo-plugin-watermark-elec")
    const defaultFontFamilyTtf = path.join(pluginPath, "fonts/Arial-Unicode-MS.ttf")
    const svgFontFamily = fontFamily || defaultFontFamilyTtf

    const svgOptions: Record<string, any> = {}
    parsedFontSize && (svgOptions.fontSize = parsedFontSize)
    textColor && (svgOptions.fill = textColor)
    svgFontFamily && (svgOptions.fontFamily = svgFontFamily)

    waterMark = await getSvg(text || 'terwer.space', svgOptions)
    if (!(waterMark instanceof Buffer)) {
      throw new Error("水印格式异常" + waterMark)
    }
  }

  try {
    ctx.input = await inputAddWaterMarkHandle(
      ctx,
      {
        input,
        minHeight,
        minWidth,
        position,
        waterMark
      },
      ctx.log
    )
  } catch (error) {
    ctx.log.error(error)
    // To prevent the next step
    throw new Error('可能是水印图或字体文件路径无效，请检查。' + error)
  }
  return ctx
}

export = (ctx: PicGo): any => {
  const register: () => void = () => {
    ctx.helper.beforeTransformPlugins.register('watermark', {handle})
  }
  return {
    register,
    config
  }
}
