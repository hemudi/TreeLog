export default class StorageManager {
    constructor(storageKey){
        this.storageKey = storageKey
        this.tempStorage = {
            category : [],
            contents : []
        }
    }

    getStoredData(){
        const storedData = localStorage.getItem(this.storageKey);
        this.tempStorage = (storedData !== null ? JSON.parse(storedData) : this.tempStorage);
        return this.tempStorage;
    }

    setLocalStorage(){
        localStorage.setItem(this.storageKey, JSON.stringify(this.tempStorage));
    }

    saveCategory(topCategoryName, categoryTree){
        this.tempStorage['category'].push({
            key : topCategoryName,
            value : categoryTree
        });
        this.setLocalStorage();
    }

    saveContents(categoryName, contents){
        this.tempStorage['contents'].push({
            key : categoryName,
            value : contents
        })
        this.setLocalStorage();
    }
}