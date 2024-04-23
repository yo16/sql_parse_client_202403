/*
LineageCanvas
*/
import { useState, useMemo, useEffect } from "react";

import { calcTablePillers } from "./svg_utils/calcTablePillers";
import {
    CANVAS_PADDING,
    SVG_MIN_WIDTH,
    SVG_MIN_HEIGHT,
} from "./svg_utils/svgConstants";
import SvgTablePillers from "./svg_items/SvgTablePillers";
import SvgTableConns from "./svg_items/SvgTableConns";
import SvgColumnConns from "./svg_items/SvgColumnConns";

import "./LineageCanvas.css";

const LineageCanvas = ({
    statements,
    tableConns,
    colConns,
    updateCounter,
    displayTableConns,
    displayColumnConns,
}) => {
    const [svgWidth, setSvgWidth] = useState(SVG_MIN_WIDTH);
    const [svgHeight, setSvgHeight] = useState(SVG_MIN_HEIGHT);
    const [clickedTableColumn, setClickedTableColumn] = useState(null); // table名.column名, tableの時だけの場合は、table名.

    // tableObjを取得
    const {tablePillersDispObj, mapTablePos} = useMemo(() => {
        if (statements.length===0) {
            return {
                tablePillersDispObj: {},
                mapTablePos: {},
            };
        }
        
        const tablePillersDispObj = calcTablePillers(
            statements,
            CANVAS_PADDING,
            CANVAS_PADDING
        );
        setSvgWidth(tablePillersDispObj.width + CANVAS_PADDING * 2);
        setSvgHeight(tablePillersDispObj.height + CANVAS_PADDING * 2);

        // テーブル名、列名から、posLeftX, posRightX, posYを得られるobject
        // 計算したtablePillersDispObjの位置(svg要素からの位置)を、
        // テーブル名 or 列名から検索できるようにする
        const mapTablePos = tablePillersDispObj.tablePillers.reduce((pillerTables, tablePiller) => {
            const tables = tablePiller.tables.reduce((tableMap, table) => {
                const cols = table.columns.reduce((colMap, col) => ({
                    ...colMap,
                    [col.name]: col,
                }), {});
                
                return {
                    ...tableMap,
                    [table.tableTitle.name]: {
                        absX: table.absX,
                        absY: table.absY,
                        relX: table.relX,
                        relY: table.relY,
                        width: table.width,
                        height: table.height,
                        tableTitle: table.tableTitle,
                        columns: cols,
                    },
                }
            }, {});

            return {
                ...pillerTables,
                ...tables,
            };
        }, {});

        // clickedTable、clickedColumnがある場合はisClickedを立てる
        if (clickedTableColumn) {
            const tc = clickedTableColumn.split(".");
            if (tc[1].length === 0) {
                // テーブルの選択
                mapTablePos[tc[0]].tableTitle.isClicked = true;
            } else {
                // 列の選択
                mapTablePos[tc[0]].columns[tc[1]].isClicked = true;
            }
        }

        return {
            tablePillersDispObj,
            mapTablePos,
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateCounter, clickedTableColumn]);


    // テーブル名 or 列名のクリック
    const handleOnClickTablePillers = (tableName, columnName) => {
        const targetTableColumnStr = `${tableName}.${(columnName?columnName:"")}`;
        if (targetTableColumnStr === clickedTableColumn) {
            // 同じものをクリックした場合は解除
            setClickedTableColumn(null);
        } else {
            setClickedTableColumn(targetTableColumnStr);
        }
    }

    
    return (
        <svg
            className="display-canvas"
            width={svgWidth}
            height={svgHeight}
            id="svgLineage"
        >
            {
                // テーブル
                <SvgTablePillers
                    tablePillersDispObj={tablePillersDispObj}
                    onClick={(tableName, columnName) => handleOnClickTablePillers(tableName, columnName)}
                />
            }
            {
                // 列をつなぐ線
                displayColumnConns &&
                    <SvgColumnConns
                        columnConnsInfo={colConns}
                        mapTablePos={mapTablePos}
                    />
            }
            {
                // テーブルをつなぐ線
                // 列の線より手前に表示させたい意図がある
                displayTableConns &&
                    <SvgTableConns
                        tableConnectionsInfo={tableConns}
                        mapTablePos={mapTablePos}
                    />
            }
        </svg>
    );
};


export default LineageCanvas;
