// TablePillerの位置やサイズを返す
// 位置は、引数のoffsetX, offsetYを利用した位置(x, y)を返す

import {
    TABLE_WIDTH,
    TABLE_GAP,
} from "./svgConstants";
import { calcTable } from "./calcTable";

function calcTablePiller({
    tablesStatement,
    absX,   // svg要素に対する相対位置
    absY,
    relX,   // Pillersに対する相対位置
    relY,
}) {
    const width = TABLE_WIDTH;

    // 各テーブルを計算
    const tablesDispObj = [];
    let tableRelOffsetY = 0;
    tablesStatement.forEach((tableStmt, i) => {
        // １つのテーブルを計算
        const dispObj = calcTable({
            tableStatement: tableStmt,
            absX,
            absY: absY + tableRelOffsetY,
            relX: 0,
            relY: tableRelOffsetY,
        });

        // 配列へ加える
        tablesDispObj.push(dispObj);

        // tableRelOffsetYを更新
        // カレントテーブルと下の隙間分を加える
        tableRelOffsetY += dispObj.height + TABLE_GAP;
    });
    // 最後の分を除く
    tableRelOffsetY -= TABLE_GAP;

    return {
        absX,
        absY,
        relX,
        relY,
        width,
        height: tableRelOffsetY,
        tables: tablesDispObj,
    }
}

export {
    calcTablePiller,
};
