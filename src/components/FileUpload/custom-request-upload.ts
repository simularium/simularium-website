import { RcCustomRequestOptions } from "antd/lib/upload/interface";
import { LocalSimFile } from "../../state/metadata/types";

export default (
    { file, onSuccess, onError }: RcCustomRequestOptions,
    loadFunction: (simulariumFile: LocalSimFile) => void
) => {
    file.text()
        .then((text) => JSON.parse(text))
        .then((data) => {
            loadFunction({
                lastModified: file.lastModified,
                name: `${file.name}@${file.lastModified}`,
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
