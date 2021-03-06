import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Settings } from '~components/Settings';

export interface ModalProps {
    keyDownCallback?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
}

class ShowSettingsService {
    private modalNode = document.getElementById('modal')!;
    private visible = false;

    public isVisible(): boolean {
        return this.visible;
    }

    public show(): void {
        this.visible = true;

        render(<Settings />, this.modalNode);
    }

    public hide(): void {
        this.visible = false;

        unmountComponentAtNode(this.modalNode);
    }

    public toggle(): void {
        if (this.visible) {
            this.hide();
        } else {
            this.show();
        }
    }
}

export const showSettingsService = new ShowSettingsService();
