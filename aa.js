jQuery.fn.serializeObject = function () {
    var obj = null;
    try {
        if (this[0].tagName && this[0].tagName.toUpperCase() == "FORM") {
            var arr = this.serializeArray();
            if (arr) {
                obj = {};
                jQuery.each(arr, function () {
                    obj[this.name] = this.value;
                });
            }
        }
    } catch (e) {
        alert(e.message);
    } finally { }
    return obj;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function isChange(a) {
    const change = {
        0: '<a href="${item.link}" target="_blank" style="color:#888">@${item.user}</a>',
        1: '<b><span style="color:blue">월드 내 나의 캐릭터간 이동만 가능</span></b>',
        2: '<b><span style="color:red"><a href="${item.link}" target="_blank" style="color:#888">@${item.user}</a></span></b>',
        3: '월드 내 나의 캐릭터간 이동만 가능',
        4: '<b><span style="color:blue">월드 내 나의 캐릭터간 1회 이동 가능</span></b>'
    };
    return change[a] || '...?';
}

function getResult() {
    $("#tableRes1>tbody").empty();
    var sum_coin = 0;
    $("input[type=hidden]").each(function (idx) {
        if ($(this).val()) {
            var tmpa = $(this).closest('tr').clone();
            var price = parseInt(tmpa.find("td:eq(1)").text());
            var coin = parseInt($(this).val()) * price;
            tmpa.find("td:eq(1)").html($(this).val());
            $("#tableRes1>tbody").append(tmpa);
        }
    });
}

function tableToJson(table) {
    var data = [];
    var headers = ['name', 'cnt', 'uc', 'price']

    for (var i = 1; i < table.rows.length; i++) {
        var tableRow = table.rows[i];
        var rowData = {};

        for (var j = 0; j < tableRow.cells.length; j++) {
            rowData[headers[j]] = tableRow.cells[j].innerHTML.replace(/(<([^>]+)>)/ig, "").trim();
        }
        data.push(rowData);
    }

    return data;
}

function getFormatDate(date) {
    var year = date.getFullYear();
    var month = (1 + date.getMonth());
    month = month >= 10 ? month : '0' + month;
    var day = date.getDate();
    day = day >= 10 ? day : '0' + day;
    return year + '-' + month + '-' + day;
}

function getDate() {
    return getFormatDate($('#date_calendar').calendar('get date'));
}

function prev_check() {
    if ($('#union').dropdown('get value') == "") {
        alert("유니온 레벨을 선택해주세요!");
        $.tab('change tab', 'first');
        $('.final.active').removeClass('active');
        return false;
    }

    var jsonObj = tableToJson(document.getElementById("tableRes1"));
    if (jsonObj.length == 0) {
        alert("먼저 구매할 물품을 선택해주세요!")
        return false;
    }
}

function aaaa() {
    $('button.ui.positive.button').addClass('disabled');
    $('body').toast({
        title: '생성중...',
        message: '<p style="color:gray">영수증 생성중입니다! 잠시만 기다려주세요</p>',
        showProgress: 'bottom',
        classProgress: 'green'
    });
    var API_URL = "https://8kl7idqvja.execute-api.ap-northeast-2.amazonaws.com/heejin";
    var jsonObj = tableToJson(document.getElementById("tableRes1"));
    var data = {
        "item": JSON.stringify(jsonObj)
    };
    $.post({
        url: API_URL,
        async: false,
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function (data) {
            console.log("success");
            $('#ajaxRes').html(` <div class="ui icon message"> <i class="sync alternate icon"></i> <div class="content"> <div class="header"> <h2 style="color:palevioletred" id="message">이달의 소녀 투표 꼭 부탁드려요!</h2> </div> <p style="font-weight: 100;">잊지 말고 아래 영수증 사진도 다운로드 해보세요! 감사합니다 :)</p> </div> </div><img class="ui centered large bordered image" src="data:image/png;base64,${data.img}">`)
        }
    });
}

$(document).ready(function () {
    /* init */
    $('.menu .item').tab();
    $(".final").click(function () {
        getResult()
    });
    $('#dev').popup({
        on: 'hover',
        position: 'bottom right'
    });
    $('img').popup({
        on: 'hover',
        delay: {
            show: 100,
            hide: 100
        },
        position: 'right center'
    });
});



$.getJSON('csv1.json', function (items) {
    $.each(items, function (i, item) {
        switch (item.cat) {
            case "가전/전자":
                $("#coin2>tbody").append(`<tr><td><h4 class="ui image header"> <img src="img/0${item.img}.info.iconRaw.png" class="ui mini rounded image"><div class="content"> ${item.name}<div class="sub header"><a href="${item.link}" target="_blank" style="color:#888">@${item.user}</a></div></h4></td><td><div class="ui action input"> <input type="hidden" placeholder="${item.cnt}"  min="0"> <button class="ui green button cntMax" onclick="$(this).closest('tr').find('td:eq(1)').find('input').val(${item.cnt})"> 담기</button></div></td></tr>`);
                break;
            case "게임":
                $("#coin3>tbody").append(`<tr><td><h4 class="ui image header"> <img src="img/0${item.img}.info.iconRaw.png" class="ui mini rounded image"><div class="content"> ${item.name}<div class="sub header"><a href="${item.link}" target="_blank" style="color:#888">@${item.user}</a></div></h4></td><td><div class="ui action input"> <input type="hidden" placeholder="${item.cnt}"  min="0"> <button class="ui green button cntMax" onclick="$(this).closest('tr').find('td:eq(1)').find('input').val(${item.cnt})"> 담기</button></div></td></tr>`);
                break;
            case "기프티콘":
                $("#coin4>tbody").append(`<tr><td><h4 class="ui image header"> <img src="img/0${item.img}.info.iconRaw.png" class="ui mini rounded image"><div class="content"> ${item.name}<div class="sub header"><a href="${item.link}" target="_blank" style="color:#888">@${item.user}</a></div></h4></td><td><div class="ui action input"> <input type="hidden" placeholder="${item.cnt}"  min="0"> <button class="ui green button cntMax" onclick="$(this).closest('tr').find('td:eq(1)').find('input').val(${item.cnt})"> 담기</button></div></td></tr>`);
                break;
            case "아이돌/굿즈":
            case "CD/DVD":
                $("#coin5>tbody").append(`<tr><td><h4 class="ui image header"> <img src="img/0${item.img}.info.iconRaw.png" class="ui mini rounded image"><div class="content"> ${item.name}<div class="sub header"><a href="${item.link}" target="_blank" style="color:#888">@${item.user}</a></div></h4></td><td><div class="ui action input"> <input type="hidden" placeholder="${item.cnt}"  min="0"> <button class="ui green button cntMax" onclick="$(this).closest('tr').find('td:eq(1)').find('input').val(${item.cnt})"> 담기</button></div></td></tr>`);
                break;
            case "현금/상품권":
                $("#coin6>tbody").append(`<tr><td><h4 class="ui image header"> <img src="img/0${item.img}.info.iconRaw.png" class="ui mini rounded image"><div class="content"> ${item.name}<div class="sub header"><a href="${item.link}" target="_blank" style="color:#888">@${item.user}</a></div></h4></td><td><div class="ui action input"> <input type="hidden" placeholder="${item.cnt}"  min="0"> <button class="ui green button cntMax" onclick="$(this).closest('tr').find('td:eq(1)').find('input').val(${item.cnt})"> 담기</button></div></td></tr>`);
                break;
            case "화장품":
                $("#coin7>tbody").append(`<tr><td><h4 class="ui image header"> <img src="img/0${item.img}.info.iconRaw.png" class="ui mini rounded image"><div class="content"> ${item.name}<div class="sub header"><a href="${item.link}" target="_blank" style="color:#888">@${item.user}</a></div></h4></td><td><div class="ui action input"> <input type="hidden" placeholder="${item.cnt}"  min="0"> <button class="ui green button cntMax" onclick="$(this).closest('tr').find('td:eq(1)').find('input').val(${item.cnt})"> 담기</button></div></td></tr>`);
                break;
            case "패션잡화":
            case "의류":
                $("#coin8>tbody").append(`<tr><td><h4 class="ui image header"> <img src="img/0${item.img}.info.iconRaw.png" class="ui mini rounded image"><div class="content"> ${item.name}<div class="sub header"><a href="${item.link}" target="_blank" style="color:#888">@${item.user}</a></div></h4></td><td><div class="ui action input"> <input type="hidden" placeholder="${item.cnt}"  min="0"> <button class="ui green button cntMax" onclick="$(this).closest('tr').find('td:eq(1)').find('input').val(${item.cnt})"> 담기</button></div></td></tr>`);
                break;
            case "식품":
                $("#coin9>tbody").append(`<tr><td><h4 class="ui image header"> <img src="img/0${item.img}.info.iconRaw.png" class="ui mini rounded image"><div class="content"> ${item.name}<div class="sub header"><a href="${item.link}" target="_blank" style="color:#888">@${item.user}</a></div></h4></td><td><div class="ui action input"> <input type="hidden" placeholder="${item.cnt}"  min="0"> <button class="ui green button cntMax" onclick="$(this).closest('tr').find('td:eq(1)').find('input').val(${item.cnt})"> 담기</button></div></td></tr>`);
                break;
            default:
                $("#coin10>tbody").append(`<tr><td><h4 class="ui image header"> <img src="img/0${item.img}.info.iconRaw.png" class="ui mini rounded image"><div class="content"> ${item.name}<div class="sub header"><a href="${item.link}" target="_blank" style="color:#888">@${item.user}</a></div></h4></td><td><div class="ui action input"> <input type="hidden" placeholder="${item.cnt}"  min="0"> <button class="ui green button cntMax" onclick="$(this).closest('tr').find('td:eq(1)').find('input').val(${item.cnt})"> 담기</button></div></td></tr>`);
                console.log('기타');
        }
    });
});