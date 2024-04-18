
import ColumnConn from "./ColumnConn";

const ColumnConns = ({
    columnConnsInfo,
    mapTablePos,
}) => {
    return (
        columnConnsInfo.map((colConn, i) => 
            <ColumnConn
                key={`tc_${i}`}
                conn={colConn}
                posInfo={mapTablePos}
            />
        )
    )
};

export default ColumnConns;
