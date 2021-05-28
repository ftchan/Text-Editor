const keyDownEvents = (ev) => {
    const isSaveMode = ((ev.metaKey || ev.ctrlKey) && ev.code === 'KeyS');
    const createNewFileMode = ((ev.metaKey || ev.ctrlKey) && ev.altKey && ev.code === 'KeyN');
    const openLocalFileMode = ((ev.metaKey || ev.ctrlKey) && ev.code === 'KeyO');

    if (isSaveMode) {
        ev.preventDefault();
        handleSaveFile();
    }

    if (createNewFileMode) {
        ev.preventDefault();
        handleCreateNewFile();
    }

    if (openLocalFileMode) {
        ev.preventDefault();
        handleOpenLocalFile();
    }
}

window.addEventListener('keydown', keyDownEvents);