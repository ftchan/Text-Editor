import { handleRenderDirectories } from './render.js';

let fileHandle;
let inputOrigin = "newFile";

// File open options, limit on text
const pickerOpt = {
    types: [
        {
            description: "Text documents",
            accept: {
                "text/plain": [".txt"],
            },
        },
    ],
    excludeAcceptAllOption: true,
    multiple: false,
};

// Click to create a new pure text
const handleCreateNewFile = () => {
    fileHandle = null;
    information.innerText = "";
    inputOrigin = "newFile";

    textEditor.value = "";
    textEditor.style.fontSize = "14px";
    textEditor.focus();
};

// Open directory
const handleOpenDirectory = async () => {
    let project = {
        name: '',
        kind: '',
        files: [],
        directories: []
    };

    const dicHandle  = await window.showDirectoryPicker();
    const { name, kind } = dicHandle;

    project.name = name;
    project.kind = kind;

    if (!dicHandle) return;

    const composeProject = async (files, project) => {
        for await (const d of files.values()) {
            const { kind, name } = d;

            if (kind === 'directory') {
                let fileObj = {
                    name,
                    kind,
                    files: [],
                    directories: []
                };
                project.directories.push(fileObj);

                composeProject(d, fileObj)
            } else {
                project.files.push(d);
            }
        }
    }

    await composeProject(dicHandle, project);
    handleRenderDirectories(project);
};

// Open local text file
const handleOpenLocalFile = async () => {
    [fileHandle] = await window.showOpenFilePicker(pickerOpt);

    if (!fileHandle) return;

    if (fileHandle.name) {
        inputOrigin = "localFile";
        information.innerText = fileHandle.name;
    }

    const fileData = await fileHandle.getFile();
    const text = await fileData.text();

    textEditor.value = text;
};

// Increase Font Size
const increaseFontSize = () => {
    const fontSize = textEditor.style.fontSize.split("px")[0];

    textEditor.style.fontSize = Number(fontSize) + 2 + "px";
};

// Decrease Font Size
const decreaseFontSize = () => {
    const fontSize = textEditor.style.fontSize.split("px")[0];

    textEditor.style.fontSize =
        Number(fontSize) - 2 <= 12 ? "12px" : Number(fontSize) - 2 + "px";
};

// Save files
const handleSaveFile = async () => {
    let granted = false;
    const contents = textEditor.value;

    const opts = {
        mode: "readwrite",
    };

    if (inputOrigin === "localFile") {
        // Get file permission
        if ((await fileHandle.queryPermission(opts)) === "granted") {
            granted = true;
        } else if ((await fileHandle.requestPermission(opts)) === "granted") {
            granted = true;
        }

        // Create writeable stream to text file
        if (granted) {
            try {
                const writable = await fileHandle.createWritable();
                await writable.write(contents);
                await writable.close();
            } catch (error) {
                console.log(error);
            }
        }
    }

    else if (inputOrigin === "newFile") {
        try {
            const saveHandle = await window.showSaveFilePicker(pickerOpt);
            const writable = await saveHandle.createWritable();
            await writable.write(contents);
            await writable.close();
        } catch (error) {
            console.log(error);
        }
    }
};

buttonNew.addEventListener("click", handleCreateNewFile);
buttonOpen.addEventListener("click", handleOpenLocalFile);
buttonOpenDic.addEventListener("click", handleOpenDirectory);

buttonDecrease.addEventListener("click", decreaseFontSize);
buttonIncrease.addEventListener("click", increaseFontSize);

