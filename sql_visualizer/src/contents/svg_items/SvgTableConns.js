
import SvgTableConn from "./SvgTableConn";

const SvgTableConns = ({
    tableConnectionsInfo,
    mapTablePos,
}) => {
    const cons = tableConnectionsInfo.map((tableConn, i) => 
        <SvgTableConn
            key={`tc_${i}`}
            conn={tableConn}
            posInfo={mapTablePos}
        />
    );

    return (
        cons
    );
};

export default SvgTableConns;
