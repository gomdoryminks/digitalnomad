//게시판 댓글 개수 (게시판 댓글에 data-idx 값이 없을 경우 사용함)
var commentCnt = 0;

//8차 수정부분 START
//파일 url 가져오기
var globalFileUrl = decodeURI(window.location.href);

//리스트 스크롤 페이징관련 변수
var scrollPageCnt = 0;
var scrollPageNum = 1;
var scrollPageSize = 6;
var scrollPageTop = 0;
//8차 수정부분 END

$(function() {
    var userAgent = navigator.userAgent.toLowerCase();
    
    //ios(아이폰, 아이패드, 아이팟) 전용 css 적용
    if (userAgent.indexOf("iphone") > -1 || userAgent.indexOf("ipad") > -1 || userAgent.indexOf("ipod") > -1) {
        var cssIosLink = document.createElement("link");
        
        cssIosLink.href = "../css/member-main-ios.css";
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
            $(".mobile-area .mobile-header-logo img").attr("src","../img/logo-wh.png");
        }
        
        $("footer.footer .footer-logo img").attr("src","../img/footer_logo_wh.png");
    }
    
	//slick 슬라이드 (list)
    if ($(".list-slick").length > 0) {
        var listRows = $(".list-slick").attr("data-rows");
        
        if (listRows == undefined) listRows = 3;
        
        var listSlick = $(".list-slick").slick({
            infinite: false,
            slidesPerRow: 3,
            rows: listRows,
            arrows: false,
            dots: true,
            fade: false,
            responsive: [
                {
                    breakpoint: 701,
                    settings: {
                        slidesPerRow: 2
                    }
                },
                {
                    breakpoint: 501,
                    settings: {
                        slidesPerRow: 1
                    }
                }
            ]
        });
    }
    
    //slick 슬라이드 (list interest)
    if ($(".list-interest-slick").length > 0) {
        var listInterestSlick = $(".list-interest-slick").slick({
            infinite: false,
            slidesToShow: 3,
            slidesToScroll: 1,
            arrows: true,
            dots: false,
            fade: false,
            prevArrow: '<div class="list-slick-prev-btn"><img src="../img/btn_left.png" alt="이전"></div>',
            nextArrow: '<div class="list-slick-next-btn"><img src="../img/btn_right.png" alt="다음"></div>',
            responsive: [
                {
                    breakpoint: 701,
                    settings: {
                        slidesToShow: 2
                    }
                },
                {
                    breakpoint: 501,
                    settings: {
                        slidesToShow: 1
                    }
                }
            ]
        });
    }
    
    //상세 신청관련 내용 변경
    if ($(".application-area").length > 0) {
        var applicationId = $(".application-area .application-item:first-child").attr("id");
        
        setApplication(applicationId);
    }
    
    //2차 수정부분 START
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
    //2차 수정부분 END
    
    //마이페이지 예약일자 disabled 초기값
    if ($(".content-mypage .mypage-con .mypage-main #disabledTime").length > 0) {
        var disabledTime = $("#disabledTime").val();

        if (disabledTime != undefined) {
            var disabledTimeArr = disabledTime.split(",");

            $(".content-time-list>li").each(function() {
                $(this).removeClass("on disabled");

                if (disabledTimeArr.indexOf(String($(this).attr("data-time"))) > -1) {
                    $(this).addClass("disabled");
                }
            });
        }
    }
    
    //예약일자 설정
    $(".content-calendar").each(function() {
        $(this).datepicker({
            changeYear: false,
            changeMonth: false,
            //minDate: new Date(),
            onSelect: function(dateText) {
                $(this).prev(".content-calendar-text").val($.datepicker.formatDate("yy-mm-dd",$(this).datepicker("getDate")));
                $(".reservation-time-area").css("display","table-row");
                
                var disabledTime = $("#disabledTime").val();
                
                if (disabledTime != undefined) {
                    var disabledTimeArr = disabledTime.split(",");
                    
                    $(".content-time-list>li").each(function() {
                        $(this).removeClass("on disabled");
                        
                        if (disabledTimeArr.indexOf(String($(this).attr("data-time"))) > -1) {
                            $(this).addClass("disabled");
                        }
                    });
                }
                
                $(".content-time-list").prev(".content-time-text").val("");
                /*$("#rentalTime").html("<option value=''>대여시간선택</option>");
                $("#rentalTime option").eq(0).prop("selected",true);*/
            }
        });
    });
    
    //예약시간 설정
    $(".content-time-list>li").click(function() {
        if (!$(this).hasClass("disabled")) {
            if ($(this).hasClass("on")) {
                $(this).removeClass("on");
            } else {
                var selectedCnt = $(".content-time-list>li.on").length;
                var maxCnt = 6;
                
                if (selectedCnt < maxCnt) {
                    $(this).addClass("on");
                } else {
                    openLayer("alert","최대 " + maxCnt + "개까지 선택할 수 있습니다.","");
                    return false
                }
            }
            
            var selectedTimeVal = "";
            
            $(".content-time-list>li.on").each(function() {
                if (selectedTimeVal == "") {
                    //selectedTimeVal = $(this).text().replace(/\s/gi, "");
                    selectedTimeVal = String($(this).attr("data-time"));
                } else {
                    //selectedTimeVal = selectedTimeVal + "," + $(this).text().replace(/\s/gi, "");
                    selectedTimeVal = selectedTimeVal + "," + String($(this).attr("data-time"));
                }
            });
            
            $(this).parent(".content-time-list").prev(".content-time-text").val(selectedTimeVal);
            
            /*$(".content-time-list>li").removeClass("on");
            $(this).addClass("on");
            $(this).parent(".content-time-list").prev(".content-time-text").val($(this).text());
            
            var selectedTime = parseInt($(this).attr("data-time"));
            var disabledTime = $("#disabledTime").val();
            var disabledGap = 6;
            var rentalTimeHtml = "";
            
            //마지막 시간과의 갭 구하기
            if ((24 - selectedTime) < disabledGap) {
                disabledGap = 24 - selectedTime;
            }
            
            if (disabledTime != undefined && disabledTime != "") {
                var disabledTimeArr = disabledTime.split(",");
                
                //선택불가 시간과의 갭 구하기
                for (var i in disabledTimeArr) {
                    if (((parseInt(disabledTimeArr[i]) - selectedTime) > 0) && ((parseInt(disabledTimeArr[i]) - selectedTime) < disabledGap)) {
                        disabledGap = parseInt(disabledTimeArr[i]) - selectedTime;
                    }
                }
            }
            
            //대여시간 동적으로 설정
            for (var j=1; j<=disabledGap; j++) {
                rentalTimeHtml += "<option value='" + j + "'>" + j + "시간</option>";
            }
            
            //대여시간에 24시간 옵션이 있으므로 1일 값은 25로 설정
            if (disabledTime == undefined || disabledTime == "") {
                rentalTimeHtml += "<option value='25'>1일</option>";
            }
            
            $("#rentalTime").html(rentalTimeHtml);
            $("#rentalTime option").eq(0).prop("selected",true);*/
        }
    });
    
    //예약일자 초기값
    if ($(".content-calendar").length > 0 && $(".content-calendar").prev(".content-calendar-text").length > 0) {
        if ($(".content-calendar").prev(".content-calendar-text").val() != "") {
            var selectedDateArr = $(".content-calendar").prev(".content-calendar-text").val().split("-");
            
            if (selectedDateArr.length == 3) {
                $(".content-calendar").datepicker({format:"yyyy-mm-dd"}).datepicker("setDate",new Date(selectedDateArr[0],selectedDateArr[1] - 1,selectedDateArr[2]));
            }
        }
    }
    
    //예약시간 초기값
    if ($(".content-time-list").length > 0 && $(".content-time-list").prev(".content-time-text").length > 0) {
        if ($(".content-time-list").prev(".content-time-text").val() != "") {
            var selectedTimeArr = $(".content-time-list").prev(".content-time-text").val().split(",");
            
            $(".content-time-list>li").each(function() {
                //if (selectedTimeArr.indexOf($(this).text().replace(/\s/gi, "")) > -1) {
                if (selectedTimeArr.indexOf(String($(this).attr("data-time"))) > -1) {
                    $(this).addClass("on");
                }
            });
        }
    }
    
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
            spaceBetween: 15,
            autoHeight : true,
            watchOverflow: true,
            breakpoints: {
                901: {
                    spaceBetween: 30
                },
                1101: {
                    spaceBetween: 0
                }
            }
        });
    }
    //4차 수정부분 END
    
    //게시판 댓글 개수 (게시판 댓글에 data-idx 값이 없을 경우 사용함)
    if ($(".content-detail .detail-board-comment .board-comment-list").length > 0) {
        $(".content-detail .detail-board-comment .board-comment-list .comment-list-item").each(function() {
            commentCnt++;
            $(this).attr("data-idx",commentCnt);
        });
    }
    
    //6차 수정부분 START
    //모바일 메뉴 보이기&숨기기
    $(".mobile-area .mobile-header-btn").on("click", function(evt) {
        evt.preventDefault();
        $(this).closest(".mobile-area").addClass("on");
    });
    
    $(".mobile-area .mobile-box .mobile-close-btn").on("click", function(evt) {
        evt.preventDefault();
        $(this).closest(".mobile-area").removeClass("on");
    });
    
    //slick 슬라이드 (main introduce)
    if ($(".main-introduce-slick").length > 0) {
        var mainIntroduceSlick = $(".main-introduce-slick").slick({
            infinite: false,
            slidesToShow: 4,
            slidesToScroll: 1,
            arrows: true,
            dots: false,
            fade: false,
            prevArrow: '<div class="main-slick-prev-btn"><img src="../img/btn_left.png" alt="이전"></div>',
            nextArrow: '<div class="main-slick-next-btn"><img src="../img/btn_right.png" alt="다음"></div>',
            responsive: [
                {
                    breakpoint: 1101,
                    settings: {
                        slidesToShow: 3
                    }
                },
                {
                    breakpoint: 701,
                    settings: {
                        slidesToShow: 2
                    }
                },
                {
                    breakpoint: 501,
                    settings: {
                        slidesToShow: 1
                    }
                }
            ]
        });
    }
    
    //swiper 슬라이드 (main program)
    if ($(".main-program-slide").length > 0) {
        var mainProgramSwiper = new Swiper('.main-program-slide', {
            observer: true,
            observeParents: true,
            slidesPerView: 'auto',
            mousewheelControl: true,
            watchOverflow: true
        });
    }
    //6차 수정부분 END
    
    //7차 수정부분 START
    //swiper 슬라이드 (main project)
    if ($(".main-project-slide").length > 0) {
        var mainProgramSwiper = new Swiper('.main-project-slide', {
            observer: true,
            observeParents: true,
            slidesPerView: 'auto',
            mousewheelControl: true,
            watchOverflow: true,
            breakpoints: {
                1101: {
                    slidesPerView: 2,
                    slidesPerColumn: 2,
                    slidesPerColumnFill: "row",
                    slidesPerGroup: 1,
                    spaceBetween: 30,
                }
            }
        });
    }
    //7차 수정부분 END
    
    //8차 수정부분 START
    //리스트 스크롤 페이징
    if ($(".content-list .list-main .list-list-area .list-scroll-page").length > 0) {
        var paramSpnum = getURLParamValue(globalFileUrl, "spnum");
        var paramSptop = getURLParamValue(globalFileUrl, "sptop");
        scrollPageNum = (paramSpnum != "") ? paramSpnum : scrollPageNum;
        scrollPageTop = (paramSptop != "") ? paramSptop : scrollPageTop;
        
        $(".content-list .list-main .list-list-area .list-scroll-page .list-list-item").css("display","none");

        $(".content-list .list-main .list-list-area .list-scroll-page .list-list-item").each(function(idx) {
            if (idx < (scrollPageNum * scrollPageSize)) {
                $(this).css("display","inline-block");
            }
        });
        
        $("html,body").animate({scrollTop: scrollPageTop}, 0);
    }
    //8차 수정부분 END
    
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

//8차 수정부분 START
$(window).load(function() {
    //스크롤
    $(window).scroll(function() {
        //리스트 스크롤 페이징
        if ($(".content-list .list-main .list-list-area .list-scroll-page").length > 0) {
            scrollPageCnt = $(".content-list .list-main .list-list-area .list-scroll-page .list-list-item").length;
            scrollPageTop = $(this).scrollTop();
            
            var scrollPageHeight = $(this).height();
            var scrollPageContent = parseFloat($(".content").css("padding-top")) + parseFloat($(".content-list .list-top").innerHeight()) + parseFloat($(".content-list .list-main").innerHeight());
            
            if (((scrollPageTop + scrollPageHeight + 1) >= scrollPageContent) && (scrollPageCnt > (scrollPageNum * scrollPageSize))) {
                scrollPageNum++;
                
                $(".content-list .list-main .list-list-area .list-scroll-page .list-list-item").each(function(idx) {
                    if ((idx >= ((scrollPageNum - 1) * scrollPageSize)) && (idx < (scrollPageNum * scrollPageSize))) {
                        $(this).css("display","inline-block");
                    }
                });
            }
            
            var paramNew = "";
            var paramArr = getURLParams(globalFileUrl);
            
            for (var i in paramArr) {
                if (paramArr[i] != "") {
                    if (i != "spnum" && i != "sptop") {
                        if (paramNew != "") {
                            paramNew += "&";
                        } else {
                            paramNew += "?";
                        }
                        
                        paramNew += i + "=" + paramArr[i];
                    }
                }
            }
            
            if (paramNew != "") {
                paramNew += "&";
            } else {
                paramNew += "?";
            }

            paramNew += "spnum=" + scrollPageNum + "&sptop=" + scrollPageTop;
            
            window.history.replaceState({},"",window.location.pathname + paramNew);
        }
    });
});
//8차 수정부분 END

//헤더 마지막 하위메뉴 위치 설정
function setNavLastListPosition() {
    var winWidth = window.innerWidth;
    
    if ($("nav.nav .nav-menu>li .nav-sub-menu").length > 0 && winWidth < 1624) {
        var ctMarginRight = $("nav.nav").closest(".center-ct").css("margin-right");

        $("nav.nav .nav-menu>li:last-child .nav-sub-menu").css("right","-" + ctMarginRight);
    }
}

//상세 신청관련 내용 변경
function setApplication(id) {
    $(".application-area .application-item").css("display","none");
    $(".application-area .application-item#" + id).css("display","block");
}

//관심 체크&체크해제
function setWish(obj) {
    if ($(obj).hasClass("on")) {
        $(obj).removeClass("on");
    } else {
        $(obj).addClass("on");
    }
}

//상세 신청/예약시 내용 확인
function setApplicationConfirm(id, obj) {
    var applicationText = (id == "reservation") ? "예약" : "신청";
    var applicationName = applicationText + "자명";
    var applicationPhone = "010-1234-5678";
    var applicationBirth = "2000-01-01";
    var applicationDate = "2021-10-24";
    var applicationTime = "14,15,20,21";
    
    var confirmMsg = "";
    var confirmTimeMsg = "";
    var confirmFun = "";
    
    if (applicationTime != "") {
        var applicationTimeArr = applicationTime.split(",");
        
        for (var i in applicationTimeArr) {
            confirmTimeMsg += (confirmTimeMsg != "" ? ", " : "") + applicationTimeArr[i] + "시";
        }
    }
    
    confirmMsg += "<div class='layer-content-txt2'>아래 " + applicationText + "정보가 정확한지 확인해주세요.</div>";
    confirmMsg += "<div class='layer-inline-area'>";
    confirmMsg += "    <div class='layer-inline-tit'>" + applicationText + "자명</div>";
    confirmMsg += "    <div class='layer-inline-con content-left'>" + applicationName + "</div>";
    confirmMsg += "</div>";
    confirmMsg += "<div class='layer-inline-area'>";
    confirmMsg += "    <div class='layer-inline-tit'>연락처</div>";
    confirmMsg += "    <div class='layer-inline-con content-left'>" + applicationPhone + "</div>";
    confirmMsg += "</div>";
    confirmMsg += "<div class='layer-inline-area'>";
    confirmMsg += "    <div class='layer-inline-tit'>생년월일</div>";
    confirmMsg += "    <div class='layer-inline-con content-left'>" + applicationBirth + "</div>";
    confirmMsg += "</div>";
    
    if (id == "reservation") {
        confirmMsg += "<div class='layer-inline-area'>";
        confirmMsg += "    <div class='layer-inline-tit'>예약일자</div>";
        confirmMsg += "    <div class='layer-inline-con content-left'>" + applicationDate + "</div>";
        confirmMsg += "</div>";
        confirmMsg += "<div class='layer-inline-area'>";
        confirmMsg += "    <div class='layer-inline-tit'>예약시간</div>";
        confirmMsg += "    <div class='layer-inline-con content-left'>" + confirmTimeMsg + "</div>";
        confirmMsg += "</div>";
    }
    
    openLayer("confirm",confirmMsg,confirmFun);
}

//4차 수정부분 START
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
//사용자 비밀번호 변경 체크&체크해제
function setChangePassword(obj) {
    if ($(obj).prop("checked") !== false) {
        $(".change-password-area").css("display","table-row");
    } else {
        $(".change-password-area").css("display","none");
    }
}

//기본 레이어 팝업 열기
function openDefaultLayer(id,obj) {
    var layerTitle = "";
    var layerHtml = "";
    var layerWidth = "320px";
    
    if (id == "find-id-layer") {
        //아이디찾기 레이어
        layerTitle = "아이디찾기";
        
        //layer-content-area : 레이어 내용
        layerHtml += "<div class='layer-content-area'>";
        //layer-content-item : setLayerContent(id) 함수를 호출하면 해당 id를 가진 태그만 보여줌
        layerHtml += "    <div class='layer-content-item' id='layer-content-1'>";
        layerHtml += "        <div class='layer-content-txt2'>본인 확인이 필요합니다.</div>";
        layerHtml += "        <input type='text' name='' id='' class='content-text' placeholder='이름'>";
        layerHtml += "        <input type='email' name='' id='' class='content-text' placeholder='이메일'>";
        layerHtml += "        <button type='button' class='content-btn content-btn-type1' onclick='setLayerFindId();'>확인</button>";
        layerHtml += "    </div>";
        //layer-content-item : setLayerContent(id) 함수를 호출하면 해당 id를 가진 태그만 보여줌
        layerHtml += "    <div class='layer-content-item' id='layer-content-2'>";
        layerHtml += "    </div>";
        layerHtml += "</div>";
    } else if (id == "find-pw-layer") {
        //비밀번호찾기 레이어
        layerTitle = "비밀번호찾기";
        
        //layer-content-area : 레이어 내용
        layerHtml += "<div class='layer-content-area'>";
        //layer-content-item : setLayerContent(id) 함수를 호출하면 해당 id를 가진 태그만 보여줌
        layerHtml += "    <div class='layer-content-item' id='layer-content-1'>";
        layerHtml += "        <div class='layer-content-txt2'>본인 확인이 필요합니다.</div>";
        layerHtml += "        <input type='text' name='' id='' class='content-text' placeholder='아이디'>";
        layerHtml += "        <input type='text' name='' id='' class='content-text' placeholder='이름'>";
        layerHtml += "        <input type='email' name='' id='' class='content-text' placeholder='이메일'>";
        layerHtml += "        <button type='button' class='content-btn content-btn-type1' onclick='setLayerFindPw();'>확인</button>";
        layerHtml += "    </div>";
        //layer-content-item : setLayerContent(id) 함수를 호출하면 해당 id를 가진 태그만 보여줌
        layerHtml += "    <div class='layer-content-item' id='layer-content-2'>";
        layerHtml += "    </div>";
        layerHtml += "</div>";
    } else if (id == "leave-layer") {
        //회원탈퇴 레이어
        layerTitle = "회원탈퇴";
        
        //layer-content-area : 레이어 내용
        layerHtml += "<div class='layer-content-area'>";
        //layer-content-item : setLayerContent(id) 함수를 호출하면 해당 id를 가진 태그만 보여줌
        layerHtml += "    <div class='layer-content-item' id='layer-content-1'>";
        layerHtml += "        <div class='layer-content-txt2'>회원탈퇴를 진행하시려면 비밀번호를 입력해주세요.</div>";
        layerHtml += "        <input type='password' name='' id='' class='content-text' placeholder='비밀번호'>";
        layerHtml += "        <button type='button' class='content-btn content-btn-type1' onclick='setLayerLeave();'>확인</button>";
        layerHtml += "    </div>";
        //layer-content-item : setLayerContent(id) 함수를 호출하면 해당 id를 가진 태그만 보여줌
        layerHtml += "    <div class='layer-content-item' id='layer-content-2'>";
        layerHtml += "    </div>";
        layerHtml += "</div>";
    } else if (id == "board-update-layer") {
        //게시판 수정 레이어
        layerTitle = "게시판 수정";
        
        //layer-content-area : 레이어 내용
        layerHtml += "<div class='layer-content-area'>";
        //layer-content-item : setLayerContent(id) 함수를 호출하면 해당 id를 가진 태그만 보여줌
        layerHtml += "    <div class='layer-content-item' id='layer-content-1'>";
        layerHtml += "        <div class='layer-content-txt2'>비밀번호를 입력해주세요.</div>";
        layerHtml += "        <input type='password' name='' id='' class='content-text' placeholder='비밀번호'>";
        layerHtml += "        <button type='button' class='content-btn content-btn-type1' onclick='closeLayer(this);location.href=\"works-portfolio-record-update.html\";'>확인</button>";
        layerHtml += "    </div>";
        //layer-content-item : setLayerContent(id) 함수를 호출하면 해당 id를 가진 태그만 보여줌
        layerHtml += "    <div class='layer-content-item' id='layer-content-2'>";
        layerHtml += "    </div>";
        layerHtml += "</div>";
    } else if (id == "board-delete-layer") {
        //게시판 삭제 레이어
        layerTitle = "게시판 삭제";
        
        //layer-content-area : 레이어 내용
        layerHtml += "<div class='layer-content-area'>";
        //layer-content-item : setLayerContent(id) 함수를 호출하면 해당 id를 가진 태그만 보여줌
        layerHtml += "    <div class='layer-content-item' id='layer-content-1'>";
        layerHtml += "        <div class='layer-content-txt2'>비밀번호를 입력해주세요.</div>";
        layerHtml += "        <input type='password' name='' id='' class='content-text' placeholder='비밀번호'>";
        layerHtml += "        <button type='button' class='content-btn content-btn-type1' onclick='closeLayer(this);location.href=\"works-portfolio-record-list.html\";'>확인</button>";
        layerHtml += "    </div>";
        //layer-content-item : setLayerContent(id) 함수를 호출하면 해당 id를 가진 태그만 보여줌
        layerHtml += "    <div class='layer-content-item' id='layer-content-2'>";
        layerHtml += "    </div>";
        layerHtml += "</div>";
    } else if (id == "comment-update-layer") {
        //댓글 수정 레이어
        var dataIdx = $(obj).closest(".comment-list-item").attr("data-idx");
        
        layerTitle = "댓글 수정";
        
        //layer-content-area : 레이어 내용
        layerHtml += "<div class='layer-content-area'>";
        //layer-content-item : setLayerContent(id) 함수를 호출하면 해당 id를 가진 태그만 보여줌
        layerHtml += "    <div class='layer-content-item' id='layer-content-1'>";
        layerHtml += "        <div class='layer-content-txt2'>비밀번호를 입력해주세요.</div>";
        layerHtml += "        <input type='password' name='' id='' class='content-text' placeholder='비밀번호'>";
        layerHtml += "        <button type='button' class='content-btn content-btn-type1' onclick='closeLayer(this);modComment(\"" + dataIdx + "\");'>확인</button>";
        layerHtml += "    </div>";
        //layer-content-item : setLayerContent(id) 함수를 호출하면 해당 id를 가진 태그만 보여줌
        layerHtml += "    <div class='layer-content-item' id='layer-content-2'>";
        layerHtml += "    </div>";
        layerHtml += "</div>";
    } else if (id == "comment-delete-layer") {
        //댓글 삭제 레이어
        var dataIdx = $(obj).closest(".comment-list-item").attr("data-idx");
        
        layerTitle = "댓글 삭제";
        
        //layer-content-area : 레이어 내용
        layerHtml += "<div class='layer-content-area'>";
        //layer-content-item : setLayerContent(id) 함수를 호출하면 해당 id를 가진 태그만 보여줌
        layerHtml += "    <div class='layer-content-item' id='layer-content-1'>";
        layerHtml += "        <div class='layer-content-txt2'>비밀번호를 입력해주세요.</div>";
        layerHtml += "        <input type='password' name='' id='' class='content-text' placeholder='비밀번호'>";
        layerHtml += "        <button type='button' class='content-btn content-btn-type1' onclick='closeLayer(this);delComment(\"" + dataIdx + "\");'>확인</button>";
        layerHtml += "    </div>";
        //layer-content-item : setLayerContent(id) 함수를 호출하면 해당 id를 가진 태그만 보여줌
        layerHtml += "    <div class='layer-content-item' id='layer-content-2'>";
        layerHtml += "    </div>";
        layerHtml += "</div>";
    } else if (id == "agreement-layer") {
        //이용약관 레이어
        layerTitle = "이용약관";
        
        layerHtml += "<div class='agreement-area'>";
        layerHtml += "    <div class='agreement-big'>제1장 총칙 v1.1</div>";
        layerHtml += "    <div class='agreement-medium'>제1조(목적)</div>";
        layerHtml += "    <div class='agreement-small'>";
        layerHtml += "        이 약관은 제주특별자치도(이하 '도'라 합니다) 웹 관련서비스(모바일, 앱포함)를 이용함에 있어 제주특별자치도와 회원 및 비회원, 문화사랑회원 간의 이용조건ㆍ절차 및 권리ㆍ의무ㆍ책임사항 등에 관한 사항을 규정함을 목적으로 합니다";
        layerHtml += "    </div>";
        layerHtml += "    <div class='agreement-medium'>제2조(약관의 효력 및 변경)</div>";
        layerHtml += "    <div class='agreement-small'>";
        layerHtml += "        이 약관 외에 통신망을 통하여 이용자에게 공지되는 내용은 약관의 일부로서 유효하고, 도는 필요하다고 인정되는 경우 이 약간의 내용을 변경 할 수 있으며 변경된 사항은 서비스 화면에 공지사항을 이용하여 공지합니다. 변경된 약관에 동의하지 않는 경우 서비스 이용을 중단하고 회원탈퇴신청을 할 수 있으며, 계속 서비스 이용하는 경우 약관변경에 동의한 것으로 간주하여 전항과 같은 방법으로 효력이 발생합니다.";
        layerHtml += "    </div>";
        layerHtml += "    <div class='agreement-medium'>제3조(준용규정)</div>";
        layerHtml += "    <div class='agreement-small'>";
        layerHtml += "        이 서비스는 전기통신기본법, 전기통신사업법 및 관계법령에 규정하는 사항을 제외하고는 이 약관에 의하여 취급합니다.";
        layerHtml += "    </div>";
        layerHtml += "    <div class='agreement-medium'>제4조(정의)</div>";
        layerHtml += "   <div class='agreement-small'>";
        layerHtml += "        <div>이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</div>";
        layerHtml += "        <span class='agreement-indent'>1. '제주특별자치도' 라함은 도에서 운영하는 인터넷 홈페이지(패밀리사이트 목록은 회원가입 화면에 공지)를 말합니다.</span>";
        layerHtml += "        <span class='agreement-indent'>2. '이용자' 라함은 제주특별자치도에 접속하여 서비스를 받는 회원 및 비회원을 말합니다.</span>";
        layerHtml += "        <span class='agreement-indent'>3. '회원' 이라함은 제주특별자치도에 회원으로 가입 등록하여 회원ID를 부여받은 자로서 회원에 한하여 제공하는 서비스를 이용할 수 있는 자를 말합니다.</span>";
        layerHtml += "        <span class='agreement-indent'>4. '비회원' 이라함은 본인확인계정을 통해 제주특별자치도가 제공하는 서비스를 이용하는 자를 말합니다.</span>";
        layerHtml += "        <span class='agreement-indent'>5. '문화사랑회원' 이라함은 해당 기관 (문화예술진흥원, 제주아트센터, 서귀포 예술의 전당)의 문화예술행사에 한하여 관람료 감면혜택 서비스를 받는 자를 말하며 신규회원 또는 기존회원이 추가로 가입 및 해지가 가능합니다.</span>";
        layerHtml += "        <span class='agreement-indent'>6. '회원ID' 이라함은 회원식별과 회원의 서비스 이용을 위하여 회원자신이 선정하고 도가 승인하는 문자와 숫자의 조합(6자이상)입니다.</span>";
        layerHtml += "        <span class='agreement-indent'>7. '비밀번호' 라함은 회원의 비밀 보호를 위해 회원 자신이 설정한 문자와 숫자, 특수문자의 조합(9자이상)으로 제주특별자치도에 접속권한 인증 여부를 검사하기 위하여 사용하는 문자열을 말합니다.</span>";
        layerHtml += "        <span class='agreement-indent'>8. '회원탈퇴' 라함은 회원이 서비스 이용계약을 종료시키는 의사표시를 말합니다.</span>";
        layerHtml += "    </div>";
        layerHtml += "    <div class='agreement-big'>제2장 서비스 이용계약</div>";
        layerHtml += "    <div class='agreement-medium'>제5조(회원가입신청)</div>";
        layerHtml += "    <div class='agreement-small'>";
        layerHtml += "        회원가입신청은 서비스의 회원가입 화면에서 약관에 동의한다는 의사표시를 하고 이용자가 도에서 요구하는 가입신청 양식에 회원정보를 등록하는 방식으로 신청합니다.";
        layerHtml += "    </div>";
        layerHtml += "    <div class='agreement-medium'>제6조(가입승낙)</div>";
        layerHtml += "    <div class='agreement-small'>";
        layerHtml += "        신청자가 가입신청 내용을 허위, 기재누락, 오기로 게재하였을 경우를 제외하고는 모든 신청자에게 가입승낙을 원칙으로 합니다.";
        layerHtml += "    </div>";
        layerHtml += "    <div class='agreement-medium'>제7조(가입사항의 변경 및 해지)</div>";
        layerHtml += "    <div class='agreement-small'>";
        layerHtml += "        <span class='agreement-indent'>①회원은 서비스의 회원정보 화면을 통해 언제든지 자신의 정보를 열람하고 수정할 수 있습니다. 회원은 이용신청 시 기재한 사항이 변경되었을 때에는 수정을 하여야 하며, 수정하지 아니하여 발생하는 문제의 책임은 회원에게 있습니다.</span>";
        layerHtml += "        <span class='agreement-indent'>②회원이 회원가입을 해지하고자 하실 때에는 회원 본인이 직접 회원정보 화면을 통해 탈퇴 신청을 하여야 합니다.</span>";
        layerHtml += "    </div>";
        layerHtml += "    <div class='agreement-medium'>제7조의 1(회원 자격의 제한 및 자격상실)</div>";
        layerHtml += "    <div class='agreement-small'>";
        layerHtml += "        <span class='agreement-indent'>①이용자가 다음 각 호의 사유에 해당하는 경우 사전 통지 없이 회원자격을 해지하거나, 중지할 수 있습니다.</span>";
        layerHtml += "        <div class='agreement-indent-area'>";
        layerHtml += "            <span class='agreement-indent'>1. 타인의 이용자ID 및 비밀번호를 도용한 경우</span>";
        layerHtml += "            <span class='agreement-indent'>2. 서비스 운영을 고의로 방해한 경우</span>";
        layerHtml += "            <span class='agreement-indent'>3. 허위로 가입 신청을 한 경우</span>";
        layerHtml += "            <span class='agreement-indent'>4. 회원 기본정보가 변경되어 회원과 연락이 불가한 경우</span>";
        layerHtml += "            <span class='agreement-indent'>5. 같은 사용자가 다른 ID로 이중 등록을 한 경우</span>";
        layerHtml += "            <span class='agreement-indent'>6. 공공질서 및 미풍양속에 저해되는 내용을 유포시킨 경우</span>";
        layerHtml += "            <span class='agreement-indent'>7. 타인의 명예를 손상시키거나 불이익을 주는 행위를 한 경우</span>";
        layerHtml += "            <span class='agreement-indent'>8. 컴퓨터 바이러스 유포등 서비스의 운영을 고의로 방해한 경우</span>";
        layerHtml += "            <span class='agreement-indent'>9. 기타 관련법령에 위반된다고 판단되는 경우</span>";
        layerHtml += "        </div>";
        layerHtml += "        <span class='agreement-indent'>②도는 2년을 주기로 회원의 개인정보처리 재동의 절차를 걸치며, 재동의 하지 않은 회원은 자동 탈퇴 처리됩니다. 이후 재가입을 원하시는 경우 신규 회원가입(기존 회원 ID 사용 불가)이 필요합니다.</span>";
        layerHtml += "    </div>";
        layerHtml += "    <div class='agreement-medium'>제8조(서비스 이용)</div>";
        layerHtml += "    <div class='agreement-small'>";
        layerHtml += "        서비스 이용은 정기점검 등 도가 필요로 정한 날, 업무상 또는 기술상 특별한 지장이 없는 한 연중무휴(1일 24시간) 서비스를 하며, 제주특별자치도의 모든 자료는 이용자들이 자유롭게 이용할 수 있습니다. 다만, 실명을 요하는 게시판 글 올리기 등은 회원 및 비회원(본인인증)에 한하여 권한을 줄 수 있습니다.";
        layerHtml += "    </div>";
        layerHtml += "    <div class='agreement-big'>제3장 인터넷이용</div>";
        layerHtml += "    <div class='agreement-medium'>제9조(정보의 제공 및 광고의 게재)</div>";
        layerHtml += "    <div class='agreement-small'>";
        layerHtml += "        <span class='agreement-indent'>①도는 회원이 서비스 이용 중 필요가 있다고 인정되는 다양한 정보 및 광고에 대해서는 전자우편이나 서신우편, 휴대폰 문자메시지, DM 등의 방법으로 다양한 서비스를 제공할 수 있으며, 만약 원치 않는 정보를 수신한 경우 회원은 이를 수신거부 할 수 있습니다.</span>";
        layerHtml += "        <span class='agreement-indent'>②도는 서비스의 운용과 관련하여 서비스화면, 홈페이지, 전자우편 등에 광고 등을 게재할 수 있으며, 도는 서비스를 이용하고자 하는 회원이 이 광고게재에 대하여 동의하는 것으로 간주합니다.</span>";
        layerHtml += "    </div>";
        layerHtml += "    <div class='agreement-medium'>제10조(회원ID 및 비밀번호관리)</div>";
        layerHtml += "    <div class='agreement-small'>";
        layerHtml += "        <span class='agreement-indent'>①회원ID 및 비밀번호의 관리는 회원의 책임으로 합니다.</span>";
        layerHtml += "        <span class='agreement-indent'>②회원의 회원ID 및 비밀번호에 의하여 발생되는 사용상의 과실 또는 제 3자에 의한 부정사용 등에 대한 모든 책임은 회원에게 있습니다.</span>";
        layerHtml += "        <span class='agreement-indent'>③회원 자신의 회원ID가 부정하게 사용된 경우 회원은 반드시 도에 그 사실을 통보해야 합니다.</span>";
        layerHtml += "    </div>";
        layerHtml += "    <div class='agreement-medium'>제11조(문화사랑 회원 서비스 이용)</div>";
        layerHtml += "    <div class='agreement-small'>";
        layerHtml += "        <span class='agreement-indent'>①문화사랑회원은 해당기관의 (문화예술진흥원, 제주아트센터, 서귀포 예술의 전당)의 조례에 따라 운영 됩니다.</span>";
        layerHtml += "        <span class='agreement-indent'>②문화사랑회원은 제주특별자치도 홈페이지 회원에 한해 가입 및 해지가 가능합니다.</span>";
        layerHtml += "        <span class='agreement-indent'>③회원정보수정을 통해 언제든지 선택 가입 및 해지가 가능하나, 제주특별자치도의 홈페이지 회원 탈퇴 시 문화사랑회원도 탈퇴처리 됩니다.</span>";
        layerHtml += "    </div>";
        layerHtml += "    <div class='agreement-medium'>제12조(게시물의 관리)</div>";
        layerHtml += "    <div class='agreement-small'>";
        layerHtml += "        <div>제주특별자치도 이용자는 다음 각호에 해당하는 사항을 게재하여서는 아니되며 게시물 내용이 다음 각호의 1에 해당한다고 판단되는 경우에는 제7조의1(회원 자격의 제한 및 자격상실)에 준하고, 해당 게시물은 통보없이 삭제할 수 있습니다.</div>";
        layerHtml += "        <span class='agreement-indent'>1. 국가안전이나 보안에 위배되는 경우</span>";
        layerHtml += "        <span class='agreement-indent'>2. 선거와 관련한 내용, 정치적 목적이나 성향이 있는 경우</span>";
        layerHtml += "        <span class='agreement-indent'>3. 특정기관, 단체, 부서를 근거없이 비난하는 경우</span>";
        layerHtml += "        <span class='agreement-indent'>4. 특정인을 비방하거나 명예훼손의 우려가 있는 경우</span>";
        layerHtml += "        <span class='agreement-indent'>5. 영리목적의 상업성 광고, 저작권을 침해할 수 있는 내용</span>";
        layerHtml += "        <span class='agreement-indent'>6. 욕설, 음란물 등 불건전한 내용</span> ";
        layerHtml += "        <span class='agreement-indent'>7. 실명을 원칙으로 하는 경우에 실명을 사용하지 않았거나 실명이 아닌 것으로 판단되었을 경우</span>";
        layerHtml += "        <span class='agreement-indent'>8. 동일인 또는 동일인이라고 인정되는 자가 똑같은 내용을 주 2회 이상 게시하거나 비슷한 내용을 1일 2회 이상 게시하는 경우</span>";
        layerHtml += "        <span class='agreement-indent'>9. 연습성, 오류, 장난성의 내용</span>";
        layerHtml += "        <span class='agreement-indent'>10. 기타 관계법령에 위배된다고 판단되는 경우</span>";
        layerHtml += "    </div>";
        layerHtml += "    <div class='agreement-medium'>제13조(도의 의무)</div>";
        layerHtml += "    <div class='agreement-small'>";
        layerHtml += "        <span class='agreement-indent'>① 제주특별자치도 시스템을 계속적 안정적으로 서비스를 제공할 의무가 있습니다.</span>";
        layerHtml += "        <span class='agreement-indent'>② 제주특별자치도 서비스를 위한 설비에 장애가 발생될 때에는 신속한 복구가 가능하도록 조치하여야 합니다</span>";
        layerHtml += "        <span class='agreement-indent'>③ 전화 또는 메일 등을 이용 가입회원에 대한 실명확인을 할 수 있으며, 가입회원의 신상정보를 본인의 승낙없이 제3자에게 누설, 배포하지 않습니다.다만, 전기통신기본법 등 법률의 규정에 의해 국가기관의 요구가 있는 경우, 범죄에 대한 수사상의 목적이 있거나 정보통신윤리위원회의 요청이 있는 경우 또는 기타 관계법령에서 정한 절차에 따른 요청이 있는 경우에는 그러하지 않습니다.</span>";
        layerHtml += "        <span class='agreement-indent'>④ 서비스 내용의 변경 또는 추가사항이 있을 경우에는 온라인으로 공지합니다.</span>";
        layerHtml += "        <span class='agreement-indent'>⑤ 제주특별자치도의 모든 정보가 제10조에 위배되는지의 점검을 위하여 필요한 경우에 일부 회원의 정보를 열람한 후 그 결과를 홈페이지에 게시할 수 있습니다. 제주특별자치도 이용자는 게시물을 정확하고 올바르게 등록해야 하며 게시물 등록에 의해 발생되는 모든 문제에 대하여는 민·형사상의 책임을 져야 합니다.</span>";
        layerHtml += "    </div>";
        layerHtml += "    <div class='agreement-medium'>제14조(이용자의 의무)</div>";
        layerHtml += "    <div class='agreement-small'>";
        layerHtml += "        <span class='agreement-indent'>① 제주특별자치도 이용자는 이 약관에서 규정하는 사항 이외에 서비스 이용안내와 주의사항을 준수하여야 합니다.</span>";
        layerHtml += "        <span class='agreement-indent'>② 회원가입자는 제주특별자치도 이용권한, 기타 가입계약상 지위를 타인에게 양도, 증여 할 수 없으며, 이를 담보로 제공할 수 없습니다.</span>";
        layerHtml += "    </div>";
        layerHtml += "    <div class='agreement-medium'>제15조(개인정보보호정책)</div>";
        layerHtml += "    <div class='agreement-small'>";
        layerHtml += "        <span class='agreement-indent'>① 회원가입 또는 서비스 이용 신청시 회원이 제공하는 정보를 통하여 정보를 수집하며, 개인정보는 본 이용계약의 이행과 본 이용계약상의 서비스제공을 목적으로 이용합니다.</span>";
        layerHtml += "        <span class='agreement-indent'>② 취득한 회원의 정보를 본인의 승낙 없이 제3자에게 누설 또는 배포할 수 없으며 상업적 목적으로 사용할 수 없습니다. 다만, 다음의 각 호의 경우에는 그러하지 아니합니다.</span>";
        layerHtml += "        <div class='agreement-indent-area'>";
        layerHtml += "            <span class='agreement-indent'>1. 관계법령에 의하여 수사상의 목적으로 관계기관으로부터 요구가 있는 경우</span>";
        layerHtml += "            <span class='agreement-indent'>2. 정보통신윤리위원회의 요청이 있는 경우</span>";
        layerHtml += "            <span class='agreement-indent'>3. 기타 관계법령에서 정한 절차에 따른 요청이 있는 경우</span>";
        layerHtml += "        </div>";
        layerHtml += "    </div>";
        layerHtml += "    <div class='agreement-big'>제4장 저작권</div>";
        layerHtml += "    <div class='agreement-medium'>제16조(게재된 자료에 대한 권리)</div>";
        layerHtml += "    <div class='agreement-small'>";
        layerHtml += "        <div>제주특별자치도에 게재된 자료에 대한 권리는 다음 각호의 1과 같습니다.</div>";
        layerHtml += "        <div class='agreement-indent-area'>";
        layerHtml += "            <span class='agreement-indent'>1. 제주특별자치도에 게재된 자료를 상업적 목적으로 이용할 수 없습니다.</span>";
        layerHtml += "            <span class='agreement-indent'>2. 게재한 게시물에 대한 권리와 책임은 게시자에게 있습니다. 다만, 도는 게시자의 동의없이 이를 비영리적으로 이용할 수 있으며, 게시물을 영리적으로 이용할 시는 반드시 게시자의 동의를 사전에 얻어야 합니다.</span>";
        layerHtml += "            <span class='agreement-indent'>3. 도는 회원이 게재한 게시물의 신뢰도나 정확도 그리고 게시자 이외의 이용자가 게시물을 상업적으로 이용하였을 경우 책임을 지지 아니합니다.</span>";
        layerHtml += "            <span class='agreement-indent'>4. 제주특별자치도에 수록된 컨텐츠의 무단 또는 불법 복제ㆍ배포는 저작권법에 의하여 처벌되나, 사전에 도의 동의를 얻은 경우는 그러하지 아니합니다.</span>";
        layerHtml += "        </div>";
        layerHtml += "    </div>";
        layerHtml += "    <div class='agreement-big'>제5장 가입비 및 이용요금</div>";
        layerHtml += "    <div class='agreement-medium'>제17조(가입비 및 이용요금)</div>";
        layerHtml += "    <div class='agreement-small'>";
        layerHtml += "        제주특별자치도의 가입비, 이용요금은 무료입니다.";
        layerHtml += "    </div>";
        layerHtml += "    <div class='agreement-big'>제6장 이의신청 및 손해배상청구 금지</div>";
        layerHtml += "    <div class='agreement-medium'>제18조(이의신청 금지)</div>";
        layerHtml += "    <div class='agreement-small'>";
        layerHtml += "        이용자는 도에서 제공하는 서비스 이용시 발생되는 문제에 대해서 이의신청 및 민원을 제기 할 수 없습니다.";
        layerHtml += "    </div>";
        layerHtml += "    <div class='agreement-medium'>제19조(손해배상 청구금지)</div>";
        layerHtml += "    <div class='agreement-small'>";
        layerHtml += "        이용자는 도에서 제공하는 서비스 이용시 발생되는 문제에 대하여 도에 손해배상청구를 할 수 없으며 도는 이에 대해 책임을 지지 아니합니다.";
        layerHtml += "    </div>";
        layerHtml += "    <div class='agreement-medium'>제19조(면책조항)</div>";
        layerHtml += "    <div class='agreement-small'>";
        layerHtml += "        도는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 대한 책임이 면제됩니다. 또한 회원 및 비회원의 귀책사유로 인한 서비스 이용의 장애와 회원 및 비회원이 게재한 정보, 자료, 신뢰도, 정확성 등의 내용에 관하여는 책임을지지 않습니다.";
        layerHtml += "    </div>";
        layerHtml += "    <div class='agreement-medium'>부칙</div>";
        layerHtml += "    <div class='agreement-small'>";
        layerHtml += "        본 약관은 2018년 12월19일부터 시행합니다.";
        layerHtml += "    </div>";
        layerHtml += "</div>";
        
        layerWidth = "640px";
    } else if (id == "policy-layer") {
        //이용약관 레이어
        layerTitle = "개인정보처리방침";
        
        layerHtml += "<div class='agreement-area'>";
        layerHtml += "    <div class='agreement-small'>";
        layerHtml += "        제주특별자치도 제주시가 취급하는 모든 개인정보는 관련 법령에 근거하거나 정보주체의 동의에 의하여 수집, 보유 및 처리되고 있습니다. [개인정보보호법]은 이러한 개인정보의 취급에 대한 일반적 규범을 제시하고 있으며, 제주특별자치도 제주시는 이러한 법령의 규정에 따라 수집, 보유 및 처리하는 개인정보를 공공업무의 적절한 수행과 국민의 권익을 보호하기 위해 적법하고 적정하게 취급할 것입니다.<br><br>";
        layerHtml += "        또한, 제주특별자치도 제주시는 관련 법령에서 규정한 바에 따라 보유하고 있는 개인정보에 대한 열람청구권 및 정정청구권 등 여러분의 권익을 존중하며, 여러분은 이러한 법령상 권익의 침해 등에 대하여 행정심판법에서 정하는 바에 따라 행정심판을 청구할 수 있습니다.<br><br>";
        layerHtml += "        제주특별자치도 제주시의 개인정보처리 방침은 현행 '개인정보보호법'에 근거를 두고 있으며 별도의 설명이 없는 한 제주특별자치도 제주시에서 운용하는 모든 홈페이지에 적용됨을 알려드립니다. 다만 제주특별자치도 제주시내 조직(부서, 사업소 등)에서 소관업무 수행을 위해 별도의 개인정보처리방침을 제정, 시행하는 경우에는 이에 따르고 해당조직이 운영하는 홈페이지에 게시됨을 알려드립니다.";
        layerHtml += "    </div>";
        layerHtml += "    <div class='agreement-medium'>제1조(개인정보의 처리목적)</div>";
        layerHtml += "    <div class='agreement-small'>";
        layerHtml += "        <span class='agreement-indent'>① 제주특별자치도 제주시는 개인정보를 아래의 목적이외의 용도로는 이용하지 않으며 이용목적이 변경될 경우에는 동의를 받아 처리합니다.</span>";
        layerHtml += "        <div class='agreement-indent-area'>";
        layerHtml += "            <span class='agreement-indent'>1. 홈페이지 회원 가입 및 관리</span>";
        layerHtml += "            <div class='agreement-indent-area'>";
        layerHtml += "                회원제 서비스이용에 따른 본인 확인, 만 14세 미만 아동의 개인정보 처리 시 법정대리인의 동의여부 확인, 게시판 글쓰기, 각종 서비스 안내를 목적으로 개인정보를 처리합니다.";
        layerHtml += "            </div>";
        layerHtml += "            <span class='agreement-indent'>2. 민원사무 처리</span>";
        layerHtml += "            <div class='agreement-indent-area'>";
        layerHtml += "                각종 민원업무 접수ㆍ처리, 법령에 의한 각종 인허가 접수ㆍ처리 등 소관업무 처리를 목적으로 개인정보를 처리합니다.";
        layerHtml += "            </div>";
        layerHtml += "            <span class='agreement-indent'>3. 행정업무의 처리</span>";
        layerHtml += "            <div class='agreement-indent-area'>";
        layerHtml += "                민원사무처리외 행정업무 목적으로 법령 및 조례에 근거한 경우에만 개인정보를 처리합니다.";
        layerHtml += "            </div>";
        layerHtml += "        </div>";
        layerHtml += "    </div>";
        layerHtml += "    <div class='agreement-medium'>제2조(개인정보의 처리 및 보유기간, 개인정보의 항목)</div>";
        layerHtml += "    <div class='agreement-small'>";
        layerHtml += "        <span class='agreement-indent'>① 제주특별자치도 제주시는 소관 법령의 규정과 정보주체의 동의에 의해서만 개인정보를 수집ㆍ보유하며 제주특별자치도가 개인정보보호법 제32조에 따라 등록ㆍ공개하는 개인정보파일은 다음과 같습니다.</span>";
        layerHtml += "        <div class='agreement-indent-area'>";
        layerHtml += "            제주특별자치도가 개인정보보호법 제32조에 따라 등록ㆍ공개하는 개인정보파일<br>";
        layerHtml += "            개인정보 처리업무 위탁에 관한 사항으로 순번, 개인정보파일의 명칭, 보유근거 /보유목적, 개인정보의 항목, 보유기간을 나타냅니다.";
        layerHtml += "            <div class='content-table-area'>";
        layerHtml += "                <table class='content-table list-table'>";
        layerHtml += "                    <colgroup>";
        layerHtml += "                        <col width='40px'>";
        layerHtml += "                        <col width='*'>";
        layerHtml += "                        <col width='*'>";
        layerHtml += "                        <col width='*'>";
        layerHtml += "                        <col width='*'>";
        layerHtml += "                    </colgroup>";
        layerHtml += "                    <thead>";
        layerHtml += "                        <tr>";
        layerHtml += "                            <th>순번</th>";
        layerHtml += "                            <th>개인정보파일의 명칭</th>";
        layerHtml += "                            <th>보유근거/보유목적</th>";
        layerHtml += "                            <th>개인정보의 항목</th>";
        layerHtml += "                            <th>보유기간</th>";
        layerHtml += "                        </tr>";
        layerHtml += "                    </thead>";
        layerHtml += "                    <tbody>";
        layerHtml += "                        <tr>";
        layerHtml += "                            <td>1</td>";
        layerHtml += "                            <td colspan='4'>바로가기</td>";
        layerHtml += "                        </tr>";
        layerHtml += "                    </tbody>";
        layerHtml += "                </table>";
        layerHtml += "            </div>";
        layerHtml += "            <span class='agreement-indent'>※ 좀더 상세한 개인정보파일 등록사항은 개인정보보호 종합지원포털(www.privacy.go.kr) → 민원마당 → 개인정보열람등 요구 → 개인정보파일 목록검색 → 기관명에 “제주시” 입력 후 검색 메뉴를 활용해주시기 바랍니다.</span>";
        layerHtml += "        </div>";
        layerHtml += "    </div>";
        layerHtml += "    <div class='agreement-medium'>제3조(홈페이지 회원제 관련 개인정보 수집 및 이용안내)</div>";
        layerHtml += "    <div class='agreement-small'>";
        layerHtml += "        <span class='agreement-indent'>① 제주특별자치도 제주시 홈페이지는 여러분이 회원에 가입하시거나 게시판을 이용하시고자 할 경우에 필요한 최소한의 개인정보를 수집하며, 이에 대한 동의를 얻고 있습니다. 정보주체는 개인정보 수집 동의를 거부하실 수 있습니다. 다만 이 경우 회원가입이 제한되며 회원제 서비스를 이용할 수 없습니다.</span>";
        layerHtml += "        <div class='agreement-indent-area'>";
        layerHtml += "            <span class='agreement-indent'>1. 수집하는 개인정보 항목</span>";
        layerHtml += "            <div class='agreement-indent-area'>";
        layerHtml += "                <span class='agreement-indent'>가. 필수항목：이름, 아이디, 비밀번호, 이메일, 휴대전화번호, 생년월일, 만14세 미만의 회원일 경우 법정대리인 정보(개인식별번호)</span>";
        layerHtml += "                <span class='agreement-indent'>나. 선택항목：주소, 문화사랑 가입정보, 맞춤형정보 수신 설정</span>";
        layerHtml += "                <span class='agreement-indent'>다. 자동수집항목：서버 접근 기록, 통신사실확인 정보, 중복회원가입 방지를 위한 본인인증센터에서 발급하는 개인별 인증코드 등</span>";
        layerHtml += "            </div>";
        layerHtml += "            <span class='agreement-indent'>2. 개인정보의 수집 및 이용목적</span>";
        layerHtml += "            <div class='agreement-indent-area'>";
        layerHtml += "                제주특별자치도 제주시 홈페이지는 수집한 개인정보를 다음의 목적을 위해 활용합니다.<br>";
        layerHtml += "                <span class='agreement-indent'>가. 회원관리：회원제 서비스 제공에 따른 본인 식별ㆍ인증, 회원자격 유지ㆍ관리, 제한적 본인 확인제 시행에 따른 본인 확인, 만14세 미만 회원의 법정 대리인 동의여부 확인, 회원 서비스 이용중 각종 고지ㆍ통지의 목적</span>";
        layerHtml += "                <span class='agreement-indent'>나. 소관 업무 수행：민원처리, 설문조사, 게시판 글쓰기, 정기간행물 발송, 공공서비스 예약관리, 교육강좌 신청관리, 특정 맞춤정보 서비스 제공 등 서비스 이용에 관한 업무처리</span>";
        layerHtml += "            </div>";
        layerHtml += "            <span class='agreement-indent'>3. 개인정보의 보유 및 이용기간</span>";
        layerHtml += "            <div class='agreement-indent-area'>";
        layerHtml += "                제주특별자치도 제주시 홈페이지의 회원정보 보유기간은 회원가입일로부터 회원 탈퇴 시(2년마다 재동의가 요구됨)까지 이며, 회원 탈퇴 시 보유하고 있는 개인정보는 지체 없이 파기합니다. 다만 다음의 정보에 대해서는 보존합니다.<br>";
        layerHtml += "                <span class='agreement-indent'>가. 보존항목：탈퇴자 아이디</span>";
        layerHtml += "                <span class='agreement-indent'>나. 보존근거：서비스 이용의 혼선 방지</span>";
        layerHtml += "                <span class='agreement-indent'>다. 보존내역：이용자가 작성했던 게시글과 전자민원에 포함된 정보</span>";
        layerHtml += "                <span class='agreement-indent'>라. 보존근거：공공기록물 관리에 관한 법령, 민원사무처리에 관한 법령등</span>";
        layerHtml += "                <span class='agreement-indent'>※ 게시글은 회원탈퇴 전 작성자 본인이 직접 삭제 하셔야 하며, 기타 관계법령의 규정에 의하여 보존할 필요가 있는 경우 관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다.</span>";
        layerHtml += "            </div>";
        layerHtml += "        </div>";
        layerHtml += "    </div>";
        layerHtml += "    <div class='agreement-medium'>제4조(홈페이지 비회원 로그인관련 개인정보 수집 및 이용안내)</div>";
        layerHtml += "    <div class='agreement-small'>";
        layerHtml += "        <span class='agreement-indent'>① 제주특별자치도 제주시 홈페이지는 여러분이 회원에 가입하시지 않더라도 게시판을 이용하시고자 할 경우에 필요한 최소한의 개인정보를 수집하며, 이에 대한 동의를 얻고 있습니다. 정보주체는 개인정보 수집 동의를 거부하실 수 있습니다. 다만 이 경우 비회원 서비스를 이용할 수 없습니다.</span>";
        layerHtml += "        <div class='agreement-indent-area'>";
        layerHtml += "            <span class='agreement-indent'>1. 수집하는 개인정보 항목</span>";
        layerHtml += "            <div class='agreement-indent-area'>";
        layerHtml += "                <span class='agreement-indent'>가. 필수항목：이름, 본인인증키</span>";
        layerHtml += "            </div>";
        layerHtml += "            <span class='agreement-indent'>2. 개인정보의 수집 및 이용목적</span>";
        layerHtml += "            <div class='agreement-indent-area'>";
        layerHtml += "                제주특별자치도 제주시 홈페이지는 수집한 개인정보를 다음의 목적을 위해 활용합니다.<br>";
        layerHtml += "                <span class='agreement-indent'>가. 서비스 이용에 따른 본인 확인, 민원처리, 설문조사, 게시판 글쓰기</span>";
        layerHtml += "            </div>";
        layerHtml += "            <span class='agreement-indent'>3. 개인정보의 보유 및 이용기간</span>";
        layerHtml += "            <div class='agreement-indent-area'>";
        layerHtml += "                제주특별자치도 제주시 홈페이지의 비회원정보 보유기간은 사용자 본인 작성게시물 삭제시까지 이며, 삭제 시 보유하고 있는 개인정보는 지체 없이 파기합니다.";
        layerHtml += "            </div>";
        layerHtml += "        </div>";
        layerHtml += "    </div>";
        layerHtml += "    <div class='agreement-medium'>제5조(개인정보의 제3자 제공에 관한 사항)</div>";
        layerHtml += "    <div class='agreement-small'>";
        layerHtml += "        <span class='agreement-indent'>① 제주특별자치도 제주시는 다음 중 어느 하나에 해당하는 경우에는 정보주체 또는 제3자의 이익을 부당하게 침해할 우려가 있을 때를 제외하고는 개인정보를 목적 외의 용도로 이용하거나 이를 제3자에게 제공할 수 있습니다.</span>";
        layerHtml += "        <div class='agreement-indent-area'>";
        layerHtml += "            <span class='agreement-indent'>1. 정보주체로부터 별도의 동의를 받은 경우</span>";
        layerHtml += "            <span class='agreement-indent'>2. 다른 법률에 특별한 규정이 있는 경우</span>";
        layerHtml += "            <span class='agreement-indent'>3. 정보주체 또는 그 법정대리인이 의사표시를 할 수 없는 상태에 있거나 주소불명 등으로 사전 동의를 받을 수 없는 경우로서 명백히 정보주체 또는 제3자의 급박한 생명, 신체, 재산의 이익을 위하여 필요하다고 인정되는 경우</span>";
        layerHtml += "            <span class='agreement-indent'>4. 통계작성 및 학술연구 등의 목적을 위하여 필요한 경우로서 특정 개인을 알아볼 수 없는 형태로 개인정보를 제공하는 경우</span>";
        layerHtml += "            <span class='agreement-indent'>5. 개인정보를 목적 외의 용도로 이용하거나 이를 제3자에게 제공하지 아니하면 다른 법률에서 정하는 소관 업무를 수행할 수 없는 경우로서 보호위원회의 심의ㆍ의결을 거친 경우</span>";
        layerHtml += "            <span class='agreement-indent'>6. 조약, 그 밖의 국제협정의 이행을 위하여 외국정부 또는 국제기구에 제공하기 위하여 필요한 경우</span>";
        layerHtml += "            <span class='agreement-indent'>7. 범죄의 수사와 공소의 제기 및 유지를 위하여 필요한 경우</span>";
        layerHtml += "            <span class='agreement-indent'>8. 법원의 재판업무 수행을 위하여 필요한 경우</span>";
        layerHtml += "            <span class='agreement-indent'>9. 형(刑) 및 감호, 보호처분의 집행을 위하여 필요한 경우</span>";
        layerHtml += "        </div>";
        layerHtml += "    </div>";
        layerHtml += "    <div class='agreement-medium'>제6조(개인정보 처리업무 위탁에 관한 사항)</div>";
        layerHtml += "    <div class='agreement-small'>";
        layerHtml += "        <span class='agreement-indent'>① 제주특별자치도 제주시는 원칙적으로 정보주체의 동의없이 해당 개인정보의 처리를 타인에게 위탁하지 않습니다. 다만, 제주특별자치도 제주시가 제3자에게 개인정보의 처리업무를 위탁하는 경우에는 '개인정보보호법' 제26조(업무위탁에 따른 개인정보의 처리제한)에 따라 위탁하며 다음 각호의 내용이 포함된 문서에 의하여 위탁업무의 내용과 수탁자를 홈페이지에 게시합니다.</span>";
        layerHtml += "        <div class='agreement-indent-area'>";
        layerHtml += "            <span class='agreement-indent'>1. 위탁업무 수행 목적 외 개인정보의 처리 금지에 관한 사항</span>";
        layerHtml += "            <span class='agreement-indent'>2. 개인정보의 기술적ㆍ관리적 보호조치에 관한 사항</span>";
        layerHtml += "            <span class='agreement-indent'>3. 그 밖에 개인정보의 안전한 관리를 위하여 다음과 대통령령으로 정한 사항</span>";
        layerHtml += "            <div class='agreement-indent-area'>";
        layerHtml += "                <span class='agreement-indent'>가. 위탁업무의 목적 및 범위</span>";
        layerHtml += "                <span class='agreement-indent'>나. 재위탁 제한에 관한 사항</span>";
        layerHtml += "                <span class='agreement-indent'>다. 개인정보에 대한 접근 제한 등 안전성 확보 조치에 관한 사항</span>";
        layerHtml += "                <span class='agreement-indent'>라. 위탁업무와 관련하여 보유하고 있는 개인정보 관리현황 점검 등 감독에 관한 사항</span>";
        layerHtml += "                <span class='agreement-indent'>마. 법 제26조제2항에 따른 수탁자(이하 '수탁자'라 한다)가 준수하여야 할 의무를 위반한 경우의 손해배상 등 책임에 관한 사항</span>";
        layerHtml += "            </div>";
        layerHtml += "        </div>";
        layerHtml += "        <span class='agreement-indent'>② 제주특별자치도 제주시는 원활한 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.</span>";
        layerHtml += "        <div class='agreement-indent-area'>";
        layerHtml += "            개인정보 처리업무 위탁에 관한 사항<br>";
        layerHtml += "            개인정보 처리업무 위탁에 관한 사항으로 순번, 업무명(시스템명), 위탁업체, 위탁기간, 위탁내용을 나타냅니다.";
        layerHtml += "            <div class='content-table-area'>";
        layerHtml += "                <table class='content-table list-table'>";
        layerHtml += "                    <colgroup>";
        layerHtml += "                        <col width='40px'>";
        layerHtml += "                        <col width='*'>";
        layerHtml += "                        <col width='*'>";
        layerHtml += "                        <col width='*'>";
        layerHtml += "                        <col width='*'>";
        layerHtml += "                    </colgroup>";
        layerHtml += "                    <thead>";
        layerHtml += "                        <tr>";
        layerHtml += "                            <th>순번</th>";
        layerHtml += "                            <th>업무명(시스템명)</th>";
        layerHtml += "                            <th>위탁업체</th>";
        layerHtml += "                            <th>위탁기간</th>";
        layerHtml += "                            <th>위탁내용</th>";
        layerHtml += "                        </tr>";
        layerHtml += "                    </thead>";
        layerHtml += "                    <tbody>";
        layerHtml += "                        <tr>";
        layerHtml += "                            <td>1</td>";
        layerHtml += "                            <td colspan='4'>붙임 참조</td>";
        layerHtml += "                        </tr>";
        layerHtml += "                    </tbody>";
        layerHtml += "                </table>";
        layerHtml += "            </div>";
        layerHtml += "            <span class='agreement-indent'>※ 제주시 개인정보 처리업무 위탁 현황 열람</span>";
        layerHtml += "        </div>";
        layerHtml += "    </div>";
        layerHtml += "    <div class='agreement-medium'>제7조(정보주체의 권리ㆍ의무 및 행사방법)</div>";
        layerHtml += "    <div class='agreement-small'>";
        layerHtml += "        <span class='agreement-indent'>① 정보주체는 다음과 같은 권리를 행사할 수 있으며, 만 14세 미만 아동의 법정대리인은 그 아동의 개인정보에 대한 열람, 정정ㆍ삭제, 처리정지 요구를 할 수 있습니다.</span>";
        layerHtml += "        <span class='agreement-indent'>② 개인정보 열람요구</span>";
        layerHtml += "        <div class='agreement-indent-area'>";
        layerHtml += "            제주특별자치도 제주시에서 보유하고 있는 개인정보파일은 「개인정보보호법」 제35조(개인정보의 열람)에 따라 열람을 요구할 수 있습니다. 다만 개인정보 열람 요구는 「개인정보보호법」 제35조제5항에 의하여 다음과 같이 제한될 수 있습니다.<br>";
        layerHtml += "            <span class='agreement-indent'>1. 법률에 따라 열람이 금지되거나 제한되는 경우</span>";
        layerHtml += "            <span class='agreement-indent'>2. 다른 사람의 생명ㆍ신체를 해할 우려가 있거나 다른 사람의 재산과 그 밖의 이익을 부당하게 침해할 우려가 있는 경우</span>";
        layerHtml += "            <span class='agreement-indent'>3. 공공기관이 다음 각 목의 어느 하나에 해당하는 업무를 수행할 때 중대한 지장을 초래하는 경우 조세의 부과·징수 또는 환급에 관한 업무</span>";
        layerHtml += "            <div class='agreement-indent-area'>";
        layerHtml += "                <span class='agreement-indent'>가. 조세의 부과ㆍ징수 또는 환급에 관한 업무</span>";
        layerHtml += "                <span class='agreement-indent'>나. 「초ㆍ중등교육법」 및 「고등교육법」에 따른 각급 학교, 「평생교육법」에 따른 평생교육시설, 그 밖의 다른 법률에 따라 설치 된 고등교육기관에서의 성적 평가 또는 입학자 선발에 관한 업무</span>";
        layerHtml += "                <span class='agreement-indent'>다. 학력ㆍ기능 및 채용에 관한 시험, 자격 심사에 관한 업무</span>";
        layerHtml += "                <span class='agreement-indent'>라. 보상금ㆍ급부금 산정 등에 대하여 진행 중인 평가 또는 판단에 관한 업무</span>";
        layerHtml += "                <span class='agreement-indent'>마. 다른 법률에 따라 진행 중인 감사 및 조사에 관한 업무</span>";
        layerHtml += "            </div>";
        layerHtml += "        </div>";
        layerHtml += "        <span class='agreement-indent'>③ 개인정보 정정ㆍ삭제 요구</span>";
        layerHtml += "        <div class='agreement-indent-area'>";
        layerHtml += "            제주특별자치도 제주시에서 보유하고 있는 개인정보파일에 대해서는 「개인정보보호법」 제36조(개인정보의 정정ㆍ삭제)에 따라 제주특별자치도 제주시에 개인정보의 정정·삭제를 요구할 수 있습니다. 다만, 다른 법령에서 그 개인정보가 수집 대상으로 명시되어 있는 경우에는 그 삭제를 요구할 수 없습니다.";
        layerHtml += "        </div>";
        layerHtml += "        <span class='agreement-indent'>④ 개인정보 처리정지 요구</span>";
        layerHtml += "        <div class='agreement-indent-area'>";
        layerHtml += "            제주특별자치도 제주시에서 보유하고 있는 개인정보파일에 대해서는 「개인정보보호법」 제37조(개인정보의 처리정지 등)에 따라 제주특별자치도 제주시에 개인정보의 처리정지를 요구할 수 있습니다. 다만, 개인정보 처리정지 요구 시 「개인정보보호법」 제37조제2항에 의하여 처리정지 요구가 거절될 수 있습니다.<br>";
        layerHtml += "            <span class='agreement-indent'>1. 법률에 특별한 규정이 있거나 법령상 의무를 준수하기 위하여 불가피한 경우</span>";
        layerHtml += "            <span class='agreement-indent'>2. 다른 사람의 생명ㆍ신체를 해할 우려가 있거나 다른 사람의 재산과 그 밖의 이익을 부당하게 침해할 우려가 있는 경우</span>";
        layerHtml += "            <span class='agreement-indent'>3. 공공기관이 개인정보를 처리하지 아니하면 다른 법률에서 정하는 소관 업무를 수행할 수 없는 경우</span>";
        layerHtml += "            <span class='agreement-indent'>4. 개인정보를 처리하지 아니하면 정보주체와 약정한 서비스를 제공하지 못하는 등 계약의 이행이 곤란한 경우로서 정보주체가 그 계약의 해지 의사를 명확하게 밝히지 아니한 경우</span>";
        layerHtml += "        </div>";
        layerHtml += "        <span class='agreement-indent'>⑤ 개인정보의 열람, 정정ㆍ삭제, 처리정지 요구에 대해서는 10일 이내에 해당 사항에 대한 제주특별자치도 제주시의 조치를 통지합니다.</span>";
        layerHtml += "        <span class='agreement-indent'>⑥ 정보주체 권리에 다른 열람의 요구, 정정ㆍ삭제의 요구, 처리정지의 요구 시 열람 등 요구를 한자가 본인이거나 정당한 대리인인지를 확인합니다.</span>";
        layerHtml += "        <span class='agreement-indent'>⑦ 개인정보 열람, 정정ㆍ삭제, 처리정지 처리절차</span>";
        layerHtml += "        <div class='agreement-indent-area'>";
        layerHtml += "            <span class='agreement-indent'>1. 개인정보보호 종합지원 포털사이트(www.privacy.go.kr)를 통해서도 개인정보 열람청구를 하실 수 있습니다.</span>";
        layerHtml += "            <span class='agreement-indent'>※ 개인정보보호 종합지원포털 (www.privacy.go.kr) → 민원마당 → 개인정보의 열람 등 요구</span>";
        layerHtml += "            <span class='agreement-indent'>2. 개인정보파일을 보관하고 있는 해당 부서(개인정보파일현황 참고)에 서면, 전자우편, FAX 등을 통해 신청할 수 있으며, 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통해서도 하실 수 있습니다. 이 경우 위임장을 제출하셔야 합니다.</span>";
        layerHtml += "            <span class='agreement-indent'>※ 개인정보 열람 요구서 및 위임장 서식 다운받기</span>";
        layerHtml += "        </div>";
        layerHtml += "    </div>";
        layerHtml += "    <div class='agreement-medium'>제8조(개인정보의 파기)</div>";
        layerHtml += "    <div class='agreement-small'>";
        layerHtml += "        <span class='agreement-indent'>① 제주특별자치도 제주시는 원칙적으로 개인정보의 보유기간이 경과했거나 처리목적이 달성된 경우에는 지체없이 해당 개인정보를 파기합니다. 다만, 다른 법률에 따라 보존하여야 하는 경우에는 그러하지 않으며, 파기의 절차, 기한 및 방법은 다음과 같습니다.</span>";
        layerHtml += "        <div class='agreement-indent-area'>";
        layerHtml += "            <span class='agreement-indent'>1. 파기절차</span>";
        layerHtml += "            <div class='agreement-indent-area'>";
        layerHtml += "                보유기간이 경과했거나 처리목적이 달성된 개인정보는 내부 방침 및 관련 법령에 따라 파기합니다.";
        layerHtml += "            </div>";
        layerHtml += "            <span class='agreement-indent'>2. 파기기한</span>";
        layerHtml += "            <div class='agreement-indent-area'>";
        layerHtml += "                이용자의 개인정보는 개인정보의 보유기간이 경과된 경우 보유기간의 종료일로부터 5일 이내, 개인정보의 처리 목적 달성 등 그 개인정보가 불필요하게 되었을 때에는 개인정보의 처리가 불필요한 것으로 인정되는 날로부터 5일 이내에 그 개인정보를 파기합니다.";
        layerHtml += "            </div>";
        layerHtml += "            <span class='agreement-indent'>3. 파기방법</span>";
        layerHtml += "            <div class='agreement-indent-area'>";
        layerHtml += "                제주특별자치도 제주시에서는 개인정보를 파기할 때 다음의 방법으로 파기 합니다.<br>";
        layerHtml += "                <span class='agreement-indent'>가. 전자적 파일 형태인 경우：기록을 재생할 수 없는 기술적 방법으로 영구삭제</span>";
        layerHtml += "                <span class='agreement-indent'>나. 전자적 파일의 형태 외의 기록물, 인쇄물, 서면, 그 밖의 기록매체인 경우：파쇄 또는 소각</span>";
        layerHtml += "            </div>";
        layerHtml += "        </div>";
        layerHtml += "    </div>";
        layerHtml += "    <div class='agreement-medium'>제9조(개인정보의 안전성 확보 조치)</div>";
        layerHtml += "    <div class='agreement-small'>";
        layerHtml += "        <span class='agreement-indent'>① 제주특별자치도 제주시는 「개인정보보호법」 제29조에 따라 다음과 같이 안전성 확보에 필요한 기술적, 관리적, 물리적 조치를 하고 있습니다.</span>";
        layerHtml += "        <div class='agreement-indent-area'>";
        layerHtml += "            <span class='agreement-indent'>1. 내부관리계획의 수립 및 시행</span>";
        layerHtml += "            <div class='agreement-indent-area'>";
        layerHtml += "                제주특별자치도 제주시는 ‘개인정보의 안전성 확보조치 기준’에 의거하여 내부 관리계획을 수립 및 시행합니다.";
        layerHtml += "            </div>";
        layerHtml += "            <span class='agreement-indent'>2. 개인정보취급자 지정의 최소화 및 교육</span>";
        layerHtml += "            <div class='agreement-indent-area'>";
        layerHtml += "                개인정보취급자의 지정을 최소화하고 정기적인 교육을 시행하고 있습니다.";
        layerHtml += "            </div>";
        layerHtml += "            <span class='agreement-indent'>3. 개인정보에 대한 접근 제한</span>";
        layerHtml += "            <div class='agreement-indent-area'>";
        layerHtml += "                개인정보를 처리하는 데이터베이스시스템에 대한 접근권한의 부여, 변경, 말소를 통하여 개인정보에 대한 접근을 통제하고, 침입차단시스템과 탐지시스템을 이용하여 외부로부터의 무단 접근을 통제하고 있으며 개인정보취급자가 정보통신망을 통해 외부에서 개인정보처리시스템에 접속하는 경우에는 가상사설망(VPN：Virtual Private Network)을 이용하고 있습니다. 또한 권한 부여, 변경 또는 말소에 대한 내역을 기록하고, 그 기록을 최소 3년간 보관하고 있습니다.";
        layerHtml += "                <span class='agreement-indent'>※ 접속기록의 보관 및 위변조 방지 개인정보처리시스템에 접속한 기록(웹 로그, 요약정보 등)을 최소 1년 이상 보관, 관리하고 있으며, 접속 기록이 위변조 및 도난, 분실되지 않도록 관리하고 있습니다.</span>";
        layerHtml += "            </div>";
        layerHtml += "            <span class='agreement-indent'>4. 개인정보의 암호화</span>";
        layerHtml += "            <div class='agreement-indent-area'>";
        layerHtml += "                이용자의 개인정보는 암호화되어 저장 및 관리되고 있으며, 중요한 데이터는 저장 및 전송 시 암호화하여 사용하는 등의 별도 보안기능을 사용하고 있습니다.";
        layerHtml += "            </div>";
        layerHtml += "            <span class='agreement-indent'>5. 해킹 등에 대비한 기술적 대책</span>";
        layerHtml += "            <div class='agreement-indent-area'>";
        layerHtml += "                제주특별자치도는 해킹이나 컴퓨터 바이러스 등에 의한 개인정보 유출 및 훼손을 막기 위하여 보안프로그램을 설치하고 주기적인 갱신ㆍ점검을 하며 외부로부터 접근이 통제된 구역에 시스템을 설치하고 기술적, 물리적으로 감시 및 차단하고 있습니다.";
        layerHtml += "            </div>";
        layerHtml += "            <span class='agreement-indent'>6. 비인가자에 대한 출입 통제</span>";
        layerHtml += "            <div class='agreement-indent-area'>";
        layerHtml += "                개인정보를 보관하고 있는 개인정보시스템의 물리적 보관 장소를 별도로 두고 이에 대해 출입통제 절차를 수립, 운영하고 있습니다.";
        layerHtml += "            </div>";
        layerHtml += "        </div>";
        layerHtml += "    </div>";
        layerHtml += "    <div class='agreement-medium'>제10조(개인정보 보호책임자 등 지정)</div>";
        layerHtml += "    <div class='agreement-small'>";
        layerHtml += "        <span class='agreement-indent'>① 제주특별자치도 제주시는 개인정보를 보호하고 개인정보와 관련된 사항을 처리하기 위하여 아래와 같이 개인정보 보호책임자 및 담당자를 지정하고 있습니다.</span>";
        layerHtml += "        <div class='agreement-indent-area'>";
        layerHtml += "            개인정보 보호책임자<br>";
        layerHtml += "            다음은 개인정보 보호책임자에 대한 표이며 개인정보보호, 소속부서(직위), 성명, 비고로 구분되어 나타냅니다.";
        layerHtml += "            <div class='content-table-area'>";
        layerHtml += "                <table class='content-table list-table'>";
        layerHtml += "                    <colgroup>";
        layerHtml += "                        <col width='*'>";
        layerHtml += "                        <col width='*'>";
        layerHtml += "                        <col width='*'>";
        layerHtml += "                        <col width='*'>";
        layerHtml += "                    </colgroup>";
        layerHtml += "                    <thead>";
        layerHtml += "                        <tr>";
        layerHtml += "                            <th>개인정보보호</th>";
        layerHtml += "                            <th>소속부서(직위)</th>";
        layerHtml += "                            <th>성명</th>";
        layerHtml += "                            <th>연락처(비고)</th>";
        layerHtml += "                        </tr>";
        layerHtml += "                    </thead>";
        layerHtml += "                    <tbody>";
        layerHtml += "                        <tr>";
        layerHtml += "                            <td>개인정보 보호책임자</td>";
        layerHtml += "                            <td>안전교통국장</td>";
        layerHtml += "                            <td>홍성균</td>";
        layerHtml += "                            <td>064-728-3000</td>";
        layerHtml += "                        </tr>";
        layerHtml += "                        <tr>";
        layerHtml += "                            <td>개인정보 관리책임자</td>";
        layerHtml += "                            <td>정보화지원과장</td>";
        layerHtml += "                            <td>채경원</td>";
        layerHtml += "                            <td>064-728-2290</td>";
        layerHtml += "                        </tr>";
        layerHtml += "                        <tr>";
        layerHtml += "                            <td>개인정보 보호담당</td>";
        layerHtml += "                            <td>정보보호팀장</td>";
        layerHtml += "                            <td>정윤실</td>";
        layerHtml += "                            <td>064-728-2321</td>";
        layerHtml += "                        </tr>";
        layerHtml += "                        <tr>";
        layerHtml += "                            <td>개인정보 보호담당자</td>";
        layerHtml += "                            <td>주무관</td>";
        layerHtml += "                            <td>문지예</td>";
        layerHtml += "                            <td>064-728-2323</td>";
        layerHtml += "                        </tr>";
        layerHtml += "                    </tbody>";
        layerHtml += "                </table>";
        layerHtml += "            </div>";
        layerHtml += "            <span class='agreement-indent'>※ 제주시에서 운영하는 개인정보파일(분야별) 보호책임자는 해당 개인정보 보유 부서장 및 읍ㆍ면ㆍ동장, 사업소장 임.</span>";
        layerHtml += "        </div>";
        layerHtml += "    </div>";
        layerHtml += "    <div class='agreement-medium'>제11조(권익침해 구제방법)</div>";
        layerHtml += "    <div class='agreement-small'>";
        layerHtml += "        <span class='agreement-indent'>① 정보주체는 아래의 기관에 대해 개인정보 침해에 대한 피해구제, 상담 등을 문의하실 수 있습니다. 아래의 기관은 제주특별자치도 제주시와는 별개의 기관으로서, 제주특별자치도의 자체적인 개인정보 불만처리, 피해구제 결과에 만족하지 못하시거나 보다 자세한 도움이 필요하시면 문의하여 주시기 바랍니다.</span>";
        layerHtml += "        <div class='agreement-indent-area'>";
        layerHtml += "            <span class='agreement-indent'>1. 개인정보 침해신고센터 (한국인터넷진흥원 운영)</span>";
        layerHtml += "            <div class='agreement-indent-area'>";
        layerHtml += "                소관업무：개인정보 침해사실 신고, 상담 신청<br>";
        layerHtml += "                홈페이지：privacy.kisa.or.kr<br>";
        layerHtml += "                전화：(국번없이) 118<br>";
        layerHtml += "            </div>";
        layerHtml += "            <span class='agreement-indent'>2. 개인정보 분쟁조정위원회 (한국인터넷진흥원 운영)</span>";
        layerHtml += "            <div class='agreement-indent-area'>";
        layerHtml += "                소관업무：개인정보 분쟁조정신청, 집단분쟁조정(민사적 해결)<br>";
        layerHtml += "                홈페이지：www.kopico.go.kr<br>";
        layerHtml += "                전화：1833-6972<br>";
        layerHtml += "            </div>";
        layerHtml += "            <span class='agreement-indent'>3. 경찰청 사이버안전국</span>";
        layerHtml += "            <div class='agreement-indent-area'>";
        layerHtml += "                소관업무：개인정보 침해 관련 형사사건 문의 및 신고<br>";
        layerHtml += "                홈페이지：cyberbureau.police.go.kr<br>";
        layerHtml += "                전화：(국번없이) 182<br>";
        layerHtml += "            </div>";
        layerHtml += "            <span class='agreement-indent'>4. 대검찰청 사이버범죄수사단</span>";
        layerHtml += "            <div class='agreement-indent-area'>";
        layerHtml += "                소관업무 : 개인정보 침해 관련 형사사건 문의 및 신고<br>";
        layerHtml += "                홈페이지：www.spo.go.kr<br>";
        layerHtml += "                전화：(국번없이) 1301<br>";
        layerHtml += "            </div>";
        layerHtml += "        </div>";
        layerHtml += "        <span class='agreement-indent'>② 「개인정보보호법」제35조(개인정보의 열람), 제36조(개인정보의 정정ㆍ삭제), 제37조(개인정보의 처리정지 등)의 규정에 의한 요구에 대하여 공공기관의 장이 행한 처분 또는 부작위로 인하여 권리 또는 이익의 침해를 받은 정보주체는 행정심판법이 정하는 바에 따라 행정심판을 청구할 수 있습니다.</span>";
        layerHtml += "        <span class='agreement-indent'>※ 행정심판에 대해 자세한 사항은 법제처 행정심판위원회 (http://www.simpan.go.kr) 홈페이지 또는 제주특별자치도 행정심판위원회(064-710-2277)로 문의하시기 바랍니다.</span>";
        layerHtml += "    </div>";
        layerHtml += "    <div class='agreement-medium'>제12조(개인정보처리방침의 변경)</div>";
        layerHtml += "</div>";
        
        layerWidth = "640px";
    } else if (id == "email-layer") {
        //이메일주소무단수집거부 레이어
        layerTitle = "이메일주소 무단수집 거부";
        
        layerHtml += "<div class='agreement-area'>";
        layerHtml += "   <div class='content-center'>";
        layerHtml += "       <div class='agreement-small'></div>";
        layerHtml += "       <div class='agreement-medium'>이메일 무단수집을 거부합니다.</div>";
        layerHtml += "       <div class='agreement-img'>";
        layerHtml += "           <img src='../img/email-layer-img.png' alt='email-layer-img'>";
        layerHtml += "       </div>";
        layerHtml += "   </div>";
        layerHtml += "   <ul class='agreement-list cf'>";
        layerHtml += "       <li>본 웹사이트에서는 게시된 이메일 주소가 전자우편 수집 프로그램이나 그 밖의 기술적 장치를 이용하여 수집되는 것을 거부합니다.</li>";
        layerHtml += "       <li>이를 위반시 '정보통신망 이용척진 및 정보보호'등에 의해 처벌받을 수 있습니다.</li>";
        layerHtml += "   </ul>";
        layerHtml += "</div>";
        
        layerWidth = "640px";
    }
    
    $("#default-layer .layer-box .layer-title .layer-title-txt").html(layerTitle);
    $("#default-layer .layer-box .layer-content").html(layerHtml);
    $("#default-layer .layer-box").css("max-width",layerWidth);
    
    //레이어 팝업 내용 변경
    if ($("#default-layer .layer-box .layer-content .layer-content-area").length > 0) {
        var layerContentId = $("#default-layer .layer-box .layer-content .layer-content-area .layer-content-item:first-child").attr("id");

        setLayerContent(layerContentId);
    }
    
    $("#default-layer").addClass("on");
    
    var scrollTop = parseFloat($(document).scrollTop());

    $("body").css("top", -scrollTop + "px");

    $("body").addClass("scroll-disable").on('scroll touchmove', function(event) {
        event.preventDefault();
    });
}

//레이어 팝업 내용 변경
function setLayerContent(id) {
    $("#default-layer .layer-box .layer-content .layer-content-area .layer-content-item").css("display","none");
    $("#default-layer .layer-box .layer-content .layer-content-area .layer-content-item#" + id).css("display","block");
}

//아이디찾기 결과
function setLayerFindId() {
    var layerHtml = "";
    
    layerHtml += "<div class='layer-content-txt'>입력하신 정보와 일치하는 아이디가 없습니다.</div>";
    layerHtml += "<button type='button' class='content-btn content-btn-type1' onclick='closeLayer(this);'>확인</button>";
    
    $("#default-layer .layer-box .layer-content .layer-content-area .layer-content-item#layer-content-2").html(layerHtml);
    
    setLayerContent('layer-content-2');
}

//비밀번호찾기 결과
function setLayerFindPw() {
    var layerHtml = "";
    
    layerHtml += "<div class='layer-content-txt'>입력하신 정보와 일치하는 회원이 없습니다.</div>";
    layerHtml += "<button type='button' class='content-btn content-btn-type1' onclick='closeLayer(this);'>확인</button>";
    
    $("#default-layer .layer-box .layer-content .layer-content-area .layer-content-item#layer-content-2").html(layerHtml);
    
    setLayerContent('layer-content-2');
}

//회원탈퇴 결과
function setLayerLeave() {
    var layerHtml = "";
    
    layerHtml += "<div class='layer-content-txt'>비밀번호가 일치하지 않습니다.</div>";
    layerHtml += "<button type='button' class='content-btn content-btn-type1' onclick='closeLayer(this);'>확인</button>";
    
    $("#default-layer .layer-box .layer-content .layer-content-area .layer-content-item#layer-content-2").html(layerHtml);
    
    setLayerContent('layer-content-2');
}

//게시판 수정 결과
function setLayerBoardUpdate() {
    var layerHtml = "";
    
    layerHtml += "<div class='layer-content-txt'>비밀번호가 일치하지 않습니다.</div>";
    layerHtml += "<button type='button' class='content-btn content-btn-type1' onclick='closeLayer(this);'>확인</button>";
    
    $("#default-layer .layer-box .layer-content .layer-content-area .layer-content-item#layer-content-2").html(layerHtml);
    
    setLayerContent('layer-content-2');
}

//게시판 삭제 결과
function setLayerBoardDelete() {
    var layerHtml = "";
    
    layerHtml += "<div class='layer-content-txt'>비밀번호가 일치하지 않습니다.</div>";
    layerHtml += "<button type='button' class='content-btn content-btn-type1' onclick='closeLayer(this);'>확인</button>";
    
    $("#default-layer .layer-box .layer-content .layer-content-area .layer-content-item#layer-content-2").html(layerHtml);
    
    setLayerContent('layer-content-2');
}

//댓글 수정 결과
function setLayerCommentUpdate() {
    var layerHtml = "";
    
    layerHtml += "<div class='layer-content-txt'>비밀번호가 일치하지 않습니다.</div>";
    layerHtml += "<button type='button' class='content-btn content-btn-type1' onclick='closeLayer(this);'>확인</button>";
    
    $("#default-layer .layer-box .layer-content .layer-content-area .layer-content-item#layer-content-2").html(layerHtml);
    
    setLayerContent('layer-content-2');
}

//댓글 삭제 결과
function setLayerCommentDelete() {
    var layerHtml = "";
    
    layerHtml += "<div class='layer-content-txt'>비밀번호가 일치하지 않습니다.</div>";
    layerHtml += "<button type='button' class='content-btn content-btn-type1' onclick='closeLayer(this);'>확인</button>";
    
    $("#default-layer .layer-box .layer-content .layer-content-area .layer-content-item#layer-content-2").html(layerHtml);
    
    setLayerContent('layer-content-2');
}
//5차 수정부분 END

//레이어 팝업 열기
function openLayer(type, msg, fun) {
    $("#" + type + "-layer .layer-box .layer-content .layer-content-txt").html(msg);
    
    $("#" + type + "-layer .layer-box .layer-btn-area .confirm-btn").removeAttr("onclick");
    $("#" + type + "-layer .layer-box .layer-btn-area .confirm-btn").attr("onclick","closeLayer(this);" + fun);
    
    $("#" + type + "-layer").addClass("on");
    
    var scrollTop = parseFloat($(document).scrollTop());

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

        var scrollTop = Math.abs(parseFloat($("body").css("top")));

        $("html,body").animate({scrollTop: scrollTop}, 0);
    }
}

//8차 수정부분 START
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
//8차 수정부분 END

