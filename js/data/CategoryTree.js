export default class CategoryTree {
    constructor(topName) {
        this.topCategory = {
            name: topName,
            children: []
        }
    }

    getTopCategoryName(){
        return this.topCategory['name'];
    }

    getTopCategory() {
        return this.topCategory;
    }

    /*=============== 새 카테고리 추가 ===============*/
    addNewCategory(path, newCategoryName){
        let parentCategory = getCurrentCategory(path);
        const child = this.getChild(parentCategory, newCategoryName);

        // 이름 중복
        if(child !== null) return false;

        parentCategory['children'].push({
            name : newCategoryName,
            children : []
        });

        return true
    }

    /* 경로 이용한 현재 카테고리 탐색 */
    getCurrentCategory(path, currentCategory = this.topCategory){
        if(path.length == 1){
            return currentCategory;
        }

        path.shift();
        return this.getCurrentCategory(path, getChild(currentCategory, path[0]));
    }

    /* 현재 카테고리의 자식을 이름으로 찾아서 반환 */
    getChild(current, childName){
        for(const child of current['children']){
            if(child['name'] === childName) return child;
        }
        return null;
    }

    /*=============== 카테고리 이동할때 ===============*/
    /* 전체 Tree 순회하면서 선택된 카테고리 찾기 */
    getSelectedCategory(parentName = '', selectedName){
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

    getChildrenCategory(parentName = null, selectedName){
        if(parentName === null) return this.topCategory['children'];
        const selectedCategory = getCategory(parentName, selectedName);
        return selectedCategory['children'];
    }
}