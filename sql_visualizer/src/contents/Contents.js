import { useState } from "react";
import DisplayArea from "./DisplayArea";
import DisplayCtrlPanel from "./DisplayCtrlPanel";

import "./Contents.css";

const SERVER_URL = process.env.SERVER_URL || "http://localhost:3001/sql";

const Contents = () => {
    const [stmts, setStmts] = useState([]);

    const handleOnChangedQuery = (query) => {
        console.log("changed query");
        console.log(query);

        const reqOptions = {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                query,
            })
        }

        fetch(SERVER_URL, reqOptions)
            .then((res) => res.json())
            .then((json) => {
                console.log(json);
                setStmts(json.statements);
            })
            .catch((e) => console.error(e.message))
        ;
    }

    return (
        <div className="contents-items">
            <DisplayArea
                onChangedQuery={handleOnChangedQuery}
                statements={stmts}
            />
            <DisplayCtrlPanel />
        </div>
    );
};

export default Contents;
