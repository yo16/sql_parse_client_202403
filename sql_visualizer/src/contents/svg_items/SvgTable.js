import { v4 } from "uuid";

import {
    TABLE_CORNER_R,
    TABLE_BORDER_WIDTH,
    TABLE_BORDER_COLOR,
} from "../svg_utils/svgConstants";
import SvgColumn from "./SvgColumn";

const SvgTable = ({
    tableDispObj,
    onClick=f=>f,
}) => {
    const clipName = `tableClip_${v4()}`;

    const handleOnClickTable = () => {
        onClick(tableDispObj.tableTitle.name, null);
    }
    const handleOnClickColumn = (columnName) => {
        onClick(tableDispObj.tableTitle.name, columnName);
    };

    return (
        <>
            <g
                transform={`translate(${tableDispObj.relX}, ${tableDispObj.relY})`}
            >
                <defs>
                    <clipPath
                        id={clipName}
                    >
                        <rect
                            x={tableDispObj.relX}
                            y={tableDispObj.relX}
                            width={tableDispObj.width}
                            height={tableDispObj.height}
                            rx={TABLE_CORNER_R}
                            ry={TABLE_CORNER_R}
                        />
                    </clipPath>
                </defs>
                <g
                    clipPath={`url(#${clipName})`}
                >
                    {
                        // 背景
                    }
                    <rect
                        x={tableDispObj.relX}
                        y={tableDispObj.relY}
                        width={tableDispObj.width}
                        height={tableDispObj.height}
                    />
                    {
                        // テーブル名
                    }
                    <SvgColumn
                        columnDispObj={tableDispObj.tableTitle}
                        isTableTitle={true}
                        onClick={()=>handleOnClickTable()}
                    />
                    {
                        // 列
                    }
                    {tableDispObj.columns.map((tblCol, i) => 
                        <SvgColumn
                            key={`col_${i}`}
                            columnDispObj={tblCol}
                            isTableTitle={false}
                            isEven={i%2===0}
                            onClick={()=>handleOnClickColumn(tblCol.name)}
                        />
                    )}
                    {
                        // テーブルの枠
                    }
                    <rect
                        x={tableDispObj.relX}
                        y={tableDispObj.relY}
                        width={tableDispObj.width}
                        height={tableDispObj.height}
                        fill="none"
                        strokeWidth={TABLE_BORDER_WIDTH}
                        stroke={TABLE_BORDER_COLOR}
                        rx={TABLE_CORNER_R}
                        ry={TABLE_CORNER_R}
                    />
                </g>
            </g>
        </>
    );
};

export default SvgTable;
