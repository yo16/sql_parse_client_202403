/*
LineageCanvas
*/
import { v4 } from "uuid";
import "./LineageCanvas.css";

const CANVAS_PADDING = 20;
const PILLER_GAP = 100;
const TABLE_WIDTH = 200;
const TABLE_GAP = 20;


let maxDepth = 0;
const LineageCanvas = ({statements}) => {
    // x位置を決めるためにmaxDepthを取得
    maxDepth = statements.reduce((curMax, stmt) => {
        return (curMax < stmt.depth)? stmt.depth: curMax;
    }, -1);

    // 同じdepthごとにまとめる
    const tablePillers = [...new Array(maxDepth+1)].map(() => []);
    statements.forEach((s, i) => {
        tablePillers[s.depth].push(s);
    });

    return (
        <svg
            className="display-canvas"
        >
            {
                tablePillers.map(curStatements => {
                    // x位置を決める
                    const tablePillerX = CANVAS_PADDING
                        + (maxDepth - curStatements[0].depth) * TABLE_WIDTH
                        + (maxDepth - curStatements[0].depth) * PILLER_GAP;

                    return (
                        <TablePiller statements={curStatements} posX={tablePillerX} />
                    );
                })
            }
            {
                
            }
        </svg>
    );
};

const getTableRectHeight = statement => {
    return TABLE_HEADER_HEIGHT + statement.columns.length * TABLE_COLUMN_HEIGHT;
};
const TablePiller = ({statements, posX}) => {
    // statementsのy位置を決める
    statements.reduce((upperBottom, stmt) => {
        stmt.posY = upperBottom;

        const curBottom = upperBottom + getTableRectHeight(stmt) + TABLE_GAP;
        return curBottom;
    }, CANVAS_PADDING);

    return (
        <g
            transform={`translate(${posX}, 0)`}
        >
            {statements.map((s, i) => <TableRect statement={s} />)}
        </g>
    )
}

const TABLE_CORNER_R = 10;
const TABLE_HEADER_BGCOLOR = "#2a2d57";
const TABLE_HEADER_TEXTCOLOR = "#e8e8e8";
const TABLE_COLUMN_ODD_BGCOLOR = "#d1ccab";
const TABLE_COLUMN_EVEN_BGCOLOR = "#dddbcf";
const TABLE_COLUMN_TEXTCOLOR = "#000"
const TABLE_HEADER_HEIGHT = 35;
const TABLE_COLUMN_HEIGHT = 30;

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
                    x="0"
                    y={TABLE_HEADER_HEIGHT + i * TABLE_COLUMN_HEIGHT}
                    width={TABLE_WIDTH}
                    height={TABLE_COLUMN_HEIGHT}
                    fill={(i % 2 === 0) ? TABLE_COLUMN_EVEN_BGCOLOR: TABLE_COLUMN_ODD_BGCOLOR}
                    clipPath={`url(#${clipName})`}
                />
            )}

            {/* タイトル */}
            <text
                x="12"
                y="25"
                fontSize="20"
                fill={TABLE_HEADER_TEXTCOLOR}
            >{statement.tableName}</text>

            {/* 列名 */}
            {statement.columns.map((c, i) =>
                <text
                    x="12"
                    y={TABLE_HEADER_HEIGHT + i * TABLE_COLUMN_HEIGHT + 22}
                    fontSize="18"
                    fill={TABLE_COLUMN_TEXTCOLOR}
                >{c.columnName}</text>
            )}

        </g>
    );
};

export default LineageCanvas;
