
import SvgColumnConn from "./SvgColumnConn";

const SvgColumnConns = ({
    columnConnsInfo,
    mapTablePos,
}) => {
    return (
        columnConnsInfo.map((colConn, i) => 
            <SvgColumnConn
                key={`tc_${i}`}
                conn={colConn}
                posInfo={mapTablePos}
            />
        )
    )
};

export default SvgColumnConns;
