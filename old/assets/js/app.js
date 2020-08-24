(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;
        if (!u && a) return a(o, !0);
        if (i) return i(o, !0);
        var f = new Error("Cannot find module '" + o + "'");
        throw f.code = "MODULE_NOT_FOUND", f
      }
      var l = n[o] = {
        exports: {}
      };
      t[o][0].call(l.exports, function (e) {
        var n = t[o][1][e];
        return s(n ? n : e)
      }, l, l.exports, e, t, n, r)
    }
    return n[o].exports
  }
  var i = typeof require == "function" && require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s
})({
  1: [function (require, module, exports) {
    'use strict';

    var _anchor = require('./modules/anchor');

    var _anchor2 = _interopRequireDefault(_anchor);

    var _dribbbleLoad = require('./modules/dribbbleLoad');

    var _dribbbleLoad2 = _interopRequireDefault(_dribbbleLoad);

    var _revealFooter = require('./modules/revealFooter');

    var _revealFooter2 = _interopRequireDefault(_revealFooter);

    function _interopRequireDefault(obj) {
      return obj && obj._esModule ? obj : {
        default: obj
      };
    }

    (function ($) {
      'use strict';

      $(function () {
        // _dribbbleLoad2.default.init('ianroblambert', '619c6260271ef48bf8d588210cca7462c209b6ed152ac4353c83f178543281cd');
        _dribbbleLoad2.default.init();
        _revealFooter2.default.init($('body'), $('.footer-block'));
        _anchor2.default.init();
        $('[data-accordion]').accordion({
          'transitionSpeed': 200,
          'singleOpen': true
        });
      });
    })(jQuery);

  }, {
    "./modules/anchor": 2,
    "./modules/dribbbleLoad": 3,
    "./modules/revealFooter": 4
  }],
  2: [function (require, module, exports) {
    'use strict';

    Object.defineProperty(exports, "_esModule", {
      value: true
    });
    var anchor = {
      init: function init() {
        $(document).on('click', 'a[href^="#"]', function (e) {
          e.preventDefault();
          $('html, body').animate({
            scrollTop: $(this.getAttribute('href')).offset().top
          }, 750);
        });
      }
    };

    exports.default = anchor;

  }, {}],
  3: [function (require, module, exports) {
    'use strict';

    Object.defineProperty(exports, "_esModule", {
      value: true
    });
    var dribbbleLoad = {
      init: function init(user, token) {
        var currentPage = 1,
          self = this,
          winWidth = $(window).width(),
          total = void 0;

        var getPageOfWork = function getPageOfWork(page, perPage, init) {
          if (init) {
            var result = void 0;
            var url = getUrl(page);

            fetch(url)
              .then(function (response) {
                return response.json();
              })
              .then(function (result) {
                getShots(page, perPage);
              })
              .catch(function (error) {
                console.log(error);
                $('[data-load="grid-shots"]').html('Something went wrong.');
              });
          } else {
            getShots(page, perPage);
          }
        };

        function getUrl(page, limit) {
          var lim = limit || 6;
          return 'http://159.65.233.168/api/shots?limit=' + lim + '&page=' + page;
        }

        function disableLoadButton(page, perPage) {
          if (total <= page * perPage) {
            $('[data-load="grid-shots"]').html('No more work.').addClass('button-disabled').removeClass('button-loading');
          }
        }

        function getShots(page, perPage) {
          var url = getUrl(page, perPage);

          fetch(url)
            .then(function (response) {
              return response.json();
            })
            .then(function (result) {
              total = result.total;
              if (result.data.length === 0) {
                $('[data-load="grid-shots"]').html('No more work.').addClass('button-disabled').removeClass('button-loading');
              }
              renderBlocks(result.data);
              disableLoadButton(page, perPage);
            })
            .catch(function (error) {
              console.log(error);
              $('[data-load="grid-shots"]').html('Something went wrong.');
            });
        }

        function renderBlocks(res) {
          var html = [];

          for (var i = 0; i < res.length;) {
            html.push(createTemplate(res, i));
            i += 3;
          }

          appendShots(html.join(''));

          $('[data-load="grid-shots"]').removeClass('button-loading');
        }

        var appendShots = function appendShots(html) {
          $('[data-works]').append(html);
        };

        var createTemplate = function createTemplate(res, index) {
          var template = '<div class="grid-block-row">';

          for (var i = 0; i < 3; i++) {
            template += i === 0 ? '<div class="grid-block-col-8">' : i === 1 ? '<div class="grid-block-col-4">' : '';

            if (typeof res[index] === 'undefined') {
              template += '<div class="grid-block-item" data-empty></div>';
            } else {
              var href = res[index].data.html_url,
                image = void 0;

              if (winWidth <= 400) {
                image = res[index].data.images.normal || res[index].data.images.hidpi;
              } else {
                image = res[index].data.images.hidpi || res[index].data.images.normal;
              }
              var title = res[index].data.title.substr(0, 50) + '...';
              template += '<div class="grid-block-item">\n      <a class="shot" href="' + href + '" target="_blank">\n        <div class="shot-image" style="background: #eeeeee url(\'' + image + '\') no-repeat 50% 50% / cover;">&nbsp;</div>\n        <div class="shot-overlay">\n          <div class="shot-content">\n            <h6>' + title + '</h6>\n            <h6>↘</h6>\n          </div>\n        </div>\n      </a>\n    </div>';
            }

            template += i === 0 || i === 2 ? '</div>' : '';

            index++;
          }

          return template += '</div>';
        };

        getPageOfWork(currentPage, 6, true);
        currentPage++;

        $('[data-load="grid-shots"]').on('click', function (e) {
          e.preventDefault();
          $(this).addClass('button-loading');
          currentPage++;
          getPageOfWork(currentPage, 3);
        });
      }
    };

    exports.default = dribbbleLoad;

  }, {}],
  4: [function (require, module, exports) {
    'use strict';

    Object.defineProperty(exports, "_esModule", {
      value: true
    });
    var revealFooter = {
      init: function init($block, $footer) {
        var $win = $(window);

        if (!$block.length || !$footer.length) {
          return;
        }

        changeValue();

        $win.resize(changeValue);

        function changeValue() {
          var footerHeight = $footer.innerHeight(),
            $body = $('html, body');

          if ($win.height() <= footerHeight) {
            $body.css({
              'background-color': '#ffffff'
            });

            $block.css({
              'margin-bottom': '0'
            });

            $footer.css({
              'position': 'static'
            });
          } else {
            $body.css({
              'background-color': '#0000ff'
            });

            $block.css('margin-bottom', $footer.innerHeight());

            $footer.css({
              'position': 'fixed',
              'z-index': -1,
              'left': 0,
              'right': 0,
              'bottom': 0
            });
          }
        }
      }
    };

    exports.default = revealFooter;

  }, {}]
}, {}, [1])
