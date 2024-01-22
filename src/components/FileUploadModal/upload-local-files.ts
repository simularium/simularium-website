import {
    ISimulariumFile,
    loadSimulariumFile,
    ErrorLevel,
    FrontEndError,
} from "@aics/simularium-viewer";
import { findIndex } from "lodash";
import {
    UploadRequestOption,
    UploadRequestError,
} from "rc-upload/lib/interface";

import { LocalSimFile } from "../../state/trajectory/types";
import { VIEWER_ERROR } from "../../state/viewer/constants";
import { ViewerError, ViewerStatus } from "../../state/viewer/types";
import { clearBrowserUrlParams } from "../../util";

let numRequests = 0;

/**
Takes in an array of all the files loaded by the user, finds and processes the
.simularium file and any geometry files separately, then tells the app to load
the trajectory with its associated geometry files into the viewer.

This function may be used as a "custom request" for an Antd Upload component,
which overrides the default POST request that happens when the user uploads
files. The Antd Upload wraps the Upload component from react-component.
- Antd docs: https://ant.design/components/upload/#API
- rc-upload docs: https://github.com/react-component/upload#customrequest
*/
export default async (
    selectedFiles: File[],
    clearSimulariumFile: (isNewFile: { newFile: boolean }) => void,
    loadFunction: (simulariumFile: LocalSimFile) => void,
    setViewerStatus: (status: { status: ViewerStatus }) => void,
    setError: (error: ViewerError) => void,
    rcRequest?: UploadRequestOption
) => {
    numRequests++;
    if (numRequests !== 1) {
        // If the user loads multiple files at once (.simularium file + geometry file(s)),
        // this function is called multiple times, but we only need to process
        // and load the trajectory once.
        if (numRequests === selectedFiles.length) {
            // We're at the last customRequest for this batch of files,
            // so reset counter
            numRequests = 0;
        }
        return;
    }

    if (selectedFiles.length === 1) {
        // numRequests and selectedFiles.length are both 1, so reset
        numRequests = 0;
    }

    // want the loading indicator to show without any lag time
    // as soon as user hits "Open" button or drops files,
    // and not have to have this action called multiple places in the code.
    clearSimulariumFile({ newFile: true });

    try {
        // Try to identify the simularium file.
        // Put all the other files as text based geoAssets.
        const simulariumFileIndex = findIndex(selectedFiles, (file) =>
            file.name.endsWith(".simularium")
        );
        if (simulariumFileIndex === -1) {
            throw new Error(
                "Trajectory file was not found; please make sure it has a .simularium extension."
            );
        }
        const parsedFiles = await Promise.all<string | ISimulariumFile>(
            selectedFiles.map((element, index) => {
                if (index !== simulariumFileIndex) {
                    // is async call
                    return element.text();
                } else {
                    return loadSimulariumFile(element);
                }
            })
        );

        const simulariumFile = parsedFiles[
            simulariumFileIndex
        ] as ISimulariumFile;
        // build the geoAssets as mapping name-value pairs:
        const geoAssets = selectedFiles.reduce((acc, cur, index) => {
            if (index !== simulariumFileIndex) {
                acc[cur.name] = parsedFiles[index] as string;
            }
            return acc;
        }, {} as { [key: string]: string });
        const fileName = selectedFiles[simulariumFileIndex].name;

        loadFunction({
            lastModified: selectedFiles[simulariumFileIndex].lastModified,
            name: fileName,
            data: simulariumFile,
            geoAssets: geoAssets,
        });
        if (rcRequest?.onSuccess) {
            rcRequest.onSuccess(
                {
                    name: fileName,
                    status: "done",
                    url: "",
                },
                new XMLHttpRequest() // onSuccess needs an XMLHttpRequest arg
            );
        }
    } catch (error) {
        let message;
        let level = ErrorLevel.ERROR;
        if (error instanceof DOMException) {
            message =
                "Please load a collection of single files that does not include a folder.";
        } else {
            if (error instanceof FrontEndError) {
                message = error.message;
                level = error.level;
            } else {
                message = String(error);
            }
        }
        setError({ level, message, htmlData: "" });
        setViewerStatus({ status: VIEWER_ERROR });
        clearSimulariumFile({ newFile: false });
        clearBrowserUrlParams();
        if (rcRequest?.onError) {
            rcRequest.onError(error as UploadRequestError);
        }
    }
};
