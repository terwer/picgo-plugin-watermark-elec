import { fontOptions } from './attr'
import { UltimateTextToImage } from 'ultimate-text-to-image'

export const getSvg = (
  text: string,
  options?: { fontSize?: number, [propName: string]: any }
): Buffer => {
  const svgOptions: Record<string, any> = {
    attributes: {},
    ...fontOptions
  }
  if (options) {
    svgOptions.attributes = {
      ...svgOptions.attributes,
      ...options
    }
    if (options.fontSize) {
      svgOptions.fontSize = options.fontSize
    }
    if (options.fill) {
      svgOptions.fontColor = options.fill
    }
    if (options.fontFamily) {
      svgOptions.fontFamily = options.fontFamily
    }
  }

  const textToImage = new UltimateTextToImage(text, options).render()
  return textToImage.toBuffer()
}
