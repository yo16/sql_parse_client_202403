
import {
    TABLE_HEADER_BGCOLOR,
    TABLE_COLUMN_EVEN_BGCOLOR,
    TABLE_COLUMN_ODD_BGCOLOR,
    TABLE_HEADER_FONTSIZE,
    TABLE_HEADER_TEXTCOLOR,
    TABLE_COLUMN_FONTSIZE,
    TABLE_COLUMN_TEXTCOLOR,
    COLUMN_TEXT_OFFSET_HEADER_X,
    COLUMN_TEXT_OFFSET_HEADER_Y,
    COLUMN_TEXT_OFFSET_COLUMN_X,
    COLUMN_TEXT_OFFSET_COLUMN_Y,
} from "../svg_utils/svgConstants";

const SvgColumn = ({
    columnDispObj,
    clipPath,
    isTableTitle=false,
    isEven,
}) => {
    const fillColor = isTableTitle
        ? TABLE_HEADER_BGCOLOR
        : isEven
            ? TABLE_COLUMN_EVEN_BGCOLOR
            : TABLE_COLUMN_ODD_BGCOLOR
    ;

    const textX = columnDispObj.relX
        + (isTableTitle
            ? COLUMN_TEXT_OFFSET_HEADER_X
            : COLUMN_TEXT_OFFSET_COLUMN_X)
    ;
    const textY = columnDispObj.relY
        + (isTableTitle
            ? COLUMN_TEXT_OFFSET_HEADER_Y
            : COLUMN_TEXT_OFFSET_COLUMN_Y)
    ;
    const fontSize = isTableTitle
        ? TABLE_HEADER_FONTSIZE
        : TABLE_COLUMN_FONTSIZE
    ;
    const textFill = isTableTitle
        ? TABLE_HEADER_TEXTCOLOR
        : TABLE_COLUMN_TEXTCOLOR
    ;

    return (
        <>
            <rect
                x={columnDispObj.relX}
                y={columnDispObj.relY}
                width={columnDispObj.width}
                height={columnDispObj.height}
                fill={fillColor}
                clipPath={clipPath}
            />
            <text
                x={textX}
                y={textY}
                fontSize={fontSize}
                fill={textFill}
            >{columnDispObj.name}</text>
        </>
    );
};

export default SvgColumn;
