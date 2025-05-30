document.addEventListener("DOMContentLoaded", function() {
    {
        let e = document.querySelector("#formAuthentication");
        e && "undefined" != typeof FormValidation && FormValidation.formValidation(e, {
            fields: {
                username: {
                    validators: {
                        notEmpty: {
                            message: "Please enter username"
                        },
                    }
                },
                password: {
                    validators: {
                        notEmpty: {
                            message: "Please enter password"
                        },
                    }
                },
            },
            plugins: {
                trigger: new FormValidation.plugins.Trigger,
                bootstrap5: new FormValidation.plugins.Bootstrap5({
                    eleValidClass: "",
                    rowSelector: ".form-control-validation"
                }),
                submitButton: new FormValidation.plugins.SubmitButton,
                defaultSubmit: new FormValidation.plugins.DefaultSubmit,
                autoFocus: new FormValidation.plugins.AutoFocus
            },
            init: e => {
                e.on("plugins.message.placed", e => {
                    e.element.parentElement.classList.contains("input-group") && e.element.parentElement.insertAdjacentElement("afterend", e.messageElement)
                })
            }
        });
        var a = document.querySelectorAll(".numeral-mask");
        0 < a.length && a.forEach(a => {
            a.addEventListener("input", e => {
                a.value = e.target.value.replace(/\D/g, "")
            })
        })
    }
});