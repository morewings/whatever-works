import React from 'react';
import {render, screen} from '@testing-library/react';

import Items from './items';

describe('<items />', () => {
    test('it should mount', () => {
        render(<Items />);

        const items = screen.getByTestId('items');

        expect(items).toBeInTheDocument();
    });
});
