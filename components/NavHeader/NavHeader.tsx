import React from 'react';
import type {FC} from 'react';

import classes from './NavHeader.module.css';

export const NavHeader: FC = () => {
    return (
        <header className={classes.navHeader}>
            <h1 className={classes.name}>WW test assignment</h1>
        </header>
    );
};
