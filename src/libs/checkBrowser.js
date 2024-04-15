export default function checkBrowser() {
  const ua = navigator.userAgent
  const chrome = ua.match(/Chrome\/(\d+)/)
  const firefox = ua.match(/Firefox\/(\d+)/)
  const edge = ua.match(/Edge\/(\d+)/)
  const safari = ua.match(/Safari\/(\d+)/)
  if (
    (chrome && Number(chrome[1]) < 108) ||
    (firefox && Number(firefox[1]) < 101) ||
    (edge && Number(edge[1]) < 108) ||
    (safari && Number(safari[1]) < 15.4)
  ) {
    alert(`
      您的浏览器版本过低，可能无法正常使用本应用
      建议使用最新版本的 Chrome / Edge / Firefox / Safari 浏览器
    `)
  }
}