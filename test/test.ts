import svg2img from 'svg2img'
import images from 'images'
import path from 'path'

const testText2Svg = async (): Promise<void> => {
  const ctx = {
    baseDir: './'
  }
  const defaultFontFamilyTtf = path.join(ctx.baseDir, 'fonts/Arial-Unicode-MS.ttf')
  console.log('defaultFontFamilyTtf=>', defaultFontFamilyTtf)

  const logo = require('logo.svg')
  const svg = logo.generate({
    logo: 'terwer.space',
    font: defaultFontFamilyTtf,
    path: {
      fill: '#a530c7'
    }
  })
  // console.log(svg)

  const buffer = await new Promise((resolve, reject) => {
    svg2img(svg, function (error, buffer) {
      if (error) {
        throw new Error('文字水印转失败', error)
      }
      resolve(buffer)
    })
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
