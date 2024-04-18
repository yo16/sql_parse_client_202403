
import TableConn from "./TableConn";

const TableConns = ({
    tableConnectionsInfo,
    mapTablePos,
}) => {
    const cons = tableConnectionsInfo.map((tableConn, i) => 
        <TableConn
            key={`tc_${i}`}
            conn={tableConn}
            posInfo={mapTablePos}
        />
    );

    return (
        cons
    );
};

export default TableConns;
