import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Settings } from '~components/Settings';
import { KeyboardService, Callback } from './keyboardService';

export interface ModalProps {
    keyDownCallback?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
}

class ShowSettingsService {
    private modalNode = document.getElementById('modal')!;
    private cancelEscapeListener: Callback = () => undefined;

    public show(): void {
        this.cancelEscapeListener = KeyboardService.instance.addListener('Escape', () => this.hide());

        render(<Settings />, this.modalNode);
    }

    public hide(): void {
        this.cancelEscapeListener();

        unmountComponentAtNode(this.modalNode);
    }
}

export const showSettingsService = new ShowSettingsService();
