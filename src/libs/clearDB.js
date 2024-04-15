import { clear } from "idb-keyval"

/**
 * 如果 IndexedDB 版本号
 * 小于目标版本号则清空 IndexedDB
 * @param {number} targetVersion 网页兼容日期
 * @returns {Promise<undefined | {type: string, title: string, content: string}>} 返回提示框信息
 */
export default async function clearDB(targetVersion) {
  // 获取当前版本号
  const thisVersion = Number(localStorage.getItem('dbVersion')) || 0
  // 如果当前版本号不同于目标版本号则清空 IndexedDB
  if (thisVersion !== targetVersion) {
    const dbStatu = localStorage.getItem('dbStatu')
    if (dbStatu === 'readyToClear') {
      await clear()
      localStorage.setItem('dbVersion', targetVersion)
      localStorage.setItem('dbStatu', 'cleared')
      return { type: 'open', title: '提示', content: '网站数据已更新，旧数据库已清空' }
    } else {
      localStorage.setItem('dbStatu', 'readyToClear')
      return { type: 'open', title: '提示', content: '网站数据需要更新, 请保存所有收藏的图片，并刷新网页; 所有数据将在下次刷新后清空' }
    }
  }
  return
}