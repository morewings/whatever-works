import {debounce} from 'lodash';

export const getItems = debounce(
    async (): Promise<number> => {
        const response = await fetch(
            'https://my-json-server.typicode.com/morewings/whatever-works/items',
            {
                method: 'GET',
            }
        );
        return await response.json();
    },
    666,
    {leading: true}
);
