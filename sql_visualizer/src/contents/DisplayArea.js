import { useState } from "react";
import "./DisplayArea.css";

const DisplayArea = ({onChangedQuery = f => f, statements}) => {
    const [showQueryInput, setShowQueryInput] = useState(false);
    const [queryText, setQueryText] = useState("");

    // クエリ入力欄の表示/非表示制御
    const handleShowQueryInput = show => {
        setShowQueryInput(show);
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
                className={`fixed top-0 left-0 w-full h-full flex items-center justify-center ${showQueryInput?"dark-overlay":"hidden"}`}
                onClick={()=>handleShowQueryInput(false)}
            >
                <div
                    className="query-input-area"
                    onClick={(e)=>e.stopPropagation()}
                >
                    <span>
                        Query
                    </span>
                    <textarea
                        className="query-input-textarea"
                        onChange={handleChangedQueryText}
                        defaultValue={queryText}
                    >
                    </textarea>
                    <div
                        className="query-input-buttonarea"
                    >
                        <button
                            onClick={() => handleShowQueryInput(false)}
                        >
                            キャンセル
                        </button>
                        <button
                            onClick={handleOnQuerySubmit}
                        >
                            OK
                        </button>
                        </div>
                </div>
            </div>
            <div
                className="display-area"
            >
                ファイルをドロップするか、<span className="cursor-pointer" onClick={()=>handleShowQueryInput(true)}>ここをクリック</span>してSQL文を入力してください。
                <div
                    className="display-canvas"
                >
                    描画エリア
                    {statements.map((s, i)=><div key={`div_${i}`}>{s.tableName}</div>)}
                </div>
            </div>
        </>
    );
};

export default DisplayArea;
