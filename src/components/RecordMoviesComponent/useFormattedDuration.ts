import { useEffect, useState } from "react";

/**
 * onloadedmetadata is async hence the need for this custom hook
 * to retrieve the duration from the recorded movie.
 */
export const useFormattedDuration = (movieUrl: string) => {
    const [formattedDuration, setFormattedDuration] = useState("");

    useEffect(() => {
        const video = document.createElement("video");
        video.src = movieUrl;
        video.onloadedmetadata = () => {
            const durationInSeconds = video.duration;
            const minutes = Math.floor((durationInSeconds % 3600) / 60);
            const secs = Math.ceil(durationInSeconds) % 60;

            const minutesStr = minutes.toString().padStart(2, "0");
            const secondsStr = secs.toString().padStart(2, "0");

            setFormattedDuration(`${minutesStr}:${secondsStr}`);
            video.src = "";
            video.load();
        };
    }, [movieUrl]);

    return formattedDuration;
};
