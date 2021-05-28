
let projectName = '';

export const handleRenderDirectories = (dic) => {
    projectName = dic.name;

    const parentFragment = document.createDocumentFragment();

    const assemblyFiles = (files, parentContainer) => {
        for (let i = 0; i < files.length; i++) {
            const { name } = files[i];
            const listElement = document.createElement('li');
            
            listElement.innerText = name;
            listElement.classList.add('common-file');

            parentContainer.appendChild(listElement);
            
        }
    }

    const assemblyDic = (dics, parentContainer) => {
       for (let i = 0; i < dics.length; i++) {
           const dic = dics[i];
           const { name, kind } = dic;
           
           if (!dic.directories.length) {
               const listElement = document.createElement('li');
               
               listElement.innerText = name;
               listElement.classList.add('empty-dic');

               parentContainer.appendChild(listElement);
           } else {
                if(kind === 'file') assemblyFile(dic.files, parentContainer);
                else {
                    const parentElement = document.createElement('ul');

                    parentElement.innerText = name;
                    parentElement.classList.add('common-dic');
                    parentContainer.appendChild(parentElement);
    
                    assemblyDic(dic, parentElement);
                }

           }
       } 
    }

    assemblyFiles(dic.files, parentFragment);
    assemblyDic(dic.directories, parentFragment);
    document.querySelectorAll('.project-container')[0].appendChild(parentFragment);
}