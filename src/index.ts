import {PicGo} from "electron-picgo";

import {parseAndValidate, IConfig} from "./util";
import {loadFontFamily, getSvg} from "./text2svg";
import {config} from "./config";
import {inputAddWaterMarkHandle} from "./input";

const handle = async (ctx: PicGo): Promise<PicGo | boolean> => {
  const input = ctx.input;
  const userConfig = ctx.getConfig<IConfig>("picgo-plugin-watermark-electron");

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
      textColor,
    }
  ] = parseAndValidate(userConfig);

  // Verify configuration
  if (errors.length) {
    // To prevent the next step
    throw new Error(errors.join("，") + "设置错误，请检查");
  }

  let waterMark = null;
  if (image) {
    waterMark = image;
  } else {
    try {
      console.log("准备加载水印字体")
      loadFontFamily(fontFamily || undefined);
      console.log("水印字体加载成功")
    } catch (error) {
      ctx.log.error("字体文件载入失败");
      ctx.log.error(error);
      // To prevent the next step
      throw new Error("字体文件载入失败，请检查字体文件路径");
    }

    const svgOptions: { [key: string]: any } = {}
    parsedFontSize && (svgOptions.fontSize = parsedFontSize)
    textColor && (svgOptions.fill = textColor)
    waterMark = Buffer.from(
      getSvg(text, svgOptions)
    );
  }

  try {
    console.log("开始处理图片水印")
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
    );
  } catch (error) {
    ctx.log.error(error);
    // To prevent the next step
    throw new Error("可能是水印图或字体文件路径无效，请检查。");
  }
  return ctx;
};

export = (ctx: PicGo): any => {
  const register: () => void = () => {
    ctx.helper.beforeTransformPlugins.register("watermark", {handle});
  };
  return {
    register,
    config
  };
};
