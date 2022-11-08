import {combineReducers, configureStore} from "@reduxjs/toolkit";

import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {api} from "./api/api";
import {Platform} from "react-native";
import thunk from "redux-thunk";

// @ts-ignore
import createSensitiveStorage from "redux-persist-sensitive-storage";
import {FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE,} from 'redux-persist'
import {setupListeners} from "@reduxjs/toolkit/query";

const storage = createSensitiveStorage({
    keychainService: "storage",
    sharedPreferencesName: "storage"
});

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}

const rootReducer = combineReducers({
    [api.reducerPath]: api.reducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)



export const store = configureStore({
    devTools: {
        name: Platform.OS,
    },
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => {
        const options: any = {
            serializableCheck: {
                ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            }
        }
        const middlewares = getDefaultMiddleware(options)
        middlewares.push(thunk)
        middlewares.push(api.middleware)

        return middlewares
    }
})


export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector
setupListeners(store.dispatch)
