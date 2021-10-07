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
    loadFunction: (simulariumFile: LocalSimFile) => void
) => {
    numCustomRequests++;
    if (numCustomRequests === 1) {
        // want the loading indicator to show without any lag time
        // as soon as user hits "Open" button or drops files,
        // and not have to have this action called multiple places in the code.
        store.dispatch({
            payload: { newFile: true },
            type: CLEAR_SIMULARIUM_FILE,
        });
    }
    if (numCustomRequests < selectedFiles.length) {
        // If the user loads multiple files at once (.simularium file + geometry file(s)),
        // this function is called multiple times, but we only need to process
        // and load the trajectory once. So we just return until it's the last
        // function call.
        return;
    }

    const files: FileHTML[] = Array.from(selectedFiles) as FileHTML[];

    Promise.all(files.map((file: FileHTML) => file.text())).then(
        (parsedFiles: string[]) => {
            try {
                const simulariumFileIndex = findIndex(files, (file) =>
                    file.name.includes(".simularium")
                );
                // TODO: handle when user doesn't load a .simularium file
                // if (simulariumFileIndex === -1) {
                //    throw new Error("Please upload a .simularium file.")
                // }

                const simulariumFile: File = files[simulariumFileIndex];
                const simulariumFileJson: SimulariumFileFormat = JSON.parse(
                    parsedFiles[simulariumFileIndex]
                );
                const geoAssets: { [name: string]: string } = files.reduce(
                    (acc: { [name: string]: string }, cur, index) => {
                        if (index !== simulariumFileIndex) {
                            acc[cur.name] = parsedFiles[index];
                        }
                        return acc;
                    },
                    {}
                );

                loadFunction({
                    lastModified: simulariumFile.lastModified,
                    name: simulariumFile.name,
                    data: simulariumFileJson,
                    geoAssets: geoAssets,
                });
                // TS thinks onSuccess might be undefined
                if (onSuccess) {
                    onSuccess(
                        {
                            name: simulariumFile.name,
                            status: "done",
                            url: "",
                        },
                        new XMLHttpRequest() // onSuccess needs an XMLHttpRequest arg
                    );
                }
                numCustomRequests = 0;
            } catch (error) {
                console.log(error);

                // TS thinks onError might be undefined
                //
                // FIXME: I think this only handles XMLHttpRequest errors
                // (failed to upload to server), need to do our own error handling
                if (onError) {
                    onError(error as UploadRequestError);
                }
            }
        }
    );
};
