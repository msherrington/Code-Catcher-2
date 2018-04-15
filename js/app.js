$(() => {

  // two lines for scroll lock
  $('body').css('overflow','hidden');
  $('body').attr('scroll','no');

  // vars for page jump buttons
  const $instructionBtn = $('.instruct');
  const $playBtn = $('.play');
  const $playBtn2 = $('#play2');

  // var for instructions page
  const $instructionPage = $('.instructions');

  // var for button to start game play
  const $startBtn = $('#startBtn');

  // vars for sounds
  const $buzz = $('#buzz');
  const $pop = $('#pop');
  const $backgroundMusic = $('#background-music');
  const $gameMusic = $('#game-track');

  // var for gameplay area
  const $codewall = $('.codewall');

  // code catcher guy
  const $coder = $('#coder');

  // var for falling divs
  const $fallingDivs = $('.column');

  // variables for timer
  const $timer = $('.timer');
  let timeRemaining = 60;
  let timer = null;

  // variables for scoreboard
  const $scoreDisplay = $('.score-display');
  const $scoreBoard = $('.score-board');
  let $score = 0;

  // set music volume and play background music
  $backgroundMusic.prop('volume', 0.1);
  $backgroundMusic[0].play();

  // hide falling divs before game starts
  $fallingDivs.hide();
  // hide instructionPage before game starts
  $instructionPage.hide();
  // hide instructionPage play button before game starts
  $playBtn2.hide();
  // hide timer before game starts
  $timer.hide();
  // hide scoreBoard before game starts
  $scoreBoard.hide();

  // event listener for arrrow keys to move coder
  let pressed = false;
  $(document).on('keydown', (e) => {
    if(!pressed){ //start the coder moving (once only)
      const width = $codewall.width();
      switch (e.which) {
        case 37:  //left arrow key
          $coder.stop().animate({
            left: '-=' + width //allow coder to move along whole codewall
          }, 1500);
          break;
        case 39:  //right arrow key
          $coder.stop().animate({
            left: '+=' + width //allow coder to move along whole codewall
          }, 1500);
          break;
      }
    }
    pressed = true;
  }).on('keyup', () => {
    $coder.stop(); //stop the coder moving
    pressed = false;
    if ($coder.position().left < -35) {
      $coder.animate({
        left: -35
      });
    } else if ($coder.position().left > 835) {
      $coder.animate({
        left: 835
      });
    }
  });

  // variable for the speed of falling items (in millisecs)
  let dropSpeed = 3000;

  // show hidden elements, reset score+timer at start of game play
  function startGamePlay() {
    $timer.show();
    $coder.show();
    $scoreBoard.show();
    $scoreDisplay.text(0);
    $timer.text(60);
  }

  // timer countdown function
  function startTime() {
    startGamePlay();
    timer = setInterval(() => {
      if (timeRemaining > 0) {
        imageDrop();
        timeRemaining--;
        dropSpeed = dropSpeed - 45;
        $timer.html(timeRemaining);
      } else if (timeRemaining === 0) {
        resetGamePlay();
      }
    }, 1000);
  }

  // clear timer and hide game elements at end of game
  function resetGamePlay() {
    clearInterval(timer);
    timeRemaining = 60;
    dropSpeed = 3000;
    $score = 0;
    $coder.hide().animate({
      left: 400
    });
    $startBtn.html('Play again?').show();
    $timer.hide();
  }

  // stops coder shaking after catching a bug image
  function shakeReset() {
    $coder.removeClass('shaking');
  }

  // array to assign image to falling div
  const images = [ 'html', 'html', 'html', 'html', 'html', 'html', 'css', 'css', 'css', 'css', 'bug', 'bug', 'bug', 'bug', 'bug', 'javascript', 'javascript', 'javascript'];


  function imageDrop(){
    // chooses random div to animate (falling)
    let $randomDiv = $fallingDivs.eq(Math.floor(Math.random()*$fallingDivs.length));
    // if randomDiv is already animated, choose another
    while($randomDiv.is(':animated')) {
      $randomDiv = $fallingDivs.eq(Math.floor(Math.random()*$fallingDivs.length));
    }

    // chooses random image and class to assign to falling div
    const chosenImage = images[Math.floor(Math.random() * images.length)];
    // assigns random img to falling div and changes class
    $randomDiv
      .find('img')
      .attr('src', `assets/images/${chosenImage}.png`)
      .attr('class', chosenImage);

    // variable to store value of previous falling image caught by coder
    let catchResult = null;

    // fades-in random div with image, animates div to make it fall
    $randomDiv.fadeIn().animate({
      top: 500
    }, {
      duration: dropSpeed,
      easing: 'linear',
      complete: resetDiv,
      progress: function() {
        if (($(this).position().top >= 460) && ($coder.position().left < ($(this).position().left + 20)) && ($coder.position().left > ($(this).position().left) - 20)) {
          $coder.stop(); // stops coder after a catch, to stop him flying off the screen
          pressed = false;
          // if coder catches bug, -5 points, shake coder
          if (chosenImage === 'bug' && catchResult === null) {
            $buzz[0].play();
            catchResult = 'bug';
            $coder.addClass('shaking');
            $score = $score - 500;
            $scoreDisplay.text($score);
            pressed = true;
            setTimeout(shakeReset, 500);
          // if coder catches html, +1 point
          } else if (chosenImage === 'html' && catchResult === null) {
            $pop[0].play();
            catchResult = 'html';
            $score = $score + 100;
            $scoreDisplay.text($score);
          // if coder catches css, +3 points
          } else if (chosenImage === 'css' && catchResult === null) {
            $pop[0].play();
            catchResult = 'css';
            $score = $score + 200;
            $scoreDisplay.text($score);
          // if coder catches javascript, +5 points
          } else if (chosenImage === 'javascript' && catchResult === null) {
            $pop[0].play();
            catchResult = 'javascript';
            $score = $score + 300;
            $scoreDisplay.text($score);
          }
        }
      }
    });
  }

  // reset the falling div to the top and hide it again
  function resetDiv() {
    $(this).css({
      top: 0
    });
    $(this).hide();
  }

  // event listener for play button
  $playBtn.on('click', jumpToGame);

  // function for play button
  function jumpToGame() {
    $('html, body').animate({ scrollTop: $(document).height() }, 2000);
  }

  // event listener for instructions button
  $instructionBtn.on('click', showInstructions);

  // function for instructions button
  function showInstructions() {
    $('html, body').animate({ scrollTop: $(document).height() - 1830 }, 2000);
    $instructionPage.show();
    $playBtn2.show();
  }

  // event listener for start button
  $startBtn.on('click', startGame);

  // function for start button
  function startGame() {
    $backgroundMusic[0].pause();
    $gameMusic.prop('volume', 0.1);
    $gameMusic[0].play();
    $startBtn.hide();
    startTime();
  }

});
