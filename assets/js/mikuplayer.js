$(function() {
	if (window.localStorage) {
		util.init()
	} else {
		$(".ok").fadeOut(300, "linear");
		$("#ng").fadeIn(300, "linear")
	}
});
var util = {
	init: function() {
		$(window).resize(util.videoresize);
		$("#bt_fs").fadeIn(300, "linear");
		$("#scene_top").fadeIn(300, "linear");
		$("#bt_fs").on('click', function() {
			util.fullscreen()
		});
		$("#btt_start").on('click', util.study);
		$("#btt_setting").on('click', function() {
			util.menuopen("menu")
		});
		$("#btt_about").on('click', function() {
			util.menuopen("about")
		});
		$("#bt_rest").on('click', function() {
			util.timerecord.pause();
			util.menuopen("rest");
			$('.aplayer-pause').trigger('click');
			$('#bt_restclose').on('click', function() {
				$('.aplayer-play').trigger('click');
				util.timerecord.start()
			});
			$("#bt_musicswitch").on('click', function() {
				$(".aplayer-button").trigger("click")
			})
		});
		$("#about_cover").on('click', function() {
			$("#about").fadeOut(300, "linear");
			$("#about_cover").fadeOut(300, "linear");
			$("#scene_top").fadeIn(300, "linear")
		});
		util.readstoragetime()
	},
	menuopen: function(e) {
		$("#" + e).fadeIn(300, "linear");
		$("#" + e + "_cover").fadeIn(300, "linear");
		$("#bt_" + e + "close").on('click', function() {
			$("#" + e).fadeOut(300, "linear");
			$("#" + e + "_cover").fadeOut(300, "linear")
		})
	},
	study: function() {
		$('.aplayer-play').trigger('click');
		$("#scene_top").fadeOut(300, "linear");
		$("#scene_learning").fadeIn(300, "linear");
		$("#bt_rest").fadeIn(300, "linear");
		$("video").trigger("play");
		util.videoresize();
		util.timerecord.start();
		util.tips.start();
		$("#bt_stop").on('click', function() {
			util.timerecord.stop();
			util.tips.stop();
			$('.aplayer-pause').trigger('click');
			$("#scene_top").fadeIn(300, "linear");
			$("#scene_learning").fadeOut(300, "linear");
			$("#bt_rest").fadeOut(300, "linear");
			$("#rest").fadeOut(300, "linear");
			$("#rest_cover").fadeOut(300, "linear")
		})
	},
	timerecord: {
		start: function() {
			clearInterval(time);
			if (!recorded) {
				hour = minutes = seconds = 0;
				recorded = 1
			}
			recorded = 1;
			util.timer()
		},
		stop: function() {
			clearInterval(time);
			if (recorded) {
				var m = h = 0;
				sumseconds = sumseconds + seconds;
				while (sumseconds >= 60) {
					m++;
					sumseconds = sumseconds - 60
				}
				summinutes = summinutes + minutes + m;
				while (summinutes >= 60) {
					h++;
					summinutes = summinutes - 60
				}
				sumhour = sumhour + hour + h;
				recorded = 0;
				util.writestoragetime()
			}
		},
		pause: function() {
			clearInterval(time)
		}
	},
	timer: function() {
		var studytime = $("#time"),
			tipstime = $("#tipstime"),
			pastsDate = sDate = pastmDate = mDate = pasthDate = hDate = 0;
		time = setInterval(function() {
			var myDate = new Date;
			sDate = myDate.getSeconds();
			mDate = myDate.getMinutes();
			hDate = myDate.getHours();
			if (sDate - pastsDate >= 1 || mDate - pastmDate >= 1 || hDate - pasthDate >= 1) {
				seconds++
			}
			if (seconds == 60) {
				minutes++;
				seconds = 0
			}
			if (minutes == 60) {
				hour++;
				minutes = 0
			}
			if (minutes == '0' && hour == '0') {
				studytime.text(seconds + "秒钟啦！继续加油吧！")
			} else if (hour != '0') {
				studytime.text(hour + "小时" + minutes + "分钟" + seconds + "秒啦！好厉害！！！")
			} else {
				studytime.text(minutes + "分钟" + seconds + "秒啦！超棒！")
			} if (minutes == '0' && hour == '0') {
				tipstime.text(seconds + "秒钟")
			} else if (hour != '0') {
				tipstime.text(hour + "小时" + minutes + "分钟" + seconds + "秒")
			} else {
				tipstime.text(minutes + "分钟" + seconds + "秒")
			}
			pastsDate = sDate;
			pastmDate = mDate;
			pasthDate = hDate
		}, 1000)
	},
	readstoragetime: function() {
		if (localStorage.getItem("study") == "GetDAZE") {
			sumhour = parseInt("0x" + localStorage.getItem("studyh"));
			summinutes = parseInt("0x" + localStorage.getItem("studym"));
			sumseconds = parseInt("0x" + localStorage.getItem("studys"));
			if (summinutes == '0' && sumhour == '0') {
				$("#sumtime").text(sumseconds + "秒钟了")
			} else if (sumhour != '0') {
				$("#sumtime").text(sumhour + "小时" + summinutes + "分钟" + sumseconds + "秒了")
			} else {
				$("#sumtime").text(summinutes + "分钟" + sumseconds + "秒了")
			}
		}
	},
	writestoragetime: function() {
		localStorage.setItem("study", "GetDAZE");
		localStorage.setItem("studyh", sumhour.toString(16));
		localStorage.setItem("studym", summinutes.toString(16));
		localStorage.setItem("studys", sumseconds.toString(16));
		util.readstoragetime()
	},
	tips: {
		start: function() {
			tips = setInterval(function() {
				if (tipstype == 0 || tipstype == 2) {
					tipstype = 1;
					async function fetchHitokoto() {
						const response = await fetch('https://v1.hitokoto.cn/?c=a&c=d&c=i&c=k&max_length=10');
						const {
							uuid, hitokoto: hitokotoText
						} = await response.json();
						const hitokoto = document.querySelector('#hitokoto');
						hitokoto.innerText = hitokotoText
					}
					fetchHitokoto();
					sayingin = setTimeout(function() {
						$(".saying").fadeIn(300, "linear")
					}, 1000);
					sayingout = setTimeout(function() {
						$(".saying").fadeOut(300, "linear")
					}, 14300)
				} else {
					tipstype = 2;
					tipstimein = setTimeout(function() {
						$(".ntime").fadeIn(300, "linear")
					}, 1000);
					tipstimeout = setTimeout(function() {
						$(".ntime").fadeOut(300, "linear")
					}, 14300)
				}
			}, 14600);
			attentionout = setTimeout(function() {
				$(".attention").fadeOut(300, "linear")
			}, 8000)
		},
		stop: function() {
			clearTimeout(tips);
			clearTimeout(sayingin);
			clearTimeout(sayingout);
			clearTimeout(tipstimein);
			clearTimeout(tipstimeout);
			clearInterval(attentionout);
			$(".saying").fadeOut(300, "linear");
			$(".ntime").fadeOut(300, "linear");
			setTimeout(function() {
				$(".attention").fadeIn(300, "linear")
			}, 300)
		}
	},
	videoresize: function() {
		var ww = $(window).width(),
			wh = $(window).height(),
			vw = $("video").width(),
			vh = $("video").height();
		if (ww * 0.5625 >= wh) {
			$("video").css("height", "auto").css("width", ww).css("top", wh / 2 - $("video").height() / 2).css("left", "0")
		} else {
			$("video").css("height", wh).css("width", "auto").css("left", ww / 2 - $("video").width() / 2).css("top", "0")
		}
	},
	fullscreen: function(e) {
		util.checkFullscreen() ? document.webkitCancelFullScreen ? document.webkitCancelFullScreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.msExitFullscreen ? document.msExitFullscreen() : document.cancelFullScreen ? document.cancelFullScreen() : document.exitFullscreen && document.exitFullscreen() : (e ? "string" == typeof e && (e = document.getElementById(e)) : e = document.body, e.webkitRequestFullscreen ? e.webkitRequestFullscreen() : e.mozRequestFullScreen ? e.mozRequestFullScreen() : e.msRequestFullscreen ? e.msRequestFullscreen() : e.requestFullscreen && e.requestFullscreen())
	},
	checkFullscreen: function() {
		return !!(document.webkitFullscreenElement || document.mozFullScreenElement || document.mozFullScreenElement || document.msFullscreenElement || document.fullscreenElement)
	}
}, hour = minutes = seconds = recorded = sumhour = summinutes = sumseconds = tipstype = tipstimein = tipstimeout = sayingin = sayingout = attentionout = 0;
console.log("\n %c Study With Miku V1.0 %c 在干什么呢(・∀・(・∀・(・∀・*) \n", "color: #fadfa3; background: #030307; padding:5px 0;", "background: #fadfa3; padding:5px 0; color: #000")