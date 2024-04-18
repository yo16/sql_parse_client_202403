import {
    TBL_CONNECTION_ENBEDDED,
    TABLE_HEADER_HEIGHT,
    COL_CONNECTION_COLOR,
    COL_CONNECTION_WIDTH,
    COL_CONNECTION_END_DOT_R,
    COL_CONNECTION_END_COLOR,
} from "./svgConstants";

const ColumnConn = ({
    conn,
    posInfo,
}) => {
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

export default ColumnConn;
