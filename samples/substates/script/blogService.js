﻿angular.module('sample').service('blog', function () {
    var monthlong = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this.getPost = function (title) {
        var result;
        angular.forEach(posts, function (post) {
            if (post.title === title)
                result = post;
        });
        result.views++;
        return result;
    };

    this.getRecentPosts = function () {
        return posts.slice(0, 5);
    };

    this.getPostsByCategory = function (category) {
        var result = [];
            if (post.category === category)
        });
    };

    this.getPostsByArchive = function (month) {
        var result = [];
            var postMonth = monthlong[post.date.getMonth()] + ' ' + post.date.getFullYear();
        });
    };
    this.getArchives = function () {
        var months = [];
            var month = monthlong[post.date.getMonth()] + ' ' + post.date.getFullYear();
        });
    };
    this.getCategories = function () {
        var categories = [];
            if (categories.indexOf(post.category) === -1)
        });
    };
});