import { useState } from "react";
import DisplayArea from "./DisplayArea";
import DisplayCtrlPanel from "./DisplayCtrlPanel";

import "./Contents.css";

const SERVER_URL = (process.env.NODE_ENV==="development") ?
    "http://localhost:3001/sql"
    : "https://express-sql-parser-202403.onrender.com/sql";

const Contents = () => {
    const [stmts, setStmts] = useState([]);
    const [tableConns, setTableConnsStmts] = useState([]);
    const [colConns, setColConns] = useState([]);
    const [updateCounter, setUpdateCounter] = useState(0);  // Queryが変わったときの下位モジュールのトリガーに使う

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
                setTableConnsStmts(json.tableConns);
                setColConns(json.colConns);
                setUpdateCounter(updateCounter+1);
            })
            .catch (e => {
                console.error("Fetch error.");
                console.error(e.message);
            })
        ;
    }

    return (
        <div className="contents-items">
            <DisplayArea
                onChangedQuery={handleOnChangedQuery}
                statements={stmts}
                tableConns={tableConns}
                colConns={colConns}
                updateCounter={updateCounter}
            />
            <DisplayCtrlPanel />
        </div>
    );
};

export default Contents;
