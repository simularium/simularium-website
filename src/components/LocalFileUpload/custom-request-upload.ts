import { ISimulariumFile, loadSimulariumFile } from "@aics/simularium-viewer";
import { findIndex } from "lodash";
import {
    UploadRequestOption,
    UploadRequestError,
} from "rc-upload/lib/interface";

import { LocalSimFile } from "../../state/trajectory/types";
import { VIEWER_ERROR } from "../../state/viewer/constants";
import { ViewerError, ViewerStatus } from "../../state/viewer/types";
import { clearUrlParams } from "../../util";

let numCustomRequests = 0;

/*
A "custom request" for an Antd Upload component is a function that overrides
the default POST request that happens when the user uploads files. The Antd
Upload is a wrapper around the Upload component from react-component (rc-upload).
- Antd docs: https://ant.design/components/upload/#API
- rc-upload docs: https://github.com/react-component/upload#customrequest

This custom request function takes in an array of all the files loaded by the
user, finds and processes the .simularium file and any geometry files separately, 
then tells the app to load the trajectory with its associated geometry files 
into the viewer.
*/
export default (
    { onSuccess, onError }: UploadRequestOption,
    selectedFiles: File[],
    clearSimulariumFile: (isNewFile: { newFile: boolean }) => void,
    loadFunction: (simulariumFile: LocalSimFile) => void,
    setViewerStatus: (status: { status: ViewerStatus }) => void,
    setError: (error: ViewerError) => void
) => {
    numCustomRequests++;
    if (numCustomRequests !== 1) {
        // If the user loads multiple files at once (.simularium file + geometry file(s)),
        // this function is called multiple times, but we only need to process
        // and load the trajectory once.
        if (numCustomRequests === selectedFiles.length) {
            // We're at the last customRequest for this batch of files,
            // so reset counter
            numCustomRequests = 0;
        }
        return;
    }

    if (selectedFiles.length === 1) {
        // numCustomRequests and selectedFiles.length are both 1, so reset
        numCustomRequests = 0;
    }

    // want the loading indicator to show without any lag time
    // as soon as user hits "Open" button or drops files,
    // and not have to have this action called multiple places in the code.
    clearSimulariumFile({ newFile: true });

    const filesArr: File[] = Array.from(selectedFiles) as File[];

    try {
        // Try to identify the simularium file.
        // Put all the other files as text based geoAssets.
        const simulariumFileIndex = findIndex(filesArr, (file) =>
            file.name.includes(".simularium")
        );
        if (simulariumFileIndex === -1) {
            throw new Error(
                "Trajectory file was not found; please make sure it has a .simularium extension."
            );
        }
        Promise.all<string | ISimulariumFile>(
            filesArr.map((element, index) => {
                if (index !== simulariumFileIndex) {
                    // is async call
                    return element.text();
                } else {
                    return loadSimulariumFile(element);
                }
            })
        )
            .then((parsedFiles) => {
                const simulariumFile = parsedFiles[
                    simulariumFileIndex
                ] as ISimulariumFile;
                // build the geoAssets as mapping name-value pairs:
                const geoAssets = filesArr.reduce(
                    (acc, cur, index) => {
                        if (index !== simulariumFileIndex) {
                            acc[cur.name] = parsedFiles[index] as string;
                        }
                        return acc;
                    },
                    {} as { [key: string]: string }
                );
                const fileName = filesArr[simulariumFileIndex].name;

                loadFunction({
                    lastModified: filesArr[simulariumFileIndex].lastModified,
                    name: fileName,
                    data: simulariumFile,
                    geoAssets: geoAssets,
                });
                // TS thinks onSuccess might be undefined
                if (onSuccess) {
                    onSuccess(
                        {
                            name: fileName,
                            status: "done",
                            url: "",
                        },
                        new XMLHttpRequest() // onSuccess needs an XMLHttpRequest arg
                    );
                }
            })

    } catch (error) {
        let message = error.message;
        if (error instanceof DOMException) {
            message =
                "Please load a collection of single files that does not include a folder.";
        }
        setError({
            level: error.level,
            message: message,
            htmlData: "",
        });
        setViewerStatus({ status: VIEWER_ERROR });
        clearSimulariumFile({ newFile: false });
        clearUrlParams();
        // TS thinks onError might be undefined
        if (onError) {
            onError(error as UploadRequestError);
        }
    }
};
