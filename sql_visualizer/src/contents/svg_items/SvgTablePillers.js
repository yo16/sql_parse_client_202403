import SvgTablePiller from "./SvgTablePiller";

const SvgTablePillers = ({tablePillersDispObj}) => {
    // 空オブジェクトの場合は何も返さない
    if (!tablePillersDispObj || (Object.keys(tablePillersDispObj).length === 0)) {
        return (<></>);
    }

    return (
        <>
            {tablePillersDispObj.tablePillers.map((tp, i) => 
                <SvgTablePiller
                    key={`svgTablePiller_${i}`}
                    tablePillerDispObj={tp}
                />
            )}
        </>
    );
};

export default SvgTablePillers;
