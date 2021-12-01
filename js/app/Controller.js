import TOP_CATEGORY_CLICKED from '../util/constants.js';
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
    }

    run() {
        this.viewManager.init(this.viewEventDetector.bind(this));
        this.setStoredCategory();
        this.setInputEnterKeyEvent();
        this.setAddButtonClickEvent();
    }

    viewEventDetector(eventName, dataObject = null) {
        const events = {
            TOP_CATEGORY_CLICKED: () => {}
        }

        events[eventName]();
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
            switch(key){
                case 'Enter': this.addInputEventHandler(e); break;
                case 'Escape': this.toggleClass('input'); break;
            }
        }, true);
    }

    addInputEventHandler(event) {
        const $input = event.currentTarget;
        const value = $input.value;
        this.addTopCategory(value);
        this.toggleClass('input');
    }

    addTopCategory(topName){
        if(!this.dataManager.saveCategory(topName)) {
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
                this.$dimmed.classList.toggle('pop-up');
                this.$input_container.classList.toggle('pop-up');
                break;
        }
    }

    setAddButtonClickEvent() {
        this.$addTopButton.addEventListener('click', (e) => {
            this.buttonClickEventHandler(e)
        });
        this.$addLogButton.addEventListener('click', (e) => {
            this.buttonClickEventHandler(e)
        });
    }

    buttonClickEventHandler(event) {
        const $clicked = event.currentTarget;
        const type = $clicked.getAttribute('id');

        if (type === 'top') {
            this.toggleClass('input');
            this.$input.focus();
            return;
        }

        this.toggleClass('pop-up');
    }

    topCategoryClickEventHandler(event) {
        const $button = event.currentTarget;
        const innerText = $button.innerText;
    }

}