﻿$(function () {
    $('#login').validate({
        highlight: function (input) {
            $(input).parents('.form-line').addClass('error');
        },
        unhighlight: function (input) {
            $(input).parents('.form-line').removeClass('error');
        },
        errorPlacement: function (error, element) {
            $(element).parents('.input-group').append(error);
        },
        submitHandler: function (form) {
            $('#submit-button').attr('disabled', true);
            // TODO: Some sort of indicator that something's going on
            var data = $(form).serialize();
            $.post('/api/user/login', data, function (res) {
                if (!res.success) {
                    if (res.error === 'USER_NOT_FOUND') {
                        swal({
                            title: 'Ensaluto ne sukcesis',
                            icon: 'error',
                            text: 'La retpoŝtadreso aŭ pasvorto ne ĝustas.',
                            button: 'Bone'
                        });
                    } else {
                        showError(res);
                    }

                    $('#submit-button').removeAttr('disabled');
                    return;
                }

                window.location = '/';
            }).fail(function (err) {
                showError(err);
                $('#submit-button').removeAttr('disabled');
            });
        }
    });
});
