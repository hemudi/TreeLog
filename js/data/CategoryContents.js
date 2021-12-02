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

    setContentsList(contentsList){
        this.contentsList = contentsList;
    }

    addContents(title, contents){
        this.contentsList.push({
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
        return this.contentsList;
    }

    getId(){
        const timeId = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') ;
        return timeId;
    }
}