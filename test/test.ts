// // eslint-disable-next-line @typescript-eslint/no-var-requires
// const imagesLib = require("images");
// // eslint-disable-next-line @typescript-eslint/no-var-requires
// const path = require("path");
// // eslint-disable-next-line @typescript-eslint/no-var-requires
// const dayjs = require("dayjs");
//
// const OFFSET = {
//   X: 20,
//   Y: 20
// };
//
// // =========
// // private
// // =========
//
// enum PositionType {
//   lt = "left-top",
//   ct = "center-top",
//   rt = "right-top",
//   lm = "left-middle",
//   cm = "center-middle",
//   rm = "right-middle",
//   lb = "left-bottom",
//   cb = "center-bottom",
//   rb = "right-bottom"
// }
//
// interface ICoordinate {
//   left: number;
//   top: number;
// }
//
// const getCoordinateByPosition = (prop: {
//   width: number;
//   height: number;
//   waterMark: {
//     width: number;
//     height: number;
//     position: PositionType;
//   };
// }): ICoordinate => {
//   const {width, height, waterMark} = prop;
//   const p = waterMark.position.split("-");
//   return p.reduce(
//     (acc, pos) => {
//       switch (pos) {
//         case "left":
//           acc.left = OFFSET.X;
//           break;
//         case "center":
//           acc.left = Math.floor((width - waterMark.width) / 2);
//           break;
//         case "right":
//           acc.left = Math.floor(width - OFFSET.X - waterMark.width);
//           break;
//         case "top":
//           acc.top = OFFSET.Y;
//           break;
//         case "middle":
//           acc.top = Math.floor((height - waterMark.height) / 2);
//           break;
//         case "bottom":
//           acc.top = Math.floor(height - OFFSET.Y - waterMark.height);
//           break;
//       }
//       return acc;
//     },
//     {left: 0, top: 0}
//   );
// };
//

const test = async () => {
  console.log("hello")
//   // ==================
//   // Mock开始
//   // ==================
//   const ctx = {
//     baseDir: "/Users/terwer/Documents/mydocs/picgo-plugins/picgo-plugin-watermark-elec"
//   }
//
//   // rt 右上
//   // rb 右下
//   // lt 左上
//   // lb 左下
//   const position = PositionType.rt
//
//   let coordinate = {
//     left: 0,
//     top: 0
//   }
//
//   const image = path.join(ctx.baseDir, "test/test.png")
//
//   // ==================
//   // Mock结束
//   // ==================


  // import { UltimateTextToImage} from "ultimate-text-to-image";
  const {UltimateTextToImage} = require("ultimate-text-to-image");
  const images = require("images")

  const textToImage = new UltimateTextToImage(`abc xyz 0123456789 零一二三四五六七八九`, {
    width: 150,
    fontFamily: "Arial, Sans",
    fontSize: 14,
    fontColor: "#af36c2",
    // margin: 20,
    // marginBottom: 40,
    align: "center",
    valign: "middle",
  }).render();
  console.log("文章水印生成成功")

  const buffer = textToImage.toBuffer();
  const imagesObj = images(buffer)
  imagesObj.save("test/textWatermark.png", {
    quality: 50
  });
  console.log("文章水印保存成功")


//   const textToImage = require('text-to-image');
//
// // using the asynchronous API with await
//   const dataUri = await textToImage.generate('Lorem ipsum dolor sit amet');
//   console.log(dataUri)
//


//   let addWaterMarkImagePath = ""
//   const extname = path.extname(image) || 'png'
//   addWaterMarkImagePath = path.join(ctx.baseDir, `lib/test/${dayjs().format('YYYYMMDDHHmmss')}.${extname}`)
//   console.log("addWaterMarkImagePath=>", addWaterMarkImagePath)
//
//   const defaultWatermark = path.join(ctx.baseDir, "fonts/watermark.png")
//   const watermarkObj = imagesLib(defaultWatermark)
//   const watermarkSize = watermarkObj.size()
//   console.log("watermarkObj size=>", watermarkSize)
//
//   //加载图像文件
//   const imagesObj = imagesLib(image)
//   const size = imagesObj.size()
//   console.log("imageObj size=>", size)
//
//   coordinate = getCoordinateByPosition({
//     width: size.width, height: size.height, waterMark: {
//       width: watermarkSize.width,
//       height: watermarkSize.height,
//       position: position
//     }
//   })
//   console.log("coordinate=>", coordinate)
//
//   // 在(10,10)处绘制Logo
//   imagesObj.draw(imagesLib(defaultWatermark), coordinate.left, coordinate.top)
//   // 保存图片到文件,图片质量为50
//   imagesObj.save(addWaterMarkImagePath, {
//     quality: 50
//   });
}

test()
