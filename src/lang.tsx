/* eslint-disable react-refresh/only-export-components */
import { createContext } from 'react'

export const ZH_CN = {
  lang: 'zh-cn', title: '赛博画师小叶子',
  // Dialog
  info: '提示', wait: '请等待${status.current}完成',
  error: '错误', confirm: '确认', genFail: '生成失败',
  // Images
  star: '收藏', prompt: '提示词', download: '下载', delete: '删除',
  starFail: '收藏失败', promptInfo: '本图提示词', deleteInfo: '请先取消收藏再删除',
  siteIntro: (lang: string) => (
    <span>
      这里是赛博画师小叶子<br />
      请输入<span className='images-intro-lang'>{lang}</span>提示词并点击生成<br />
      本站开源于 <a href='https://github.com/LeafYeeXYZ/PainterLeaf' target='_blank'>GitHub ↗</a>
    </span>
  ),
  // Prompt
  submitInit: '生成', submitLoad: '生成中', generate: '生成图片',
  translateFalseTitle: '翻译失败', translateFalseMessage: '翻译失败, 请检查网络连接或尝试中文模式',
  noPrompt: '请输入提示词', noImage: '当前为图生图模式, 请选择图片', noModel: '请选择模型',
  unsupportedModel: '当前模型不支持当前模式', 
  sameImageError: '服务端返回相同的图片, 请修改提示词或换一个模型',
  noImageError: '服务端返回空白图片, 可能是服务器错误或提示词不当',
  unknownResStatusError: '服务端返回未知的响应类型, 状态码:',
  serverError: '服务端返回错误信息:',
  promptPlaceholder: '请描述你想生成的图像',
  modelTypes: {
    textToImage: '文生图',
    imageToImage: '图生图',
    both: '文生图/图生图',
  },
  modelLangs: {
    natural: '自然语言',
    sdPrompt: 'SD提示词',
  },
  // LangSwitcher
  zhPrompt: '中文提示词', enPrompt: '英文提示词',
  // ModeSwitcher
  textToImage: '文生图', imageToImage: '图生图',
  // ImageSelector
  chooseImage: '选择图片', imageTooBig: '图片过大', imageTooBigInfo: (size: number) => `请选择小于 ${size}MB 的图片`,
  // PromptGenerator
  initText: '用图片生成提示词', loadText: '生成提示词中',
  generatePrompt: '生成提示词', genPromptFail: '生成提示词失败:',
}

export const ZH_TW = {
  lang: 'zh-tw', title: '賽博畫師小葉子',
  // Dialog
  info: '提示', wait: '請等待${status.current}完成',
  error: '錯誤', confirm: '確認', genFail: '生成失敗',
  // Images
  star: '收藏', prompt: '提示詞', download: '下載', delete: '刪除',
  starFail: '收藏失敗', promptInfo: '本圖提示詞', deleteInfo: '請先取消收藏再刪除',
  siteIntro: (lang: string) => (
    <span>
      這裡是賽博畫師小葉子<br />
      請輸入<span className='images-intro-lang'>{lang}</span>提示詞並點擊生成<br />
      本站開源於 <a href='https://github.com/LeafYeeXYZ/PainterLeaf' target='_blank'>GitHub ↗</a>
    </span>
  ),
  // Prompt
  submitInit: '生成', submitLoad: '生成中', generate: '生成圖片',
  translateFalseTitle: '翻譯失敗', translateFalseMessage: '翻譯失敗, 請檢查網絡連接或嘗試中文模式',
  noPrompt: '請輸入提示詞', noImage: '當前為圖生圖模式, 請選擇圖片', noModel: '請選擇模型',
  unsupportedModel: '當前模型不支持當前模式',
  sameImageError: '服務端返回相同的圖片, 請修改提示詞或換一個模型',
  noImageError: '服務端返回空白圖片, 可能是服務器錯誤或提示詞不當',
  unknownResStatusError: '服務端返回未知的響應類型, 狀態碼:',
  serverError: '服務端返回錯誤信息:',
  promptPlaceholder: '請描述你想生成的圖像',
  modelTypes: {
    textToImage: '文生圖',
    imageToImage: '圖生圖',
    both: '文生圖/圖生圖',
  },
  modelLangs: {
    natural: '自然語言',
    sdPrompt: 'SD提示詞',
  },
  // LangSwitcher
  zhPrompt: '中文提示詞', enPrompt: '英文提示詞',
  // ModeSwitcher
  textToImage: '文生圖', imageToImage: '圖生圖',
  // ImageSelector
  chooseImage: '選擇圖片', imageTooBig: '圖片過大', imageTooBigInfo: (size: number) => `請選擇小於 ${size}MB 的圖片`,
  // PromptGenerator
  initText: '用圖片生成提示詞', loadText: '生成提示詞中', 
  generatePrompt: '生成提示詞', genPromptFail: '生成提示詞失敗:',
}

export const EN = {
  lang: 'en', title: 'Painter Leaf',
  // Dialog
  info: 'Note', wait: 'Please wait for ${status.current} to complete',
  error: 'Error', confirm: 'OK', genFail: 'Generation Failed',
  // Images
  star: 'Star', prompt: 'Prompt', download: 'Download', delete: 'Delete',
  starFail: 'Failed to Star', promptInfo: 'Prompt of This Image', deleteInfo: 'Please unstar before deleting',
  siteIntro: (lang: string) => (
    <span>
      Painter Leaf Here!<br />
      Enter your <span className='images-intro-lang'>{lang}</span> prompt and click Generate<br />
      This site is open source on <a href='https://github.com/LeafYeeXYZ/PainterLeaf' target='_blank'>GitHub ↗</a>
    </span>
  ),
  // Prompt
  submitInit: 'Generate', submitLoad: 'Generating', generate: 'Generate Image',
  translateFalseTitle: 'Translation Failed', translateFalseMessage: 'Translation failed, please check your network connection or try Chinese prompt mode',
  noPrompt: 'Please enter your prompt', noImage: 'Image-to-image mode on, please select an image', noModel: 'Please select a model',
  unsupportedModel: 'The current model does not support the current mode',
  sameImageError: 'The server returned the same image, please modify the prompt or switch to another model',
  noImageError: 'The server returned a blank image, probably due to server error or improper prompt',
  unknownResStatusError: 'The server returned an unknown response type, status code:',
  serverError: 'The server returned an error message:',
  promptPlaceholder: 'Describe the image you want to generate here',
  modelTypes: {
    textToImage: 'Text2Img',
    imageToImage: 'Img2Img',
    both: 'Text2Img/Img2Img',
  },
  modelLangs: {
    natural: 'Natural Language',
    sdPrompt: 'SD Prompt',
  },
  // LangSwitcher
  zhPrompt: 'ChinesePrompt', enPrompt: 'EnglishPrompt',
  // ModeSwitcher
  textToImage: 'Text2Img', imageToImage: 'Img2Img',
  // ImageSelector
  chooseImage: 'ChooseImage', imageTooBig: 'Image Too Big', imageTooBigInfo: (size: number) => `Please select an image smaller than ${size}MB`,
  // PromptGenerator
  initText: 'GenPromptFromImg', loadText: 'GeneratingPrompt', 
  generatePrompt: 'Generate Prompt', genPromptFail: 'Failed to Generate Prompt:',
}

export const LangContext = createContext(EN)