/*
LineageCanvas
*/
import { v4 } from "uuid";
import { useState, useMemo } from "react";

import "./LineageCanvas.css";

const CANVAS_PADDING = 20;
const PILLER_GAP = 100;
const TABLE_WIDTH = 200;
const TABLE_GAP = 20;


const TABLE_CORNER_R = 10;
const TABLE_BORDER_WIDTH = 3;
const TABLE_BORDER_COLOR = "#9bacab";
const TABLE_BORDER_COLOR_SELECTED = "#FF6201";
const TABLE_HEADER_BGCOLOR = "#2a2d57";
const TABLE_HEADER_TEXT_X = 12;
const TABLE_HEADER_TEXT_Y = 25;
const TABLE_HEADER_FONTSIZE = 20;
const TABLE_HEADER_TEXTCOLOR = "#e8e8e8";
const TABLE_COLUMN_ODD_BGCOLOR = "#d1ccab";
const TABLE_COLUMN_EVEN_BGCOLOR = "#dddbcf";
const TABLE_COLUMN_TEXT_X = 18;
const TABLE_COLUMN_TEXT_Y = 21;
const TABLE_COLUMN_FONTSIZE = 18;
const TABLE_COLUMN_TEXTCOLOR = "#333333"
const TABLE_HEADER_HEIGHT = 35;
const TABLE_COLUMN_HEIGHT = 30;

const TBL_CONNECTION_COLOR = "#cc9231";
const TBL_CONNECTION_WIDTH = 3;
const TBL_CONNECTION_ENBEDDED = 0;
const TBL_CONNECTION_END_DOT_R = 5;
const COL_CONNECTION_COLOR = "#edc277";
const COL_CONNECTION_END_COLOR = "#ccab73";
const COL_CONNECTION_WIDTH = 2;
const COL_CONNECTION_END_DOT_R = 4;

const SVG_MIN_WIDTH = 800;
const SVG_MIN_HEIGHT = 500;

let maxDepth = 0;
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

    const {tablePillers, mapTablePos} = useMemo(() => {
        if (statements.length===0) {
            return {
                tablePillers: [],
                mapTablePos: {},
            };
        }

        // x位置を決めるためにmaxDepthを取得
        maxDepth = statements.reduce((curMax, stmt) => {
            return (curMax < stmt.depth)? stmt.depth: curMax;
        }, -1);

        // 同じdepthごとにまとめる
        const tablePillers = [...new Array(maxDepth+1)].map(() => []);
        statements.forEach((s, i) => {
            tablePillers[s.depth].push(s);
        });

        // rectの位置を決める ※connの接続点の位置は、(posX±CONNECTION_ENBEDDED, posY+height/2)
        // テーブル(statement)のposLeftX, posRightX, posY
        const maxX = (maxDepth + 1) * TABLE_WIDTH + maxDepth * PILLER_GAP + CANVAS_PADDING * 2;
        let maxY = 0;
        tablePillers.forEach(stmts => {
            // x位置は、depthで決まる
            stmts.forEach(stmt => {
                stmt.posLeftX = CANVAS_PADDING
                    + (maxDepth - stmt.depth) * TABLE_WIDTH
                    + (maxDepth - stmt.depth) * PILLER_GAP;
                stmt.posRightX = stmt.posLeftX + TABLE_WIDTH;
            });
            // y位置は、pillerの中の、自分より上の要素の高さの累計で決まる
            const finalBottom = stmts.reduce((upperBottom, stmt) => {
                // 自分より上の要素のbottomの位置が、自分のposY
                stmt.posY = upperBottom;

                // 自分のbottomの位置を計算して次に渡す
                const curBottom = upperBottom
                    + getTableRectHeight(stmt)
                    + TABLE_GAP;        // 下の隙間
                return curBottom;
            }, CANVAS_PADDING);

            if (maxY < finalBottom - TABLE_GAP + CANVAS_PADDING) {
                maxY = finalBottom - TABLE_GAP + CANVAS_PADDING;
            }
        });
        setSvgWidth(maxX);
        setSvgHeight(maxY);

        // 列のposLeftX, posRightX, posY
        statements.forEach(stmt => {
            // x位置は、stmtと同じ
            stmt.columns.forEach(col => {
                col.posLeftX = stmt.posLeftX;
                col.posRightX = stmt.posRightX;
            });
            // y位置は、stmtから累積計算
            stmt.columns.reduce((upperBottom, col) => {
                // 自分より上の要素のbottomの位置が、自分のposY
                col.posY = upperBottom;

                // 自分のbottomの位置を計算して次に渡す
                const curBottom = upperBottom + TABLE_COLUMN_HEIGHT;
                return curBottom;
            }, stmt.posY + TABLE_HEADER_HEIGHT);
        });

        // テーブル名、列名から、posLeftX, posRightX, posYを得られるobject
        const mapTablePos = statements.reduce((m1, stmt) => {
            return {
                ...m1,
                [stmt.tableName]: {
                    posLeftX: stmt.posLeftX,
                    posRightX: stmt.posRightX,
                    posY: stmt.posY,
                    columns: stmt.columns.reduce((m2, col) => {
                        return {
                            ...m2,
                            [col.columnName]: {
                                posLeftX: col.posLeftX,
                                posRightX: col.posRightX,
                                posY: col.posY,
                            }
                        }
                    }, {}),
                },
            };
        }, {});

        return {
            tablePillers,
            mapTablePos,
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateCounter]);

    // Table Connections
    const tableConnections = displayTableConns?
        (
            tableConns.map((tableConn, i) => 
                <TableConn
                    key={`tc_${i}`}
                    conn={tableConn}
                    posInfo={mapTablePos}
                />
            )
        ):
        null;

    // Column Connections
    const columnConnections = displayColumnConns?
        (
            colConns.map((colConn, i) => 
                <ColumnConn
                    key={`tc_${i}`}
                    conn={colConn}
                    posInfo={mapTablePos}
                />
            )
        ):
        null;


    return (
        <svg
            className="display-canvas"
            width={svgWidth}
            height={svgHeight}
        >
            {
                tablePillers.map((curStatements, i) => 
                    <TablePiller
                        key={`tp_${i}`}
                        statements={curStatements}
                    />
                )
            }
            {columnConnections}
            {tableConnections}
        </svg>
    );
};

const getTableRectHeight = stmt => {
    return TABLE_HEADER_HEIGHT
        + stmt.columns.length * TABLE_COLUMN_HEIGHT
    ;
};

const TablePiller = ({statements}) => {
    return (
        <>
        {(statements.length>0)&&
            <g
                transform={`translate(${statements[0].posLeftX}, 0)`}
            >
                {statements.map((s, i) => <TableRect key={`tbl_${i}`} statement={s} />)}
            </g>
        }
        </>
    )
}

const TableRect = ({statement}) => {
    const clipName = v4();
    return (
        <g
            transform={`translate(0, ${statement.posY})`}
        >
            <defs>
                <clipPath
                    id={clipName}
                >
                    <rect
                        x="0"
                        y="0"
                        width={TABLE_WIDTH}
                        height={getTableRectHeight(statement)}
                        rx={TABLE_CORNER_R}
                        ry={TABLE_CORNER_R}
                        
                    />
                </clipPath>
            </defs>
            {/* 背景 */}
            <rect
                x="0"
                y="0"
                width={TABLE_WIDTH}
                height={getTableRectHeight(statement)}
                clipPath={`url(#${clipName})`}
            />
            <rect
                x="0"
                y="0"
                width={TABLE_WIDTH}
                height={TABLE_HEADER_HEIGHT}
                fill={TABLE_HEADER_BGCOLOR}
                clipPath={`url(#${clipName})`}
            />
            {statement.columns.map((_, i) =>
                <rect
                    key={`rct_${v4()}`}
                    x="0"
                    y={TABLE_HEADER_HEIGHT + i * TABLE_COLUMN_HEIGHT}
                    width={TABLE_WIDTH}
                    height={TABLE_COLUMN_HEIGHT}
                    fill={(i % 2 === 0) ? TABLE_COLUMN_EVEN_BGCOLOR: TABLE_COLUMN_ODD_BGCOLOR}
                    clipPath={`url(#${clipName})`}
                />
            )}
            {/* 枠 */}
            <rect
                x="0"
                y="0"
                width={TABLE_WIDTH}
                height={getTableRectHeight(statement)}
                fill="none"
                strokeWidth={TABLE_BORDER_WIDTH}
                stroke={TABLE_BORDER_COLOR}
                rx={TABLE_CORNER_R}
                ry={TABLE_CORNER_R}
            />

            {/* テーブル名 */}
            <text
                x={TABLE_HEADER_TEXT_X}
                y={TABLE_HEADER_TEXT_Y}
                fontSize={TABLE_HEADER_FONTSIZE}
                fill={TABLE_HEADER_TEXTCOLOR}
            >{statement.tableName}</text>

            {/* 列名 */}
            {statement.columns.map((c, i) =>
                <text
                    key={`txt_colname_${v4()}`}
                    x={TABLE_COLUMN_TEXT_X}
                    y={TABLE_HEADER_HEIGHT + i * TABLE_COLUMN_HEIGHT + TABLE_COLUMN_TEXT_Y}
                    fontSize={TABLE_COLUMN_FONTSIZE}
                    fill={TABLE_COLUMN_TEXTCOLOR}
                >{c.columnName}</text>
            )}

        </g>
    );
};

const TableConn = ({conn, posInfo}) => {
    const fromPos = {
        x: posInfo[conn.fromTableName].posRightX - TBL_CONNECTION_ENBEDDED,
        y: posInfo[conn.fromTableName].posY + TABLE_HEADER_HEIGHT / 2,
    };
    const toPos = {
        x: posInfo[conn.toTableName].posLeftX + TBL_CONNECTION_ENBEDDED,
        y: posInfo[conn.toTableName].posY + TABLE_HEADER_HEIGHT / 2,
    };
    // M 始点 Q 1点目の制御点, 中間点 T 終点
    const pathStr = 
        `M ${fromPos.x} ${fromPos.y} ` +
        `Q ${(fromPos.x + toPos.x) / 2} ${fromPos.y}, ` +
        `${(fromPos.x + toPos.x) / 2} ${(fromPos.y + toPos.y) / 2} ` +
        `T ${toPos.x} ${toPos.y}`;

    return (
        <g>
            <path
                d={pathStr}
                fill="none"
                stroke={TBL_CONNECTION_COLOR}
                strokeWidth={TBL_CONNECTION_WIDTH}
            />
            <circle
                cx={fromPos.x}
                cy={fromPos.y}
                r={TBL_CONNECTION_END_DOT_R}
                fill={TBL_CONNECTION_COLOR}
                stroke="none"
            />
            <circle
                cx={toPos.x}
                cy={toPos.y}
                r={TBL_CONNECTION_END_DOT_R}
                fill={TBL_CONNECTION_COLOR}
                stroke="none"
            />
        </g>
    );
};

const ColumnConn = ({conn, posInfo}) => {
    // クエリの不正等で見つからない時があるので、その場合は空を返す
    if (
        (!Object.prototype.hasOwnProperty.call(
            posInfo,
            conn.fromTableName
        )) ||
        (!Object.prototype.hasOwnProperty.call(
            posInfo[conn.fromTableName].columns,
            conn.fromColumnName
        )) ||
        (!Object.prototype.hasOwnProperty.call(
            posInfo,
            conn.toTableName
        )) ||
        (!Object.prototype.hasOwnProperty.call(
            posInfo[conn.toTableName].columns,
            conn.toColumnName
        ))
    ) {
        return (<></>);
    }

    const fromPos = {
        x: posInfo[conn.fromTableName].columns[conn.fromColumnName].posRightX - TBL_CONNECTION_ENBEDDED,
        y: posInfo[conn.fromTableName].columns[conn.fromColumnName].posY + TABLE_HEADER_HEIGHT / 2,
    };

    const toPos = {
        x: posInfo[conn.toTableName].columns[conn.toColumnName].posLeftX - TBL_CONNECTION_ENBEDDED,
        y: posInfo[conn.toTableName].columns[conn.toColumnName].posY + TABLE_HEADER_HEIGHT / 2,
    };

    // M 始点 Q 1点目の制御点, 中間点 T 終点
    const pathStr = 
        `M ${fromPos.x} ${fromPos.y} ` +
        `Q ${(fromPos.x * 2 + toPos.x) / 3} ${fromPos.y}, ` +
        `${(fromPos.x + toPos.x) / 2} ${(fromPos.y + toPos.y) / 2} ` +
        `T ${toPos.x} ${toPos.y}`;

    return (
        <g>
            <path
                d={pathStr}
                fill="none"
                stroke={COL_CONNECTION_COLOR}
                strokeWidth={COL_CONNECTION_WIDTH}
            />
            <circle
                cx={fromPos.x}
                cy={fromPos.y}
                r={COL_CONNECTION_END_DOT_R}
                fill={COL_CONNECTION_END_COLOR}
                stroke="none"
            />
            <circle
                cx={toPos.x}
                cy={toPos.y}
                r={COL_CONNECTION_END_DOT_R}
                fill={COL_CONNECTION_END_COLOR}
                stroke="none"
            />
        </g>
    );
};


export default LineageCanvas;
