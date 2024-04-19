// TablePillerとそれ以下を描画するために必要なサイズ等を計算する

import {
    TABLE_WIDTH,
    PILLER_GAP,
} from "./svgConstants";
import { calcTablePiller } from "./calcTablePiller";

// TablePillersを描画するために必要な情報をオブジェクトにして返す
/*
TablePillers: {
    absX,   // svg要素に対する相対位置
    absY,
    relX,   // svg要素に対する相対位置
    relY,
    width,
    height,
    tablePillers: [
        TablePiller
    ],
}

TablePiller: {
    absX,   // svg要素に対する相対位置
    absY,
    relX,   // Pillersに対する相対位置
    relY,
    width,
    height,
    tables: [
        Table
    ],
}

Table: {
    absX,   // svg要素に対する相対位置
    absY,
    relX,   // Pillerに対する相対位置
    relY,
    width,
    height,
    columns: [
        Column
    ],
    tableTitle: Column
}

Column: {
    absX,   // svg要素に対する相対位置
    absY,
    relX,   // Tableに対する相対位置
    relY,
    width,
    height,
    leftPoint: {
        x,
        y,
    },
    rightPoint: {
        x,
        y,
    },
    name,
}

*/
function calcTablePillers(
    statements,
    offsetX,
    offsetY,
) {
    const absX = offsetX;
    const absY = offsetY;
    const relX = absX;
    const relY = absY;

    // x位置を決めるために、全体のmaxDepthを取得
    // 単純に、最大のdepth
    const maxDepth = statements.reduce((curMax, stmt) => {
        return (curMax < stmt.depth)? stmt.depth: curMax;
    }, -1);

    // 同じdepthごとにまとめる
    // tablePillersのインデックス=0: depth=0で一番浅い表層的なSQL
    const tablePillersInfo = [...new Array(maxDepth+1)].map(() => []);
    statements.forEach((tbl) => {
        tablePillersInfo[tbl.depth].push(tbl);
    });

    // 各TablePiller（とその中のTable）のサイズを計算
    const tablePillersDispObj = tablePillersInfo.map((tp, pillersIndex) => {
        // PILLER_GAPは、各Pillerの右端
        const relX = (maxDepth - pillersIndex) * (TABLE_WIDTH + PILLER_GAP);
        const relY = 0;

        return calcTablePiller({
            tablesStatement: tp,
            absX: offsetX + relX,
            absY: offsetY + relY,
            relX,
            relY,
        });
    });

    // 幅はすべてのPillerの合計、高さは最大値
    const width = tablePillersDispObj[0].width * tablePillersDispObj.length
        + PILLER_GAP * (tablePillersDispObj.length - 1);
    const height = tablePillersDispObj.reduce((maxHeight, tp) => 
        (maxHeight < tp.height)? tp.height: maxHeight
    , 0);

    return {
        absX,
        absY,
        relX,
        relY,
        width,
        height,
        tablePillers: tablePillersDispObj,
    };
}

export {
    calcTablePillers
};
