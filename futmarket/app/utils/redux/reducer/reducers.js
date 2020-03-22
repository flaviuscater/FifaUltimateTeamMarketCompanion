import {UPDATE_CONSOLE} from '../actions/types';

// Get user console
const initialState = {
    userProperties: {
        console: ""
    }
};

export default function userConsoleReducer(state = initialState, action) {
    if (action.type === UPDATE_CONSOLE) {
        return { ...state, userProperties: action.payload };
    }
    return state;
}