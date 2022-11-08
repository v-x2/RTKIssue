import { defaultSerializeQueryArgs } from "@reduxjs/toolkit/dist/query";
import {api} from "./api";
import * as _ from 'lodash';
import {Quote} from "../../models/Quote";



export const QuotesApi = api.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getQuotes: builder.query<{ quotes: Quote[], skip: number, limit: number, total: number }, { skip: number, limit: number }>({
            query: ({skip, limit}) => {

                let url = `/quotes?limit=${limit}`
                if (skip) {
                    url += `&skip=${skip}`
                }

                return ({
                    url: url,
                    method: "GET"
                })
            },
            merge: (currentCacheData, responseData) => {
                if (!responseData?.quotes) {
                    return currentCacheData
                }

                for (let item of responseData.quotes) {
                    const indexFound = _.findIndex(currentCacheData.quotes, ['id', item.id]);
                    if (indexFound !== -1) {
                        currentCacheData.quotes.splice(indexFound, 1, item);
                    } else {
                        currentCacheData.quotes.push(item);
                    }
                }
                currentCacheData.skip = responseData.quotes.length
                currentCacheData.limit = responseData.limit
                currentCacheData.total = responseData.total
            },
            serializeQueryArgs: ({queryArgs, endpointDefinition, endpointName}) => {
                const {} = queryArgs
                // This can return a string, an object, a number, or a boolean.
                // If it returns an object, number or boolean, that value
                // will be serialized automatically via `defaultSerializeQueryArgs`
                return defaultSerializeQueryArgs({
                    queryArgs, endpointDefinition, endpointName
                }) // omit `client` from the cache key

            },
            // Refetch when the page arg changes
            forceRefetch({currentArg, previousArg}) {
                return currentArg !== previousArg
            },
            providesTags: ['Quotes']
        }),
    })
})
