import { SimulariumFileFormat } from "@aics/simularium-viewer";
import { RcCustomRequestOptions } from "antd/lib/upload/interface";

import { LocalSimFile } from "../../state/trajectory/types";
import { CLEAR_SIMULARIUM_FILE } from "../../state/trajectory/constants";
import { store } from "../..";

export default (
    { file, onSuccess, onError }: RcCustomRequestOptions,
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
    file.text()
        .then((text: string) => JSON.parse(text))
        .then((data: SimulariumFileFormat) => {
            loadFunction({
                lastModified: file.lastModified,
                name: file.name,
                data,
            });
        })
        .then(() =>
            onSuccess(
                {
                    name: file.name,
                    status: "done",
                    url: "",
                },
                file
            )
        )
        .catch((error: Error) => {
            console.log(error);
            onError(error);
        });
};
