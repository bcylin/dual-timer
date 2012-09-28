/**
  * TimerApp
  * https://github.com/bcylin/tools
  *
  * Created by Ben on 28/Sep/2012
  * Licensed under the MIT License | http://opensource.org/licenses/MIT
  */

;(function($, window, document, undefined) {

// Controlls digits counting down
var ClockViewController = {

	$clock: null,
	time: null,
	delegate: null,

	isPaused: true,
	queue: 0,

	// default setting
	config: {
		decimal: 1,
		startTime: 10,	// in seconds
		interval: 100	// in milliseconds
	},

	init: function(elem, options) {
		var defaults = this.config;
		this.config = $.extend(defaults, options);

		// calculate decimal points needed for time interval
		var timeFraction = (this.config.interval < 1000) ? 1000 / this.config.interval : 1;
		this.config.decimal = Math.round( Math.log(timeFraction) / Math.LN10 );

		this.$clock = $(elem);
		this.time = this.config.startTime;
		this.syncClock();
	},

	start: function() {
		this.isPaused = false;
		if (this.queue <= 0) {
			this.countDown();
		}
	},

	pause: function() {
		this.isPaused = true;
	},

	reset: function() {
		this.isPaused = true;
		this.time = this.config.startTime;
		this.syncClock();
	},

	countDown: function () {

		this.syncClock();

		// reach the end of counting
		if (this.time <= 0) {
			this.delegate.clockViewControllerDidReachEndOfCounting();
			return;
		}

		var self = this;
		self.queue += 1;
		setTimeout(function() {
			self.queue -= 1;
			// check running status
			if (self.isPaused) { return; }
			// count down
			self.time -= self.config.interval / 1000;
			self.countDown();
		}, this.config.interval);
	},

	syncClock: function() {
		// keep a specified number of decimals
		this.time = parseFloat(this.time).toFixed(this.config.decimal);
		this.$clock.val(this.time);
	}
};

// Controlls behaviour responding to events
var PanelViewController = {

	startBtn: null,
	resetBtn: null,
	loopSwitch: null,
	delegate: null,

	init: function(elem) {
		this.$elem = $(elem);
		this.$startBtn = this.$elem.find('#start');
		this.$resetBtn = this.$elem.find('#reset');
		this.$loopSwitch = this.$elem.find('#loop');
		this.resetButtons();
		this.bindEvents();
	},

	bindEvents: function() {

		var self = this,
			$startBtnLabel = this.$startBtn.find('.ui-btn-text');

		this.$startBtn.on('click', function() {
			switch ( $startBtnLabel.text() ) {
				case 'Pause':
					$startBtnLabel.text('Start');
					self.delegate.panelViewControllerDidClickPause();
					break;
				// set start as the default behaviour
				case 'Start':
				default:
					$startBtnLabel.text('Pause');
					self.delegate.panelViewControllerDidClickStart();
					break;
			}
		});

		this.$resetBtn.on('click', function() {
			self.delegate.panelViewControllerDidClickReset();
		});

		this.$loopSwitch.on('change', function() {
			self.delegate.panelViewControllerDidSwitchLoop( $(this).val() === 'on' );
		});
	},

	resetButtons: function() {
		this.$startBtn.find('.ui-btn-text').text('Start');
		this.$resetBtn.find('.ui-btn-text').text('Reset');
	}
};

// Object that handles all functions
var TimerAppController = {

	clockViewControllers: [],
	currentClockViewController: null,
	panelViewController: null,
	shouldLoop: false,

	init: function(elem, options) {
		this.$elem = $(elem);

		// initiate clock view controllers
		var self = this;
		this.$elem.find('.clock').each(function(index, element) {
			var clockVC = Object.create( ClockViewController );
			clockVC.init(element, options);
			clockVC.delegate = self;
			self.clockViewControllers.push(clockVC);
		});
		this.currentClockViewController = this.clockViewControllers[0];

		// initiate panel view controller
		this.panelViewController = Object.create( PanelViewController );
		this.panelViewController.init( elem );
		this.panelViewController.delegate = this;
	},

	resetAllClockViewControllers: function() {
		this.clockViewControllers.forEach(function(controller, index, array) {
			controller.reset();
		});
	},

	panelViewControllerDidClickStart: function() {
		this.currentClockViewController.start();
	},

	panelViewControllerDidClickPause: function() {
		this.currentClockViewController.pause();
	},

	panelViewControllerDidClickReset: function() {
		this.resetAllClockViewControllers();
		this.panelViewController.resetButtons();
	},

	panelViewControllerDidSwitchLoop: function(switched) {
		this.shouldLoop = switched;
	},

	clockViewControllerDidReachEndOfCounting: function() {
		var index = this.clockViewControllers.indexOf( this.currentClockViewController );
		if (index < this.clockViewControllers.length - 1) {
			// go to the next clock
			currentClockViewController = this.clockViewControllers[index + 1];
		} else if (this.shouldLoop) {
			// go back to the first clock and keep running
			this.resetAllClockViewControllers();
			currentClockViewController = this.clockViewControllers[0];
			currentClockViewController.start();
		} else {
			// reach the end
			this.panelViewController.resetButtons();
		}
	}
};

window.TimerAppController = TimerAppController;

})(jQuery, window, document);