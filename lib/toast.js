let toastModulePromise = null;

const loadToastModule = () => {
    if (typeof window === 'undefined') {
        return null;
    }

    if (!toastModulePromise) {
        toastModulePromise = import('react-hot-toast');
    }

    return toastModulePromise;
};

const invokeToast = (method, args) => {
    const modulePromise = loadToastModule();
    if (!modulePromise) {
        return;
    }

    void modulePromise.then((module) => {
        const hotToast = module.default;

        if (method === 'default') {
            hotToast(...args);
            return;
        }

        if (typeof hotToast[method] === 'function') {
            hotToast[method](...args);
        }
    });
};

function toast(...args) {
    invokeToast('default', args);
}

toast.dismiss = (...args) => {
    invokeToast('dismiss', args);
};

toast.success = (...args) => {
    invokeToast('success', args);
};

toast.error = (...args) => {
    invokeToast('error', args);
};

export default toast;