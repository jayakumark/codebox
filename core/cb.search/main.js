// Requires
var _ = require('lodash');
var glob = require("glob");
var Q = require('q');


function setup(options, imports, register) {
    // Import
    var vfs = imports.vfs;
    var workspace = imports.workspace;

    // Construct
    var filesSearch = function(args) {
        var d = Q.defer();

        args = _.defaults({}, args || {}, {
            'start': 0,
            'limit': 30
        });

        glob("**/*"+args.query+"*", {
            'cwd': workspace.root,
            'mark': true
        }, function (err, files) {
            if (err) {
                d.reject(err);
            } else {
                var results = _.chain(files)
                .filter(function(path) {
                    return !(!path.length || path[path.length-1] == "/");
                })
                .map(function(path) {
                    return "/"+path;
                })
                .value();

                d.resolve({
                    'files': results.slice(args.start, args.start+args.limit),
                    'n': _.size(results)
                });
            }
        });

        return d.promise;
    };

    // Register
    register(null, {
        "search": {
            files: filesSearch
        }
    });
}

// Exports
module.exports = setup;
