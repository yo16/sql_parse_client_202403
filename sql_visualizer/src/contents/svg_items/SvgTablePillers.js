import SvgTablePiller from "./SvgTablePiller";

const SvgTablePillers = ({
    tablePillersDispObj,
    onClick=f=>f,
}) => {
    // 空オブジェクトの場合は何も返さない
    if (!tablePillersDispObj || (Object.keys(tablePillersDispObj).length === 0)) {
        return (<></>);
    }
    const handleOnClickTablePiller = (tableName, columnName) => {
        onClick(tableName, columnName);
    }

    return (
        <>
            {tablePillersDispObj.tablePillers.map((tp, i) => 
                <SvgTablePiller
                    key={`svgTablePiller_${i}`}
                    tablePillerDispObj={tp}
                    onClick={(tableName, columnName) => handleOnClickTablePiller(tableName, columnName)}
                />
            )}
        </>
    );
};

export default SvgTablePillers;
