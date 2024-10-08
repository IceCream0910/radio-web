export const localStorageEffect =
    (key) =>
        ({ setSelf, onSet }) => {
            if (typeof localStorage !== 'undefined') {
                const savedValue = localStorage.getItem(key);
                // console.log(savedValue);
                if (savedValue != null) {
                    setSelf(JSON.parse(savedValue));
                }

                onSet((newValue) => {
                    localStorage.setItem(key, JSON.stringify(newValue));
                });
            }
        };