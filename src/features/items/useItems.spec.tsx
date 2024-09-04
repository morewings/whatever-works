import {waitFor, renderHook} from '@testing-library/react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

import {useItems} from './useItems';
import {getItems} from './getItems';

jest.mock('./getItems', () => ({
    __esModule: true,
    getItems: jest.fn(),
}));

let client: QueryClient;

const response = 6;

describe('features > items > useItems', () => {
    beforeEach(() => {
        client = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                },
            },
        });
        jest.mocked(getItems).mockReset();
    });

    it('handles successful request', async () => {
        jest.mocked(getItems).mockImplementationOnce(() => Promise.resolve(response));

        const {result} = renderHook(() => useItems(), {
            wrapper: ({children}) => (
                <QueryClientProvider client={client}>{children}</QueryClientProvider>
            ),
        });

        // expect a pristine state
        expect(result.current.isPending).toBe(true);
        expect(result.current.isError).toBe(false);
        expect(result.current.isRefetching).toBe(false);
        expect(result.current.isSuccess).toBe(false);
        expect(result.current.data).toBe(undefined);
        expect(result.current.error).toBe(null);

        // expect success state
        await waitFor(() => expect(result.current.isPending).toBe(false));
        expect(result.current.isSuccess).toBe(true);
        expect(result.current.data).toBe(response);
    });

    it('handles rejected request', async () => {
        jest.mocked(getItems).mockImplementationOnce(() =>
            Promise.reject(new Error('foo'))
        );

        const {result} = renderHook(() => useItems(), {
            wrapper: ({children}) => (
                <QueryClientProvider client={client}>{children}</QueryClientProvider>
            ),
        });

        // expect pristine state
        expect(result.current.isPending).toBe(true);
        expect(result.current.isError).toBe(false);
        expect(result.current.isRefetching).toBe(false);
        expect(result.current.isSuccess).toBe(false);
        expect(result.current.data).toBe(undefined);

        // expect error state
        await waitFor(() => expect(result.current.isPending).toBe(false));
        expect(result.current.isError).toBe(true);
        expect(result.current.error).toEqual(new Error('foo'));
    });
});
