(function(angular, _) {

    angular
        .module('typeset.services')
        .factory('ComposeService', [
            'ComposePreferencesFactory', 'PaperFactory', 'BibliographyService',
            '$q', 'Restangular',
            function(
                ComposePreferencesFactory, PaperFactory, BibliographyService,
                $q, Restangular
                ) {
                var compose, shouldCancel;
                var progress = {
                    status: ''
                };
                var temp = {
                    composeURL: 'http://ec2-54-187-170-244.us-west-2.compute.amazonaws.com:60000'
                    //composeURL: 'http://sanombp.local:8890'
                    //composeURL: 'http://localhost:8192'
                };

                compose = function() {
                    progress.status = '';
                    var deferred = $q.defer();
                    shouldCancel = false;

                    /// @TODO: Gather the meta data
                    var request = {
                        meta: _.clone(ComposePreferencesFactory.composePreferences),
                        contents: {
                            title: _.string.trim(PaperFactory.paper.title),
                            authors: PaperFactory.paper.authors,
                            abstract: _.string.trim(PaperFactory.paper.abstract),
                            keywords: PaperFactory.paper.index_terms,
                            acknowledgement: _.string.trim(PaperFactory.paper.acknowledgement),
                            financial_support: _.string.trim(PaperFactory.paper.financial_support),
                            sections: []
                        },
                        bibliography: _.clone(BibliographyService.collection, true)
                    };

                    // Add Sections
                    for (var i = 0, i_len = PaperFactory.paper.sections.length; i < i_len; i++) {
                        request.contents.sections.push({
                            id: PaperFactory.paper.sections[i].id,
                            title: PaperFactory.paper.sections[i].title,
                            contents: PaperFactory.paper.sections[i].contents,
                            subsections: [],
                            images: []
                        });

                        // Add Images
                        for (var i_img = 0, i_img_len = PaperFactory.paper.sections[i].images.length; i_img < i_img_len; i_img++) {
                            request.contents.sections[i].images.push({
                                id: PaperFactory.paper.sections[i].images[i_img].id,
                                name: PaperFactory.paper.sections[i].images[i_img].name,
                                shortname: PaperFactory.paper.sections[i].images[i_img].shortname,
                                caption: PaperFactory.paper.sections[i].images[i_img].caption,
                                width: PaperFactory.paper.sections[i].images[i_img].width
                            });
                        }

                        // Add Subsections
                        for (var j = 0, j_len = PaperFactory.paper.sections[i].subsections.length; j < j_len; j++) {
                            request.contents.sections[i].subsections.push({
                                id: PaperFactory.paper.sections[i].subsections[j].id,
                                title: PaperFactory.paper.sections[i].subsections[j].title,
                                contents: PaperFactory.paper.sections[i].subsections[j].contents,
                                subsubsections: [],
                                images: []
                            });

                            // Add Images
                            for (var j_img = 0, j_img_len = PaperFactory.paper.sections[i].subsections[j].images.length; j_img < j_img_len; j_img++) {
                                request.contents.sections[i].subsections[j].images.push({
                                    id: PaperFactory.paper.sections[i].subsections[j].images[j_img].id,
                                    name: PaperFactory.paper.sections[i].subsections[j].images[j_img].name,
                                    shortname: PaperFactory.paper.sections[i].subsections[j].images[j_img].shortname,
                                    caption: PaperFactory.paper.sections[i].subsections[j].images[j_img].caption,
                                    width: PaperFactory.paper.sections[i].subsections[j].images[j_img].width
                                });
                            }

                            // Add SubSubsections
                            for (var k = 0, k_len = PaperFactory.paper.sections[i].subsections[j].subsubsections.length; k < k_len; k++) {
                                request.contents.sections[i].subsections[j].subsubsections.push({
                                    id: PaperFactory.paper.sections[i].subsections[j].subsubsections[k].id,
                                    title: PaperFactory.paper.sections[i].subsections[j].subsubsections[k].title,
                                    contents: PaperFactory.paper.sections[i].subsections[j].subsubsections[k].contents,
                                    images: []
                                });

                                // Add Images
                                for (var k_img = 0, k_img_len = PaperFactory.paper.sections[i].subsections[j].subsubsections[k].images.length; k_img < k_img_len; k_img++) {
                                    request.contents.sections[i].subsections[j].subsubsections[k].images.push({
                                        id: PaperFactory.paper.sections[i].subsections[j].subsubsections[k].images[k_img].id,
                                        name: PaperFactory.paper.sections[i].subsections[j].subsubsections[k].images[k_img].name,
                                        shortname: PaperFactory.paper.sections[i].subsections[j].subsubsections[k].images[k_img].shortname,
                                        caption: PaperFactory.paper.sections[i].subsections[j].subsubsections[k].images[k_img].caption,
                                        width: PaperFactory.paper.sections[i].subsections[j].subsubsections[k].images[k_img].width
                                    });
                                }
                            }
                        }
                    }

                    // console.log(request);

                    Restangular.setBaseUrl(temp.composeURL);
                    // console.log('Request Sent');
                    Restangular.one('compose').customPOST(request).then(function(data) {
                        // console.log('POST success!' + data);
                        deferred.resolve(data);
                    }, function(error) {
                        // console.log('Fail');
                        // console.log(error);
                        deferred.reject();
                    });

                    return deferred.promise;
                };

                cancel = function() {
                    shouldCancel = true;
                };

                return {
                    progress: progress,
                    temp: temp,
                    compose: compose,
                    cancel: cancel
                };
            }
        ]);

}(angular, _));