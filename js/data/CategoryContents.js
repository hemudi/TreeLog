export default class CategoryContents {
    constructor(path){
        this.path = path;
        this.contentsList = [];
        this.TOP_CATEGORY_INDEX = 0;
    }

    getPath(){
        return this.path;
    }

    getTopCategory(){
        return this.path[TOP_CATEGORY_INDEX];
    }

    addContents(title, contents){
        this.contents.push({
            id : this.getId(),
            title : title,
            contents : contents
        })
    }

    getContents(id){
        for(contents of this.contentsList){
            if(contents['id'] === id) return contents;
        }
        return null;
    }

    getContentsList(){
        return this.contents;
    }

    getId(){
        const timeId = new Date();
        return timeId.getTime();
    }
}