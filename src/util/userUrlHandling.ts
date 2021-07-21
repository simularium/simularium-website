import { isString } from "lodash";

const googleDriveUrlRegEx = /(?:drive.google\.com\/file\/d\/)(.*)(?=\/)|(?:drive.google\.com\/file\/d\/)(.*)/g;
const googleDriveUrlExcludingIdRegEx = /(drive.google\.com\/file\/d\/)(?=.*)/g;

export const urlCheck = (urlToCheck: any): string => {
    if (typeof urlToCheck !== "string") {
        return "";
    }
    /**
     * RegEx: https://regexr.com/5pkui, forked from https://regexr.com/39p0t
     * I had to modify the original to allow s3 buckets which have multiple `.letters-letters.` in them
     * and I made the http(s) required
     */
    const regEx = /(https?:\/\/)([\w\-]){0,200}(\.[a-zA-Z][^\-])([\/\w]*)*\/?\??([^\n\r]*)?([^\n\r]*)/g;
    if (regEx.test(urlToCheck)) {
        return urlToCheck;
    }
    return "";
};

export const isGoogleDriveUrl = (url: string) => /google.com/g.test(url);

export const getGoogleDriveFileId = (
    googleDriveUrl: string,
    id?: string | string[] | null
): string | undefined => {
    // already checked it was a google url before entering this function.
    if (id && isString(id)) {
        /**
         * if the url is formatted "https://drive.google.com/uc?export=download&id=1HH5KBpH7QAiwqw-qfm0_tfkTO3XC8afR"
         * the url params will have an id. This is less common case since this is not the url that you get from
         * selecting "share" on google drive
         **/
        return id;
    } else {
        // will match drive.google.com/file/d/1HH5KBpH7QAiwqw-qfm0_tfkTO3XC8afR
        // regEx example: https://regexr.com/612ch
        const driveUrlWithIdMatch = googleDriveUrl.match(googleDriveUrlRegEx);

        if (driveUrlWithIdMatch && driveUrlWithIdMatch[0]) {
            const driveUrlWithId = driveUrlWithIdMatch[0];
            // will remove everything but the id
            const id = driveUrlWithId.replace(
                googleDriveUrlExcludingIdRegEx,
                ""
            );
            return id;
        }
    }
};

export const getFileIdFromUrl = (
    url: string,
    idParam?: string | string[] | null
) => {
    if (isGoogleDriveUrl(url)) {
        return getGoogleDriveFileId(url, idParam);
    } else {
        // ex) "mysite.com/myTraj.simularium?dl=0" -> "myTraj.simularium"
        const urlSplit = url.split("/");
        return urlSplit[urlSplit.length - 1].split("?")[0];
    }
};

export const getStreamingUrl = (fileId: string) => {
    // ex) simularium.allencell.org/viewer?trajFileName=endocytosis.simularium
    return `${location.origin}${location.pathname}?trajFileName=${fileId}`;
};

export const getGoogleApiUrl = (id: string) => {
    return `https://www.googleapis.com/drive/v2/files/${id}?alt=media&key=${
        process.env.GOOGLE_API_KEY
    }`;
};

export const getUserTrajectoryUrl = (url: string, fileId?: string) => {
    if (isGoogleDriveUrl(url) && fileId) {
        return getGoogleApiUrl(fileId);
    } else {
        return url.replace("dropbox.com", "dl.dropboxusercontent.com");
    }
};
