// Create our baseQuery instance
import {BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError} from "@reduxjs/toolkit/query/react";
import {RootState} from "../Store";
import { Mutex } from 'async-mutex'
const mutex = new Mutex()


const baseQuery = fetchBaseQuery({
    baseUrl: "https://dummyjson.com",
})


const baseQueryWithReauth: BaseQueryFn< string | FetchArgs,  unknown, FetchBaseQueryError > = async (args, api, extraOptions) => {

    // wait until the mutex is available without locking it
    await mutex.waitForUnlock()

    let result = await baseQuery(args, api, extraOptions)

    // @ts-ignore
    console.log(`${args?.method} ➞ ${args?.url} ===> ${result.meta.response.status}`)

    return result
}


export const api = createApi({
    reducerPath: 'api',
    tagTypes: [ "Quotes"],
    baseQuery: baseQueryWithReauth,
    endpoints: () => ({}),
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,

})



