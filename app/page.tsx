import type {Metadata} from 'next';
import {Fragment} from 'react';

import {Items} from '@/components/Items';
import {NavHeader} from '@/components/NavHeader';

export default function IndexPage() {
    return (
        <Fragment>
            <NavHeader />
            <main>
                <Items />
            </main>
        </Fragment>
    );
}

export const metadata: Metadata = {
    title: 'First page',
};
