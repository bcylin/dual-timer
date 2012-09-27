/**
  *	countDownTimer plugin
  *
  *	Ver 0.1 created by Ben on 23/Jun/2012
  */

(function($, window, document, undefined) {

// Controlls digits counting down
var ClockViewController = {

	timeLabel: null,
	time: null,
	isPaused: null,
	delegate: null,

	init: function() {},
	start: function() {},
	pause: function() {},
	reset: function() {},

	countDown: function() {}
};

// Controlls behaviour that responds to events
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

		this.$resetBtn.on('click', self.delegate.panelViewControllerDidClickReset);
	},

	resetButtons: function() {
		this.$startBtn.find('.ui-btn-text').text('Start');
		this.$resetBtn.find('.ui-btn-text').text('Reset');
	}
};

// Object for plugin to initiate
var TimerAppController = {

	clockViewControllers: [],
	currentClockViewController: null,
	panelViewController: null,
	shouldLoop: false,

	init: function() {},
	panelViewControllerDidClickStart: function() {},
	panelViewControllerDidClickPause: function() {},
	panelViewControllerDidClickReset: function() {},
	panelViewControllerDidToogleLoop: function() {},
	clockViewControllerDidReachEndOfCounting: function() {}
};

var count = 0;

// PUBLIC CLASS DEFINITION
var Timer = {

	init: function(options, elem) {

		var self = this;

		self.elem = elem;
		self.$elem = $(elem);

		self.opt = $.extend( {}, $.fn.countDownTimer.options, options );

		var timeFraction = (self.opt.interval < 1000) ? 1000 / self.opt.interval : 1;
		self.condition = {
			decimal: Math.round( Math.log(timeFraction) / Math.LN10 ),
			running: false,
			pause: true
		};

		self.clock = self.$elem.find('#clock');
		var time = parseFloat(self.clock.val());

		self.time = (!isNaN(time) && time > 0) ? time : parseFloat(self.opt.seconds);
		self.clock.val(self.time.toFixed(self.condition.decimal));

		self.startBtn = self.$elem.find('#start');
		self.resetBtn = self.$elem.find('#reset');
		self.loopSwitch = self.$elem.find('#loop');
		this.startBtn.find('.ui-btn-text').text('Start');
		this.resetBtn.find('.ui-btn-text').text('Reset');
		self.opt.loop = (self.loopSwitch.val() === 'on') ? true : false;

		self.bindEvents();
	},

	bindEvents: function() {
		var self = this;

		this.clock.on('change', function() {
			// console.log('change');
		});

		this.startBtn.on('click', function() {
			var time = parseFloat(self.clock.val());
			if (!isNaN(time) && time > 0)
				self.time = time;

			self.countDown();
			self.condition.running = !self.condition.running;
			var txt = self.condition.running ? 'Stop' : 'Start';
			$(this).find('.ui-btn-text').text(txt);
		});

		this.resetBtn.on('click', function() {
			self.reset();
			self.clock.val(self.opt.seconds.toFixed(self.condition.decimal));
		});

		this.loopSwitch.on('change', function() {
			self.opt.loop = ($(this).val() === 'on') ? true : false;
		});
	},

	countDown: function() {

		var self = this;
		self.clock.val(self.time.toFixed(self.condition.decimal));

		if (self.time <= 0) {
			self.reset();
			return;
		};

		setTimeout(function() {
			if (!self.condition.running)
				return;
			self.time -= self.opt.interval / 1000;
			if (self.opt.loop)
				self.time = (self.time <= 0) ? self.opt.seconds : self.time;
			else
				self.time = (self.time <= 0) ? 0 : self.time;
			self.countDown();
		}, self.opt.interval);
	},

	reset: function() {
		this.condition.running = false;
		this.time = this.opt.seconds;
		this.startBtn.find('.ui-btn-text').text('Start');
	}
};

// PLUGIN DEFINITION
$.fn.countDownTimer = function(options) {

	return this.each(function() {
		var timer = Object.create( Timer );
		timer.init(options, this);
		$.data(this, 'countDownTimer', timer);
	});
};

$.fn.countDownTimer.options = {
	seconds: 10,
	decimal: 1,
	interval: 100,
	loop: true
};

})(jQuery, window, document);