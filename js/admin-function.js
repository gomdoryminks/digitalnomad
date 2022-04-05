//게시판 댓글 개수 (게시판 댓글에 data-idx 값이 없을 경우 사용함)
var commentCnt = 0;

$(function() {
    var userAgent = navigator.userAgent.toLowerCase();
    
    //ios(아이폰, 아이패드, 아이팟) 전용 css 적용
    if (userAgent.indexOf("iphone") > -1 || userAgent.indexOf("ipad") > -1 || userAgent.indexOf("ipod") > -1) {
        var cssIosLink = document.createElement("link");
        
        cssIosLink.href = "../css/admin-main-ios.css";
        cssIosLink.async = false;
        cssIosLink.rel = "stylesheet";
        cssIosLink.type = "text/css";
        
        document.head.appendChild(cssIosLink);
    }
    
    //리사이즈
    $(window).resize(function() {
        //헤더 마지막 하위메뉴 위치 설정
        setNavLastListPosition();
    });
    
    //스크롤
    $(window).scroll(function() {
        //위로 이동 버튼 보이기&숨기기
        if ($(this).scrollTop() > 100) {
            $(".back-to-top").fadeIn("slow");
        } else {
            $(".back-to-top").fadeOut("slow");
        }
    });
    
    //위로 이동 버튼 클릭시
    $(".back-to-top").click(function() {
        $("html,body").stop().animate({scrollTop: 0}, 1000);
    });
    
    //숫자만 입력
    $("input.only-number").on("keyup", function() {
         $(this).val($(this).val().replace(/[^0-9-]/g,""));
    });
    
    //헤더 하위메뉴 보이기&숨기기
	$("nav.nav .nav-menu>li").on("mouseover", function(evt) {
		evt.preventDefault();
        $(this).children(".nav-sub-menu").stop(true,true).slideDown(200);
	});
	
	$("nav.nav .nav-menu>li").on("mouseleave", function(evt) {
		evt.preventDefault();
        $(this).children(".nav-sub-menu").stop(true,true).slideUp(200);
	});
    
    //헤더 마지막 하위메뉴 위치 설정
    setNavLastListPosition();
    
    //로고 이미지 변경
    if ($(".blackWrap").length > 0) {
        if ($(".mainWrap.blackWrap").length > 0) {
            $("header.header .header-main .header-main-logo img").attr("src","../img/logo-wh.png");
        }
    }
    
    //파일 업로드시 파일명 추출
    $(".content-file-area input[type='file']").on("change", function() {
        var filename = "";
        
        if (window.FileReader) {
            //기본 브라우저
            filename = $(this)[0].files[0].name;
        } else {
            //old IE
            filename = $(this).val().split('/').pop().split('\\').pop();
        }
        
        $(this).closest(".content-file-area").find(".content-file").val(filename);
    });
    
    //datepicker 설정
    $(".content-date-text").each(function() {
        $(this).datepicker();
    });
    
    //datetimepicker 설정
    $(".content-datetime-text").each(function() {
        $(this).datetimepicker({
            controlType: 'select',
            oneLine: true,
            timeFormat: 'HH:mm',
            closeText: '닫기'
        });
    });
    
    //sortable 설정
    $(".content-sortable").each(function() {
        $(this).sortable({
            update: function() {
                $(this).children("li").each(function(index) {
                    //드래그시 순서 넘버링도 변경됨
                    if ($(this).children(".sortable-num").length > 0) {
                        $(this).children(".sortable-num").text(index + 1);
                    }
                });
            },
            over: function() {
                console.log("over / " + $(this).find(".ui-sortable-helper").css("height") + " / " + $(this).find(".ui-sortable-placeholder").css("height"));
                var siHeight = $(this).find(".ui-sortable-helper").css("height");
                
                if (siHeight != undefined) {
                    $(this).find(".ui-sortable-placeholder").css("height",siHeight+"px");
                }
            },
            sort: function() {
                console.log("sort / " + $(this).find(".ui-sortable-helper").css("height") + " / " + $(this).find(".ui-sortable-placeholder").css("height"));
                var siHeight = $(this).find(".ui-sortable-helper").css("height");
                
                if (siHeight != undefined) {
                    $(this).find(".ui-sortable-placeholder").css("height",siHeight+"px");
                }
            }
        });
    });
    
    //fullcalendar 설정
    $(".full-calendar").each(function() {
        var calendarEl = $(this)[0];
        
        var calendar = new FullCalendar.Calendar(calendarEl, {
            headerToolbar: {
                left: 'title',
                center: '',
                right: 'today prev,next'
            },
            expandRows: true, // 화면에 맞게 높이 재설정
            navLinks: false, // 날짜를 선택하면 Day 캘린더나 Week 캘린더로 링크
            editable: false, // 수정 가능
            selectable: false, // 달력 일자 드래그 설정가능
            dayMaxEvents: true, // 이벤트가 오버되면 높이 제한 (+ 몇 개식으로 표현)
            locale: 'ko', // 한국어 설정
            eventDidMount: function(info) {
                if (info.event.extendedProps.description != undefined && info.event.extendedProps.description != "") {
                    tippy(info.el, {
                        content: info.event.extendedProps.description, //이벤트 디스크립션을 툴팁으로 가져옵니다.
                    });
                }
            },
            eventSources: [
                {
                    //스튜디오 예약현황 설정 (날짜까지만 설정)
                    events: [
                        {
                            title: '스튜디오1',
                            url: 'reservation-studio-application.html?idx=1&startDate=2022-02-22&endDate=2022-02-22',
                            start: '2022-02-22',
                            description: '스튜디오1'
                        },
                        {
                            title: '스튜디오2',
                            url: 'reservation-studio-application.html?idx=2&startDate=2022-02-22&endDate=2022-02-22',
                            start: '2022-02-22',
                            description: '스튜디오2'
                        }
                    ],
                    color: '#4586c1',
                    textColor: '#ffffff'
                },
                {
                    //오피스 예약현황 설정 (날짜까지만 설정)
                    events: [
                        {
                            title: '오피스1',
                            url: 'reservation-office-application.html?idx=3&startDate=2022-02-22&endDate=2022-02-22',
                            start: '2022-02-22',
                            description: '오피스1'
                        },
                        {
                            title: '오피스2',
                            url: 'reservation-office-application.html?idx=4&startDate=2022-02-22&endDate=2022-02-22',
                            start: '2022-02-22',
                            description: '오피스2'
                        }
                    ],
                    color: '#d14c4b',
                    textColor: '#ffffff'
                },
                {
                    //회의실 예약현황 설정 (날짜까지만 설정)
                    events: [
                        {
                            title: '회의실1',
                            url: 'reservation-conferenceroom-application.html?idx=5&startDate=2022-02-22&endDate=2022-02-22',
                            start: '2022-02-22',
                            description: '회의실1'
                        },
                        {
                            title: '회의실2',
                            url: 'reservation-conferenceroom-application.html?idx=6&startDate=2022-02-22&endDate=2022-02-22',
                            start: '2022-02-22',
                            description: '회의실2'
                        }
                    ],
                    color: '#f1ac45',
                    textColor: '#ffffff'
                },
                {
                    //장비 예약현황 설정 (날짜까지만 설정)
                    events: [
                        {
                            title: '장비1',
                            url: 'reservation-equipment-application.html?idx=7&startDate=2022-02-22&endDate=2022-02-22',
                            start: '2022-02-22',
                            description: '장비1'
                        },
                        {
                            title: '장비2',
                            url: 'reservation-equipment-application.html?idx=8&startDate=2022-02-22&endDate=2022-02-22',
                            start: '2022-02-22',
                            description: '장비2'
                        }
                    ],
                    color: '#b1b3aa',
                    textColor: '#ffffff'
                },
                {
                    //비대여시간 설정 (날짜까지만 설정하고 시간은 마우스오버시 보여줌)
                    events: [
                        {
                            title: '스튜디오1',
                            start: '2022-02-07',
                            description: '스튜디오1 비대여시간 : 8시, 9시, 10시, 11시'
                        },
                        {
                            title: '회의실1',
                            start: '2022-02-11',
                            description: '회의실1 비대여시간 : 8시, 9시, 10시, 11시'
                        }
                    ],
                    color: '#7d7d7d',
                    textColor: '#ffffff'
                },
                {
                    //휴관일 설정 (일마다 설정해줘야 일마다 휴관일이라는 텍스트가 나옴)
                    events: [
                        {
                            title: '휴관일',
                            start: '2022-02-14',
                            overlap: false,
                            display: 'background'
                        },
                        {
                            title: '휴관일',
                            start: '2022-02-15',
                            overlap: false,
                            display: 'background'
                        },
                        {
                            title: '휴관일',
                            start: '2022-02-18',
                            overlap: false,
                            display: 'background'
                        },
                        {
                            title: '휴관일',
                            start: '2022-02-19',
                            overlap: false,
                            display: 'background'
                        }
                    ],
                    color: '#ffe2dc',
                    textColor: '#000000'
                }
            ]
        });
        
        calendar.render();
        
        //날짜 클릭시
        /*calendar.on('dateClick', function(info) {
            console.log(info.dateStr);
            location.href = "reservation-studio-application.html?startDate=" + info.dateStr + "&endDate=" + info.dateStr;
        });*/
        $(".fc-daygrid-day-number").click(function() {
            var dateStr = $(this).closest("td.fc-daygrid-day").attr("data-date");
            
            console.log(dateStr);
            location.href = "reservation-studio-application.html?startDate=" + dateStr + "&endDate=" + dateStr;
        });
    });
    
    //4차 수정부분 START
    //swiper 슬라이드 (detail)
    if ($(".detail-slide").length > 0) {
        var detailSwiper = new Swiper('.detail-slide', {
            observer: true,
            observeParents: true,
            slidesPerView: 1,
            autoHeight : true,
            watchOverflow: true
        });
    }
    
    //관리자 프로젝트 진행사항 변경
    if ($("#project_state").length > 0) {
        setProjectReturn($("#project_state"));
    }
    //4차 수정부분 END
    
    //게시판 댓글 개수 (게시판 댓글에 data-idx 값이 없을 경우 사용함)
    if ($(".content-detail .detail-board-comment .board-comment-list").length > 0) {
        $(".content-detail .detail-board-comment .board-comment-list .comment-list-item").each(function() {
            commentCnt++;
            $(this).attr("data-idx",commentCnt);
        });
    }
    
    //셀렉트박스 안에 체크박스가 있을 경우
    $(".content-dropdown-area .content-dropdown-text").on("click", function() {
    	$(this).closest(".content-dropdown-area").find(".content-dropdown-list ul").slideToggle("fast");
	});

	$(".content-dropdown-area .content-dropdown-list ul li a").on("click", function() {
		$(this).closest(".content-dropdown-area").find(".content-dropdown-list ul").hide();
	});

	$(document).bind("click", function(e) {
		var $clicked = $(e.target);
		
		if (!$clicked.parents().hasClass("content-dropdown-area")) {
			$(".content-dropdown-area .content-dropdown-list ul").hide();
		} else {
			$(".content-dropdown-area").not($clicked.parents(".content-dropdown-area")).find(".content-dropdown-list ul").hide();
		}
	});

	$(".content-dropdown-area .content-dropdown-list ul li input[type='checkbox']").on("click", function() {
		var dropdownListObj = $(this).closest(".content-dropdown-list");
		var dropdownText = "";
		
		$(dropdownListObj).find("ul li").each(function() {
			if ($(this).find("input[type='checkbox']")) {
				if ($(this).find("input[type='checkbox']").is(":checked")) {
					if (dropdownText != "") {
						dropdownText += ",";
					}
					
					dropdownText += $(this).find("input[type='checkbox']").next("label").text();
				}
			}
		});
		
		$(dropdownListObj).closest(".content-dropdown-area").find(".content-dropdown-text").val(dropdownText);
	});
	
	$(".content-dropdown-area").each(function() {
		var dropdownListObj = $(this).find(".content-dropdown-list");
		var dropdownText = "";
		
		$(dropdownListObj).find("ul li").each(function() {
			if ($(this).find("input[type='checkbox']")) {
				if ($(this).find("input[type='checkbox']").is(":checked")) {
					if (dropdownText != "") {
						dropdownText += ",";
					}
					
					dropdownText += $(this).find("input[type='checkbox']").next("label").text();
				}
			}
		});
		
		$(dropdownListObj).closest(".content-dropdown-area").find(".content-dropdown-text").val(dropdownText);
	});
});

//헤더 마지막 하위메뉴 위치 설정
function setNavLastListPosition() {
    var winWidth = window.innerWidth;
    
    if ($("nav.nav .nav-menu>li .nav-sub-menu").length > 0 && winWidth < 1624) {
        var ctMarginRight = $("nav.nav").closest(".center-ct").css("margin-right");

        $("nav.nav .nav-menu>li:last-child .nav-sub-menu").css("right","-" + ctMarginRight);
    }
}

//관리자 비밀번호 변경 체크&체크해제
function setChangePassword(obj) {
    if ($(obj).prop("checked") !== false) {
        $(".change-password-area").css("display","table-row");
    } else {
        $(".change-password-area").css("display","none");
    }
}

//파일 폼 추가
function addFileArea(obj) {
    var fileAreaObj = $(obj).closest(".variable-file-area");
    
    if ($(fileAreaObj).length > 0) {
        var fileNum = $(fileAreaObj).find(".content-file-area").length;
        var dataName = ($(obj).attr("data-name") != undefined) ? $(obj).attr("data-name") + "_" + (fileNum + 1) : "";
        var dataMaxNum = (parseInt($(obj).attr("data-max-num")) > 0) ? parseInt($(obj).attr("data-max-num")) : "";
        var fileHtml = "";

        if (dataMaxNum > fileNum || dataMaxNum == "") {
            fileHtml += "<div class='content-file-area'>";
            fileHtml += "    <input type='text' name='' id='' class='content-text content-file' disabled>";
            fileHtml += "    <label><input type='file' name='" + dataName + "' id='" + dataName + "'>첨부파일</label>";
            //remove-file-btn : 파일폼 삭제 버튼
            fileHtml += "    <button type='button' class='content-btn content-btn-type3 remove-file-btn' onclick='removeFileArea(this);'>삭제</button>";
            fileHtml += "</div>";

            $(fileAreaObj).append(fileHtml);
        } else {
            openLayer("alert","최대 " + dataMaxNum + "개까지 추가할 수 있습니다.","");
        }
    }
    
    //파일 업로드시 파일명 추출
    $(".content-file-area input[type='file']").on("change", function() {
        var filename = "";
        
        if (window.FileReader) {
            //기본 브라우저
            filename = $(this)[0].files[0].name;
        } else {
            //old IE
            filename = $(this).val().split('/').pop().split('\\').pop();
        }
        
        $(this).closest(".content-file-area").find(".content-file").val(filename);
    });
}

//파일 폼 삭제
function removeFileArea(obj) {
    var fileAreaObj = $(obj).closest(".variable-file-area");
    
    if ($(fileAreaObj).length > 0) {
        var addBtnObj = $(fileAreaObj).find(".add-file-btn");
        var dataName = ($(addBtnObj).attr("data-name") != undefined) ? $(addBtnObj).attr("data-name") : "";
        var dataMaxNum = (parseInt($(addBtnObj).attr("data-max-num")) > 0) ? parseInt($(addBtnObj).attr("data-max-num")) : "";
        
        $(obj).closest(".content-file-area").remove();

        if (dataName != "") {
            var fileNum = 1;
            
            $(fileAreaObj).find(".content-file-area").each(function() {
                $(this).find("input[type='file']").attr("name",dataName + "_" + fileNum);
                $(this).find("input[type='file']").attr("id",dataName + "_" + fileNum);
                fileNum++;
            });
        }
    }
}

//코드 폼 추가
function addCodeArea(obj) {
    var codeAreaObj = $(obj).next(".code-table-area");
    
    if ($(codeAreaObj).length > 0) {
    	var codeTbodyObj = $(codeAreaObj).find(".list-table").find("tbody");
        var codeNum = $(codeTbodyObj).find("tr").length;
        var codeHtml = "";
        
        codeHtml += "			<tr>";
        codeHtml += "				<td>" + (codeNum + 1) + "</td>";
        codeHtml += "				<td><input type='text' name='' id='' class='content-text content-center'></td>";
        codeHtml += "				<td><button type='button' class='content-btn content-btn-type3 remove-code-btn' onclick='removeCodeArea(this);'>삭제</button></td>";
        codeHtml += "			</tr>";
        
        $(codeTbodyObj).append(codeHtml);
    }
}

//코드 폼 삭제
function removeCodeArea(obj) {
    var codeAreaObj = $(obj).closest(".code-table-area");
    
    if ($(codeAreaObj).length > 0) {
    	var codeTbodyObj = $(codeAreaObj).find(".list-table").find("tbody");
    	var codeNum = 1;
        
        $(obj).closest("tr").remove();
        
        $(codeTbodyObj).find("tr").each(function() {
        	$(this).find("td").eq(0).text(codeNum);
        	codeNum++;
        });
    }
}

//IP 폼 추가
function addIpArea(obj) {
    var ipAreaObj = $(obj).next(".ip-table-area");
    
    if ($(ipAreaObj).length > 0) {
    	var ipTbodyObj = $(ipAreaObj).find(".list-table").find("tbody");
        var ipNum = $(ipTbodyObj).find("tr").length;
        var ipHtml = "";
        
        ipHtml += "			<tr>";
        ipHtml += "				<td>" + (ipNum + 1) + "</td>";
        ipHtml += "				<td><input type='text' name='' id='' class='content-text content-center'></td>";
        ipHtml += "				<td><button type='button' class='content-btn content-btn-type3 remove-ip-btn' onclick='removeIpArea(this);'>삭제</button></td>";
        ipHtml += "			</tr>";
        
        $(ipTbodyObj).append(ipHtml);
    }
}

//IP 폼 삭제
function removeIpArea(obj) {
    var ipAreaObj = $(obj).closest(".ip-table-area");
    
    if ($(ipAreaObj).length > 0) {
    	var ipTbodyObj = $(ipAreaObj).find(".list-table").find("tbody");
        var ipNum = 1;
        
        $(obj).closest("tr").remove();
        
        $(ipTbodyObj).find("tr").each(function() {
        	$(this).find("td").eq(0).text(ipNum);
        	ipNum++;
        });
    }
}

//4차 수정부분 START
//관리자 프로젝트 진행사항 변경
function setProjectReturn(obj) {
    if ($(obj).val() == "반려") {
        $(".project-return-area").css("display","table-row");
    } else {
        $(".project-return-area").css("display","none");
    }
}

//댓글 추가 폼
function addComment(obj) {
    var formObj = $(obj).closest(".board-comment-form");
    var formHtml = "";
    
    if ($(formObj).length > 0) {
        var listObj = $(formObj).next(".board-comment-list");
        var listHtml = "";
        
        formHtml += "    <div class='comment-list-item'>";
        formHtml += "        <div class='board-comment-form'>";
        formHtml += "            <div class='comment-form-item cf'>";
        formHtml += "                <div class='comment-form-left'>";
        formHtml += "                    <div class='comment-form-link'><a href='javascript:void(0);' onclick='addCommentCancel(this);'>답글취소</a></div>";
        formHtml += "                </div>";
        formHtml += "            </div>";
        formHtml += "            <div class='comment-form-item cf'>";
        formHtml += "                <textarea name='' id='' class='content-textarea' placeholder='댓글내용'></textarea>";
        formHtml += "                <button type='button' class='content-btn content-btn-type2' onclick='addCommentSubmit(\"reply\",this);'>확인</button>";
        formHtml += "            </div>";
        formHtml += "        </div>";
        formHtml += "    </div>";
        
        if ($(listObj).length > 0) {
            //해당 댓글에 답글이 있는 경우
            $(listObj).append(formHtml);
        } else {
            //해당 댓글에 답글이 없는 경우
            listHtml += "<div class='board-comment-list'>";
            listHtml += formHtml;
            listHtml += "</div>";

            $(formObj).after(listHtml);
        }
    }
}

//댓글 추가 처리 (type : 댓글종류 (new : 새글, reply : 답글))
function addCommentSubmit(type, obj) {
    var formObj = $(obj).closest(".board-comment-form");
    var formHtml = "";
    
    if ($(formObj).length > 0) {
        //게시판 댓글에 data-idx 값이 없을 경우 사용함
        commentCnt++;
        
        formHtml += "           <div class='comment-form-item cf'>";
        formHtml += "               <div class='comment-form-left'>";
        formHtml += "                   <div class='comment-form-writer'>홍길동</div>";
        formHtml += "                   <div class='comment-form-date'>2021-10-24 12:50:00</div>";
        formHtml += "               </div>";
        formHtml += "               <div class='comment-form-right'>";
        formHtml += "                   <div class='comment-form-link'><a href='javascript:void(0);' onclick='modComment(\"" + commentCnt + "\");'>수정</a></div>";
        formHtml += "                   <div class='comment-form-link'><a href='javascript:void(0);' onclick='delCommentCheck(this);'>삭제</a></div>";
        formHtml += "                   <div class='comment-form-link'><a href='javascript:void(0);' onclick='addComment(this);'>답글</a></div>";
        formHtml += "               </div>";
        formHtml += "           </div>";
        formHtml += "           <div class='comment-form-item cf'>";
        formHtml += "               <div class='comment-form-con'>댓글 내용이 들어갑니다.</div>";
        formHtml += "           </div>";
        
        if (type == "new") {
            //댓글을 새로 추가할 경우
            var listObj = $(formObj).next(".board-comment-list");
            var listHtml = "";

            if ($(listObj).length > 0) {
                //기존에 댓글이 있는 경우
                //게시판 댓글의 답글에 data-idx 값 설정 (primary key)
                listHtml += "    <div class='comment-list-item' data-idx='" + commentCnt + "'>";
                listHtml += "        <div class='board-comment-form'>";
                listHtml += formHtml;
                listHtml += "        </div>";
                listHtml += "    </div>";
                
                $(listObj).append(listHtml);
            } else {
                //기존에 댓글이 없는 경우
                listHtml += "<div class='board-comment-list'>";
                //게시판 댓글의 답글에 data-idx 값 설정 (primary key)
                listHtml += "    <div class='comment-list-item' data-idx='" + commentCnt + "'>";
                listHtml += "        <div class='board-comment-form'>";
                listHtml += formHtml;
                listHtml += "        </div>";
                listHtml += "    </div>";
                listHtml += "</div>";
                
                $(formObj).after(listHtml);
            }
        } else if (type == "reply") {
            //댓글의 답글을 새로 추가할 경우            
            $(formObj).html(formHtml);
            
            //게시판 댓글의 답글에 data-idx 값 설정 (primary key)
            $(formObj).closest(".comment-list-item").attr("data-idx",commentCnt);
        }
    }
}

//댓글 추가 취소
function addCommentCancel(obj) {
    var formObj = $(obj).closest(".board-comment-form");
    
    if ($(formObj).length > 0) {
        var listObj = $(formObj).closest(".board-comment-list");
        
        if ($(listObj).length > 0) {
            var itemObj = $(listObj).children(".comment-list-item");
            
            if ($(itemObj).length > 1) {
                //댓글에 해당 답글외에 답글이 있는 경우
                $(formObj).closest(".comment-list-item").remove();
            } else {
                //댓글에 해당 답글만 있는 경우
                $(listObj).remove();
            }
        }
    }
}

//댓글 수정 폼
function modComment(idx) {
    var formObj = $(".content-detail .detail-board-comment .board-comment-list .comment-list-item[data-idx='" + idx + "']").children(".board-comment-form");
    var formHtml = "";
    
    if ($(formObj).length > 0) {
        formHtml += "<div class='comment-form-item cf'>";
        formHtml += "    <div class='comment-form-left'>";
        formHtml += "        <div class='comment-form-writer'>홍길동</div>";
        formHtml += "        <div class='comment-form-date'>2021-10-24 12:50:00</div>";
        formHtml += "    </div>";
        formHtml += "    <div class='comment-form-right'>";
        formHtml += "        <div class='comment-form-link'><a href='javascript:void(0);' onclick='modCommentCancel(this);'>수정취소</a></div>";
        formHtml += "    </div>";
        formHtml += "</div>";
        formHtml += "<div class='comment-form-item cf'>";
        formHtml += "    <textarea name='' id='' class='content-textarea' placeholder='댓글내용'></textarea>";
        formHtml += "    <button type='button' class='content-btn content-btn-type2' onclick='modCommentSubmit(\"" + idx + "\");'>확인</button>";
        formHtml += "</div>";
        
        $(formObj).html(formHtml);
    }
}

//댓글 수정 처리
function modCommentSubmit(idx) {
    var formObj = $(".content-detail .detail-board-comment .board-comment-list .comment-list-item[data-idx='" + idx + "']").children(".board-comment-form");
    var formHtml = "";
    
    if ($(formObj).length > 0) {
        formHtml += "<div class='comment-form-item cf'>";
        formHtml += "    <div class='comment-form-left'>";
        formHtml += "        <div class='comment-form-writer'>홍길동</div>";
        formHtml += "        <div class='comment-form-date'>2021-10-24 12:50:00</div>";
        formHtml += "    </div>";
        formHtml += "    <div class='comment-form-right'>";
        formHtml += "        <div class='comment-form-link'><a href='javascript:void(0);' onclick='modComment(\"" + idx + "\");'>수정</a></div>";
        formHtml += "        <div class='comment-form-link'><a href='javascript:void(0);' onclick='delCommentCheck(this);'>삭제</a></div>";
        formHtml += "        <div class='comment-form-link'><a href='javascript:void(0);' onclick='addComment(this);'>답글</a></div>";
        formHtml += "    </div>";
        formHtml += "</div>";
        formHtml += "<div class='comment-form-item cf'>";
        formHtml += "    <div class='comment-form-con'>댓글 내용이 들어갑니다.</div>";
        formHtml += "</div>";
        
        $(formObj).html(formHtml);
    }
}

//댓글 수정 취소
function modCommentCancel(obj) {
    var formObj = $(obj).closest(".board-comment-form");
    var formHtml = "";
    
    if ($(formObj).length > 0) {
        var dataIdx = $(formObj).closest(".comment-list-item").attr("data-idx");
        
        formHtml += "<div class='comment-form-item cf'>";
        formHtml += "    <div class='comment-form-left'>";
        formHtml += "        <div class='comment-form-writer'>홍길동</div>";
        formHtml += "        <div class='comment-form-date'>2021-10-24 12:50:00</div>";
        formHtml += "    </div>";
        formHtml += "    <div class='comment-form-right'>";
        formHtml += "        <div class='comment-form-link'><a href='javascript:void(0);' onclick='modComment(\"" + dataIdx + "\");'>수정</a></div>";
        formHtml += "        <div class='comment-form-link'><a href='javascript:void(0);' onclick='delCommentCheck(this);'>삭제</a></div>";
        formHtml += "        <div class='comment-form-link'><a href='javascript:void(0);' onclick='addComment(this);'>답글</a></div>";
        formHtml += "    </div>";
        formHtml += "</div>";
        formHtml += "<div class='comment-form-item cf'>";
        formHtml += "    <div class='comment-form-con'>댓글 내용이 들어갑니다.</div>";
        formHtml += "</div>";
        
        $(formObj).html(formHtml);
    }
}

//댓글 삭제 체크
function delCommentCheck(obj) {
    var formObj = $(obj).closest(".board-comment-form");
    
    if ($(formObj).length > 0) {
        var listObj = $(formObj).closest(".board-comment-list");
        var dataIdx = $(formObj).closest(".comment-list-item").attr("data-idx");
        
        if ($(listObj).length > 0) {
            var subListObj = $(formObj).next(".board-comment-list");
            
            if ($(subListObj).length > 0) {
                //해당 댓글에 답글이 있는 경우
                openLayer("alert","답글이 있어서 삭제할 수 없습니다.","");
            } else {
                //해당 댓글에 답글이 없는 경우
                delComment(dataIdx);
            }
        }
    }
}

//댓글 삭제 처리
function delComment(idx) {
    var formObj = $(".content-detail .detail-board-comment .board-comment-list .comment-list-item[data-idx='" + idx + "']").children(".board-comment-form");
    
    if ($(formObj).length > 0) {
        var listObj = $(formObj).closest(".board-comment-list");
        
        if ($(listObj).length > 0) {
            var itemObj = $(listObj).children(".comment-list-item");
            
            if ($(itemObj).length > 1) {
                //해당 댓글외에 댓글이 있는 경우
                $(formObj).closest(".comment-list-item").remove();
            } else {
                //해당 댓글만 있는 경우
                $(listObj).remove();
            }
        }
    }
}
//4차 수정부분 END

//5차 수정부분 START
//7차 수정부분 START
//기본 레이어 팝업 열기
function openDefaultLayer(id,obj) {
    var layerTitle = "";
    var layerHtml = "";
    var layerWidth = "320px";
    
    if (id == "reservation-close-layer") {
        //휴관일 설정 레이어
        layerTitle = "휴관일 설정";
        
        layerHtml += "<div class='layer-content-txt2'>휴관일을 설정해주세요.</div>";
        layerHtml += "<div class='layer-date-area'>";
        layerHtml += "   <input type='text' name='' id='startClosed' class='content-text content-date-text' autocomplete='off'>";
        layerHtml += "   <span class='separate'>~</span>";
        layerHtml += "   <input type='text' name='' id='endClosed' class='content-text content-date-text' autocomplete='off'>";
        layerHtml += "</div>";
        layerHtml += "<button type='button' class='content-btn content-btn-type1' onclick=''>확인</button>";
        
        layerWidth = "480px";
    } else if (id == "reservation-time-layer") {
        //비대여시간 설정 레이어
        layerTitle = "비대여시간 설정";
        
        layerHtml += "<div class='layer-content-txt2'>비대여시간을 설정해주세요.</div>";
        layerHtml += "<input type='hidden' name='' id='' class='content-text content-time-text'>";
        layerHtml += "<ul class='content-time-list cf'>";
        
        for (var i=0; i<24; i++) {
            layerHtml += "   <li data-time='" + i + "'>" + (i < 10 ? "0" : "") + i + ":00</li>";
        }
        
        layerHtml += "</ul>";
        layerHtml += "<button type='button' class='content-btn content-btn-type1' onclick=''>확인</button>";
        
        layerWidth = "480px";
    } else if (id == "code-insert-layer") {
        //코드 추가 레이어
        layerTitle = "코드 추가";
        
        layerHtml += "<div class='layer-inline-area'>";
        layerHtml += "   <div class='layer-inline-tit'>이름</div>";
        layerHtml += "   <div class='layer-inline-con'><input type='text' name='' id='' class='content-text' placeholder='이름'></div>";
        layerHtml += "</div>";
        layerHtml += "<div class='layer-inline-area'>";
        layerHtml += "   <div class='layer-inline-tit'>코드</div>";
        layerHtml += "   <div class='layer-inline-con'><input type='text' name='' id='' class='content-text' placeholder='코드'></div>";
        layerHtml += "</div>";
        layerHtml += "<button type='button' class='content-btn content-btn-type1' onclick=''>확인</button>";
        
        layerWidth = "480px";
    } else if (id == "code-update-layer") {
        //코드 수정 레이어
        layerTitle = "코드 수정";
        
        layerHtml += "<div class='layer-inline-area'>";
        layerHtml += "   <div class='layer-inline-tit'>이름</div>";
        layerHtml += "   <div class='layer-inline-con'><input type='text' name='' id='' class='content-text' value='코드명1' placeholder='이름'></div>";
        layerHtml += "</div>";
        layerHtml += "<div class='layer-inline-area'>";
        layerHtml += "   <div class='layer-inline-tit'>코드</div>";
        layerHtml += "   <div class='layer-inline-con'><input type='text' name='' id='' class='content-text' value='code1' placeholder='코드'></div>";
        layerHtml += "</div>";
        layerHtml += "<button type='button' class='content-btn content-btn-type1' onclick=''>확인</button>";
        
        layerWidth = "480px";
    } else if (id == "code2-insert-layer") {
        //코드2 추가 레이어
        layerTitle = "코드 추가";
        
        layerHtml += "<div class='layer-inline-area'>";
        layerHtml += "   <div class='layer-inline-tit'>코드명</div>";
        layerHtml += "   <div class='layer-inline-con'><input type='text' name='' id='' class='content-text' placeholder='코드명'></div>";
        layerHtml += "</div>";
        layerHtml += "<div class='layer-inline-area'>";
        layerHtml += "   <div class='layer-inline-tit'>코드</div>";
        layerHtml += "   <div class='layer-inline-con'><input type='text' name='' id='' class='content-text' placeholder='코드'></div>";
        layerHtml += "</div>";
        layerHtml += "<button type='button' class='content-btn content-btn-type1' onclick=''>확인</button>";
        
        layerWidth = "480px";
    } else if (id == "code2-update-layer") {
        //코드2 수정 레이어
        layerTitle = "코드 수정";
        
        layerHtml += "<div class='layer-inline-area'>";
        layerHtml += "   <div class='layer-inline-tit'>코드명</div>";
        layerHtml += "   <div class='layer-inline-con'><input type='text' name='' id='' class='content-text' value='코드명1' placeholder='코드명'></div>";
        layerHtml += "</div>";
        layerHtml += "<div class='layer-inline-area'>";
        layerHtml += "   <div class='layer-inline-tit'>코드</div>";
        layerHtml += "   <div class='layer-inline-con'><input type='text' name='' id='' class='content-text' value='code1' placeholder='코드'></div>";
        layerHtml += "</div>";
        layerHtml += "<button type='button' class='content-btn content-btn-type1' onclick=''>확인</button>";
        
        layerWidth = "480px";
    } else if (id == "code2-detail-layer") {
        //코드2 상세 레이어
        layerTitle = "코드 상세";
        
        /*layerHtml += "<div class='layer-inline-area'>";
        layerHtml += "   <div class='layer-inline-tit'>항목1</div>";
        layerHtml += "   <div class='layer-inline-con'><input type='text' name='' id='' class='content-text' placeholder='항목1'></div>";
        layerHtml += "</div>";
        layerHtml += "<div class='layer-inline-area'>";
        layerHtml += "   <div class='layer-inline-tit'>항목2</div>";
        layerHtml += "   <div class='layer-inline-con'><input type='text' name='' id='' class='content-text' placeholder='항목2'></div>";
        layerHtml += "</div>";
        layerHtml += "<div class='layer-inline-area'>";
        layerHtml += "   <div class='layer-inline-tit'>항목3</div>";
        layerHtml += "   <div class='layer-inline-con'><input type='text' name='' id='' class='content-text' placeholder='항목3'></div>";
        layerHtml += "</div>";
        layerHtml += "<div class='layer-inline-area'>";
        layerHtml += "   <div class='layer-inline-tit'>항목4</div>";
        layerHtml += "   <div class='layer-inline-con'><input type='text' name='' id='' class='content-text' placeholder='항목4'></div>";
        layerHtml += "</div>";
        layerHtml += "<button type='button' class='content-btn content-btn-type1' onclick=''>확인</button>";*/
        layerHtml += "<button type='button' class='content-btn content-btn-type1 add-code-btn' onclick='addCodeArea(this);'>추가</button>";
        layerHtml += "<div class='content-table-area code-table-area'>";
        layerHtml += "	<table class='content-table list-table'>";
        layerHtml += "		<colgroup>";
        layerHtml += "			<col width='85px'>";
        layerHtml += "			<col width='*'>";
        layerHtml += "			<col width='85px'>";
        layerHtml += "		</colgroup>";
        layerHtml += "		<thead>";
        layerHtml += "			<tr>";
        layerHtml += "				<th>번호</th>";
        layerHtml += "				<th>일련번호</th>";
        layerHtml += "				<th>삭제</th>";
        layerHtml += "			</tr>";
        layerHtml += "		</thead>";
        layerHtml += "		<tbody></tbody>";
        layerHtml += "	</table>";
        layerHtml += "</div>";
        layerHtml += "<div class='content-btn-area'>";
        layerHtml += "	 <button type='button' class='content-btn content-btn-type1 half-btn' onclick=''>확인</button>";
        layerHtml += "	 <button type='button' class='content-btn content-btn-type2 half-btn' onclick=''>취소</button>";
        layerHtml += "</div>";
        
        layerWidth = "480px";
    } else if (id == "partnership-order-layer") {
        //파트너쉽 순서 설정 레이어
        layerTitle = "순서 설정";
        
        /*layerHtml += "<ul class='content-sortable'>";
        layerHtml += "   <li class='ui-state-default'><span class='ui-icon ui-icon-arrowthick-2-n-s'></span>Item 1</li>";
        layerHtml += "   <li class='ui-state-default'><span class='ui-icon ui-icon-arrowthick-2-n-s'></span>Item 2</li>";
        layerHtml += "   <li class='ui-state-default'><span class='ui-icon ui-icon-arrowthick-2-n-s'></span>Item 3</li>";
        layerHtml += "   <li class='ui-state-default'><span class='ui-icon ui-icon-arrowthick-2-n-s'></span>Item 4</li>";
        layerHtml += "   <li class='ui-state-default'><span class='ui-icon ui-icon-arrowthick-2-n-s'></span>Item 5</li>";
        layerHtml += "   <li class='ui-state-default'><span class='ui-icon ui-icon-arrowthick-2-n-s'></span>Item 6</li>";
        layerHtml += "</ul>";*/
        layerHtml += "<div class='layer-content-txt2'>드래그해서 순서를 변경해주세요.</div>";
        layerHtml += "<div class='content-sortable-area partnership-order-area'>";
        layerHtml += "   <ul class='content-sortable-tit'>";
        layerHtml += "      <li>";
        layerHtml += "          <div class='sortable-item si00'>순서</div>";
        layerHtml += "          <div class='sortable-item si01'>기업명</div>";
        layerHtml += "      </li>";
        layerHtml += "   </ul>";
        layerHtml += "   <ul class='content-sortable'>";
        layerHtml += "      <li>";
        layerHtml += "          <div class='sortable-item sortable-num si00'>1</div>";
        layerHtml += "          <div class='sortable-item si01'>기업명1</div>";
        layerHtml += "      </li>";
        layerHtml += "      <li>";
        layerHtml += "          <div class='sortable-item sortable-num si00'>2</div>";
        layerHtml += "          <div class='sortable-item si01'>기업명2</div>";
        layerHtml += "      </li>";
        layerHtml += "      <li>";
        layerHtml += "          <div class='sortable-item sortable-num si00'>3</div>";
        layerHtml += "          <div class='sortable-item si01'>기업명3</div>";
        layerHtml += "      </li>";
        layerHtml += "      <li>";
        layerHtml += "          <div class='sortable-item sortable-num si00'>4</div>";
        layerHtml += "          <div class='sortable-item si01'>기업명4</div>";
        layerHtml += "      </li>";
        layerHtml += "      <li>";
        layerHtml += "          <div class='sortable-item sortable-num si00'>5</div>";
        layerHtml += "          <div class='sortable-item si01'>기업명5</div>";
        layerHtml += "      </li>";
        layerHtml += "   </ul>";
        layerHtml += "</div>";
        layerHtml += "<div class='content-btn-area'>";
        layerHtml += "	 <button type='button' class='content-btn content-btn-type1 half-btn' onclick=''>확인</button>";
        layerHtml += "	 <button type='button' class='content-btn content-btn-type2 half-btn' onclick=''>취소</button>";
        layerHtml += "</div>";
        
        layerWidth = "480px";
    } else if (id == "ip-insert-layer") {
        //IP 추가 레이어
        layerTitle = "IP 추가";
        
        layerHtml += "<div class='layer-inline-area'>";
        layerHtml += "   <div class='layer-inline-tit'>IP주소</div>";
        layerHtml += "   <div class='layer-inline-con'><input type='text' name='' id='' class='content-text' placeholder='IP주소'></div>";
        layerHtml += "</div>";
        layerHtml += "<button type='button' class='content-btn content-btn-type1' onclick=''>확인</button>";
        
        layerWidth = "480px";
    } else if (id == "ip-update-layer") {
        //IP 수정 레이어
        layerTitle = "IP 수정";
        
        layerHtml += "<div class='layer-inline-area'>";
        layerHtml += "   <div class='layer-inline-tit'>IP주소</div>";
        layerHtml += "   <div class='layer-inline-con'><input type='text' name='' id='' class='content-text' value='111.111.111.111' placeholder='IP주소'></div>";
        layerHtml += "</div>";
        layerHtml += "<button type='button' class='content-btn content-btn-type1' onclick=''>확인</button>";
        
        layerWidth = "480px";
    }
    
    $("#default-layer .layer-box .layer-title .layer-title-txt").html(layerTitle);
    $("#default-layer .layer-box .layer-content").html(layerHtml);
    $("#default-layer .layer-box").css("max-width",layerWidth);
    
    //레이어 팝업 내용 변경
    if ($("#default-layer .layer-box .layer-content .layer-content-area").length > 0) {
        var layerContentId = $("#default-layer .layer-box .layer-content .layer-content-area .layer-content-item:first-child").attr("id");

        setLayerContent(layerContentId);
    }
    
    if (id == "reservation-close-layer") {
        var dataStartClosed = $(obj).attr("data-start-closed");
        var dataEndClosed = $(obj).attr("data-end-closed");
        
        if (dataStartClosed != undefined && dataStartClosed != "") {
            var dataStartClosedArr = dataStartClosed.split("-");
            
            if (dataStartClosedArr.length == 3) {
                $("#startClosed").datepicker({format:"yyyy-mm-dd"}).datepicker("setDate",new Date(dataStartClosedArr[0],dataStartClosedArr[1] - 1,dataStartClosedArr[2]));
            }
        }
        
        if (dataEndClosed != undefined && dataEndClosed != "") {
            var dataEndClosedArr = dataEndClosed.split("-");
            
            if (dataEndClosedArr.length == 3) {
                $("#endClosed").datepicker({format:"yyyy-mm-dd"}).datepicker("setDate",new Date(dataEndClosedArr[0],dataEndClosedArr[1] - 1,dataEndClosedArr[2]));
            }
        }
    } else if (id == "reservation-time-layer") {
        var dataTimeClosed = $(obj).attr("data-time-closed");
        
        $(".content-time-list").prev(".content-time-text").val(dataTimeClosed);
        
        if ($(".content-time-list").prev(".content-time-text").val() != "") {
            var selectedTimeArr = $(".content-time-list").prev(".content-time-text").val().split(",");

            $(".content-time-list>li").each(function() {
                if (selectedTimeArr.indexOf(String($(this).attr("data-time"))) > -1) {
                    $(this).addClass("on");
                }
            });
        }
    }
    
    $("#default-layer").addClass("on");
    
    var scrollTop = parseInt($(document).scrollTop());

    $("body").css("top", -scrollTop + "px");

    $("body").addClass("scroll-disable").on('scroll touchmove', function(event) {
        event.preventDefault();
    });
    
    //datepicker 설정
    $(".content-date-text").each(function() {
        $(this).datepicker();
    });
    
    //예약시간 설정
    $(".content-time-list>li").click(function() {
        if (!$(this).hasClass("disabled")) {
            if ($(this).hasClass("on")) {
                $(this).removeClass("on");
            } else {
                var selectedCnt = $(".content-time-list>li.on").length;
                
                $(this).addClass("on");
            }
            
            var selectedTimeVal = "";
            
            $(".content-time-list>li.on").each(function() {
                if (selectedTimeVal == "") {
                    selectedTimeVal = String($(this).attr("data-time"));
                } else {
                    selectedTimeVal = selectedTimeVal + "," + String($(this).attr("data-time"));
                }
            });
            
            $(this).parent(".content-time-list").prev(".content-time-text").val(selectedTimeVal);
        }
    });
    
    //sortable 설정
    $(".content-sortable").each(function() {
        $(this).sortable({
            update: function() {
                $(this).children("li").each(function(index) {
                    //드래그시 순서 넘버링도 변경됨
                    if ($(this).children(".sortable-num").length > 0) {
                        $(this).children(".sortable-num").text(index + 1);
                    }
                });
            },
            over: function() {
                console.log("over / " + $(this).find(".ui-sortable-helper").css("height") + " / " + $(this).find(".ui-sortable-placeholder").css("height"));
                var siHeight = $(this).find(".ui-sortable-helper").css("height");
                
                if (siHeight != undefined) {
                    $(this).find(".ui-sortable-placeholder").css("height",siHeight+"px");
                }
            },
            sort: function() {
                console.log("sort / " + $(this).find(".ui-sortable-helper").css("height") + " / " + $(this).find(".ui-sortable-placeholder").css("height"));
                var siHeight = $(this).find(".ui-sortable-helper").css("height");
                
                if (siHeight != undefined) {
                    $(this).find(".ui-sortable-placeholder").css("height",siHeight+"px");
                }
            }
        });
    });
}
//7차 수정부분 END

//레이어 팝업 내용 변경
function setLayerContent(id) {
    $("#default-layer .layer-box .layer-content .layer-content-area .layer-content-item").css("display","none");
    $("#default-layer .layer-box .layer-content .layer-content-area .layer-content-item#" + id).css("display","block");
}
//5차 수정부분 END

//레이어 팝업 열기
function openLayer(type, msg, fun) {
    $("#" + type + "-layer .layer-box .layer-content .layer-content-txt").html(msg);
    
    $("#" + type + "-layer .layer-box .layer-btn-area .confirm-btn").removeAttr("onclick");
    $("#" + type + "-layer .layer-box .layer-btn-area .confirm-btn").attr("onclick","closeLayer(this);" + fun);
    
    $("#" + type + "-layer").addClass("on");
    
    var scrollTop = parseInt($(document).scrollTop());

    $("body").css("top", -scrollTop + "px");

    $("body").addClass("scroll-disable").on('scroll touchmove', function(event) {
        event.preventDefault();
    });
}

//레이어 팝업 닫기
function closeLayer(obj) {
    $(obj).closest(".layer-wrap").removeClass("on");
    
    if ($(".layer-wrap.on").length == 0) {
        $("body").removeClass("scroll-disable").off('scroll touchmove');

        var scrollTop = Math.abs(parseInt($("body").css("top")));

        $("html,body").animate({scrollTop: scrollTop}, 0);
    }
}

//쿠키값 설정하기
function setCookie(cookieName, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var cookieValue = escape(value) + ((exdays==null) ? "" : "; expires=" + exdate.toGMTString());
    document.cookie = cookieName + "=" + cookieValue;
}

//쿠키값 삭제하기
function deleteCookie(cookieName) {
    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() - 1);
    document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString();
}

//쿠키값 가져오기
function getCookie(cookie_name) {
    var x, y;
    var val = document.cookie.split(';');
    
    for (var i = 0; i < val.length; i++) {
        x = val[i].substr(0, val[i].indexOf('='));
        y = val[i].substr(val[i].indexOf('=') + 1);
        x = x.replace(/^\s+|\s+$/g, ''); // 앞과 뒤의 공백 제거하기
        
        if (x == cookie_name) {
          return unescape(y); // unescape로 디코딩 후 값 리턴
        }
    }
}

//파라미터 가져오기
function getURLParams(url) {
    var result = {};
    
    url.replace(/[?&]{1}([^=&#]+)=([^&#]*)/g, function(s, k, v) { 
        result[k] = decodeURIComponent(v); 
    });
    
    return result;
}

//해당 파라미터의 값 가져오기
function getURLParamValue(url, key) {
    var result = "";
    var paramArr = getURLParams(url);
    
    for (var i in paramArr) {
        if (i == key) {
            result = paramArr[i];
        }
    }
    
    return result;
}

