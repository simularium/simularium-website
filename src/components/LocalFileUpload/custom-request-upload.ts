import { RcCustomRequestOptions } from "antd/lib/upload/interface";
import { LocalSimFile } from "../../state/metadata/types";
import { setViewerStatus } from "../../state/metadata/actions";
import { VIEWER_LOADING } from "../../state/metadata/constants";
import { store } from "../..";
export default (
    { file, onSuccess, onError }: RcCustomRequestOptions,
    loadFunction: (simulariumFile: LocalSimFile) => void
) => {
    store.dispatch(setViewerStatus({ status: VIEWER_LOADING }));
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
