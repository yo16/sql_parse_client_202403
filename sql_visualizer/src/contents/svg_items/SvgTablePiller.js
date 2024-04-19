
import SvgTable from "./SvgTable";

const SvgTablePiller = ({
    tablePillerDispObj
}) => {
    return (
        <>
            <g
                transform={`translate(${tablePillerDispObj.absX}, ${tablePillerDispObj.absY})`}
            >
                {tablePillerDispObj.tables.map((tbl, i) => 
                    <SvgTable
                        key={`svgTbl_${i}`}
                        tableDispObj={tbl}
                    />
                )}
            </g>
        </>
    );
};

export default SvgTablePiller;
