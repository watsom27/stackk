import React, { useState } from 'react';

interface ToggleProps {
    initial?: boolean;
    onChange?: (newValue: boolean) => void;
}

export function Toggle({ initial, onChange }: ToggleProps): JSX.Element {
    const [value, setValue] = useState<boolean>(initial ?? false);

    const onClick = () => {
        setValue(!value);
        onChange?.(!value);
    };

    return (
        <div className={`toggle ${value ? 'true' : 'false'}`} onClick={onClick}>
            <div className='circle' />
        </div>
    );
}
