import { createLogic } from "redux-logic";
import { UIDisplayData } from "@aics/simularium-viewer";

import {
    CLEAR_UI_DATA_FROM_BROWSER_AND_STATE,
    GET_UI_DATA_FROM_BROWSER,
    STORE_UI_DATA_IN_BROWSER,
} from "./constants";
import { ReduxLogicDeps } from "../types";
import {
    getAgentDisplayNamesAndStates,
    getSimulariumFile,
} from "../trajectory/selectors";
import { setSessionUIData } from "../trajectory/actions";

// const storeColorsLogic = createLogic({
//     process(deps: ReduxLogicDeps, dispatch, done) {
//         // todo: is this still true? i think we are not doing this anymore with stored color changers
//         // applies color changes either by the user
//         // or from local storage
//         const { action, getState } = deps;
//         const uiData: UIDisplayData = getAgentDisplayNamesAndStates(getState());
//         const colorChange = action.payload;
//         console.log(
//             "ui data in store colors logic",
//             uiData,
//             "color change",
//             colorChange
//         );
//         const newUiData = uiData.map((agent) => {
//             const newAgent = { ...agent };
//             if (agent.name === colorChange.agent.name) {
//                 if (colorChange.agent.tags.includes("")) {
//                     newAgent.color = colorChange.color;
//                 }
//                 const newDisplayStates = agent.displayStates.map(
//                     (state: any) => {
//                         if (colorChange.agent.tags.includes(state.id)) {
//                             return {
//                                 ...state,
//                                 color: colorChange.color,
//                             };
//                         }
//                         return state;
//                     }
//                 );
//                 newAgent.displayStates = newDisplayStates;
//             }
//             return newAgent;
//         });
//         // dispatch(receiveAgentNamesAndStates(newUiData));
//         // dispatch(storeColorsInLocalStorage(newUiData));
//         const fileKey = getSimulariumFile(getState()).name;
//         localStorage.setItem(fileKey, JSON.stringify(newUiData));
//         done();
//     },
//     type: [SET_COLOR_CHANGES],
// });

const storeSessionColorsLogic = createLogic({
    process(deps: ReduxLogicDeps, dispatch, done) {
        const { action, getState } = deps;
        const uiData: UIDisplayData = getAgentDisplayNamesAndStates(getState());
        const colorChange = action.payload;
        // only make uiData for storage in browser, the UI data
        // we display in the website is always derived from the viewer
        // whih is the SSOT in alignment with the viewport/scene
        const newUiData = uiData.map((agent) => {
            const newAgent = { ...agent };
            if (agent.name === colorChange.agent.name) {
                if (colorChange.agent.tags.includes("")) {
                    newAgent.color = colorChange.color;
                }
                const newDisplayStates = agent.displayStates.map(
                    (state: any) => {
                        if (colorChange.agent.tags.includes(state.id)) {
                            return {
                                ...state,
                                color: colorChange.color,
                            };
                        }
                        return state;
                    }
                );
                newAgent.displayStates = newDisplayStates;
            }
            return newAgent;
        });
        const fileKey = getSimulariumFile(getState()).name;
        localStorage.setItem(fileKey, JSON.stringify(newUiData));
        dispatch(setSessionUIData(newUiData));
        done();
    },
    type: STORE_UI_DATA_IN_BROWSER,
});

const clearSessionColorsLogic = createLogic({
    process(deps: ReduxLogicDeps, dispatch, done) {
        const { getState } = deps;
        const fileKey = getSimulariumFile(getState()).name;
        console.log("clear logic, filekey", fileKey);
        localStorage.removeItem(fileKey);
        dispatch(setSessionUIData([]));
        done();
    },
    type: CLEAR_UI_DATA_FROM_BROWSER_AND_STATE,
});

const applySessionColorsLogic = createLogic({
    process(deps: ReduxLogicDeps, dispatch, done) {
        const { getState } = deps;

        const simulariumFile = getSimulariumFile(getState());
        const storedColorChanges = localStorage.getItem(simulariumFile.name);
        if (storedColorChanges !== "undefined" && storedColorChanges !== null) {
            const uiData = JSON.parse(storedColorChanges);
            dispatch(setSessionUIData(uiData)); // sets in redux which is passed as prop, when viewport mounts it will be applied as stored in viewer
            /**
             * When toggling back and forth between color settings,
             * it seemed important that there be a single source of truth of the
             * UI data.
             * So instead of dipatching this stored data from the browser,
             * we have updated the viewer to keep the selection interface in sync
             * with the viewer state, and stick with the previous pattern of always deriving
             * the UI data from the viewer
             * TODO: make sure color changes work like this as well
             */
            // dispatch(receiveAgentNamesAndStates(uiData));
            // done();
        }
        done();
    },
    type: GET_UI_DATA_FROM_BROWSER,
});

export default [
    storeSessionColorsLogic,
    applySessionColorsLogic,
    clearSessionColorsLogic,
];
