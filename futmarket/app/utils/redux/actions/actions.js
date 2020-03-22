import { UPDATE_CONSOLE } from './types';

export const updateConsole = (console) => ({
    type: UPDATE_CONSOLE,
    payload: {
        console: console
    }
});