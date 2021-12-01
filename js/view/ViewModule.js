import constants from '../util/constants.js';

const IDs = constants['IDs'];
const TOP_CATEGORY_CLICKED = constants['TOP_CATEGORY_CLICKED'];

export default class ViewManager {
    constructor(){
        this.CategoryViewManager = null;
        this.TreeViewManager = null;
        this.ContentsViewManager = null;
        this.InputViewManager = null;
    }

    init(eventDetector){
        this.CategoryViewManager = new CategoryViewManager(eventDetector);
        this.TreeViewManager = new TreeViewManager(eventDetector);
        this.ContentsViewManager = new ContentsViewManager(eventDetector);
        this.InputViewManager = new InputViewManager(eventDetector);
    }

    setStoredCategory(categoryList){
        this.CategoryViewManager.init(categoryList);
    }

    getCategoryViewManager(){
        return this.CategoryViewManager;
    }

    getTreeViewManager(){
        return this.TreeViewManager;
    }

    getContentsViewManager(){
        return this.ContentsViewManager;
    }

    getInputViewManager(){
        return this.InputViewManager;
    }
    
    addTopCategory(topName){
        this.CategoryViewManager.createCategory(topName);
    }
}

class CategoryViewManager {
    constructor(eventDetector){
        this.eventDetector = eventDetector;
        this.$categoryUl = document.querySelector(IDs['TOP_CATEGORY_ID']);
    }

    init(categoryList){
        for(const category of categoryList){
            this.createCategory(category['topName']);
        }
    }

    createCategory(categoryName){
        const $categoryButton = this.createButton(categoryName);
        const $categoryLi = document.createElement('li');
        $categoryLi.classList.add('top-item');
        $categoryLi.append($categoryButton);
        this.$categoryUl.appendChild($categoryLi);
    }

    createButton(name){
        const $button = document.createElement('button');
        $button.innerText = name;
        $button.classList.add('top-category-button');
        $button.addEventListener('click', (e) => {this.eventDetector(TOP_CATEGORY_CLICKED)});
        return $button;
    }
}

class TreeViewManager {
    constructor(eventDetector){
        this.eventDetector = eventDetector;
    }
}

class ContentsViewManager {
    constructor(eventDetector){
        this.eventDetector = eventDetector;
    }
}

class InputViewManager {
    constructor(eventDetector){
        this.eventDetector = eventDetector;
    }
}