import React from 'react';
import { useHistory } from 'react-router-dom';
import { URLs } from '~config/URLs';

export function Return(): JSX.Element {
    const history = useHistory();
    const onClick = () => history.push(URLs.view);

    return <div className='return-icon logout-pad' onClick={onClick} />;
}
