/*
 * File: main.js
 * Project: \src\assets\js\main.js
 * -------------------------
 * File Created: 20181217
 * Author: Cenk Kılıç (cenk1cenk2cenk3@gmail.com)
 * -------------------------
 * Last Modified: 15:27, 20181218
 * Modified By: Cenk Kılıç (cenk1cenk2cenk3@gmail.com>)
 * -------------------------
 * Changelog:
 * Date      	By	Rev	Comments
 * ----------	---	---	---------------------------------------------------------
 * 20181217		CK	0   Initial version.
 */

var App = function () {
    // Helper variables - set in uiInit()
    var $lHtml, $lBody, $lPage, $lSidebar, $lSidebarScroll, $lSideOverlay, $lSideOverlayScroll, $lHeader, $lMain, $lFooter;

    /*
     ********************************************************************************************
     *
     * BASE UI FUNCTIONALITY
     *
     *********************************************************************************************
     */

    // User Interface init
    var uiInit = function () {
        // Set variables
        $lHtml = jQuery('html');
        $lBody = jQuery('body');
        $lPage = jQuery('#page-container');
        $lSidebar = jQuery('#sidebar');
        $lSidebarScroll = jQuery('#sidebar-scroll');
        $lSideOverlay = jQuery('#side-overlay');
        $lSideOverlayScroll = jQuery('#side-overlay-scroll');
        $lHeader = jQuery('#header-navbar');
        $lMain = jQuery('#main-container');
        $lFooter = jQuery('#page-footer');

        // Initialize Tooltips
        jQuery('[data-toggle="tooltip"], .js-tooltip').tooltip({
            container: 'body',
            animation: false
        });

        // Initialize Popovers
        jQuery('[data-toggle="popover"], .js-popover').popover({
            container: 'body',
            animation: true,
            trigger: 'hover'
        });

        // Initialize Tabs
        jQuery('[data-toggle="tabs"] a, .js-tabs a').click(function (e) {
            e.preventDefault();
            jQuery(this).tab('show');
        });

    };

    // Layout functionality
    var uiLayout = function () {
        // Resizes #main-container min height (push footer to the bottom)
        var $resizeTimeout;

        if ($lMain.length) {
            uiHandleMain();

            jQuery(window).on('resize orientationchange', function () {
                clearTimeout($resizeTimeout);

                $resizeTimeout = setTimeout(function () {
                    uiHandleMain();
                }, 150);
            });
        }

        // Init sidebar and side overlay custom scrolling
        uiHandleScroll('init');

        // Init transparent header functionality (solid on scroll - used in frontend)
        if ($lPage.hasClass('header-navbar-fixed') && $lPage.hasClass('header-navbar-transparent')) {
            jQuery(window).on('scroll', function () {
                if (jQuery(this).scrollTop() > 20) {
                    $lPage.addClass('header-navbar-scroll');
                } else {
                    $lPage.removeClass('header-navbar-scroll');
                }
            });
        }

        // Call layout API on button click
        jQuery('[data-toggle="layout"]').on('click', function () {
            var $btn = jQuery(this);

            uiLayoutApi($btn.data('action'));

            if ($lHtml.hasClass('no-focus')) {
                $btn.blur();
            }
        });
    };

    // Resizes #main-container to fill empty space if exists
    var uiHandleMain = function () {
        var $hWindow = jQuery(window).height();
        var $hHeader = $lHeader.outerHeight();
        var $hFooter = $lFooter.outerHeight();

        if ($lPage.hasClass('header-navbar-fixed')) {
            $lMain.css('min-height', $hWindow - $hFooter);
        } else {
            $lMain.css('min-height', $hWindow - ($hHeader + $hFooter));
        }
    };

    // Handles sidebar and side overlay custom scrolling functionality
    var uiHandleScroll = function ($mode) {
        var $windowW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

        // Init scrolling
        if ($mode === 'init') {
            // Init scrolling only if required the first time
            uiHandleScroll();

            // Handle scrolling on resize or orientation change
            var $sScrollTimeout;

            jQuery(window).on('resize orientationchange', function () {
                clearTimeout($sScrollTimeout);

                $sScrollTimeout = setTimeout(function () {
                    uiHandleScroll();
                }, 150);
            });
        } else {
            // If screen width is greater than 991 pixels and .side-scroll is added to #page-container
            if ($windowW > 991 && $lPage.hasClass('side-scroll')) {
                // Turn scroll lock off (sidebar and side overlay - slimScroll will take care of it)
                jQuery($lSidebar).scrollLock('disable');
                jQuery($lSideOverlay).scrollLock('disable');

                // If sidebar scrolling does not exist init it..
                if ($lSidebarScroll.length && (!$lSidebarScroll.parent('.slimScrollDiv').length)) {
                    $lSidebarScroll.slimScroll({
                        height: $lSidebar.outerHeight(),
                        color: '#fff',
                        size: '5px',
                        opacity: .35,
                        wheelStep: 15,
                        distance: '2px',
                        railVisible: false,
                        railOpacity: 1
                    });
                } else { // ..else resize scrolling height
                    $lSidebarScroll
                        .add($lSidebarScroll.parent())
                        .css('height', $lSidebar.outerHeight());
                }

                // If side overlay scrolling does not exist init it..
                if ($lSideOverlayScroll.length && (!$lSideOverlayScroll.parent('.slimScrollDiv').length)) {
                    $lSideOverlayScroll.slimScroll({
                        height: $lSideOverlay.outerHeight(),
                        color: '#000',
                        size: '5px',
                        opacity: .35,
                        wheelStep: 15,
                        distance: '2px',
                        railVisible: false,
                        railOpacity: 1
                    });
                } else { // ..else resize scrolling height
                    $lSideOverlayScroll
                        .add($lSideOverlayScroll.parent())
                        .css('height', $lSideOverlay.outerHeight());
                }
            } else {
                // Turn scroll lock on (sidebar and side overlay)
                jQuery($lSidebar).scrollLock('enable');
                jQuery($lSideOverlay).scrollLock('enable');

                // If sidebar scrolling exists destroy it..
                if ($lSidebarScroll.length && $lSidebarScroll.parent('.slimScrollDiv').length) {
                    $lSidebarScroll
                        .slimScroll({
                            destroy: true
                        });
                    $lSidebarScroll
                        .attr('style', '');
                }

                // If side overlay scrolling exists destroy it..
                if ($lSideOverlayScroll.length && $lSideOverlayScroll.parent('.slimScrollDiv').length) {
                    $lSideOverlayScroll
                        .slimScroll({
                            destroy: true
                        });
                    $lSideOverlayScroll
                        .attr('style', '');
                }
            }
        }
    };

    // Layout API
    var uiLayoutApi = function ($mode) {
        var $windowW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

        // Mode selection
        switch ($mode) {
            case 'sidebar_pos_toggle':
                $lPage.toggleClass('sidebar-l sidebar-r');
                break;
            case 'sidebar_pos_left':
                $lPage
                    .removeClass('sidebar-r')
                    .addClass('sidebar-l');
                break;
            case 'sidebar_pos_right':
                $lPage
                    .removeClass('sidebar-l')
                    .addClass('sidebar-r');
                break;
            case 'sidebar_toggle':
                if ($windowW > 991) {
                    $lPage.toggleClass('sidebar-o');
                } else {
                    $lPage.toggleClass('sidebar-o-xs');
                }
                break;
            case 'sidebar_open':
                if ($windowW > 991) {
                    $lPage.addClass('sidebar-o');
                } else {
                    $lPage.addClass('sidebar-o-xs');
                }
                break;
            case 'sidebar_close':
                if ($windowW > 991) {
                    $lPage.removeClass('sidebar-o');
                } else {
                    $lPage.removeClass('sidebar-o-xs');
                }
                break;
            case 'sidebar_mini_toggle':
                if ($windowW > 991) {
                    $lPage.toggleClass('sidebar-mini');
                }
                break;
            case 'sidebar_mini_on':
                if ($windowW > 991) {
                    $lPage.addClass('sidebar-mini');
                }
                break;
            case 'sidebar_mini_off':
                if ($windowW > 991) {
                    $lPage.removeClass('sidebar-mini');
                }
                break;
            case 'side_overlay_toggle':
                $lPage.toggleClass('side-overlay-o');
                break;
            case 'side_overlay_open':
                $lPage.addClass('side-overlay-o');
                break;
            case 'side_overlay_close':
                $lPage.removeClass('side-overlay-o');
                break;
            case 'side_overlay_hoverable_toggle':
                $lPage.toggleClass('side-overlay-hover');
                break;
            case 'side_overlay_hoverable_on':
                $lPage.addClass('side-overlay-hover');
                break;
            case 'side_overlay_hoverable_off':
                $lPage.removeClass('side-overlay-hover');
                break;
            case 'header_fixed_toggle':
                $lPage.toggleClass('header-navbar-fixed');
                break;
            case 'header_fixed_on':
                $lPage.addClass('header-navbar-fixed');
                break;
            case 'header_fixed_off':
                $lPage.removeClass('header-navbar-fixed');
                break;
            case 'side_scroll_toggle':
                $lPage.toggleClass('side-scroll');
                uiHandleScroll();
                break;
            case 'side_scroll_on':
                $lPage.addClass('side-scroll');
                uiHandleScroll();
                break;
            case 'side_scroll_off':
                $lPage.removeClass('side-scroll');
                uiHandleScroll();
                break;
            default:
                return false;
        }
    };

    // Main navigation functionality
    var uiNav = function () {
        // When a submenu link is clicked
        jQuery('[data-toggle="nav-submenu"]').on('click', function (e) {
            // Get link
            var $link = jQuery(this);

            // Get link's parent
            var $parentLi = $link.parent('li');

            if ($parentLi.hasClass('open')) { // If submenu is open, close it..
                $parentLi.removeClass('open');
            } else { // .. else if submenu is closed, close all other (same level) submenus first before open it
                $link
                    .closest('ul')
                    .find('> li')
                    .removeClass('open');

                $parentLi
                    .addClass('open');
            }

            // Remove focus from submenu link
            if ($lHtml.hasClass('no-focus')) {
                $link.blur();
            }

            return false;
        });
    };

    // Blocks options functionality
    var uiBlocks = function () {
        // Init default icons fullscreen and content toggle buttons
        uiBlocksApi(false, 'init');

        // Call blocks API on option button click
        jQuery('[data-toggle="block-option"]').on('click', function () {
            uiBlocksApi(jQuery(this).closest('.block'), jQuery(this).data('action'));
        });
    };

    // Blocks API
    var uiBlocksApi = function ($block, $mode) {
        // Set default icons for fullscreen and content toggle buttons
        var $iconFullscreen = 'si si-size-fullscreen';
        var $iconFullscreenActive = 'si si-size-actual';
        var $iconContent = 'si si-arrow-up';
        var $iconContentActive = 'si si-arrow-down';

        if ($mode === 'init') {
            // Auto add the default toggle icons to fullscreen and content toggle buttons
            jQuery('[data-toggle="block-option"][data-action="fullscreen_toggle"]').each(function () {
                var $this = jQuery(this);

                $this.html('<i class="' + (jQuery(this).closest('.block').hasClass('block-opt-fullscreen') ? $iconFullscreenActive : $iconFullscreen) + '"></i>');
            });

            jQuery('[data-toggle="block-option"][data-action="content_toggle"]').each(function () {
                var $this = jQuery(this);

                $this.html('<i class="' + ($this.closest('.block').hasClass('block-opt-hidden') ? $iconContentActive : $iconContent) + '"></i>');
            });
        } else {
            // Get block element
            var $elBlock = ($block instanceof jQuery) ? $block : jQuery($block);

            // If element exists, procceed with blocks functionality
            if ($elBlock.length) {
                // Get block option buttons if exist (need them to update their icons)
                var $btnFullscreen = jQuery('[data-toggle="block-option"][data-action="fullscreen_toggle"]', $elBlock);
                var $btnToggle = jQuery('[data-toggle="block-option"][data-action="content_toggle"]', $elBlock);

                // Mode selection
                switch ($mode) {
                    case 'fullscreen_toggle':
                        $elBlock.toggleClass('block-opt-fullscreen');

                        // Enable/disable scroll lock to block
                        if ($elBlock.hasClass('block-opt-fullscreen')) {
                            jQuery($elBlock).scrollLock('enable');
                        } else {
                            jQuery($elBlock).scrollLock('disable');
                        }

                        // Update block option icon
                        if ($btnFullscreen.length) {
                            if ($elBlock.hasClass('block-opt-fullscreen')) {
                                jQuery('i', $btnFullscreen)
                                    .removeClass($iconFullscreen)
                                    .addClass($iconFullscreenActive);
                            } else {
                                jQuery('i', $btnFullscreen)
                                    .removeClass($iconFullscreenActive)
                                    .addClass($iconFullscreen);
                            }
                        }
                        break;
                    case 'fullscreen_on':
                        $elBlock.addClass('block-opt-fullscreen');

                        // Enable scroll lock to block
                        jQuery($elBlock).scrollLock('enable');

                        // Update block option icon
                        if ($btnFullscreen.length) {
                            jQuery('i', $btnFullscreen)
                                .removeClass($iconFullscreen)
                                .addClass($iconFullscreenActive);
                        }
                        break;
                    case 'fullscreen_off':
                        $elBlock.removeClass('block-opt-fullscreen');

                        // Disable scroll lock to block
                        jQuery($elBlock).scrollLock('disable');

                        // Update block option icon
                        if ($btnFullscreen.length) {
                            jQuery('i', $btnFullscreen)
                                .removeClass($iconFullscreenActive)
                                .addClass($iconFullscreen);
                        }
                        break;
                    case 'content_toggle':
                        $elBlock.toggleClass('block-opt-hidden');

                        // Update block option icon
                        if ($btnToggle.length) {
                            if ($elBlock.hasClass('block-opt-hidden')) {
                                jQuery('i', $btnToggle)
                                    .removeClass($iconContent)
                                    .addClass($iconContentActive);
                            } else {
                                jQuery('i', $btnToggle)
                                    .removeClass($iconContentActive)
                                    .addClass($iconContent);
                            }
                        }
                        break;
                    case 'content_hide':
                        $elBlock.addClass('block-opt-hidden');

                        // Update block option icon
                        if ($btnToggle.length) {
                            jQuery('i', $btnToggle)
                                .removeClass($iconContent)
                                .addClass($iconContentActive);
                        }
                        break;
                    case 'content_show':
                        $elBlock.removeClass('block-opt-hidden');

                        // Update block option icon
                        if ($btnToggle.length) {
                            jQuery('i', $btnToggle)
                                .removeClass($iconContentActive)
                                .addClass($iconContent);
                        }
                        break;
                    case 'refresh_toggle':
                        $elBlock.toggleClass('block-opt-refresh');

                        // Return block to normal state if the demostration mode is on in the refresh option button - data-action-mode="demo"
                        if (jQuery('[data-toggle="block-option"][data-action="refresh_toggle"][data-action-mode="demo"]', $elBlock).length) {
                            // $("#mahmut").load("main.php #mahmut");
                            setTimeout(function () {
                                $elBlock.removeClass('block-opt-refresh');
                            }, 15000);
                        }
                        break;
                    case 'state_loading':
                        $elBlock.addClass('block-opt-refresh');
                        break;
                    case 'state_normal':
                        $elBlock.removeClass('block-opt-refresh');
                        break;
                    case 'close':
                        $elBlock.hide();
                        break;
                    case 'open':
                        $elBlock.show();
                        break;
                    default:
                        return false;
                }
            }
        }
    };

    // Material inputs helper
    var uiForms = function () {
        jQuery('.form-material.floating > .form-control').each(function () {
            var $input = jQuery(this);
            var $parent = $input.parent('.form-material');

            setTimeout(function () {
                if ($input.val()) {
                    $parent.addClass('open');
                }
            }, 150);

            $input.on('change', function () {
                if ($input.val()) {
                    $parent.addClass('open');
                } else {
                    $parent.removeClass('open');
                }
            });
        });
    };

    // Scroll to element animation helper
    var uiScrollTo = function () {
        jQuery('[data-toggle="scroll-to"]').on('click', function () {
            var $this = jQuery(this);
            var $target = $this.data('target');
            var $speed = $this.data('speed') ? $this.data('speed') : 1000;
            var $headerHeight = ($lHeader.length && $lPage.hasClass('header-navbar-fixed')) ? $lHeader.outerHeight() : 0;

            jQuery('html, body').animate({
                scrollTop: jQuery($target).offset().top - $headerHeight
            }, $speed);
        });
    };

    // Toggle class helper
    var uiToggleClass = function () {
        jQuery('[data-toggle="class-toggle"]').on('click', function () {
            var $el = jQuery(this);

            jQuery($el.data('target').toString()).toggleClass($el.data('class').toString());

            if ($lHtml.hasClass('no-focus')) {
                $el.blur();
            }
        });
    };

    // Add the correct copyright year
    var uiYearCopy = function () {
        var $date = new Date();
        var $yearCopy = jQuery('.js-year-copy');

        $yearCopy.html('© ' + $date.getFullYear().toString());
    };

    // Manage page loading screen functionality
    var uiLoader = function ($mode) {
        var $lpageLoader = jQuery('#page-loader');

        if ($mode === 'show') {
            if ($lpageLoader.length) {
                $lpageLoader.fadeIn(250);
            } else {
                $lBody.prepend('<div id="page-loader"></div>');
            }
        } else if ($mode === 'hide') {
            if ($lpageLoader.length) {
                $lpageLoader.fadeOut(250);
            }
        }

        return false;
    };

    return {
        init: function ($func) {
            switch ($func) {
                case 'uiInit':
                    uiInit();
                    break;
                case 'uiLayout':
                    uiLayout();
                    break;
                case 'uiNav':
                    uiNav();
                    break;
                case 'uiBlocks':
                    uiBlocks();
                    break;
                case 'uiForms':
                    uiForms();
                    break;
                case 'uiToggleClass':
                    uiToggleClass();
                    break;
                case 'uiScrollTo':
                    uiScrollTo();
                    break;
                case 'uiYearCopy':
                    uiYearCopy();
                    break;
                case 'uiLoader':
                    uiLoader('hide');
                    break;
                default:
                    // Init all vital functions
                    uiInit();
                    uiLayout();
                    uiNav();
                    uiBlocks();
                    uiForms();
                    uiToggleClass();
                    uiScrollTo();
                    uiYearCopy();
                    uiLoader('hide');
            }
        },
        layout: function ($mode) {
            uiLayoutApi($mode);
        },
        loader: function ($mode) {
            uiLoader($mode);
        },
        blocks: function ($block, $mode) {
            uiBlocksApi($block, $mode);
        },
        initHelpers: function ($helpers) {
            if ($helpers instanceof Array) {
                for (var $index in $helpers) {
                    App.initHelper($helpers[$index]);
                }
            } else {
                App.initHelper($helpers);
            }
        }
    };
}();

// Initialize app when page loads
jQuery(function () {
    App.init();
    console.log('init main.js');
});