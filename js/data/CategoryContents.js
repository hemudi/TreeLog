class CategoryContents {
    constructor(categoryName){
        this.categoryName = categoryName;
        this.contentsList = [];
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