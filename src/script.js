var currentSection;
var currentAgent;
var showingPhone = false;
var scroller = scrollama();
var bgPositions = [
  [
    [385, 540],
    [1480, 540],
    [2550, 540],
    [3140, 540],
  ],
  [
    [4690, 540],
    [6000, 540],
    [6810, 540],
    [7850, 540],
  ],
  [
    [8760, 540],
    [9620, 540],
    [10820, 540],
    [11830, 540],
  ],
  [
    [12720, 540],
    [13760, 540],
    [14460, 540],
    [15880, 540],
  ],
  [
    [17030, 540],
    [17850, 540],
    [18800, 540],
    [19800, 540],
  ],
  [
    [21240, 540],
    [21940, 540],
    [23300, 540],
    [24460, 540],
  ],
  [
    [25360, 540],
    [26040, 540],
    [26800, 540],
    [27760, 540],
  ],
];
var assistantPositions = [
  // [715, 156, 42, 48],
  // [2341, 228, 42, 48],
  // [2949, 165, 42, 48],
  // [4420, 159, 25, 29],
  // [5449, 215, 41, 47],
  // [6343, 212, 42, 48],
  // [7816, 161, 55, 63],
  // [8732, 226, 52, 59],
  // [9182, 152, 113, 128],
  // [9673, 199, 79, 89],
  // [10950, 223, 93, 105],
  // [12842, 263, 37, 42],
  [13613, 125, 44, 50],
];
// var phonePositions = [
//   [[390], [1120], [1490], [1840]],
//   [[2567], [3071], [3614], [4577]],
//   [[4923], [6306], [6668], [7091]],
//   [[9929], [10483], [10853], [11230]],
//   [[11531], [12546], [13274], [13906]],
//   [[14186], [15264], [15815], [16868]],
//   [[17044], [17199], [18072], [18072]],
// ];
var phonePositions;
var prototypeCardIds = [
  ["scenario-1a", "scenario-1b", "scenario-1c", "scenario-1d"],

  ["scenario-2a", "scenario-2b", "scenario-2b", "scenario-2d"],

  ["scenario-3a", "scenario-3b", "scenario-3c", "scenario-3d"],

  ["scenario-4a", "scenario-4b", "scenario-4c", "scenario-4d"],

  ["scenario-5a", "scenario-5b", "scenario-5c", "scenario-5d"],

  ["scenario-6a", "scenario-6b", "scenario-6c", "scenario-6d"],

  ["scenario-7a", "scenario-7b", "scenario-7c", "scenario-7d"],
];

$(function () {
  phonePositions = [];
  var cardSection;
  var yOffset = 0;
  var lastId = "";
  $(prototypeCardIds).each(function (i, sectionIds) {
    sectionPositions = [];
    $(sectionIds).each(function (j, cardId) {
      t = $(`#pcard-${cardId}`).position().top;
      h = $(`#pcard-${cardId}`).height();
      // y = t + h;
      if (cardId != lastId) yOffset += h + 16;
      sectionPositions.push(yOffset);
      // console.log(yOffset, y, t, h);
      lastId = cardId;
    });
    phonePositions.push(sectionPositions);
    console.log(i, sectionIds);
  });

  scroller = scrollama();
  $(".prototype-loader .btn").click(function () {
    var loaderEl = $(this).parents(".prototype-loader");
    var parentEl = loaderEl.parents(".prototype");
    var containerEl = parentEl.find(".prototype-container");
    var iFrame = parentEl.find("iframe");
    containerEl.show();
    loaderEl.hide();
    // iFrame.load(function(){
    //   console.log("loaded frame");
    // })
    iFrame.attr("src", iFrame.attr("data-src"));
  });

  $("[data-link]").click(function () {
    var id = $(this).data("link");
    scrollToSection($("#" + id));
    window.location.hash = id;
  });
  $(".btn-seemore").click(function () {
    $(this).parents(".taxonomy-container").css("height", "auto");
    $(this).parents(".taxonomy-seemore").hide();
  });

  $(".nav-open-menu").click(function () {
    $(".menu-overlay-container").show();
  });
  $(".menu-overlay-container").click(function () {
    $(".menu-overlay-container").hide();
  });
  $(".section-title").click(function () {
    scrollToSection($(this).parents(".step"));
  });
  $(".nav-prev-section").click(function () {
    scrollToSection($(currentSection).prev(".step"));
  });
  $(".nav-next-section").click(function () {
    scrollToSection($(currentSection).next(".step"));
  });
  $(".cards-principles .btn-circle").click(function () {
    var width = $($(".cards-principles .col-10")[0]).width();
    width += $($(".cards-principles .col-10")[1]).width();
    $(".cards-principles").animate({ scrollLeft: width }, 500);
  });
  $(".cards-projects .btn-circle").click(function () {
    var width = $($(".cards-projects .col-10")[0]).width();
    width += $($(".cards-projects .col-10")[1]).width();
    $(".cards-projects").animate({ scrollLeft: width }, 500);
  });
  currentAgent = $($(".ai-option.selected .avatar .material-icons")[0]).text();
  $(".ai-option").click(function () {
    $(".ai-option.selected").removeClass("selected");
    $(this).addClass("selected");
    currentAgent = $(this).find(".avatar .material-icons").text();
    var agentIcon = $(this).data("icon");
    $(".tapestry-assistant").attr("src", `images/assistant_${agentIcon}.svg`);
    if (agentIcon == "help") {
      window.open("https://me210829.typeform.com/to/cHglkn7x");
    }
  });

  $(".prototype-conversation .prototype-card").click(function () {
    var step = $(this).data("prototype-step");
    console.log(step);
    $(".prototype-modal").scrollTop(0);
    $(".prototype-modal .data-chain").hide();
    $("#datachain-" + step).show();
    $(".prototype-modal").css("transform", "translateX(-375px)");
  });
  $(".prototype-modal").click(function () {
    $(".prototype-modal .data-chain").hide();
    var index = $(currentSection).attr("data-stepIndex");
    var frame = $(currentSection).attr("data-stepFrame");
    $("#datachain-" + prototypeCardIds[index][frame]).show();
    $(".prototype-modal").css("transform", "translateX(0)");
  });
  // setup the instance, pass callback functions
  scroller
    .setup({
      step: ".step",
      offset: 1,
      // progress: true,
    })
    .onStepEnter((response) => {
      currentSection = response.element;
      var index = $(currentSection).attr("data-stepIndex");
      var frame = $(currentSection).attr("data-stepFrame");
      var el = $(currentSection);
      var x, y;

      if (index && frame) {
        var sideMargin = 0;
        x = bgPositions[index][frame][0];
        y = bgPositions[index][frame][1];
        // if ($(window).width() > 576) sideMargin = 20;
        $("#tapestry .banner").css(
          "transform",
          "translate(-" + x + "px, -" + y + "px)"
        );

        // $(`#pcard-${cardId}`).;
        // prototypeCardIds[index][frame]
        $(".prototype-conversation .prototype-card").css("opacity", 0.5);
        $("#pcard-" + prototypeCardIds[index][frame]).css("opacity", 1);
        $(".prototype-conversation").css(
          "transform",
          "translate(0, -" + phonePositions[index][frame] + "px)"
        );
        // if (index != undefined && showingPhone == false) {
        //   showingPhone = true;
        //   $("#sticky-prototype").show();
        // }
      }
      // if (index == undefined && showingPhone == true) {
      //   showingPhone = false;
      //   $("#sticky-prototype").hide();
      // }

      // $("#tapestry").css("transform", "translate(" + sideMargin + "vw, 0)");

      // if (el.is(".step-holder-left")) {
      //   x = bgPositions[index][frame][0];
      //   y = bgPositions[index][frame][1];
      //   console.log(x, y);
      //   if ($(window).width() > 576) sideMargin = 20;
      //   $("#tapestry img").css(
      //     "transform",
      //     "translate(-" + x + "px, -" + y + "px)"
      //   );
      //   $("#tapestry").css("transform", "translate(" + sideMargin + "vw, 0)");
      //   console.log(bgPositions[index][frame]);
      // } else if (el.is(".step-holder-right")) {
      //   x = bgPositions[index][frame][0];
      //   y = bgPositions[index][frame][1];
      //   if ($(window).width() > 768) sideMargin = -20;

      //   $("#tapestry img").css(
      //     "transform",
      //     "translate(-" + x + "px, -" + y + "px)"
      //   );
      //   $("#tapestry").css("transform", "translate(" + sideMargin + "vw, 0)");
      //   console.log(bgPositions[index][frame]);
      // }
      // console.log($(window).width());
      // if (el.is(".step-holder")) {
      //   $("#tapestry").show();
      // } else {
      //   $("#tapestry").hide();
      // }
      // if (response.direction == "down") {
      //   $(".nav-container").css("top", -48);
      // }
    })
    .onStepExit((response) => {
      // if (response.direction == "up") {
      //   $(".nav-container").css("top", 0);
      // }
    })
    .onStepProgress((response) => {});
  // scroller.onStepEnter();
  // setup resize event
  window.addEventListener("resize", scroller.resize);
  $(window).resize(function () {
    $(".prototype-content").mouseover(function () {
      var scale = Math.min(1, ($(window).height() - 150) / 812);
      $(this).css("transform", `scaleX(${scale}) scaleY(${scale})`);
    });
    $(".prototype-content").mouseout(function () {
      $(this).css("transform", `scaleX(.2) scaleY(.2)`);
    });
    //   console.log($(".prototype-content"), $(window).width());
  });
  $(window).resize();
});

function scrollToSection(sectionElement) {
  scroller.disable();
  $("html, body").animate(
    {
      scrollTop: sectionElement.offset().top,
    },
    1000,
    function () {
      scroller.enable();
    }
  );
}

function mapScenariosFrames () {
  const chatbotConfig = [
    [ // scenario 1 (a, b, c, d)
      { title: "Learn About BikeShare Co Mobility System", componentId: "rec8fAgsB2c98ltIU", placeId: "recDtlwq338h5oNjl", },
      { title: "Learn About Agency System - Plaza", componentId: "recaqqa3R43debY3l", placeId: "recDtlwq338h5oNjl", },
      { title: "Learn About Library Borrowing System", componentId: "recaxVBIJDm2Cx5gY", placeId: "recDtlwq338h5oNjl", },
      { title: "Learn About Library Borrowing System", componentId: "recaxVBIJDm2Cx5gY", placeId: "recDtlwq338h5oNjl", }
    ],
    [ // scenario 2 (a, b, c, d)
      { title: "Learn About Agency System - Unique Chic", componentId: "recyZEHi93W12Pu6v", placeId: "recDtlwq338h5oNjl", },
      { title: "Learn About Virtual Changing Room", componentId: "recaeEMK59ayD6v4i", placeId: "recDtlwq338h5oNjl", },
      { title: "Learn About Virtual Changing Room", componentId: "recaeEMK59ayD6v4i", placeId: "recDtlwq338h5oNjl", },
      { title: "Learn About Grab and Go Payments - Unique Chic", componentId: "recqqnyBjyKZM0PHF", placeId: "recDtlwq338h5oNjl", },
    ],
    [ // scenario 3 (a, b, c, d)
      { title: "Learn About Arts Feedback System", componentId: "recKtjxEcw9x7Hvxk", placeId: "recDtlwq338h5oNjl", },
      { title: "Learn About Arts Feedback System", componentId: "recKtjxEcw9x7Hvxk", placeId: "recDtlwq338h5oNjl", },
      { title: "Learn About Inform System - Plaza", componentId: "recDTKLqPrgXhuCvm", placeId: "recDtlwq338h5oNjl", },
      { title: "Learn About Cellular Phone", componentId: "reciyeJc5l276Nn96", placeId: "recDtlwq338h5oNjl", },
    ],
    [ // scenario 4 (a, b, c, d)
      { title: "Learn About Sunshine Sushi Ordering System", componentId: "recf081uxuPQRQutZ", placeId: "recDtlwq338h5oNjl", },
      { title: "Learn About Inform System - Plaza", componentId: "recDTKLqPrgXhuCvm", placeId: "recDtlwq338h5oNjl", },
      { title: "Learn About West Side Plaza Mobility System", componentId: "recLAW92gvb1e84g7", placeId: "recDtlwq338h5oNjl", },
      { title: "Learn About Sunshine Sushi Ordering System", componentId: "recf081uxuPQRQutZ", placeId: "recDtlwq338h5oNjl", },

    ],
    [ // scenario 5 (a, b, c, c, c, c)
      { title: "Learn About West Side Plaza Smart Waste System", componentId: "recrLfW6Zm3iAJQpz", placeId: "recDtlwq338h5oNjl", },
      { title: "Learn About Location Data Sharing - Energy Scheduler", componentId: "recPkFEDdzGSwx1N6", placeId: "recDtlwq338h5oNjl", },
      { title: "Learn About West Side Plaza Sustainability Systems", componentId: "rec0TU14pgPA0TiWV", placeId: "recDtlwq338h5oNjl", },
      { title: "Learn About West Side Plaza Energy Scheduler", componentId: "recvQUeDYowKhUFH8", placeId: "recDtlwq338h5oNjl", },
      // { title: "Learn About Thermal Grid", componentId: "recChHJz11WtJHb7X", placeId: "recDtlwq338h5oNjl", },
      // { title: "Learn About Lighting System", componentId: "recALCUYUYzmaEzKO", placeId: "recDtlwq338h5oNjl", },
    ],
    [ // scenario 6 (a, b, c, a, d)
      { title: "Learn About West Side Plaza on-site support", componentId: "recBY7B3aCSDCE5vV", placeId: "recDtlwq338h5oNjl", },
      { title: "Learn About West Side Plaza Safety & Security", componentId: "reczGG2kvRjR3zxqi", placeId: "recDtlwq338h5oNjl", },
      // { title: "Learn About West Side Plaza Safety & Security", componentId: "reczGG2kvRjR3zxqi", placeId: "recDtlwq338h5oNjl", },
      { title: "Learn About Inform System - Plaza", componentId: "recDTKLqPrgXhuCvm", placeId: "recDtlwq338h5oNjl", },
      { title: "Learn About BikeShare Co Mobility System", componentId: "rec8fAgsB2c98ltIU", placeId: "recDtlwq338h5oNjl", },
    ],
    [ // scenario 7 (a, b, c, d)
      { title: "Learn About Greenwave Mobility System", componentId: "recjM2DDblwt2CpFz", placeId: "recDtlwq338h5oNjl", },
      { title: "Learn About Home Agency System", componentId: "recblubc63H3qNso3", placeId: "rec1Bq2htVzd8gJwy", },
      { title: "Learn About Personal AI", componentId: "recNww3zikCXTsz7Z", placeId: "rec1Bq2htVzd8gJwy", },
      { title: "Learn About Cellular Phone", componentId: "reciyeJc5l276Nn96", placeId: "recDtlwq338h5oNjl", },
    ],
  ];

  const bodyTop = document.body.getBoundingClientRect().top;
  // 7 scenarios
  const framesTop = [];
  for(let i = 1; i <= 7; i++) {
    const scenario = `section-scenario-${i}`;
    const element = document.getElementById(scenario);
    // 4 frames
    for(let k = 0; k < 4; k++) {
      const frame = element.querySelector(`[data-stepframe='${k}']`).getBoundingClientRect();
      const frameY = frame.top - bodyTop;
      framesTop.push({ scenario: i-1, frame: k, frameY, height: frame.height });
    }
  }

  function isAtFrame (frame) {
    const scrollTop = window.document.querySelector('html').scrollTop;
    return scrollTop + 150 > frame.frameY && scrollTop < (frame.frameY + frame.height / 2);
  }

  let currentFrame = null;
  function findFrame() {
    const scrollTop = window.document.querySelector('html').scrollTop;
    if (scrollTop < framesTop[0].frameY) return;
    if (scrollTop > (framesTop[27].frameY + framesTop[27].height / 2)) return;

    return framesTop.find(function (frame, i) {
      return isAtFrame(frame);
    });
  };

  function handleWindowScroll () {
    const chatClient = document.getElementById("chat-client");


    if (currentFrame && isAtFrame(currentFrame)) return;
    currentFrame = findFrame();

    if (!currentFrame) {
      chatClient.innerHTML = '';
      return;
    }

    const chatConfig = chatbotConfig[currentFrame.scenario][currentFrame.frame];

    window.addEventListener('df-response-received', function (evt) {
      const messageList = evt.target.shadowRoot
        .querySelector('df-messenger-chat').shadowRoot
        .querySelector('df-message-list').shadowRoot
        .getElementById('messageList');


        if (messageList.getElementsByClassName('bot-message').length <= 1) {
          setTimeout(function () {
            messageList.scrollTop = 0;
          }, 100);
        }
    });
    // Element is injected dynamically to allow chatConfig to be written into the chat client on start up
    // We make use of the user-id string which is passed to the Dialog-Flow fulfillment code to transport
    // a JSON formatted string of configuration information

    chatClient.innerHTML =
      `<df-messenger
        user-id={"agentId":"f92d33ee-bfa0-4c27-9a5d-852381c861c2","startingIntent":"learn-about-component","placeId":"${chatConfig.placeId}","componentId":"${chatConfig.componentId}"}
        intent="WELCOME"
        chat-title="${chatConfig.title}"
        agent-id="f92d33ee-bfa0-4c27-9a5d-852381c861c2"
        language-code="en"
        chat-icon="images/DTPR.png"
        wait-open="true"
      >
      </df-messenger>`;
  }

  window.document.addEventListener('scroll', handleWindowScroll);
  handleWindowScroll();
};

window.addEventListener('load', function () {
  mapScenariosFrames();
})
