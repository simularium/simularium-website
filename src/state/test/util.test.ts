import { AnyAction } from "redux";

import { TypeToDescriptionMap } from "../types";
import {
    batchActions,
    enableBatching,
    makeConstant,
    makeReducer,
} from "../util";

describe("state utilities", () => {
    describe("makeConstant", () => {
        it("returns a string in the form 'APP_NAMESPACE/REDUCER/ACTION_TYPE'", () => {
            const constant = makeConstant("foo", "bar");
            const [namespace, reducer, type] = constant.split("/");
            expect(typeof constant).toBe("string");
            expect(namespace).toBe("simularium-ui");
            expect(reducer).toBe("FOO");
            expect(type).toBe("BAR");
        });
    });

    describe("makeReducer", () => {
        const ACTION_CONSTANT = "FAKE_CONSTANT";
        interface Action {
            type: string;
            arbitraryProp: boolean;
        }
        interface State {
            flag: boolean;
        }

        const initialState: State = {
            flag: false,
        };

        const typeToDescriptionMap: TypeToDescriptionMap = {
            [ACTION_CONSTANT]: {
                accepts: (action: AnyAction): action is Action =>
                    action.hasOwnProperty("arbitraryProp"),
                perform: (state: Partial<State>, action: AnyAction) => ({
                    ...state,
                    flag: action.arbitraryProp,
                }),
            },
        };

        // typed as `any` because we know that `beforeEach` will in fact make this a valid function in every
        // assertion block
        let reducer: any;

        beforeEach(() => {
            reducer = makeReducer(typeToDescriptionMap, initialState);
        });

        it("returns a reducer function", () => {
            expect(reducer).toBeInstanceOf(Function);
        });

        it("returns given state if action type does not match key in typeToDescriptionMap", () => {
            const fakeAction = { type: "FAKE", arbitraryProp: true };
            expect(reducer(initialState, fakeAction)).toBe(initialState);
        });

        it("returns given state if action does not pass type assertion", () => {
            const fakeAction = { type: ACTION_CONSTANT, payload: "Also fake" };
            expect(reducer(initialState, fakeAction)).toBe(initialState);
        });

        it("returns the output of ActionDescription.perform if the type assertion passes", () => {
            const realAction = { type: ACTION_CONSTANT, arbitraryProp: true };
            const expectedOutput = typeToDescriptionMap[
                ACTION_CONSTANT
            ].perform(initialState, realAction);
            const nextState = reducer(initialState, realAction);
            expect(nextState).not.toBe(initialState);
            expect(nextState).toEqual(expectedOutput);
        });
    });

    describe("enableBatching", () => {
        interface MockState {
            tortilla: boolean;
            beans: boolean;
            cheese: boolean;
        }

        interface MockAction {
            type: string;
            key: keyof MockState;
            value: boolean;
        }

        const TOGGLE_BURRITO_INGREDIENT = "TOGGLE_BURRITO_INGREDIENT";

        const toggleBurritoIngredientCreator = (
            key: keyof MockState,
            value: boolean
        ): MockAction => ({
            key,
            type: TOGGLE_BURRITO_INGREDIENT,
            value,
        });

        const initialState: MockState = {
            beans: false,
            cheese: false,
            tortilla: false,
        };

        const reducer = (
            state: MockState = initialState,
            action: AnyAction
        ) => {
            switch (action.type) {
                case TOGGLE_BURRITO_INGREDIENT:
                    return {
                        ...state,
                        [action.key]: action.value,
                    };
                default:
                    return state;
            }
        };

        const batchingReducer = enableBatching<MockState>(
            reducer,
            initialState
        );

        it("applies all actions in a batched action to state", () => {
            const enableBeans = toggleBurritoIngredientCreator("beans", true);
            const enableCheese = toggleBurritoIngredientCreator("cheese", true);

            const expectedState: MockState = {
                beans: true,
                cheese: true,
                tortilla: false,
            };

            expect(
                batchingReducer(
                    initialState,
                    batchActions([enableBeans, enableCheese])
                )
            ).toEqual(expectedState);
        });

        it("applies non-batched actions as usual", () => {
            const enableBeans = toggleBurritoIngredientCreator("beans", true);
            const expectedState: MockState = {
                beans: true,
                cheese: false,
                tortilla: false,
            };

            const result = batchingReducer(initialState, enableBeans);
            expect(result).toEqual(reducer(initialState, enableBeans));
            expect(result).toEqual(expectedState);
        });
    });
});
