class CategoryTree {
    constructor(topName) {
        this.topCategory = {
            name: topName,
            children: []
        }
        this.parentCategory = null;
        this.currentCategory = this.topCategory;
    }

    getTopCategory() {
        return this.topCategory;
    }

    getCurrentCategory() {
        return this.currentCategory;
    }

    getParentCategory() {
        return this.parentCategory;
    }

    moveTo(category) {
        this.parentCategory = this.currentCategory;
        this.currentCategory = category;
    }

    moveToTopCategory() {
        this.parentCategory = null;
        this.currentCategory = this.topCategory;
        return this.topCategory;
    }

    moveToChildCategory(selectedName) {
        const childCategory = this.getChildCategory(selectedName);

        if (childCategory === null) return null;
        return this.moveTo(childCategory);
    }

    moveToCategory(parentName, selectedName){
        const categoryToMove = this.searchTree(parentName, selectedName);
        if(categoryToMove === false) return false;
        return this.moveTo(categoryToMove);
    }

    searchTree(parentName, selectedName){
        let queue = this.topCategory['children'];
        let current = null;
        let child = null;

        while(queue.length != 0){
            current = queue.shift();

            if(current['name'] !== parentName){
                queue = queue.concat(current['children']); // 빈배열도 되는지 테스트
                continue;
            }

            child = this.getChildCategory(current, selectedName);
            if(child !== null) break;
        }

        return child !== null ? child : false;
    }

    getChildCategory(parent = null, childName) {
        if(parent === null) parent = this.currentCategory;

        const children = parent['children'];

        for (const child of children) {
            if (child.getName() === childName) {
                return child;
            }
        }
        return null;
    }

    addChildCategory(childName) {
        if (this.getChildCategory(childName) !== null) return false; // 한 부모 내에서는 중복 불가능

        const newCategory = {
            name: childName,
            children: []
        };

        this.currentCategory['child'].push(newCategory);
        this.moveTo(newCategory);
        return this.currentCategory;
    }
}