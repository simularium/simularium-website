import {
    ISimulariumFile,
    loadSimulariumFile,
    ErrorLevel,
    FrontEndError,
} from "@aics/simularium-viewer";
import { UploadFile } from "antd";
import { findIndex } from "lodash";
import {
    UploadRequestOption,
    UploadRequestError,
} from "rc-upload/lib/interface";

import { LocalSimFile } from "../../state/trajectory/types";
import { VIEWER_ERROR } from "../../state/viewer/constants";
import { ViewerError, ViewerStatus } from "../../state/viewer/types";
import { clearUrlParams } from "../../util";

let numRequests = 0;

/**
Takes in an array of all the files loaded by the user, finds and processes the
.simularium file and any geometry files separately, then tells the app to load
the trajectory with its associated geometry files into the viewer.
*/
export default (
    selectedFiles: File[],
    clearSimulariumFile: (isNewFile: { newFile: boolean }) => void,
    loadFunction: (simulariumFile: LocalSimFile) => void,
    setViewerStatus: (status: { status: ViewerStatus }) => void,
    setError: (error: ViewerError) => void
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
        // numCustomRequests and selectedFiles.length are both 1, so reset
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
            file.name.includes(".simularium")
        );
        if (simulariumFileIndex === -1) {
            throw new Error(
                "Trajectory file was not found; please make sure it has a .simularium extension."
            );
        }
        Promise.all<string | ISimulariumFile>(
            selectedFiles.map((element, index) => {
                if (index !== simulariumFileIndex) {
                    // is async call
                    return element.text();
                } else {
                    return loadSimulariumFile(element);
                }
            })
        ).then((parsedFiles) => {
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
        });
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
        setError({
            level: level,
            message: message,
            htmlData: "",
        });
        setViewerStatus({ status: VIEWER_ERROR });
        clearSimulariumFile({ newFile: false });
        clearUrlParams();
    }
};
