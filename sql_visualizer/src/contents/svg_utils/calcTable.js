// Tableの位置やサイズ、文字列が入ったオブジェクトを返す
// 位置は、引数のoffsetX, offsetYを利用した位置(x, y)を返す
import {
    TABLE_WIDTH,
} from "./svgConstants";
import { calcColumn } from "./calcColumn";

function calcTable({
    tableStatement,
    absX,   // svg要素に対する相対位置
    absY,
    relX,   // Pillerに対する相対位置
    relY,
}) {
    // テーブルタイトル
    const tableTitleDispObj = calcColumn({
        columnStatement: {columnName: tableStatement.tableName},
        absX,
        absY,
        relX: 0,
        relY: 0,
        isTableTitle: true,
    });

    // 各列を計算
    const columnsDispObj = [];
    let columnRelOffsetY = tableTitleDispObj.height;
    tableStatement.columns.forEach(columnStatement => {
        const dispObj = calcColumn({
            columnStatement,
            absX,
            absY: absY + columnRelOffsetY,
            relX: 0,
            relY: columnRelOffsetY,
        });

        // 配列へ加える
        columnsDispObj.push(dispObj);

        // offsetYを更新
        columnRelOffsetY += dispObj.height;
    });

    return {
        absX,
        absY,
        relX,
        relY,
        width: TABLE_WIDTH,
        height: columnRelOffsetY,
        columns: columnsDispObj,
        tableTitle: tableTitleDispObj,
    };
}

export {
    calcTable,
};
