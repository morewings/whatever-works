import {useQuery} from '@tanstack/react-query';

import {getItems} from './getItems';

export const useItems = () => {
    const {isPending, isError, data, error, refetch, isSuccess, isRefetching} = useQuery({
        queryKey: ['items'],
        queryFn: getItems,
    });
    return {isPending, isError, data, error, refetch, isSuccess, isRefetching};
};
