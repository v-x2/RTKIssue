
import React, {memo, useCallback} from 'react';
import {FlatList, ListRenderItem, StyleSheet, Text, View,} from 'react-native';
import {withWrapper} from "./src/hoc/withWrapper";
import {QuotesApi} from "./src/redux/api/Quotes.api";
import {Quote} from "./src/models/Quote";


const App : React.FC = () => {
    const {data, isFetching, refetch} = QuotesApi.useGetQuotesQuery({
        limit: 10, skip: 0
    })

    const onNextPage = useCallback( () => {

        if(data && data.skip > 0 ) {
            console.log("Fetching a new page... Skip: " + data.skip)
            refetch()
        }
    }, [data])

    const _keyExtractor = (item: Quote, index: number) => {
        return `${item.id}`
    };
    const renderItem: ListRenderItem<Quote> = ({item, index}: any) => {
        return <View style={style.flatListElement}>
            <Text>{item.id} {item.quote}</Text>
        </View>
    }


    return (
        <View style={style.view}>
            <Text style={style.heading}>Quote List</Text>

            <FlatList
                keyExtractor={_keyExtractor}

                onEndReached={onNextPage}
                onRefresh={refetch}
                refreshing={isFetching}

                data={data?.quotes}
                renderItem={renderItem}
            />
        </View>

    )
}


const style = StyleSheet.create({
    view: {
        marginTop: 60,
        padding: 16,
        marginBottom: 16,
    },
    heading: {
        fontSize: 24,
    },
    text: {
        fontSize: 18,
    },
    flatListElement: {
      borderWidth: 1,
      borderRadius: 12,
      padding: 16,
    }
})



export default withWrapper(memo(App));
