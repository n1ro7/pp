import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/**
 * 导出持仓数据为Excel
 * @param {Array} currentData - 当前持仓数据
 * @param {Array} historyData - 历史持仓数据
 * @param {string} timeRange - 时间范围（7days/30days）
 */
export const exportAssetExcel = (currentData, historyData, timeRange) => {
  try {
    // 1. 创建工作簿
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet([]), '持仓数据汇总'); // 空sheet占位（可选）

    // 2. 处理当前持仓sheet
    const formattedCurrent = currentData.map((item) => ({
      币种: item.assetType,
      占比: `${(item.rate || 0).toFixed(2)}%`,
      '金额(万美元)': (item.amount || 0).toFixed(2),
      最后更新时间: item.updateTime ? new Date(item.updateTime).toLocaleString() : '无',
    }));
    const currentSheet = XLSX.utils.json_to_sheet(formattedCurrent);
    XLSX.utils.book_append_sheet(workbook, currentSheet, '当前持仓');

    // 3. 处理历史持仓sheet
    const formattedHistory = historyData.map((day) => {
      const row = { 日期: day.date };
      day.assets.forEach((asset) => {
        row[`${asset.assetType}_占比`] = `${(asset.rate || 0).toFixed(2)}%`;
        row[`${asset.assetType}_金额(万美元)`] = (asset.amount || 0).toFixed(2);
      });
      return row;
    });
    const historySheet = XLSX.utils.json_to_sheet(formattedHistory);
    XLSX.utils.book_append_sheet(
      workbook,
      historySheet,
      `${timeRange === '7days' ? '近7日' : '近30日'}历史持仓`
    );

    // 4. 生成Excel文件并下载
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const fileName = `数字货币持仓数据_${new Date().toLocaleDateString()}.xlsx`;
    saveAs(blob, fileName);

    return true; // 导出成功
  } catch (error) {
    console.error('Excel导出失败:', error);
    return false; // 导出失败
  }
};