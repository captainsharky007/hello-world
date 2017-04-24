$('body')
    .on('touchstart', 'input', function(e) {
        e.target.focus();
        return false;
    })
    .on('focus', 'input', function() {
        window.scrollTo(0, 0);
        return false;
    });

var containerClasses = "container container-m";
var mobileClasses = "mobile-page";

html = $("li:nth-child(5)").html(); //for demo

function screenClass() {
    if(window.matchMedia('(min-width: 900px)').matches) {
        $("main").removeClass('mobile-page mobile-right page-1');
        $(".page-2").addClass("none");
        if($(".page-2").hasClass("active-page")){
            $("main").removeClass("active-page");
        }
        $(".container").removeClass("mobile-page");

    } else {
        $('main').addClass('mobile-page mobile-right page-1');
        $(".page-2").removeClass("none").addClass("mobile-page");
          if($("body").find(".page-2").length == 0) {
             $('main').after("<div class='container container-m page-2 mobile-page' style='right:-100%'></div>");
        
              if($(".expansion-panel li").hasClass("active") && !$(".page-2").hasClass("active-page") ){
                  console.log("new funct")
                 $(".page-2").addClass("active-page");
                  $(".page-1").removeClass("active-page");
                  var thisObj = $(".expansion-panel li.active")
                  appendPage(thisObj);
                 }
        
        }
    }
}

function pagesNew(html) {
    var futurePage = "[data-deep="+ (deepCount + 1)+"]";
    // var dataForFuturePage = "'data-page', "+(deepCount+1);
    
    var deepCount = $("[data-deep]").size();
    var lastPage = $("[data-deep]:last");
    $(lastPage).after("<div class='"+containerClasses+" "+mobileClasses+"' style='right:-100%' data-deep="+(deepCount+1)+">"+html+"</div>");
    var lastPage = $("[data-deep]:last");
    pagesAppear(lastPage);
}

function pagesGetObjPage(thisObj){
    return $(thisObj).closest("[data-deep]");
}

function pagesClose(thisObj){
    $(pagesGetObjPage(thisObj)).remove();
}

function pagesAppear(thisObj){
    setTimeout(function(){ $(thisObj).css("right","0%");},10)  
}


// Fire.
screenClass();

// And recheck if window gets resized.


$(window).bind('resize',function(){
    screenClass();
    pagePosition();
});



function appendPage(thisObj){
    $(thisObj).addClass("transition");
    setTimeout(function(){
        $(thisObj).removeClass("transition")
    }, 300);
    setTimeout(function(){
        //$("body").animate({scrollTop:0}, 200);
        $(".page-1").removeClass("active-page").css("right", "100%");
        $(".page-2").addClass("active-page").css("right", "0%").find("section").remove();
     
       
        
        $(thisObj).find("section").clone().appendTo(".page-2");
        screenClass();
        
        $(".page-2").find(".poga").on("click", function(){
            $(".page-1").addClass("active-page").css("right", "0%");
            $(".page-2").removeClass("active-page").css("right", "-100%");
          
            expansionPanelControl(thisObj, "close");
            
           

           //  setTimeout(function(){   pagePosition(); }, 10);
        })
        
    },1);
}

function pagePosition(){
    if($(".page-1").is(".active-page"))
        { 
            console.log("page-1 is active");
            $("main").css("right", "0%");
            $(".page-2").css("right", "-100%");
        } else if ($(".page-2").is(".active-page")) {
            console.log("page-2 is active");
            $("main").css("right", "100%");
            $(".page-2").css("right", "-0%");
        }
}


var open;
var loadingTimeSimulation = 100;

var defaultTime = 1;
var removeHeightCssTime = 200 * defaultTime;

function expansionPanelHeight(thisObj, type) {
    switch(type) {
        case "thisHeight":
            return $(thisObj).outerHeight();
            break;
            
        case "thisContentHeight":
            return $(thisObj).find("section").height(); 
            break;
            
        case "thisSumHeight":
            return $(thisObj).outerHeight() + $(thisObj).find("section").height();
            break;
            
        case "thisClosedHeight":
            var outer = $(thisObj).outerHeight();
            var content =  $(thisObj).find("section").height();
            return  outer - content;
            break;
            
        case "previousElementHeight":
            return  $(thisObj).parent().find("li.active").outerHeight();
            break;
            
        case "previousContentHeight":
            return $(thisObj).parent().find("li.active").find("section").height();
            break;
            
        case "previousClosedHeight":
            var outers = $(thisObj).parent().find("li.active").outerHeight();
            var contents =  $(thisObj).parent().find("li.active").find("section").height();
            return  outers - contents;
            break;

        default:
            alert("expansionPanelHeight wrong type")
               };
}

function expansionPanelClosePrevious(thisObj) {
    
}

function expansionPanelExpand(thisObj) {
    $(thisObj).addClass("active loading").css("height",expansionPanelHeight(thisObj,"thisHeight"));
    open = setTimeout(function(){
        $(thisObj).css("height", expansionPanelHeight(thisObj,"thisSumHeight") );
        $(thisObj).parent().find("li.loading").removeClass("loading").addClass("relative");
        setTimeout(function() {
            $(thisObj).parents().find(".relative").css("height", "");
        }, removeHeightCssTime);      
    }, loadingTimeSimulation );
}

function expansionPanelStop() {
    clearTimeout(open);
}  

function clearCssHeight(thisObj){
    $(thisObj).parent().find(".previuos").css("height", "").removeClass("previuos");
}

function expansionPanelControl(thisObj, action) {
    switch (action) {
        case "open": // opening action
            
            if($(thisObj).parent().find(".loading").size() < 1) {
               
                // close previous
                $(thisObj).parent().find("li.active").addClass("previuos").removeClass("relative").css("height",  expansionPanelHeight(thisObj,"thisHeight")).removeClass("active");
                
                
                // //expansionPanelScroll(thisObj);
                
                clearCssHeight(thisObj);

                expansionPanelExpand(thisObj);
               

            } else { 
                expansionPanelStop();
                $(".loading").removeClass("active loading");
                expansionPanelControl(thisObj,"open");
            }
            
            break;

        case "close": // closing action
            console.log("closing...")
                if($("main").hasClass("mobile-page")){
                     $(thisObj).css("height","");
                   
                           setTimeout(function(){ $(thisObj).removeClass("relative")},100)
                } else {  $(thisObj).css("height", expansionPanelHeight(thisObj,"thisHeight")).removeClass("relative");
                        $(".active-page").css("right","-100%").removeClass("active-page");}
   
          
            
           var close = function() {
                    $(thisObj).css("height", expansionPanelHeight(thisObj,"thisClosedHeight")).removeClass("active");
                }
           
            close();
           

            break;
        default:
            console.log("default...");
    }
};




function expansionPanelScroll(thisObj) {
    
    
     if ($(thisObj).parent().is(".expansion-panel") && !$("main").is(".mobile-page")) {
                console.log("sroll...");
               
                if (!$(thisObj).is(":first-child")) {

                    // scrolling for not first-child
                    $('html, body').animate({
                        scrollTop: $(thisObj).offset().top - 50
                    }, 500);
                } else {
                    // scroling for first-child
                    $('html, body').animate({
                        scrollTop: $(thisObj).top - 50
                    }, 500);
                }
                 $(thisObj).addClass("loading");
                

                 
            } else {
                 console.log("sroll else...");
                // if not expansion-panel another scroll
                $('html, body').animate({
                    scrollTop: $('body').top 
                }, 500);
            }
    
};


$(document).ready(function() {
    
   
    // checks all input fields, if not empty addClass
    $("input").each(function() {
        if ($(this).val()) {
            $(this).parents('field').addClass('not-empty');
            // console.log("work");
        }
    });

    // check if input is empty after edit
    $('input').blur(function() {
        if ($(this).val()) {
            $(this).parents('field').addClass('not-empty');
        } else {
            $(this).parents('field').removeClass('not-empty');
        }
    });

    // addClass on input focus
    $('input').focus(function() {
        $(this).parent('field').addClass('not-empty');
        $(this).parent('field').addClass('focus');
    }).blur(function() {
        $(this).parent('field').removeClass('focus');
    });

    // addClass active to clicked tab
    $(".nav-tabs li, .expansion-panel li").on("click", function() {
        if (!$(this).is(".disabled, .active")) {
             var thisObj = $(this);
            expansionPanelControl(thisObj, "open");
            setTimeout(function(){
                appendPage(thisObj);
            }, loadingTimeSimulation);
            
        }
    });
    
    $(".poga").on("click", function(){
        
        event.stopImmediatePropagation();
        var thisObj = $(this).parents("li.active");
        console.log(thisObj);
        expansionPanelControl(thisObj, "close");
    });
});

// if input is first element in container, fix padding when less.js is finished 
less.pageLoadFinished.then(function() {
    if ($(".container").children(":visible:first").has('input').length > 0) {
        $('.container').addClass('extra-input-padding');
    }
});



