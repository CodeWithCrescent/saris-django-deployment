(() => {
    window.Helpers.initCustomOptionCheck();
    (e = [].slice.call(document.querySelectorAll(".flatpickr-validation"))) &&
        e.forEach((e) => {
            e.flatpickr({ allowInput: !0, monthSelectorType: "static" });
        });
    var e = document.querySelectorAll(".needs-validation");
    Array.prototype.slice.call(e).forEach(function (a) {
        a.addEventListener(
            "submit",
            function (e) {
                a.checkValidity() ? "" : (e.preventDefault(), e.stopPropagation()), a.classList.add("was-validated");
            },
            !1
        );
    });
})();
