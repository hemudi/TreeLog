import constants from '../util/constants.js';

const IDs = constants['IDs'];

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

    addTopCategory(topName){
        this.CategoryViewManager.createCategory(topName);
    }

    selectedTopCategory(selectedTree){
        return this.TreeViewManager.init(selectedTree);
    }

    plusButtonClicked(){
        this.TreeViewManager.transInputForm();
    }

    addNewCategory(name){
        this.TreeViewManager.transInputForm();
        this.TreeViewManager.addSubmenu(name);
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
        $button.addEventListener('click', (e) => {this.eventDetector('TOP_CATEGORY_CLICKED', e)});
        return $button;
    }
}

class TreeViewManager {
    constructor(eventDetector){
        this.eventDetector = eventDetector;
        this.selectedTree = null;
        this.$treeUl = document.querySelector('#nav');
        this.removedLi = null;
    }

    init(selectedTree){
        this.clearUl();
        this.selectedTree = selectedTree;
        const topName = selectedTree.getTopCategoryName();
        const topChildren = selectedTree.getTopCategoryChildren();
        this.createCategory(topName, topChildren);
        return this.$treeUl.hasChildNodes();
    }

    createCategory(category, children, depth = 1){
        const $categoryLi = this.createLi('menu-item', category, depth);

        let $blankLi;

        if(children.length === 0){
            $blankLi = this.createLi('menu-item', 'X', depth+1);
        } else {
            $blankLi = this.createLi('menu-item', '▼', depth+1);
            $blankLi.append(this.createSubMenuUl(children, depth+1));
        }

        this.$treeUl.appendChild($categoryLi);
        this.$treeUl.appendChild($blankLi);
    }

    createSpan(categoryName){
        const $categorySpan = document.createElement('span');
        $categorySpan.innerText = categoryName;
        return $categorySpan;
    }

    createLi(type, categoryName, depth){
        const $textSpan = this.createSpan(categoryName);
        const $categoryLi = document.createElement('li');
        $categoryLi.classList.add(type);
        $categoryLi.classList.add('depth-' + depth);
        $categoryLi.id = 'depth-' + depth;
        $categoryLi.append($textSpan);
        return $categoryLi;
    }

    createSubMenuUl(children, depth){
        const $ul = document.createElement('ul');
        $ul.classList.add('submenu');
        $ul.classList.add('depth-' + depth);

        for(const child of children){
            $ul.appendChild(this.createLi('submenu-item', child['name'], depth));
        }

        return $ul;
    }

    transInputForm(){
        if(this.removedLi !== null){
            this.$treeUl.removeChild(this.getLastElement());
            this.$treeUl.appendChild(this.removedLi);
            this.removedLi = null;
            return;
        }

        this.removedLi = this.getLastElement();
        this.$treeUl.removeChild(this.removedLi);
        this.$treeUl.appendChild(this.createInputFormLi());
        document.getElementById('cate-input').focus();
    }

    getLastElement(){
        const children = this.$treeUl.children;
        return children[children.length-1];
    }

    createInputFormLi(){
        const $inputLi = document.createElement('li');
        $inputLi.classList.add('menu-item');
        $inputLi.append(this.createInputForm());
        return $inputLi;
    }

    createInputForm(){
        const $input = document.createElement('input');
        $input.classList.add('cate-input');
        $input.id = 'cate-input';
        $input.type = 'text';
        $input.placeholder = '입력 후 enter 취소는 esc';
        $input.addEventListener('keydown', (e) => {
            const key = e.key;
            switch (key) {
                case 'Enter':
                    this.eventDetector('INPUT_CATEGORY', e);
                    break;
                case 'Escape':
                    this.transInputForm();
                    break;
            }
        });
        return $input;
    }

    clearUl(){
        while(this.$treeUl.hasChildNodes()){
            this.$treeUl.removeChild(this.$treeUl.firstChild);
        }
    }

    // 맨 끝에 거의 서브메뉴에 추가
    addSubmenu(menuName){
        const $lastLi = this.getLastElement();
        const lastLiId = $lastLi.id;
        const depth = lastLiId[lastLiId.length-1];
        let $submenuUl = null;
        
        if($lastLi.childNodes.length === 1){
            $submenuUl = this.createSubMenuUl([{name:menuName}], depth);
            $lastLi.append($submenuUl);
            return;
        }

        $submenuUl = $lastLi.children[1];
        $submenuUl.appendChild(this.createLi('submenu-item', menuName, depth));
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