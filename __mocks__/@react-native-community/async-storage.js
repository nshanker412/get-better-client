let data = {};

export const setItem = jest.fn((key, value) => {
    return new Promise((resolve) => {
        data[key] = value;
        resolve(null);
    });
});

export const getItem = jest.fn((key) => {
    return new Promise((resolve) => {
        resolve(data[key]);
    });
});

export const removeItem = jest.fn((key) => {
    return new Promise((resolve) => {
        delete data[key];
        resolve(null);
    });
});

export const clear = jest.fn(() => {
    return new Promise((resolve) => {
        data = {};
        resolve(null);
    });
});

export default {
    setItem,
    getItem,
    removeItem,
    clear,
};