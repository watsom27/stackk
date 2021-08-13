import styled from 'styled-components';
import React, { Dispatch, SetStateAction, useState, useEffect, useRef } from 'react';
import { db } from '~data/Db';
import { Item } from '~data/Item';

interface ItemComponentProps {
    item: Item;
    isFirst?: boolean;
    setItems: Dispatch<SetStateAction<Item[]>>;
}

interface Position {
    x: number;
    y: number;
}

interface PositionedThingProps extends Position {
    isMouseDown: boolean;
    width: number;
}

const PositionedThing = styled.div<PositionedThingProps>`
    ${(props) => {
        if (props.isMouseDown) {
            return `
                position: fixed;
                z-index: 100;
                left: ${props.x}px;
                top: ${props.y}px;
                width: ${props.width}px;
            `;
        }

        return '';
    }}
`;

function Controls({ item, isFirst, setItems }: ItemComponentProps): JSX.Element {
    const btnDoneOnClick = async () => {
        db.delete(item);
        setItems(db.getItems());
    };

    const btnBumpOnClick = async () => {
        db.bump(item);
        setItems(db.getItems());
    };

    const btnBumpntOnClick = async () => {
        db.bumpnt(item);
        setItems(db.getItems());
    };

    const completeButtonText = isFirst ? 'Done' : 'Delete';

    return (
        <div className='controls'>
            <div className='bump'>
                <button
                    className='btn-bump'
                    onClick={btnBumpOnClick}
                    type='button'
                />
                <button
                    className='btn-bumpnt'
                    onClick={btnBumpntOnClick}
                    type='button'
                />
            </div>
            <button
                onClick={btnDoneOnClick}
                type='button'
            >
                {completeButtonText}
            </button>
        </div>
    );
}

export function ItemComponent({ item, isFirst, setItems }: ItemComponentProps): JSX.Element {
    const [mouseDown, setMouseDown] = useState<boolean>(false);
    const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });
    const className = `item ${mouseDown ? 'down' : ''} ${isFirst ? 'first' : ''} `;
    const [width, setWidth] = useState<number>();
    const ref = useRef();

    useEffect(() => {
        window.addEventListener('mousemove', (event) => {
            setMousePosition({
                x: event.clientX,
                y: event.clientY,
            });
        });

        if (ref.current) {
            setWidth(ref.current.offsetWidth);
        }

        window.addEventListener('resize', () => {
            if (ref.current) {
                setWidth(ref.current.offsetWidth);
            }
        });
    }, []);

    return (
        <div className={`mouse-down-background ${isFirst ? 'first' : ''} ${mouseDown ? 'down' : ''}`}>
            <PositionedThing
                className={className}
                onMouseDown={() => setMouseDown(true)}
                onMouseUp={() => setMouseDown(false)}
                x={mousePosition.x}
                y={mousePosition.y}
                isMouseDown={mouseDown}
                width={width}
            >
                <p className='value'>
                    {item.value}
                </p>
                <Controls item={item} isFirst={isFirst} setItems={setItems} />
            </PositionedThing>
        </div>
    );
}
