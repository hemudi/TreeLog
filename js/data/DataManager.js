/*
    tempStorage = {
        category : [categoryObject],
        contentsList : [contentsObject]
    }

    categoryObject = {
        topName : 'topName',
        tree : categoryTree
    }

    contentsObject = {
        path : path
        contents : [{
            title : 
            text :
        }]
    }
*/

import CategoryContents from "./CategoryContents.js";
import CategoryTree from "./CategoryTree.js";

export default class DataManager {
    constructor(storageKey){
        this.storageKey = storageKey
        this.tempStorage = {
            category : [],
            contentsList : []
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

        // let categoryContents = null;
        // let contentsObj = null;
        // let array = null;
        // let path;
        // for(const contents of this.tempStorage['contentsList']){
        //     path = contents['path'];
        //     categoryContents = new CategoryContents(path);
        //     contentsObj = contents['contents'];
        //     array = contents['contentsList'];
        //     // contentsList.setContentList(contents['contents']);
        //     // contents = contentsList;
        // }
    }

    getStoredCategory(){
        return this.tempStorage['category'];
    }

    getStoredContents(){
        return this.tempStorage['contentsList'];
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

    saveContentsObj(path, title, text){
        const savedContents = this.getCurrentContents(path);

        if(savedContents !== null){
            savedContents['contents'].push({
                id : this.getId(),
                title : title,
                text : text
            });
                this.setLocalStorage();
                return this.getCurrentContents(path);
        }

        this.tempStorage['contentsList'].push({
            path : path,
            contents : [{
                id : this.getId(),
                title : title,
                text : text
            }]
        })

        this.setLocalStorage();
        return this.getCurrentContents(path);
    }

    getId(){
        const timeId = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') ;
        return timeId;
    }

    saveNewCategory(path, newCategoryName){
        const categoryTree = this.getCategoryTree(path[0]);
        const result = categoryTree.addNewCategory(path, newCategoryName);
        
        if(!result) return false;

        this.setLocalStorage();
        return true;
    }

    getChildren(path){
        const categoryTree = this.getCategoryTree(path[0]);
        const children = categoryTree.getCurrentCategory(path)['children'];
        return children;
    }

    getCurrentContents(path){
        for(const obj of this.tempStorage['contentsList']){
            if(obj['path'].join('/') === path.join('/')){
                return obj;
            }
        }

        return null;
    }

    getContentsUseId(path, id){
        const contentsObj = this.getCurrentContents(path);
        const contentsList = contentsObj['contents'];
        for(const contents of contentsList){
            if(contents['id'] === id){
                return contents;
            }
        }
        return null;
    }
}