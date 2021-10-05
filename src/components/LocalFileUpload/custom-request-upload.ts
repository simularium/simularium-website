import { SimulariumFileFormat } from "@aics/simularium-viewer";
import { findIndex } from "lodash";
import {
    UploadRequestOption,
    UploadRequestError,
} from "rc-upload/lib/interface";

import { LocalSimFile } from "../../state/trajectory/types";
import { CLEAR_SIMULARIUM_FILE } from "../../state/trajectory/constants";
import { store } from "../..";

// Typescript's File definition is missing this function
//  which is part of the HTML standard on all browsers
//  and needed below
interface FileHTML extends File {
    text(): Promise<string>;
}

let isLoading = false;

// TODO: what does this function do
export default (
    { onSuccess, onError }: UploadRequestOption,
    droppedFiles: File[],
    loadFunction: (simulariumFile: LocalSimFile) => void
) => {
    if (isLoading === false) {
        isLoading = true;
    } else {
        // If the user loads multiple files at once (.simularium file + geometry file(s)),
        // this function is called multiple times, but we only need to process
        // and load the trajectory once
        return;
    }

    // want the loading indicator to show without any lag time
    // as soon as user hits "Open" button, and not have to have this action called
    // multiple places in the code.
    store.dispatch({
        payload: { newFile: true },
        type: CLEAR_SIMULARIUM_FILE,
    });

    const filesArr: FileHTML[] = Array.from(droppedFiles) as FileHTML[];

    Promise.all(filesArr.map((item: FileHTML) => item.text())).then(
        (parsedFiles: string[]) => {
            try {
                const simulariumFileIndex = findIndex(filesArr, (file) =>
                    file.name.includes(".simularium")
                );
                // TODO: handle when user doesn't load a .simularium file
                // if (simulariumFileIndex === -1) {
                //    throw new Error("Please upload a .simularium file.")
                // }

                const simulariumFile: SimulariumFileFormat = JSON.parse(
                    parsedFiles[simulariumFileIndex]
                );
                const fileName: string = filesArr[simulariumFileIndex].name;
                const geoAssets = filesArr.reduce(
                    (acc: { [name: string]: string }, cur, index) => {
                        if (index !== simulariumFileIndex) {
                            acc[cur.name] = parsedFiles[index];
                        }
                        return acc;
                    },
                    {}
                );

                loadFunction({
                    lastModified: filesArr[simulariumFileIndex].lastModified,
                    name: fileName,
                    data: simulariumFile,
                    geoAssets: geoAssets,
                });
                if (onSuccess) {
                    onSuccess(
                        {
                            name: fileName,
                            status: "done",
                            url: "",
                        },
                        new XMLHttpRequest()
                    );
                }
                isLoading = false;
            } catch (error) {
                console.log(error);
                // FIXME: I think this only handles XMLHttpRequest errors
                // (failed to upload to server), need to do our own error handling
                if (onError) onError(error as UploadRequestError);
            }
        }
    );
};
