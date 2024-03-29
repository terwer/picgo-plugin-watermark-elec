import {ILogger, IPicGo} from './types'
import {getCoordinateByPosition, getImageBufferData, PositionType} from './util'
import images from 'images'
import path from 'path'
import dayjs from 'dayjs'
import fs from 'fs-extra'

interface IInput {
  input: any[]
  minWidth: number
  minHeight: number
  position: string
  waterMark: string | Buffer
}

export const inputAddWaterMarkHandle: (
  ctx: IPicGo,
  iinput: IInput,
  logger: ILogger
) => Promise<string[]> = async (ctx, imageInput, logger) => {
  const {input, minWidth, minHeight, waterMark, position} = imageInput
  console.log('waterMark=>', waterMark)
  console.log('position=>', position)

  const addedWaterMarkInput = await Promise.all(
    input.map(async image => {
      let addWaterMarkImagePath = ''

      let coordinate = {
        left: 0,
        top: 0
      }

      // 加载水印
      console.log('准备加载水印，临时保存水印文件')
      let watermarkObj
      if (typeof waterMark === 'string') {
        watermarkObj = images(waterMark)
      } else {
        watermarkObj = images(waterMark)
      }
      const watermarkSize = watermarkObj.size()
      const watermarkImagePath = path.join(ctx.baseDir, 'node_modules/picgo-plugin-watermark-elec/fonts/terwer.png')
      watermarkObj.save(watermarkImagePath, {
        quality: 50
      })
      console.log('加载水印，临时保存水印文件完成=>', watermarkImagePath)

      // 加载图像文件
      const imageBuffer = await getImageBufferData(ctx, image)
      const imagesObj = images(imageBuffer)
      const size = imagesObj.size()

      // 等比缩放图像到400像素宽
      // imagesObj.size(400)
      // 在(10,10)处绘制Logo
      coordinate = getCoordinateByPosition({
        width: size.width,
        height: size.height,
        waterMark: {
          width: watermarkSize.width,
          height: watermarkSize.height,
          position: PositionType[position]
        }
      })
      console.log('coordinate=>', coordinate)

      // Picture width or length is too short, do not add watermark
      // Or trigger minimum size limit
      if (
        coordinate.left <= 0 ||
        coordinate.top <= 0 ||
        size.width <= minWidth ||
        size.height <= minHeight
      ) {
        addWaterMarkImagePath = image
        logger.info('watermark 图片尺寸不满足，跳过水印添加')
      } else {
        const extname = (typeof image === "string") ? path.extname(image) : 'png'
        addWaterMarkImagePath = path.join(ctx.baseDir, `${dayjs().format('YYYYMMDDHHmmss')}.${extname}`)
        console.log('addWaterMarkImagePath=>', addWaterMarkImagePath)

        ctx.once('failed', () => {
          // 删除 picgo 生成的图片文件，例如 `~/.picgo/20200621205720.png`
          fs.remove(addWaterMarkImagePath).catch((e) => {
            ctx.log.error(e)
          })
        })

        ctx.once('finished', () => {
          // 删除 picgo 生成的图片文件，例如 `~/.picgo/20200621205720.png`
          fs.remove(addWaterMarkImagePath).catch((e) => {
            ctx.log.error(e)
          })
        })

        imagesObj.draw(watermarkObj, coordinate.left, coordinate.top)
        // 保存图片到文件,图片质量为50
        imagesObj.save(addWaterMarkImagePath, {
          quality: 50
        })

        logger.info('watermark 水印添加成功')
      }
      return addWaterMarkImagePath
    })
  )
  return addedWaterMarkInput
}
