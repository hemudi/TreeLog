/*
    tempStorage = {
        category : [categoryObject],
        contents : [contentsObject]
    }

    categoryObject = {
        topName : 'topName',
        tree : categoryTree
    }

    contentsObject = {
        path : path
        contents : categoryContents
    }
*/

import CategoryContents from "./CategoryContents.js";
import CategoryTree from "./CategoryTree.js";

export default class DataManager {
    constructor(storageKey){
        this.storageKey = storageKey
        this.tempStorage = {
            category : [],
            contents : []
        }
    }

    // 저장된 데이터 가져오기
    getStoredData(){
        const storedData = localStorage.getItem(this.storageKey);
        this.tempStorage = (storedData !== null ? JSON.parse(storedData) : this.tempStorage);
        this.reParseObj();
        return this.tempStorage;
    }

    reParseObj(){
        let topCategory = null;
        for(const category of this.tempStorage['category']){
            topCategory = category['tree']['topCategory'];
            category['tree'] = new CategoryTree(topCategory['name'], topCategory['children']);
        }
    }

    getStoredCategory(){
        return this.tempStorage['category'];
    }

    getStoredContents(){
        return this.tempStorage['contents'];
    }

    setLocalStorage(){
        localStorage.setItem(this.storageKey, JSON.stringify(this.tempStorage));
    }

    getCategoryTree(topName){
        for(const category of this.tempStorage['category']){
            if(category['topName'] === topName){
                return category['tree'];
            };
        }
        return null;
    }

    getCategoryContents(path){
        const pathToString = path.join('');
        for(const savedContents of this.tempStorage['contents']){
            if(savedContents['path'].join('') === pathToString){
                return savedContents;
            }
        }
        return null;
    }
    
    saveTopCategory(topCategoryName, categoryTree = null){
        const savedCategory = this.getCategoryTree(topCategoryName);

        // 변경의 경우
        if(savedCategory !== null && categoryTree !== null){
            savedCategory['tree'] = categoryTree;
            this.setLocalStorage();
            return true;
        }

        // 새로 추가 : 상위 카테 이름 중복인 경우
        if(savedCategory !== null){
            return false;
        }

        // 새로 추가 : 성공
        categoryTree = new CategoryTree(topCategoryName);
        this.tempStorage['category'].push({
            topName : topCategoryName,
            tree : categoryTree
        });

        this.setLocalStorage();
        return true;
    }

    saveContentsObj(path, contents = null){
        if(contents === null){
            contents = new CategoryContents(path);
        }

        const savedContents = this.getCategoryContents(path);

        if(savedContents !== null && contents !== null){
            savedContents['contents'] = contents;
                this.setLocalStorage();
                return;
        }

        contents = new CategoryContents(path);
        this.tempStorage['contents'].push({
            path : contents.getPath(),
            contents : contents
        })

        this.setLocalStorage();
    }

    saveNewCategory(path, newCategoryName){
        const categoryTree = this.getCategoryTree(path[0]);
        const result = categoryTree.addNewCategory(path, newCategoryName);
        
        if(!result) return false;

        this.setLocalStorage();
        return true;
    }

    saveNewContents(path, title, contents){
        const categoryContents = this.getContents(path);
        categoryContents.addContents(title, contents);
        this.setLocalStorage();
    }    
}