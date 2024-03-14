import DisplayArea from "./DisplayArea";
import DisplayCtrlPanel from "./DisplayCtrlPanel";

import "./Contents.css";

const Contents = () => {
    const handleOnChangedQuery = (query) => {
        console.log("changed query");
        console.log(query);
    }

    return (
        <div className="contents-items">
            <DisplayArea
                onChangedQuery={handleOnChangedQuery}
            />
            <DisplayCtrlPanel />
        </div>
    );
};

export default Contents;
