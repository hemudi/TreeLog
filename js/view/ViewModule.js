import constants from '../util/constants.js';

const IDs = constants['IDs'];

export default class ViewManager {
    constructor() {
        this.CategoryViewManager = null;
        this.TreeViewManager = null;
        this.ContentsViewManager = null;
        this.InputViewManager = null;
        this.currentSelectedTop = null;
    }

    init(eventDetector) {
        this.CategoryViewManager = new CategoryViewManager(eventDetector);
        this.TreeViewManager = new TreeViewManager(eventDetector);
        this.ContentsViewManager = new ContentsViewManager(eventDetector);
        this.InputViewManager = new InputViewManager(eventDetector);
        this.InputViewManager.init();
    }

    setStoredCategory(categoryList) {
        this.CategoryViewManager.init(categoryList);
    }

    addTopCategory(topName) {
        this.CategoryViewManager.createCategory(topName);
    }

    selectedTopCategory(topName, children) {
        this.currentSelectedTop = topName;
        this.TreeViewManager.init(topName, children);
    }

    getSelectedTop(){
        return this.currentSelectedTop;
    }

    getNavigator(){
        return this.TreeViewManager.getTreeUl();
    }

    plusButtonClicked() {
        this.TreeViewManager.transInputForm();
    }

    addNewCategory(name) {
        this.TreeViewManager.transInputForm();
        this.TreeViewManager.addSubmenu(name);
    }

    clickedSubMenu($parentLi, children){
        this.TreeViewManager.renderCurrent($parentLi, children);
    }

    openInputForm(path){
        this.InputViewManager.openInputForm(path);
    }

    closeInputForm(){
        this.InputViewManager.closeInputForm();
    }

    checkInputForm(){
        return this.InputViewManager.isInputFormEmpty();
    }

    getInputData(){
        return this.InputViewManager.getInputData();
    }

    updateLogList(contentsObj){
        this.ContentsViewManager.renderLogList(contentsObj);
    }

    openContents(path, title, text){
        this.InputViewManager.openContents(path, title, text);
    }

    clearLogList(){
        this.ContentsViewManager.clearList();
    }
}

class CategoryViewManager {
    constructor(eventDetector) {
        this.eventDetector = eventDetector;
        this.$categoryUl = document.querySelector(IDs['TOP_CATEGORY_ID']);
    }

    init(categoryList) {
        for (const category of categoryList) {
            this.createCategory(category['topName']);
        }
    }

    createCategory(categoryName) {
        const $categoryButton = this.createButton(categoryName);
        const $categoryLi = document.createElement('li');
        $categoryLi.classList.add('top-item');
        $categoryLi.append($categoryButton);
        this.$categoryUl.appendChild($categoryLi);
    }

    createButton(name) {
        const $button = document.createElement('button');
        $button.innerText = name;
        $button.classList.add('top-category-button');
        $button.addEventListener('click', (e) => {
            this.eventDetector('TOP_CATEGORY_CLICKED', e)
        });
        return $button;
    }
}

class TreeViewManager {
    constructor(eventDetector) {
        this.eventDetector = eventDetector;
        this.$treeUl = document.querySelector('#nav');
        this.removedLi = null;
    }

    getTreeUl(){
        return this.$treeUl;
    }

    init(topName, topChildren) {
        this.clearUl();
        this.createCategory(topName, topChildren);
        // return this.$treeUl.hasChildNodes();
    }

    createCategory(category, children, depth = 1) {
        const $categoryLi = this.createLi('menu-item', category, depth);
        this.$treeUl.appendChild($categoryLi);

        if(+depth === 5) return;

        let $blankLi = this.getBlankLi(children, depth);
        this.$treeUl.appendChild($blankLi);
    }

    createSpan(categoryName) {
        const $categorySpan = document.createElement('span');
        $categorySpan.innerText = categoryName;
        return $categorySpan;
    }

    createLi(type, categoryName, depth) {
        const $textSpan = this.createSpan(categoryName);
        const $categoryLi = document.createElement('li');
        $categoryLi.classList.add(type);
        $categoryLi.classList.add('depth-' + depth);
        $categoryLi.id = 'depth-' + depth;
        $categoryLi.append($textSpan);

        switch(type){
            case 'submenu-item' :
                $categoryLi.addEventListener('click', (e) => {
                    this.eventDetector('SUB_MENU_CLICKED', e)
                });
            break;
        }

        if(depth === 1){
            $categoryLi.addEventListener('click', (e) => {
                this.eventDetector('TOP_CATEGORY_CLICKED', e);
            })
        }

        return $categoryLi;
    }

    createSubMenuUl(children, depth) {
        const $ul = document.createElement('ul');
        $ul.classList.add('submenu');
        $ul.classList.add('depth-' + depth);

        for (const child of children) {
            $ul.appendChild(this.createLi('submenu-item', child['name'], depth));
        }

        return $ul;
    }

    transInputForm() {
        if (this.removedLi !== null) {
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

    getLastElement() {
        const children = this.$treeUl.children;
        return children[children.length - 1];
    }

    createInputFormLi() {
        const $inputLi = document.createElement('li');
        $inputLi.classList.add('menu-item');
        $inputLi.append(this.createInputForm());
        return $inputLi;
    }

    createInputForm() {
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

    clearUl() {
        while (this.$treeUl.hasChildNodes()) {
            this.$treeUl.removeChild(this.$treeUl.firstChild);
        }
    }

    // 맨 끝에 거의 서브메뉴에 추가
    addSubmenu(menuName) {
        const $lastLi = this.getLastElement();
        const lastLiId = $lastLi.id;
        const depth = lastLiId[lastLiId.length - 1];
        let $submenuUl = null;

        if ($lastLi.childNodes.length === 1) {
            $submenuUl = this.createSubMenuUl([{
                name: menuName
            }], depth);
            $lastLi.append($submenuUl);
            return;
        }

        $submenuUl = $lastLi.children[1];
        const $submenuItem = this.createLi('submenu-item', menuName, depth);
        $submenuUl.appendChild($submenuItem);
        setTimeout(function () {
            $submenuItem.click();
        }, 100);
    }

    setMouseEnterEvent($li) {
        let enterTimer = null;
        let leaveTimer = null;

        $li.addEventListener('mouseenter', function () {
            if (leaveTimer !== null) {
                clearTimeout(leaveTimer)
            };

            enterTimer = setTimeout(function () {
                $li.classList.add('active');
            }, 300);
        });

        $li.addEventListener('mouseleave', function () {
            if (enterTimer !== null) {
                clearTimeout(enterTimer);
            }
            leaveTimer = setTimeout(function () {
                $li.classList.remove('active');
            }, 300);

        });
    }

    renderCurrent($parentLi, children){
        const depth = $parentLi.id[$parentLi.id.length-1];

        if(+depth === 5) return;

        this.sliceUlChild(depth);
        const $blankLi = this.getBlankLi(children, depth);
        this.$treeUl.appendChild($blankLi);
    }

    getBlankLi(children, depth){
        let $blankLi = null;

        if (children.length === 0) {
            $blankLi = this.createLi('menu-item', 'X', +depth + 1);
        } else {
            $blankLi = this.createLi('menu-item', '▼', +depth + 1);
            $blankLi.append(this.createSubMenuUl(children, +depth + 1));
        }

        this.setMouseEnterEvent($blankLi);
        return $blankLi;
    }

    sliceUlChild(depth){
        const children = this.$treeUl.children;
        let sliceCount = children.length - depth;

        while(sliceCount > 0){
            this.$treeUl.removeChild(this.$treeUl.lastChild);
            sliceCount--;
        }
    }
}

class ContentsViewManager {
    constructor(eventDetector) {
        this.eventDetector = eventDetector;
        this.$logUl = document.querySelector('#log-list');
    }

    renderLogList(contentsObj){
        this.clearList();
        for(const contents of contentsObj){
            this.addLogElement(contents['id'], contents['title'], contents['text']);
        }
    }

    addLogElement(date, title, contents){
        const $logTopDiv = this.createDiv(title, date);
        const $logContentsDiv = this.createDiv(contents);
        const $li = this.createLi('log-item');
        $li.append($logTopDiv);
        $li.append($logContentsDiv);
        this.$logUl.appendChild($li);
    }

    createLi(){
        const $li = document.createElement('li');
        $li.classList.add('log-item');
        $li.addEventListener('click', (e) => {
            this.eventDetector('LOG_CLICKED', e);
        })
        return $li;
    }

    createDiv(value, date = null){
        const $div = document.createElement('div');
        if(date === null){
            $div.classList.add('log-contents');
            $div.append(this.createSpan(value, 'log-contents'));
        } else {
            $div.classList.add('log-top');
            $div.append(this.createTitleHeader(value));
            $div.append(this.createSpan(date, 'log-date'));
        }

        return $div;
    }

    createTitleHeader(title){
        const $header = document.createElement('h3');
        $header.classList.add('log-title');
        $header.innerText = title;
        return $header;
    }

    createSpan(value, className){
        const $span = document.createElement('span');
        $span.classList.add(className);
        $span.innerText = value;
        return $span;
    }

    clearList(){
        while (this.$logUl.hasChildNodes()) {
            this.$logUl.removeChild(this.$logUl.firstChild);
        }
    }
}

class InputViewManager {
    constructor(eventDetector) {
        this.eventDetector = eventDetector;
        this.$dimmed = document.querySelector('#dimmed-layer');
        this.$input_container = document.querySelector('#input-container');
        this.$input_category_nav = document.querySelector('#input-nav');
        this.$input_title = document.querySelector('#input-title');
        this.$input_contents = document.querySelector('#input-contents');
        this.$input_cancel = document.querySelector('#cancel');
        this.$input_confirm = document.querySelector('#confirm');
    }

    init(){
        this.$input_confirm.addEventListener('click', (e) => {
            this.eventDetector('CONFIRM_CLICKED');
            
        });
        this.$input_cancel.addEventListener('click', (e) => {
            this.eventDetector('CANCEL_CLICKED');
        });
        this.$dimmed.addEventListener('click', (e) => {
            this.eventDetector('CANCEL_CLICKED');
        })
    }

    openInputForm(path = ''){
        this.setPath(path);
        this.toggleClass();
    }

    toggleClass(value = 'pop-up'){
        this.$dimmed.classList.toggle(value);
        this.$input_container.classList.toggle(value);
    }

    closeInputForm(){
        this.clearInputForm();
        this.toggleClass();
    }

    clearInputForm(){
        this.$input_category_nav.innerText = '';
        this.$input_title.value = '';
        this.$input_contents.value = '';
        this.$input_cancel.innerText = '취소';
        this.$input_confirm.innerText = '확인';
        this.$input_title.placeholder = '제목 입력';
        this.$input_contents.placeholder = '내용 입력';
    }

    isInputFormEmpty(){
        if(this.$input_title.value === ''){
            this.$input_title.placeholder = '제목을 적어주세요!!';
            return false;
        }

        if(this.$input_contents.value === ''){
            this.$input_contents.placeholder = '내용을 적어주세요!';
            return false;
        }

        return true;
    }

    setPath(path){
        const pathText = path.join('/');
        this.$input_category_nav.innerText = pathText;
    }

    getInputData(){
        return {
            title : this.$input_title.value,
            contents : this.$input_contents.value,
            path : this.$input_category_nav.innerText.split('/')
        }
    }

    openContents(path, title, text){
        this.$input_category_nav.innerText = path.join('/');
        this.$input_title.value = title;
        this.$input_contents.value = text;
        this.toggleClass();
    }
}