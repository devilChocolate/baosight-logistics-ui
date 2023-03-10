/*
 * excel导出
 *
 * @Author: 谢力
 * @Date:   2018-06-06 14:08:51
 * @Last Modified by:   谢力
 * @Last Modified time: 2018-06-06 14:08:56
 */
import FileSaver from "file-saver";
import * as XLSX from "xlsx"
import { isNumber, trim } from "./tool";

let generateArray = (table) => {
  let out = [],
    rows = table.querySelectorAll("tr"),
    ranges = [];
  for (let R = 0; R < rows.length; ++R) {
    let outRow = [],
      row = rows[R],
      columns = row.querySelectorAll("td");
    for (let C = 0; C < columns.length; ++C) {
      var cell = columns[C],
        colspan = cell.getAttribute("colspan"),
        rowspan = cell.getAttribute("rowspan"),
        cellValue = cell.innerText;
      if (cellValue !== "" && cellValue == +cellValue) {
        cellValue = +cellValue;
      }
      //Skip ranges
      ranges.forEach((range) => {
        if (
          R >= range.s.r &&
          R <= range.e.r &&
          outRow.length >= range.s.c &&
          outRow.length <= range.e.c
        ) {
          for (let i = 0; i <= range.e.c - range.s.c; ++i) {
            outRow.push(null);
          }
        }
      });
      //Handle Row Span
      if (rowspan || colspan) {
        rowspan = rowspan || 1;
        colspan = colspan || 1;
        ranges.push({
          s: {
            r: R,
            c: outRow.length,
          },
          e: {
            r: R + rowspan - 1,
            c: outRow.length + colspan - 1,
          },
        });
      }
      //Handle Value
      outRow.push(cellValue !== "" ? cellValue : null);
      //Handle Colspan
      if (colspan) {
        for (let k = 0; k < colspan - 1; ++k) {
          outRow.push(null);
        }
      }
    }
    out.push(outRow);
  }
  return [out, ranges];
};

let datenum = (v, date1904) => {
  if (date1904) {
    v += 1462;
  }
  let epoch = Date.parse(v);
  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
};

function Workbook() {
  if (!(this instanceof Workbook)) {
    return new Workbook();
  }
  this.SheetNames = [];
  this.Sheets = {};
}

let s2ab = (s) => {
  let buf = new ArrayBuffer(s.length),
    view = new Uint8Array(buf);
  for (let i = 0; i != s.length; ++i) {
    view[i] = s.charCodeAt(i) & 0xff;
  }
  return buf;
};

let sheet_from_array_of_arrays = (data) => {
  let ws = {},
    range = {
      s: {
        c: 10000000,
        r: 10000000,
      },
      e: {
        c: 0,
        r: 0,
      },
    };
  for (let R = 0; R != data.length; ++R) {
    for (let C = 0; C != data[R].length; ++C) {
      if (range.s.r > R) {
        range.s.r = R;
      }
      if (range.s.c > C) {
        range.s.c = C;
      }
      if (range.e.r < R) {
        range.e.r = R;
      }
      if (range.e.c < C) {
        range.e.c = C;
      }
      let cell = {
        v: data[R][C],
      };
      if (cell.v == null) {
        continue;
      }
      cell.v = `\t${cell.v.toString()}`;
      let cell_ref = XLSX.utils.encode_cell({
        c: C,
        r: R,
      });
      if (typeof cell.v === "number") {
        cell.t = "n";
      } else if (typeof cell.v === "boolean") {
        cell.t = "b";
      } else if (cell.v instanceof Date) {
        cell.t = "n";
        cell.z = XLSX.SSF._table[14];
        cell.v = datenum(cell.v);
      } else {
        cell.t = "s";
      }
      cell.v = trim(cell.v);
      if (isNumber(cell.v.replace(/,+/g, ""))) {
        cell.t = "n";
      }
      ws[cell_ref] = cell;
    }
  }
  if (range.s.c < 10000000) {
    ws["!ref"] = XLSX.utils.encode_range(range);
  }
  return ws;
};

let saveExcelAs = (wb, filename, bookType) => {
  let wbout = XLSX.write(wb, {
      bookType: bookType,
      bookSST: false,
      type: "binary",
    }),
    blob = new Blob([s2ab(wbout)], {
      type: "application/octet-stream",
    });
  FileSaver.saveAs(blob, `${filename}.${bookType}`);
};

export const export_table_to_excel = ({
  table,
  filename,
  bookType = "xlsx",
} = {}) => {
  let oo = generateArray(table),
    ranges = oo[1],
    data = oo[0],
    ws_name = "SheetJS",
    wb = new Workbook(),
    ws = sheet_from_array_of_arrays(data);
  /* add ranges to worksheet */
  // ws['!cols'] = ['apple', 'banan'];
  ws["!merges"] = ranges;
  /* add worksheet to Workbook */
  wb.SheetNames.push(ws_name);
  wb.Sheets[ws_name] = ws;
  saveExcelAs(wb, filename, bookType);
};

export const export_json_to_excel = ({
  multiHeader = [],
  header,
  data,
  filename,
  merges = [],
  autoWidth = true,
  bookType = "xlsx",
} = {}) => {
  filename = filename || "excel-list";
  data = [...data];
  data.unshift(header);
  for (let i = multiHeader.length - 1; i > -1; i--) {
    data.unshift(multiHeader[i]);
  }
  let ws_name = "SheetJS",
    wb = new Workbook(),
    ws = sheet_from_array_of_arrays(data);
  if (merges.length) {
    ws["!merges"] = ws["!merges"] || [];
    merges.forEach((item) => {
      ws["!merges"].push(XLSX.utils.decode_range(item));
    });
  }
  if (autoWidth) {
    /*设置worksheet每列的最大宽度*/
    const colWidth = data.map((row) =>
      row.map((val) => {
        if (val == null) {
          /*先判断是否为null/undefined*/
          return {
            wch: 10,
          };
        } else if (val.toString().charCodeAt(0) > 255) {
          /*再判断是否为中文*/
          return {
            wch: val.toString().length * 2 + 1,
          };
        } else {
          return {
            wch: val.toString().length + 1,
          };
        }
      })
    );
    /*以第一行为初始值*/
    let result = colWidth[0];
    for (let i = 1; i < colWidth.length; i++) {
      for (let j = 0; j < colWidth[i].length; j++) {
        if (result[j].wch < colWidth[i][j].wch) {
          result[j].wch = colWidth[i][j].wch;
        }
      }
    }
    ws["!cols"] = result;
  }
  /* add worksheet to Workbook */
  wb.SheetNames.push(ws_name);
  wb.Sheets[ws_name] = ws;
  saveExcelAs(wb, filename, bookType);
};
