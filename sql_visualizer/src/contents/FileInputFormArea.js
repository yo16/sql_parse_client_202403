import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import "./FileInputFormArea.css";

const FileInputFormArea = ({
    onClickDisplayDialogButton = f => f,
    onConfirmQuery = f => f,
}) => {
    // onDrop
    const onDrop = useCallback((acceptedFiles) => {
      // open if type is text/plain
      acceptedFiles.forEach((f) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            if (typeof reader.result === "string" ) {
                onConfirmQuery(reader.result);
            }
        });
        reader.readAsText(f, "utf-8");
      })
    }, [onConfirmQuery]);
  
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

    const handleOnClickInputForm = () => {
        onClickDisplayDialogButton();
    };

    return (
        <>
            <div className="containerFormInputArea">
                <div
                    {...getRootProps()}
                >
                    <input {...getInputProps()} />
                    <div
                        className={ "divDropZone " + (isDragActive?"divDragActive":"") }
                    >
                        Drop SQL-File
                    </div>
                </div>
                <div> or <span className="cursor-pointer" onClick={handleOnClickInputForm}>
                            <button>CLICK HERE</button>
                        </span> and Enter SQL Query!
                </div>
            </div>
        </>
    );
};

export default FileInputFormArea;
