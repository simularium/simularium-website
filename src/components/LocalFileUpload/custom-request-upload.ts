import { RcCustomRequestOptions } from "antd/lib/upload/interface";
import { LocalSimFile } from "../../state/metadata/types";
import { CLEAR_SIMULARIUM_FILE } from "../../state/metadata/constants";
import { store } from "../..";
export default (
    { file, onSuccess, onError }: RcCustomRequestOptions,
    loadFunction: (simulariumFile: LocalSimFile) => void
) => {
    // want the loading indicator to show and clear out
    // as soon as user hits "Open" button
    store.dispatch({
        payload: { newFile: true },
        type: CLEAR_SIMULARIUM_FILE,
    });
    file.text()
        .then((text) => JSON.parse(text))
        .then((data) => {
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
        .catch((error) => {
            console.log(error);
            onError(error);
        });
};
