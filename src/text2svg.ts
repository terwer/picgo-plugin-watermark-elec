import {fontOptions} from './attr'
import Text2svg from "text2svg";
import svg2img from "svg2img";

export const getSvg = async (
  text: string,
  options?: { fontSize?: number, [propName: string]: any }
): Promise<any> => {
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
      svgOptions.fill = options.fill
    }
    if (options.fontFamily) {
      svgOptions.fontFamily = options.fontFamily
    }
  }
  console.log("fontFamily=>", svgOptions.fontFamily)

  const logo = require('logo.svg');
  // const text2svg = new Text2svg(svgOptions.fontFamily)
  // const svg = text2svg.toSVG(text, svgOptions).svg
  // console.log("svg=>", svg)
  const svg = logo.generate({
    logo: text,
    font: svgOptions.fontFamily,
    fontSize: svgOptions.fontSize,
    path: {
      fill: svgOptions.fill
    }
  });

  const buffer = await new Promise((resolve, reject) => {
    svg2img(svg, function (error, buffer) {
      if (error) {
        throw new Error("文字水印转失败", error)
        // reject(error)
      }
      resolve(buffer)
    });
  })
  return buffer
}
