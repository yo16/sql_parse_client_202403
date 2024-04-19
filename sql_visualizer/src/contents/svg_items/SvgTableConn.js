
import {
    TBL_CONNECTION_ENBEDDED,
    TABLE_HEADER_HEIGHT,
    TBL_CONNECTION_COLOR,
    TBL_CONNECTION_WIDTH,
    TBL_CONNECTION_END_DOT_R,
} from "../svg_utils/svgConstants";


const SvgTableConn = ({
    conn,
    posInfo,
}) => {
    const fromObj = posInfo[conn.fromTableName];
    const toObj = posInfo[conn.toTableName];

    const fromPos = {
        x: fromObj.absX + fromObj.width - TBL_CONNECTION_ENBEDDED,
        y: fromObj.absY + TABLE_HEADER_HEIGHT / 2,
    };
    const toPos = {
        x: toObj.absX + TBL_CONNECTION_ENBEDDED,
        y: toObj.absY + TABLE_HEADER_HEIGHT / 2,
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

export default SvgTableConn;
