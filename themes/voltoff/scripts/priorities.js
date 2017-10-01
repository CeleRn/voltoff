/**
* Thumbnail Helper
* @description Get the thumbnail url from a post
* @example
*     <%- thumbnail(post) %>
*/

// Вывод тега title
hexo.extend.helper.register('h1Escape', function (page) {
    var seoH1 = null;
    if (page.seo) {
        if (page.seo.h1 != "") {
            seoH1 = page.seo.h1;
        }
    }
    return seoH1 || page.longtitle || page.title || '';
});

// Вывод тега title
hexo.extend.helper.register('titleEscape', function (page) {
    var seoTitle = null;
    if (page.seo) {
        if (page.seo.title != "") {
            seoTitle = page.seo.title;
        }
        
    }
    return seoTitle || page.longtitle || page.title || '';
});

// Вывод тега description
hexo.extend.helper.register('descriptionEscape', function (page) {
    var seoDescription = "";
    if (page.seo) {
        if (page.seo.description && page.seo.description != "") {
            seoDescription = '<meta name="description" content="' + page.seo.description + '" />';
        }
    }
    return seoDescription || '';
});

// Вывод тега keywords
hexo.extend.helper.register('keywordsEscape', function (page) {
    var seoKeywords = "";
    if (page.seo) {
        if (page.seo.keywords && page.seo.keywords != "") {
            seoKeywords = '<meta name="keywords" content="' + page.seo.keywords + '" />';
        }
        
    }
    return seoKeywords || '';
});