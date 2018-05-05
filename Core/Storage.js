//Save and load settings set by the user
const Storage = (() => {
    
    const storageSelectionName = "XSChoices";
    const storageToggleName = "XStogglePage";
    const storageExtensionName = "XSextensions";

	const getSelections = async () => {
    
        const storageObject = await browser.storage.local.get(storageSelectionName);
        const selections = storageObject[storageSelectionName] || [];
        
        //The object properties are lost in the local storage so let's put them back in.
        //Also put the selection up to date in case of new XS versions.
        const prototypedSelections = [];
        for(const selection of selections){            
            const newSelection = Selection.createFromObject(selection);
            newSelection.cleanUp();
            prototypedSelections.push(newSelection);
        }

        await saveSelections(prototypedSelections);
        return prototypedSelections;

	}

	const saveSelections = async (selections) => {
		await browser.storage.local.set({
			[storageSelectionName] : selections
		});
    }

    const getToggle = async () => {
    
        const storageObject = await browser.storage.local.get(storageToggleName);
        const toggle = storageObject[storageToggleName] || {};

        await saveToggle(toggle);
        return toggle;

    }
    
    const saveToggle = async (toggle) => {
		await browser.storage.local.set({
			[storageToggleName] : toggle
		});
    }

    const getExtensions = async () => {
    
        const storageObject = await browser.storage.local.get(storageExtensionName);
        const choices = storageObject[storageExtensionName] || [];

        //Saving object in storage means there prototype is gone. Set it back.
        const prototypedChoices = [];
        for(const choice of choices){
            const prototypedChoice = Choice.createFromObject(choice, "Extension");
            if(prototypedChoice.hasRecognizedId()){
                prototypedChoice.cleanPicks();
                prototypedChoices.push(prototypedChoice);
            }
        }

        //Add extra choices for new extensions.
        for(const extension of Extension.getAll()){
            if(prototypedChoices.every(choice => choice.id !== extension.id)){
                const newChoice = new Choice(extension.id, "Extension");
                prototypedChoices.push(newChoice);
            }
        }

        await saveExtensions(prototypedChoices);
        return prototypedChoices;

    }
    
    const saveExtensions = async (choices) => {
		await browser.storage.local.set({
			[storageExtensionName] : choices
		});
    }


    

	return {getSelections, saveSelections, getToggle, saveToggle, getExtensions, saveExtensions};

})();