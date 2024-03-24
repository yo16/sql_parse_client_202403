import { useState } from "react";
import "./DisplayCtrlPanel.css";

const DisplayCtrlPanel = ({
    initialCheckedDispTableConns,
    initialCheckedDispColumnConns,
    onCheckDisplayTableConns = f => f,
    onCheckDisplayColumnConns = f => f,
}) => {
    const [checkedTableConns, setCheckedTableConns] = useState(initialCheckedDispTableConns);
    const [checkedColumnConns, setCheckedColumnConns] = useState(initialCheckedDispColumnConns);

    const handleCheckedShowTableConns = e => {
        onCheckDisplayTableConns(e.target.checked);
        setCheckedTableConns(e.target.checked);
    };
    const handleCheckedShowColumnConns = e => {
        onCheckDisplayColumnConns(e.target.checked);
        setCheckedColumnConns(e.target.checked);
    };

    return (
        <div
            className="display-ctrl-panel-contents"
        >
            <div>
                <input
                    type="checkbox"
                    id="cbShowTableConns"
                    defaultChecked={checkedTableConns}
                    onClick={e => handleCheckedShowTableConns(e)}
                />
                <label
                    htmlFor="cbShowTableConns"
                    className="lblCbFor"
                >Show Table Conns.</label>
            </div>
            <div>
                <input
                    type="checkbox"
                    id="cbShowColumnConns"
                    defaultChecked={checkedColumnConns}
                    onClick={e => handleCheckedShowColumnConns(e)}
                />
                <label
                    htmlFor="cbShowColumnConns"
                    className="lblCbFor"
                >Show Column Conns.</label>
            </div>
        </div>
    );
};

export default DisplayCtrlPanel;
