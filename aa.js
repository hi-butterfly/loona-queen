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
        0: '교환 불가',
        1: '<b><span style="color:blue">월드 내 나의 캐릭터간 이동만 가능</span></b>',
        2: '<b><span style="color:red">교환 불가</span></b>',
        3: '월드 내 나의 캐릭터간 이동만 가능',
        4: '<b><span style="color:blue">월드 내 나의 캐릭터간 1회 이동 가능</span></b>'
    };
    return change[a] || '...?';
}

function getResult() {
    $("#tableRes1>tbody").empty();
    var sum_coin = 0;
    $("input[type=number]").each(function (idx) {
        if ($(this).val()) {
            var tmpa = $(this).closest('tr').clone();
            var price = parseInt(tmpa.find("td:eq(2)").text());
            var coin = parseInt($(this).val()) * price;
            sum_coin += coin;
            console.log("@@");
            console.log(sum_coin);
            tmpa.find("td:eq(1)").html($(this).val());
            tmpa.find("td:eq(3)").html(coin);
            $("#tableRes1>tbody").append(tmpa);
        }
    });
    $("#tableRes1>tfoot").html(`<tr><th colspan="3">총 필요한 코인 수</th><th>${numberWithCommas(sum_coin)}</th></tr>`)
}

function tableToJson(table) {
    var data = [];
    var headers = ['name', 'cnt', 'uc', 'price']
    var keyword = ['교환 불가', '월드 내 나의 캐릭터간 이동만 가능', '월드 내 나의 캐릭터간 1회 이동 가능', '"> '];
    var keyRegExp = new RegExp('(' + keyword.join('|') + ')', 'g');

    for (var i = 1; i < table.rows.length; i++) {
        var tableRow = table.rows[i];
        var rowData = {};

        for (var j = 0; j < tableRow.cells.length; j++) {
            rowData[headers[j]] = tableRow.cells[j].innerHTML.replace(/(<([^>]+)>)/ig, "").replace(keyRegExp, '').trim();
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
    if ($('#date_calendar').calendar('get date') == null) {
        alert("코인 캐기 시작할 날짜를 선택해주세요!");
        $('#date_calendar').calendar('focus');
        return false;
    }

    var jsonObj = tableToJson(document.getElementById("tableRes1"));
    if (jsonObj.length == 1) {
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
    var sum_coin = jsonObj[Object.keys(jsonObj)[jsonObj.length - 1]].cnt.replace(',', '')
    if (sum_coin <= 21433) {
        alert("구매할 물품이 적은 경우, 영수증이 정상적으로 표시되지 않는 경우가 있습니다.\n영수증 위 메시지를 확인해주세요!")
    }
    var data = {
        "date_start": getDate(),
        "punch": $('#punch').val(),
        "want": sum_coin,
        "item": JSON.stringify(jsonObj)
    };
    $.post({
        url: API_URL,
        async: false,
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function (data) {
            console.log("success");
            $('#ajaxRes').html(` <div class="ui icon message"> <i class="sync alternate icon"></i> <div class="content"> <div class="header"> <h2 style="color:palevioletred" id="message">${data.message}</h2> </div> <p style="font-weight: 100;">썬데이 코인 2배, 유니온 가드닝 매일 수령한다고 가정.</p> </div> </div><img class="ui centered large bordered image" src="data:image/png;base64,${data.img}">`)
        }
    });
}

$(document).ready(function () {
    /* init */
    $('.menu .item').tab();
    $('#date_calendar').calendar({
        type: 'date',
        minDate: new Date(2022, 5, 1),
        maxDate: new Date(2022, 5, 3),
        text: {
            days: ['일', '월', '화', '수', '목', '금', '토'],
            months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
            monthsShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
            today: '오늘\'오늘',
            now: '현재',
            am: '오전',
            pm: '오후'
        },
    });
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
    $("#punch").change(function () {
        var i = parseInt($('#punch').val());
        var coin = Math.floor(i / 2);
        $('#display_union').text(`최대 ${numberWithCommas(coin)} 코인`);
    });
});



$.getJSON('csv1.json', function (items) {
    $.each(items, function (i, item) {
        /* if (i < 17) {
            $("#coin1>tbody").append(`<tr><td><div><h4 class="ui image header"> <img src="img/0${item.img}.info.iconRaw.png" class="ui mini rounded image"><div class="content"> ${item.name}<div class="sub header">${isChange(item.num)}</div></h4></div></td><td>${item.cnt}</td><td><div class="ui action input"> <input type="number" placeholder="0" style="width:100px" min="0"> <button class="ui green button cntMax" onclick="$(this).closest('tr').find('td:eq(2)').find('input').val(${item.cnt})"> 최대</button></div></td></tr>`);
        } else if (i < 29) {
            $("#coin2>tbody").append(`<tr><td><h4 class="ui image header"> <img src="img/0${item.img}.info.iconRaw.png" class="ui mini rounded image"><div class="content"> ${item.name}<div class="sub header">교환 불가</div></h4></td><td>${item.cnt}</td><td><div class="ui action input"> <input type="number" placeholder="0" style="width:100px" min="0"> <button class="ui green button cntMax" onclick="$(this).closest('tr').find('td:eq(2)').find('input').val(${item.cnt})"> 최대</button></div></td></tr>`);
        } else if (i < 99) {
            $("#coin3>tbody").append(`<tr><td><h4 class="ui image header"> <img src="img/0${item.img}.info.iconRaw.png" class="ui mini rounded image"><div class="content"> ${item.name}<div class="sub header">교환 불가</div></h4></td><td>${item.cnt}</td><td><div class="ui action input"> <input type="number" placeholder="0" style="width:100px" min="0"> <button class="ui green button cntMax" onclick="$(this).closest('tr').find('td:eq(2)').find('input').val(${item.cnt})"> 최대</button></div></td></tr>`);
        } else if (i < 125) {
            $("#coin5>tbody").append(`<tr><td><h4 class="ui image header"> <img src="img/0${item.img}.info.iconRaw.png" class="ui mini rounded image"><div class="content"> ${item.name}<div class="sub header">교환 불가</div></h4></td><td>${item.cnt}</td><td><div class="ui action input"> <input type="number" placeholder="0" style="width:100px" min="0"> <button class="ui green button cntMax" onclick="$(this).closest('tr').find('td:eq(2)').find('input').val(${item.cnt})"> 최대</button></div></td></tr>`);
        } else if (i < 150) {
            $("#coin6>tbody").append(`<tr><td><h4 class="ui image header"> <img src="img/0${item.img}.info.iconRaw.png" class="ui mini rounded image"><div class="content"> ${item.name}<div class="sub header">교환 불가</div></h4></td><td>${item.cnt}</td><td><div class="ui action input"> <input type="number" placeholder="0" style="width:100px" min="0"> <button class="ui green button cntMax" onclick="$(this).closest('tr').find('td:eq(2)').find('input').val(${item.cnt})"> 최대</button></div></td></tr>`);
        } else {
            $("#coin7>tbody").append(`<tr><td><h4 class="ui image header"> <img src="img/0${item.img}.info.iconRaw.png" class="ui mini rounded image"><div class="content"> ${item.name}<div class="sub header">교환 불가</div></h4></td><td>${item.cnt}</td><td><div class="ui action input"> <input type="number" placeholder="0" style="width:100px" min="0"> <button class="ui green button cntMax" onclick="$(this).closest('tr').find('td:eq(2)').find('input').val(${item.cnt})"> 최대</button></div></td></tr>`);
        } */
        switch (item.cat) {
            case "가전/전자":
                $("#coin2>tbody").append(`<tr><td><h4 class="ui image header"> <img src="img/0${item.img}.info.iconRaw.png" class="ui mini rounded image"><div class="content"> ${item.name}<div class="sub header">교환 불가</div></h4></td><td>${item.cnt}</td><td><div class="ui action input"> <input type="number" placeholder="0" style="width:100px" min="0"> <button class="ui green button cntMax" onclick="$(this).closest('tr').find('td:eq(2)').find('input').val(${item.cnt})"> 최대</button></div></td></tr>`);
                break;
            case "게임":
                $("#coin3>tbody").append(`<tr><td><h4 class="ui image header"> <img src="img/0${item.img}.info.iconRaw.png" class="ui mini rounded image"><div class="content"> ${item.name}<div class="sub header">교환 불가</div></h4></td><td>${item.cnt}</td><td><div class="ui action input"> <input type="number" placeholder="0" style="width:100px" min="0"> <button class="ui green button cntMax" onclick="$(this).closest('tr').find('td:eq(2)').find('input').val(${item.cnt})"> 최대</button></div></td></tr>`);
                break;
            case "기프티콘":
                $("#coin4>tbody").append(`<tr><td><h4 class="ui image header"> <img src="img/0${item.img}.info.iconRaw.png" class="ui mini rounded image"><div class="content"> ${item.name}<div class="sub header">교환 불가</div></h4></td><td>${item.cnt}</td><td><div class="ui action input"> <input type="number" placeholder="0" style="width:100px" min="0"> <button class="ui green button cntMax" onclick="$(this).closest('tr').find('td:eq(2)').find('input').val(${item.cnt})"> 최대</button></div></td></tr>`);
                break;
            case "아이돌/굿즈":
            case "CD/DVD":
                $("#coin5>tbody").append(`<tr><td><h4 class="ui image header"> <img src="img/0${item.img}.info.iconRaw.png" class="ui mini rounded image"><div class="content"> ${item.name}<div class="sub header">교환 불가</div></h4></td><td>${item.cnt}</td><td><div class="ui action input"> <input type="number" placeholder="0" style="width:100px" min="0"> <button class="ui green button cntMax" onclick="$(this).closest('tr').find('td:eq(2)').find('input').val(${item.cnt})"> 최대</button></div></td></tr>`);
                break;
            case "현금/상품권":
                $("#coin6>tbody").append(`<tr><td><h4 class="ui image header"> <img src="img/0${item.img}.info.iconRaw.png" class="ui mini rounded image"><div class="content"> ${item.name}<div class="sub header">교환 불가</div></h4></td><td>${item.cnt}</td><td><div class="ui action input"> <input type="number" placeholder="0" style="width:100px" min="0"> <button class="ui green button cntMax" onclick="$(this).closest('tr').find('td:eq(2)').find('input').val(${item.cnt})"> 최대</button></div></td></tr>`);
                break;
            case "화장품":
                $("#coin7>tbody").append(`<tr><td><h4 class="ui image header"> <img src="img/0${item.img}.info.iconRaw.png" class="ui mini rounded image"><div class="content"> ${item.name}<div class="sub header">교환 불가</div></h4></td><td>${item.cnt}</td><td><div class="ui action input"> <input type="number" placeholder="0" style="width:100px" min="0"> <button class="ui green button cntMax" onclick="$(this).closest('tr').find('td:eq(2)').find('input').val(${item.cnt})"> 최대</button></div></td></tr>`);
                break;
            case "패션잡화":
            case "의류":
                $("#coin8>tbody").append(`<tr><td><h4 class="ui image header"> <img src="img/0${item.img}.info.iconRaw.png" class="ui mini rounded image"><div class="content"> ${item.name}<div class="sub header">교환 불가</div></h4></td><td>${item.cnt}</td><td><div class="ui action input"> <input type="number" placeholder="0" style="width:100px" min="0"> <button class="ui green button cntMax" onclick="$(this).closest('tr').find('td:eq(2)').find('input').val(${item.cnt})"> 최대</button></div></td></tr>`);
                break;
            case "식품":
                $("#coin9>tbody").append(`<tr><td><h4 class="ui image header"> <img src="img/0${item.img}.info.iconRaw.png" class="ui mini rounded image"><div class="content"> ${item.name}<div class="sub header">교환 불가</div></h4></td><td>${item.cnt}</td><td><div class="ui action input"> <input type="number" placeholder="0" style="width:100px" min="0"> <button class="ui green button cntMax" onclick="$(this).closest('tr').find('td:eq(2)').find('input').val(${item.cnt})"> 최대</button></div></td></tr>`);
                break;
            default:
                $("#coin10>tbody").append(`<tr><td><h4 class="ui image header"> <img src="img/0${item.img}.info.iconRaw.png" class="ui mini rounded image"><div class="content"> ${item.name}<div class="sub header">교환 불가</div></h4></td><td>${item.cnt}</td><td><div class="ui action input"> <input type="number" placeholder="0" style="width:100px" min="0"> <button class="ui green button cntMax" onclick="$(this).closest('tr').find('td:eq(2)').find('input').val(${item.cnt})"> 최대</button></div></td></tr>`);
                console.log('기타');
        }
    });
});