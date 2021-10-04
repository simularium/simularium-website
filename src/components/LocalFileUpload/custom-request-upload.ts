import { SimulariumFileFormat } from "@aics/simularium-viewer";
import { findIndex } from "lodash";
import { RcCustomRequestOptions } from "antd/lib/upload/interface";

import { LocalSimFile } from "../../state/trajectory/types";
import { CLEAR_SIMULARIUM_FILE } from "../../state/trajectory/constants";
import { store } from "../..";

// Typescript's File definition is missing this function
//  which is part of the HTML standard on all browsers
//  and needed below
interface FileHTML extends File {
    text(): Promise<string>;
}

export default (
    { onSuccess, onError }: RcCustomRequestOptions,
    droppedFiles: File[],
    loadFunction: (simulariumFile: LocalSimFile) => void
) => {
    console.log("custom request");
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
            const simulariumFileIndex = findIndex(filesArr, (file) =>
                file.name.includes(".simularium")
            );
            const simulariumFile = JSON.parse(parsedFiles[simulariumFileIndex]);
            const fileName: string = filesArr[simulariumFileIndex].name;
            const geoAssets = filesArr.reduce((acc, cur, index) => {
                if (index !== simulariumFileIndex) {
                    acc[cur.name] = parsedFiles[index];
                }
                return acc;
            }, {});

            try {
                // if array of files,
                // stash instead of loadLocalFile until all files are
                // gathered, then call loadLocalFile
                console.log("loadFunction");
                loadFunction({
                    lastModified: simulariumFile.lastModified,
                    name: fileName,
                    data: simulariumFile,
                    geoAssets: geoAssets,
                });
            } catch (error) {
                console.log(error);
                onError(error);
            }
            onSuccess(
                {
                    name: fileName,
                    status: "done",
                    url: "",
                },
                simulariumFile
            );
        }
    );
};
