const url = require('url');

module.exports = class Pagination {
    constructor(urlString, itemsCount, itemsPerPage) {
        this.urlParts = url.parse(urlString, true);
        this.itemsCount = itemsCount;
        this.itemsPerPage = itemsPerPage;
    }

    paginate() {
        return {
            pageCount: Math.ceil(this.itemsCount / this.itemsPerPage),
            currentPage: this.getCurrentPage(),
            links: this.generateLinks()
        };
    }

    getCurrentPage() {
        return this.urlParts.query.page != undefined ? this.urlParts.query.page : 1;
    }

    generateLinks() {
        let links = [];

        this.urlParts.query.page = 0;

        for (let i=1; i <= this.itemsCount; i +=  this.itemsPerPage) {
            this.urlParts.query.page++;
            delete this.urlParts.path;
            delete this.urlParts.href;
            delete this.urlParts.search;
            links.push(url.format(this.urlParts));
        }

        return links;
    }
};
