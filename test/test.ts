import svg2img from "svg2img";
import images from "images";
import path from "path";

const testUltimateTextToImage = (): void => {
  const {UltimateTextToImage} = require('ultimate-text-to-image')
  const images = require('images')

  const textToImage = new UltimateTextToImage('abc xyz 0123456789 零一二三四五六七八九', {
    width: 150,
    fontFamily: 'Arial, Sans',
    fontSize: 14,
    fontColor: '#af36c2',
    // margin: 20,
    // marginBottom: 40,
    align: 'center',
    valign: 'middle'
  }).render()
  console.log('文章水印生成成功')

  const buffer = textToImage.toBuffer()
  const imagesObj = images(buffer)
  imagesObj.save('test/textWatermark.png', {
    quality: 50
  })
  console.log('文章水印保存成功')
}

const testText2Svg = async (): Promise<void> => {
  const Text2svg = require('text2svg')
  const path = require("path")

  const ctx = {
    baseDir: "/Users/terwer/Documents/mydocs/picgo-plugins/picgo-plugin-watermark-elec"
  }
  const defaultFontFamilyTtf = path.join(ctx.baseDir, "fonts/Arial-Unicode-MS.ttf")
  console.log("defaultFontFamilyTtf=>", defaultFontFamilyTtf)

  var logo = require('logo.svg');
  //
  // const text2svg = new Text2svg(defaultFontFamilyTtf)
  // const svgOptions = {
  //   path: {fill: ""}
  // }
  // svgOptions.path = {
  //   'fill': "#af36c2"
  // };
  const svg = logo.generate({
    logo: "terwer.space",
    font: defaultFontFamilyTtf,
    path: {
      fill: "#a530c7"
    }
  });
  // console.log(svg)

  // const svg = text2svg.toSVG('something', svgOptions).svg
  const buffer = await new Promise((resolve, reject) => {
    svg2img(svg, function (error, buffer) {
      if (error) {
        throw new Error("文字水印转失败", error)
        // reject(error)
      }
      resolve(buffer)
    });
  })

  // console.log(buffer)
  const imagesObj = images(buffer as Buffer)
  imagesObj.save('test/textWatermark.png', {
    quality: 50
  })
  console.log('文字水印保存成功')
}

const test = async (): Promise<void> => {
  console.log('hello')

  // testUltimateTextToImage()

  await testText2Svg()
}

(async () => {
  await test()
})().catch((e) => {
  console.log(e)
})
