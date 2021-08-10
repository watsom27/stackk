import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Settings } from '~components/Settings';

export interface ModalProps {
    keyDownCallback?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
}

class ShowSettingsService {
    private modalNode = document.getElementById('modal')!;

    public show(): void {
        render(<Settings />, this.modalNode);
    }

    public hide(): void {
        unmountComponentAtNode(this.modalNode);
    }
}

export const showSettingsService = new ShowSettingsService();
