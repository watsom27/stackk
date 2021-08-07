import React from 'react';
import { useHistory } from 'react-router-dom';

export function Return(): JSX.Element {
    const history = useHistory();
    const onClick = () => history.push('/view');

    return <div className='return-icon logout-pad' onClick={onClick} />;
}
