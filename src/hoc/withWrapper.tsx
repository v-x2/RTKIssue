import React from 'react';
import {Provider} from "react-redux";
import {persistor, store} from "../redux/Store";
import {PersistGate} from "redux-persist/integration/react";

export const withWrapper = (WrappedComponent : any) => {
    return (props: any) => (
        <Provider store={store} >
            <PersistGate loading={null} persistor={persistor}>
                <WrappedComponent {...props} />

            </PersistGate>
        </Provider>
    );
};
