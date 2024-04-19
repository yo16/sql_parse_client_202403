// Columnの位置やサイズ、文字列が入ったオブジェクトを返す
// 位置は、引数のoffsetX,offsetYを利用した絶対位置（absX, absY）と、利用せず左上を(0,0)とする相対位置（relX, relY）を返す
import {
    TABLE_HEADER_HEIGHT,
    TABLE_COLUMN_HEIGHT,
    TABLE_WIDTH,
} from "./svgConstants";

function calcColumn({
    columnStatement,
    absX,   // svg要素に対する相対位置
    absY,
    relX,   // Tableに対する相対位置
    relY,
    isTableTitle = false
}) {
    //const x = offsetX;
    //const y = offsetY;
    const width = TABLE_WIDTH;
    const height = (isTableTitle)? TABLE_HEADER_HEIGHT: TABLE_COLUMN_HEIGHT;
    const halfHeight = height / 2;

    return {
        absX,
        absY,
        relX,
        relY,
        width,
        height,
        leftPoint: {
            absX,
            absY: absY + halfHeight,
            relX,
            relY: relY + halfHeight,
        },
        rightPoint: {
            absX: absX + width,
            absY: absY + halfHeight,
            relX: relX + width,
            relY: relY + halfHeight,
        },
        name: columnStatement.columnName,
    };
}

export {
    calcColumn,
};
