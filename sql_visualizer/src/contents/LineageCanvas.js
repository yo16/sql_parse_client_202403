/*
LineageCanvas
*/
import { useState, useMemo } from "react";

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
                        name: table.tableTitle.name,
                        columns: cols,
                    },
                }
            }, {});

            return {
                ...pillerTables,
                ...tables,
            };
        }, {});

        return {
            tablePillersDispObj,
            mapTablePos,
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateCounter]);

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
