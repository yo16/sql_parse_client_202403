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

    // SVGとして保存
    const handleOnClickDownloadSVGButton = () => {
        // svg要素を取得
        const svgNode = document.getElementById('svgLineage');
        const svgText = new XMLSerializer().serializeToString(svgNode);
        const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
      
        // a要素を作ってダウンロード
        const a = document.createElement('a');
        a.href = svgUrl;
        a.download = `SQLLineage.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(svgUrl);
    };

    // PNGとして保存
    const handleOnClickDownloadPngButton = () => {
        // svg要素を取得
        const svgNode = document.getElementById('svgLineage');
        const svgText = new XMLSerializer().serializeToString(svgNode);
        const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);

        // Imageオブジェクトを生成
        const im = new Image();

        // Imageの作成に少し時間がかかるため、addEventListnerで行う
        im.addEventListener('load', () => {
            const width = svgNode.getAttribute('width');
            const height = svgNode.getAttribute('height');

            // canvasを作成
            const cvs = document.createElement('canvas');
            cvs.setAttribute('width', width);
            cvs.setAttribute('height', height);
            const ctx = cvs.getContext('2d');

            // canvasに描画(背景は透過)
            ctx.drawImage(im, 0, 0, width, height);
            const imgUrl = cvs.toDataURL('image/png');

            // a要素を作ってダウンロード
            const a = document.createElement('a');
            a.href = imgUrl;
            a.download = `SQLLineage.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(svgUrl);
            URL.revokeObjectURL(imgUrl);
        });

        // Imageオブジェクトを、svgデータから作成
        im.src = svgUrl;
    };

    return (
        <div
            className="display-ctrl-panel-contents components-flex-row"
        >
            <div
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
            <div>
                <div>
                    <button
                        onClick={handleOnClickDownloadPngButton}
                        className="btnDownload"
                    >Download PNG</button>
                </div>
                <div>
                    <button
                        onClick={handleOnClickDownloadSVGButton}
                        className="btnDownload"
                    >Download SVG</button>
                </div>
            </div>
        </div>
    );
};

export default DisplayCtrlPanel;
