import constants from '../util/constants.js';

export default class Controller {
    constructor(viewManager, dataManager) {
        this.viewManager = viewManager;
        this.dataManager = dataManager;
        this.IDs = constants['IDs'];
        this.$addTopButton = document.querySelector(this.IDs['ADD_TOP_BUTTON_ID']);
        this.$addLogButton = document.querySelector(this.IDs['ADD_LOG_BUTTON_ID']);
        this.$input = document.querySelector(this.IDs['ADD_INPUT_ID']);
        this.$addCateButton = document.querySelector('#add-button-category');
    }

    run() {
        this.viewManager.init(this.viewEventDetector.bind(this));
        this.setStoredCategory();
        this.setInputEnterKeyEvent();
        this.setAddButtonClickEvent();
    }

    viewEventDetector(eventName, event = null) {
        const events = {
            TOP_CATEGORY_CLICKED: () => {
                this.categoryClickedEventHandler(event);
            },
            INPUT_CATEGORY: () => {
                this.categoryInputEventHandler(event);
            },
            SUB_MENU_CLICKED: () => {
                this.subMenuClickedEventHandler(event);
            },
            CONFIRM_CLICKED: () => {
                this.inputConfirmProcess(event);
            },
            CANCEL_CLICKED: () => {
                this.viewManager.closeInputForm();
            },
            LOG_CLICKED: () => {
                this.popUpContents(event);
            }
        }

        events[eventName]();
    }

    popUpContents(event){
        const id = event.currentTarget.firstChild.childNodes[1].innerText;
        const $nav = this.viewManager.getNavigator();
        const path = this.getPath($nav.childNodes);
        const contents = this.dataManager.getContentsUseId(path, id);
        this.viewManager.openContents(path, contents['title'], contents['text']);
    }

    categoryClickedEventHandler(event) {
        const $button = event.currentTarget;
        const topName = $button.innerText;
        const categoryTree = this.dataManager.getCategoryTree(topName);
        const contentsObj = this.dataManager.getCurrentContents([topName]);

        if (categoryTree === null) return;

        this.viewManager.selectedTopCategory(topName, categoryTree.getTopCategoryChildren())

        if(contentsObj !== null){
            this.viewManager.updateLogList(contentsObj['contents']);
        }

        this.toggleClass('selected');
    }

    categoryInputEventHandler(event){
        const $form = event.currentTarget;
        const categoryName = $form.value;
        
        if(categoryName === ''){
            $form.value = '';
            $form.placeholder = '이름을 입력해주세요.';
            return;
        }

        const $ul = $form.parentNode.parentNode;
        const path = this.getPath($ul.childNodes);

        if(!this.dataManager.saveNewCategory(path, categoryName)){ 
            $form.value = '';
            $form.placeholder = '이미 존재하는 카테고리입니다....';
            return;
         }

        this.viewManager.addNewCategory(categoryName);
    }

    subMenuClickedEventHandler(event){
        const $submenuLi = event.currentTarget;
        const moveTo = $submenuLi.innerText;
        const $menu_item = $submenuLi.closest('.menu-item');
        const $menu = $submenuLi.closest('#nav');
        const depth = $menu_item.id[$menu_item.id.length-1];

        $menu_item.firstChild.innerText = moveTo;
        const path = this.getPath($menu.childNodes, depth);
        const children = this.dataManager.getChildren(path.slice());
        this.viewManager.clickedSubMenu($menu_item, children);

        const contentsObj = this.dataManager.getCurrentContents(path);

        if(contentsObj === null){
            this.viewManager.clearLogList();    
            return;
        }
        this.viewManager.updateLogList(contentsObj['contents']);
        
        // view
        // 1. li span 이름 바꾸기
        // 2. 부모의 아래 형제 다 지우고 새로 구한 childList 로 하위 버튼 생성
    }

    getPath(childNodes, depth = 5){
        const path = [];
        let innerText = '';
        for(const node of childNodes){
            innerText = node.firstChild.innerText;
            if(depth === 0) return path;
            if(innerText !== 'X' && innerText !== '▼' && innerText !== '') {
                path.push(innerText);
                depth--;
            }
        }
        return path;
    }

    setStoredCategory() {
        const storedData = this.dataManager.getStoredData();
        const storedCategory = storedData['category'];

        if (storedCategory.length === 0) return;

        this.viewManager.setStoredCategory(storedCategory);
    }

    setInputEnterKeyEvent() {
        this.$input.addEventListener('keydown', (e) => {
            const key = e.key;
            switch (key) {
                case 'Enter':
                    this.addInputEventHandler(e);
                    break;
                case 'Escape':
                    this.toggleClass('input');
                    break;
            }
        }, true);
    }

    addInputEventHandler(event) {
        const $input = event.currentTarget;
        const value = $input.value;

        if(value === '') {
            $input.value = '';
            $input.placeholder = '상위 카테고리 이름을 입력해주세요.';
            return;
        };

        if (!this.dataManager.saveTopCategory(value)) {
            this.$input.value = '';
            this.$input.placeholder = '이미 존재하는 카테고리입니다!';
            return false;
        }
        this.viewManager.addTopCategory(value);
        this.toggleClass('input');
    }

    toggleClass(value) {
        switch (value) {
            case 'input':
                this.$input.value = '';
                this.$input.placeholder = '입력 후 생성은 enter를, 취소는 esc';
                this.$input.classList.toggle(value);
                this.$addLogButton.classList.toggle(value);
                this.$addTopButton.classList.toggle(value);
                break;
            case 'selected':
                this.$addLogButton.classList.add(value);
                this.$addCateButton.classList.add(value);
                break;
        }
    }

    setAddButtonClickEvent() {
        this.$addTopButton.addEventListener('click', (e) => {
            this.topClickEventHandler(e)
        });
        this.$addLogButton.addEventListener('click', (e) => {
            this.clickedAddLogEventHandler(e);
        });
        this.$addCateButton.addEventListener('click', (e) => {
            this.addClickEventHandler(e)
        })
    }

    topClickEventHandler(event) {
        this.toggleClass('input');
        this.$input.focus();
    }

    addClickEventHandler(){
        this.viewManager.plusButtonClicked();
    }

    clickedAddLogEventHandler(e){
        const $nav = this.viewManager.getNavigator();
        const path = this.getPath($nav.childNodes);
        this.viewManager.openInputForm(path);
    }

    inputConfirmProcess(e){
        if(!this.viewManager.checkInputForm()) return;

        const inputObj = this.viewManager.getInputData();

        const contentsObj = this.dataManager.saveContentsObj(inputObj['path'], inputObj['title'], inputObj['contents']);
        this.viewManager.updateLogList(contentsObj['contents']);
        this.viewManager.closeInputForm();
    }
}