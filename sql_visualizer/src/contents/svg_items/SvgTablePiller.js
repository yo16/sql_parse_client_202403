
import SvgTable from "./SvgTable";

const SvgTablePiller = ({
    tablePillerDispObj,
    onClick=f=>f,
}) => {
    const handleOnClickTable = (tableName, columnName) => {
        onClick(tableName, columnName);
    }
    return (
        <>
            <g
                transform={`translate(${tablePillerDispObj.absX}, ${tablePillerDispObj.absY})`}
            >
                {tablePillerDispObj.tables.map((tbl, i) => 
                    <SvgTable
                        key={`svgTbl_${i}`}
                        tableDispObj={tbl}
                        onClick={(tableName, columnName) => handleOnClickTable(tableName, columnName)}
                    />
                )}
            </g>
        </>
    );
};

export default SvgTablePiller;
