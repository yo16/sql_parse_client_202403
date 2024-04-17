import { useState } from "react";
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

import LineageCanvas from "./LineageCanvas";
import FileInputFormArea from "./FileInputFormArea";
import "./DisplayArea.css";

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

    // 入力欄に入力中のクエリ文字列
    // このqueryTextは、確定前の文字列も含むので、確定してからonChangedQueryを呼ぶ
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

    // クエリ入力欄の確定（OKボタン）
    const handleOnQuerySubmit = () => {
        // クエリ入力欄を閉じる
        setShowQueryInput(false);

        // クエリの確定
        confirmQuery(queryText);
    }

    // FileInputFormAreaで、ファイルドロップでクエリが登録されたとき
    const handleOnEnterInputFormQuery = (query) => {
        // 入力欄に入れる
        setQueryText(query);

        // クエリの確定
        confirmQuery(query);
    }

    // 今のqueryTextを使って、fetchすべく、確定する
    const confirmQuery = (query) => {
        // 呼び出し元のonChangeQueryを実行して、fetch
        onChangedQuery(query);
    };

    return (
        <>
            <div
                className="display-area"
            >
                <FileInputFormArea
                    onClickDisplayDialogButton={()=>handleShowQueryInput(true)}
                    onConfirmQuery={handleOnEnterInputFormQuery}
                />
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
