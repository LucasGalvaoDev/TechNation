$(document).ready(function () {
    $('.toggle-sidebar').on('click', function () {
        $('.sidebar').toggleClass('hidden');
        $('.main-content').toggleClass('shifted');
        $('.top-navbar').toggleClass('shifted');
        $('.toggle-sidebar').toggleClass('shifted');
    });
});