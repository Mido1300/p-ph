export function createStateManager(initialState) {
    let state = { ...initialState };
    const subscribers = [];
    return {
        getState: () => ({ ...state }),
        setState: (newState) => {
            state = { ...state, ...newState };
            subscribers.forEach(cb => cb(state));
        },
        subscribe: (cb) => {
            subscribers.push(cb);
            return () => subscribers.splice(subscribers.indexOf(cb), 1);
        }
    };
}
