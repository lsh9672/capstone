// 업로드 파일 base64 인코딩/디코딩
function changeImage() {
    var preview_link = document.getElementById('src');
    var file = document.getElementById('file-chooser').files[0];
    var reader = new FileReader();

    reader.addEventListener("load", function () {
        preview_link.src = reader.result;

        gui_loadImage(document.getElementById('src').getAttribute('src'));
    }, false);

    if (file) {
        reader.readAsDataURL(file);

        gui_loadImage(document.getElementById('src').getAttribute('src'));
    }
}

// 업로드할 이미지 파일 미리보기
function previewImage(targetObj, View_area) {
    var preview = document.getElementById(View_area); //div id
    var ua = window.navigator.userAgent;

    //ie일때(IE8 이하에서만 작동)
    if (ua.indexOf("MSIE") > -1) {
        targetObj.select();
        try {
            var src = document.selection.createRange().text; // get file full path(IE9, IE10에서 사용 불가)
            var ie_preview_error = document.getElementById("ie_preview_error_" + View_area);

            if (ie_preview_error) {
                preview.removeChild(ie_preview_error); //error가 있으면 delete
            }

            var img = document.getElementById(View_area); //이미지가 뿌려질 곳

            //이미지 로딩, sizingMethod는 div에 맞춰서 사이즈를 자동조절 하는 역할
            img.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + src + "', sizingMethod='scale')";
        } catch (e) {
            if (!document.getElementById("ie_preview_error_" + View_area)) {
                var info = document.createElement("<p>");
                info.id = "ie_preview_error_" + View_area;
                info.innerHTML = e.name;
                preview.insertBefore(info, null);
            }
        }
        //ie가 아닐때(크롬, 사파리, FF)
    } else {
        var files = targetObj.files;
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var imageType = /image.*/; //이미지 파일일경우만.. 뿌려준다.
            if (!file.type.match(imageType))
                continue;
            var prevImg = document.getElementById("prev_" + View_area); //이전에 미리보기가 있다면 삭제
            if (prevImg) {
                preview.removeChild(prevImg);
            }
            var img = document.createElement("img");
            img.id = "prev_" + View_area;
            img.classList.add("obj");
            img.file = file;
            img.style.width = '100%';
            img.style.height = '100%';
            preview.appendChild(img);
            if (window.FileReader) { // FireFox, Chrome, Opera 확인.
                var reader = new FileReader();
                reader.onloadend = (function (aImg) {
                    return function (e) {
                        aImg.src = e.target.result;
                    };
                })(img);
                reader.readAsDataURL(file);
            } else { // safari is not supported FileReader
                //alert('not supported FileReader');
                if (!document.getElementById("sfr_preview_error_"
                    + View_area)) {
                    var info = document.createElement("p");
                    info.id = "sfr_preview_error_" + View_area;
                    info.innerHTML = "not supported FileReader";
                    preview.insertBefore(info, null);
                }
            }
        }
    }
}

var API = "http://192.168.0.16:9999";

var normal_all_ocr_API = API + "/normal-all-ocr";
var custom_ocr_API = API + "/template-ocr";

var template_read_API = API + "/template-value"

var template_eidt_API = API + "/template-update";
var template_add_API = API + "/template-add";
var template_delet_API = API + "/template-del";

var sign_up_API = API + "/sign-up";
var login_API = API + "/sign-in";
var logout_API = API + "/log-out";
var authorization_API = API + "/template-all-name";

// 로그인, 로그아웃 on/off
$(document).ready(function () {
    if (sessionStorage.getItem("ID")) {
        console.log(sessionStorage.getItem("ID"));
        $('#connected').show();
        $('#unconnected').hide();
    } else {
        console.log("non-member");
        $('#connected').hide();
        $('#unconnected').show();
    }
});

// 일반 파일 업로드 및 ocr
function normall_all_ocr() {
    var formData = new FormData();
    formData.append("file", $("input[name=profile_pt]")[0].files[0]);

    // console.log(formData);

    $.ajax({
        url: normal_all_ocr_API,
        type: 'POST',
        data: formData,
        enctype: "multipart/form-data",
        contentType: false,
        processData: false,
        success: function (data) {
            // console.log(data);
            // $('#prev_View_area').attr("src", "data:image/png;base64," + data.image);
            // $("#result_text").val(data.result);
            $("#result_text").val(data);
        },
        error: function (request, status, error) {
            alert("실패 : " + error);
        }
    })
}

// 회원가입
function sign_up() {
    if ($("#creat_password").val() != $("#confirm-password").val()) {
        alert("check");
    } else {
        var user = {};
        user.user_id = $("#creat_userID").val();
        user.passwd = $("#creat_password").val();
        user.user_email = $("#email").val();

        $.ajax({
            url: sign_up_API,
            type: 'POST',
            data: JSON.stringify(user),
            contentType: "application/json",
            success: function (result) {
                alert(result);
                location.href = "/loginForm.html";
            },
            error: function (result) {
                alert("회원가입 실패\n" + result);
            }
        });
    }
}

// 로그인
function login() {
    var user = {};
    user.user_id = $("#userID").val();
    user.passwd = $("#password").val();

    console.log("로그인 정보 전송");
    sessionStorage.setItem("ID", user.user_id);

    // $.ajax({
    //     url: login_API,
    //     data: JSON.stringify(user),
    //     type: "POST",
    //     contentType: "application/json",
    //     success: function (data) {
    //         var token = data.access_token;
    //         sessionStorage.setItem("Token", token);
    //         location.href = "/ocr.html";
    //     },
    //     error: function (request, status, error) {
    //         alert("로그인 실패");
    //     }
    // })
}

// 로그아웃
function logout() {
    console.log("로그아웃 정보 전송");
    sessionStorage.clear();
    location.href = "/ocr.html";

    // $.ajax({
    //     url: logout_API,
    //     type: 'GET',
    //     beforeSend: function (xhr) {
    //         xhr.setRequestHeader("Authorization", sessionStorage.getItem("Token"));
    //     },
    //     success: function (data) {
    //         sessionStorage.removeItem("Token");
    //         location.href = "/ocr.html";

    //         $("#unconnented").show();
    //         $("#connented").hide();
    //     },
    //     error: function (request, status, error) {
    //         alert("로그인 실패");
    //     }
    // })
}

// 인증요청 및 템플릿 이름 리스트 가져오기
function authorization(url) {
    $.ajax({
        url: authorization_API,
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", sessionStorage.getItem("Token"));
        },
        success: function (data) {
            sessionStorage.setItem("template_list", data);
            location.href = url;
        },
        error: function (error) {
            alert("로그인 필요 (1)");
            switch (error.status) {
                case "400":
                    break;
                case "401":
                    break;
                case "403":
                    break;
                default:
                    break;
            }
        }
    })
}

// 회원 서비스
// 커스텀 ocr : 템플릿 정보 전송 및 이미지 전송
function custom_ocr() {
    var img = $('#pic_container').find('img').attr('src');
    var name = $('#template_name').val();
    var size = $('input[name="img_coords"]').length;

    // 템플릿 명, 필드 명 빈 값 확인
    if (!img) {
        alert("이미지를 업로드해주세요.");
    } else {
        // if (!name) {
        //     alert("템플릿 명을 입력해주세요.");
        // } else {
        for (i = 0; i < size; i++) {
            alt = $('input[name="img_alt"]').eq(i).val();
            if (!alt) {
                alert("필드 명을 입력해주세요.");
                break;
            }
        }

        // 템플릿 json형식 생성 (템플릿명, (아이템명, 좌표값), 이미지)
        var template = {};
        template.template_name = name;
        template.template_info = [];
        for (i = 0; i < size; i++) {
            var coords = $('input[name="img_coords"]').eq(i).val();
            var alt = $('input[name="img_alt"]').eq(i).val();
            if (coords) {
                var info = {};
                var xy = [];
                info.item_name = alt;
                xy = coords.split(',');
                info.start_x = xy[0];
                info.start_y = xy[1];
                info.stop_x = xy[2];
                info.stop_y = xy[3];
                template.template_info[i] = info;
            } else {
                console.log("필드" + i + ": 빈 값");
            }
        }
    }
    // json에 이미지 값 저장
    var encoding_index = img.indexOf(",");
    var img_src = img.slice(encoding_index + 1);
    template.image = img_src;

    // console.log(template);

    $.ajax({
        url: custom_ocr_API,
        type: 'POST',
        data: JSON.stringify(template),
        contentType: "application/json",
        processData: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", sessionStorage.getItem("Token"));
        },
        success: function (data) {
            sessionStorage.setItem("ocr_result", data);
            location.href = "/templateResult.html";
        },
        error: function (request, status, error) {
            alert("실패");
        }
    })
    // }
}

// 커스텀에서 특정 템플릿 불러오기
function template_read_custom(selected) {
    var img = $('#pic_container').find('img').attr('src');

    if (img) {
        var select_template = {};
        select_template.template_name = selected;
        if (select_template.template_name == "none") {
            alert("템플릿을 선택해주세요.");
        } else {
            $.ajax({
                url: template_read_API,
                type: 'POST',
                data: JSON.stringify(select_template),
                contentType: "application/json",
                processData: false,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", sessionStorage.getItem("Token"));
                },
                success: function (data) {
                    resetSetting();

                    sessionStorage.setItem("select_template", data);
                    var select_template = JSON.parse(sessionStorage.getItem("select_template"));

                    var name = select_template.template_name;
                    var info = select_template.template_info;
                    var size = info.length;

                    for (i = 0; i < size; i++) {
                        var img_area_id = '#img_area_' + i;
                        var xy = info[i].start_x + "," + info[i].start_y + "," + info[i].stop_x + "," + info[i].stop_y;

                        myimgmap.addNewArea();
                        // 좌표 텍스트
                        $(img_area_id).find('input[name=img_coords]').val(xy);
                        // 필드 텍스트
                        $(img_area_id).find('input[name=img_alt]').val(info[i].item_name);

                        // 크롭 박스 그리기
                        myimgmap.initArea(i, "rect");
                        myimgmap._recalculate(i, xy);
                        // myimgmap._updatecoords(i);
                    }
                },
                error: function (request, status, error) {
                    alert("실패");
                }
            })
        }
    } else {
        alert("이미지를 업로드해주세요.");
    }

}

// 리스트에서 특정 템플릿 불러오기
function template_read_list(selected) {
    var td = $(selected).parent().parent().children();
    var name = td.eq(0).text();

    var select_template = {};
    select_template.template_name = name;

    $.ajax({
        url: template_read_API,
        type: 'POST',
        data: JSON.stringify(select_template),
        contentType: "application/json",
        processData: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", sessionStorage.getItem("Token"));
        },
        success: function (data) {
            sessionStorage.setItem("select_template", data);
            location.href = "/templateEdit.html"
        },
        error: function (request, status, error) {
            alert("실패");
        }
    })
}

// 템플릿 생성
function template_add() {
    var img = $('#pic_container').find('img').attr('src');
    var name = $('#template_name').val();
    var size = $('input[name="img_coords"]').length;

    // 템플릿 명, 필드 명 빈 값 확인
    if (!img) {
        alert("이미지를 업로드해주세요.");
    } else {
        if (!name) {
            alert("템플릿 명을 입력해주세요.");
        } else {
            for (i = 0; i < size; i++) {
                alt = $('input[name="img_alt"]').eq(i).val();
                if (!alt) {
                    alert("필드 명을 입력해주세요.");
                    break;
                }
            }

            // 템플릿 json형식 생성 (템플릿명, (아이템명, 좌표값), 이미지)
            var template = {};
            template.template_name = name;
            template.template_info = [];
            for (i = 0; i < size; i++) {
                var coords = $('input[name="img_coords"]').eq(i).val();
                var alt = $('input[name="img_alt"]').eq(i).val();
                if (coords) {
                    var info = {};
                    var xy = [];
                    info.item_name = alt;
                    xy = coords.split(',');
                    info.start_x = xy[0];
                    info.start_y = xy[1];
                    info.stop_x = xy[2];
                    info.stop_y = xy[3];
                    template.template_info[i] = info;
                } else {
                    console.log("텍스트" + i + ": 빈 값");
                }
            }
        }
        // json에 이미지 값 저장
        var encoding_index = img.indexOf(",");
        var img_src = img.slice(encoding_index + 1);
        template.image = img_src;

        // console.log(template);

        $.ajax({
            url: template_add_API,
            type: 'POST',
            data: JSON.stringify(template),
            contentType: "application/json",
            processData: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", sessionStorage.getItem("Token"));
            },
            success: function (data) {
                alert("생성 성공");
                authorization("/templateList.html");
            },
            error: function (request, status, error) {
                alert("실패");
            }
        })
    }
}

// 템플릿 수정
function template_edit() {
    var select_template = JSON.parse(sessionStorage.getItem("select_template"));
    var name = $('#template_name').val();
    var select_size = select_template.template_info.length;
    var size = $('input[name="img_coords"]').length;

    if (!name) {
        alert("템플릿 명을 입력해주세요.");
    } else {
        for (i = 0; i < size; i++) {
            alt = $('input[name="img_alt"]').eq(i).val();
            if (!alt) {
                alert("필드 명을 입력해주세요.");
                break;
            }
        }

        // 템플릿 json형식 생성 (템플릿명, (아이템명, 좌표값))
        var template = {};
        template.template_info = [];
        for (i = 0; i < size; i++) {
            var coords = $('input[name="img_coords"]').eq(i).val();
            var alt = $('input[name="img_alt"]').eq(i).val();
            var xy_id = $('input[name="xy_id"]').eq(i).val();
            if (coords) {
                var info = {};
                var xy = [];

                info.id = xy_id;
                info.item_name = alt;

                xy = coords.split(',');
                info.start_x = xy[0];
                info.start_y = xy[1];
                info.stop_x = xy[2];
                info.stop_y = xy[3];
                template.template_info[i] = info;
            } else {
                console.log("필드" + i + ": 빈 값");
            }
        }
    }

    console.log(template);

    // 수정 json 생성
    var edit_template = {};
    edit_template.template_name = $('#template_name').val();
    edit_template.edit = [];
    edit_template.add_edit = [];
    edit_template.del_edit = [];
    edit_template.image_path = JSON.parse(sessionStorage.getItem("select_template")).image_path;

    var id_check;
    for (i = 0; i < select_size; i++) {
        id_check = 0;
        for (j = 0; j < size; j++) {
            if (select_template.template_info[i].id == template.template_info[j].id) {
                edit_template.edit.push(template.template_info[j]);
                id_check = 1;
            }
        }
        if (id_check == 0) {
            edit_template.del_edit.push(select_template.template_info[i]);
        }
    }
    for (i = 0; i < size; i++) {
        if (!template.template_info[i].id) {
            edit_template.add_edit.push(template.template_info[i]);
        }
    }
    
    console.log(edit_template);

    // edit_template 정보 전송
    $.ajax({
        url: template_eidt_API,
        type: 'POST',
        data: JSON.stringify(edit_template),
        contentType: "application/json",
        processData: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", sessionStorage.getItem("Token"));
        },
        success: function (data) {
            alert(data);
            authorization("/templateList.html");
        },
        error: function (request, status, error) {
            alert("실패");
        }
    })
}

// 템플릿 목록 삭제
function template_delete() {
    var select_template = {};
    select_template.template_name = JSON.parse(sessionStorage.getItem("select_template")).template_name;

    $.ajax({
        url: template_delet_API,
        type: 'POST',
        data: JSON.stringify(select_template),
        contentType: "application/json",
        processData: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", sessionStorage.getItem("Token"));
        },
        success: function (data) {
            alert("삭제 성공");
            authorization("/templateList.html");
        },
        error: function (request, status, error) {
            alert("실패");
        }
    })
}

// 회원 페이지 강제 접속 시 예외 처리
window.onload = function () {
    link = window.location.pathname;
    if (link == "/custom.html" || link == "/template.html" || link == "/tmplateList.html") {
        if (!sessionStorage.getItem("Token")) {
            alert("로그인 필요 (2)");
            if (history.back() == "/custom.html" || history.back() == "/template.html" || history.back() == "/tmplateList.html") {
                location.href = "/ocr.html"
            } else {
                history.back();
            }
        }
    }
}

// 커스텀 페이지 템플릿 설정
// 템플릿 설정 초기화(전체 삭제)
function resetSetting() {
    myimgmap.removeAllAreas();
}

// 결과 페이지 다운로드
function download() {
    alert('download');
}

function download_csv(){
    var text = $(result_text).val();
    console.log(text);
}



//////////////////


// 테스트
function read_test(selected) {
    var img = $('#pic_container').find('img').attr('src');

    if (img) {
        var select_template = {};
        select_template.template_name = selected;
        if (select_template.template_name == "none") {
            alert("템플릿을 선택해주세요.");
        } else {
            // 버튼 클릭시 템플릿 설정부분 초기화
            resetSetting();

            // ajax 성공시 실행할 부분
            var data = { "template_name": "\uc2a4\ud0c0\ubc85\uc2a4_\uc601\uc218\uc99d_1", "template_info": [{ "id": 19, "item_name": "\uc0c1\ud45c\uba85", "start_x": 124, "start_y": 122, "stop_x": 426, "stop_y": 225 }, { "id": 20, "item_name": "\uc8fc\ubb38\uc790", "start_x": 144, "start_y": 314, "stop_x": 391, "stop_y": 362 }, { "id": 21, "item_name": "\uc8fc\ubb38\ub0b4\uc6a9", "start_x": 90, "start_y": 385, "stop_x": 261, "stop_y": 500 }, { "id": 22, "item_name": "\ucd1d\ud569", "start_x": 360, "start_y": 688, "stop_x": 449, "stop_y": 744 }] };
            sessionStorage.setItem("select_template", JSON.stringify(data));

            var select_template = JSON.parse(sessionStorage.getItem("select_template"));

            var name = select_template.template_name;
            var info = select_template.template_info;
            var size = info.length;

            for (i = 0; i < size; i++) {
                var img_area_id = '#img_area_' + i;
                var xy = info[i].start_x + "," + info[i].start_y + "," + info[i].stop_x + "," + info[i].stop_y;

                myimgmap.addNewArea();
                // myimgmap.initArea(i, "rect");
                // 좌표
                $(img_area_id).find('input[name=img_coords]').val(xy);
                // 필드
                $(img_area_id).find('input[name=img_alt]').val(info[i].item_name);
                myimgmap.initArea(i, "rect");
                myimgmap._recalculate(i, xy);
                // myimgmap._updatecoords(i);
            }
        }
    } else {
        alert("이미지를 업로드해주세요.");
    }
}