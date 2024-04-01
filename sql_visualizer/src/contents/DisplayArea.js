import { useState } from "react";
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

import "./DisplayArea.css";
import LineageCanvas from "./LineageCanvas";

const DisplayArea = ({
    onChangedQuery = f => f,
    statements,
    tableConns,
    colConns,
    updateCounter,
    displayTableConns,
    displayColumnConns,
}) => {
    const [showQueryInput, setShowQueryInput] = useState(false);
    const [queryText, setQueryText] = useState("");

    // クエリ入力欄の表示/非表示制御
    const handleShowQueryInput = (show) => {
        setShowQueryInput(show);

        // 表示時はフォーカスをあてる
        if (show) {
            setTimeout(()=>document.getElementById("areaQueryEntry").focus());
        }
    };

    // クエリ入力欄のOnChange
    const handleChangedQueryText = e => {
        setQueryText(e.target.value);
    }

    // クエリ入力欄の確定
    const handleOnQuerySubmit = () => {
        // 呼び出し元のonChangeQueryを実行して、fetch
        onChangedQuery(queryText);

        // クエリ入力欄は閉じる
        setShowQueryInput(false);
    };

    return (
        <>
            <div
                className="display-area"
            >
                {/*Drop SQL-File or */}<span className="cursor-pointer" onClick={()=>handleShowQueryInput(true)}><button>CLICK HERE</button></span> and Enter SQL Query!
                <TransformWrapper
                    minScale={0.5}
                >
                    <TransformComponent>
                        <LineageCanvas
                            statements={statements}
                            tableConns={tableConns}
                            colConns={colConns}
                            updateCounter={updateCounter}
                            displayTableConns={displayTableConns}
                            displayColumnConns={displayColumnConns}
                        />
                    </TransformComponent>
                </TransformWrapper>
            </div>
            <div
                className={`fixed top-0 left-0 w-full h-full flex items-center justify-center ${showQueryInput?"dark-overlay":"hidden"}`}
                onClick={()=>handleShowQueryInput(false)}
            >
                <div
                    className="query-input-area"
                    onClick={(e)=>e.stopPropagation()}
                >
                    <span>
                        Enter Query
                    </span>
                    <textarea
                        className="query-input-textarea"
                        onChange={handleChangedQueryText}
                        defaultValue={queryText}
                        id="areaQueryEntry"
                    >
                    </textarea>
                    <div
                        className="query-input-buttonarea"
                    >
                        <button
                            onClick={() => handleShowQueryInput(false)}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleOnQuerySubmit}
                        >
                            OK
                        </button>
                        </div>
                </div>
            </div>
        </>
    );
};

export default DisplayArea;
