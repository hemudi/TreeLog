import constants from '../util/constants.js';

export default class Controller {
    constructor(viewManager, dataManager) {
        this.viewManager = viewManager;
        this.dataManager = dataManager;
        this.IDs = constants['IDs'];
        this.$addTopButton = document.querySelector(this.IDs['ADD_TOP_BUTTON_ID']);
        this.$addLogButton = document.querySelector(this.IDs['ADD_LOG_BUTTON_ID']);
        this.$input = document.querySelector(this.IDs['ADD_INPUT_ID']);
        this.$dimmed = document.querySelector(this.IDs['DIMMED_ID']);
        this.$input_container = document.querySelector(this.IDs['INPUT_ID']);
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
            }
        }

        events[eventName]();
    }

    categoryClickedEventHandler(event) {
        const $button = event.currentTarget;
        const topName = $button.innerText;
        const categoryTree = this.dataManager.getCategoryTree(topName);

        if (categoryTree === null) return;
        if (!this.viewManager.selectedTopCategory(categoryTree)) return;
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

    getPath(childNodes){
        const path = [];
        for(const node of childNodes){
            path.push(node.innerText);
        }
        path.pop();
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

        this.addTopCategory(value);
        this.toggleClass('input');
    }

    addTopCategory(topName) {
        if (!this.dataManager.saveTopCategory(topName)) {
            this.$input.value = '';
            this.$input.getAttribute('placeholder') = '이미 존재하는 카테고리입니다!';
            return;
        }
        this.viewManager.addTopCategory(topName);
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
            case 'pop-up':
                this.$dimmed.classList.toggle(value);
                this.$input_container.classList.toggle(value);
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
            this.toggleClass('pop-up');
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

    topCategoryClickEventHandler(event) {
        const $button = event.currentTarget;
        const innerText = $button.innerText;
    }

}