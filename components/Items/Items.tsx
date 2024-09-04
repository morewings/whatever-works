'use client';

import React from 'react';

import {useItems} from '@/src/features/items';

import type {Item} from './Listing';
import {Listing} from './Listing';
import classes from './Items.module.css';

export const Items = () => {
    /** Loading state of random.org request from Redux store */
    const {isPending, isError, data, isSuccess} = useItems();

    return (
        <div className={classes.random}>
            {isPending && <div>Loading table</div>}
            {isError && <div>Ups...</div>}
            {isSuccess && <Listing data={data as unknown as Item[]} />}
        </div>
    );
};
