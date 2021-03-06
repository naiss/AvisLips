;(function($){

	$.fn.avisLips = function(){

		/*
			METHODS CONTROLLERS	CLASSES
			Insert div with the following classe into an al-item to create controlls
			-------------------------------------------------------------------------
			playButton
			loop
			timeline
			volume
			mute

		*/

		var elements = [
				'duration',
				'currentTime',
				'currentSrc',
				'timeline',
				'volume',
				'mute'
			]

		var wrapper = $(this);

		wrapper
		.children('.al-item:not(.loaded)')
		.each((i,el) => {
			var alItem = $(el),
				audio = alItem.find('audio')[0],
				playButton = alItem.find('.playButton'),
				timeline = alItem.find('.timeline'),
				currentTime = alItem.find('.currentTime'),
				muteButton = alItem.find('.mute'),
				loopButton = alItem.find('.loop'),
				volume = alItem.find('.volume'),
				duration = alItem.find('.duration');

			$.each(elements,
				(i,el) => {
					var element = alItem.find('.'+el);

					if(element.length > 0){

						if(element.hasClass('currentTime')){
							element.html('0:00')
						}

						if(element.hasClass('currentSrc')){
							element.html(audio.currentSrc)
						}

						if(element.hasClass('timeline')){
							element.html('<progress value="0" max="1" class="current"></progress>')
						}

						if(element.hasClass('volume')){
							element.html('<progress value="0.5" max="1" class="current"></progress>')
						}
					}
				}
			)

			var timelineCurrent = timeline.find('.current');
			var controllerVolume = volume.find('.current');

			audio.onloadeddata = function(){
				duration.html(getTime(audio.duration))
			}

			audio.onpause = function(){
				playButton.removeClass('pause');
				playButton.removeClass('active');
				playButton.addClass('play');
			}

			audio.onplay = function(){
				playButton.removeClass('play');
				playButton.addClass('active');
				playButton.addClass('pause');
			}

			audio.ontimeupdate = function(){
				if(currentTime.length > 0){
					var ms = audio.currentTime;

					currentTime.html(getTime(ms))
				}

				if (timeline.length > 0) {
					timelineCurrent.attr('value',audio.currentTime/audio.duration)
				}
			}

			audio.onended = function(){
				setTimeout(function(){
					timelineCurrent.attr('value',0)
				},500);
			}

			playButton.click((e) => {
				if(audio.paused){
					$('audio').each((i,el) => {
						el.pause()
					})
					audio.play();
				}else audio.pause();
			})

			loopButton.click((e) => {
				var loop = alItem.find('.loop');
				if(audio.loop){
					loop.removeClass('active');
					audio.loop = false;
				}else {
					loop.addClass('active');
					audio.loop = true;
				}
			})

			muteButton.click((e) => {
				var mute = alItem.find('.mute');
				if(audio.muted){
					mute.removeClass('active');
					audio.muted = false;
				}else {
					mute.addClass('active');
					audio.muted = true;
				}
			})

			timelineCurrent.on('mousedown',function(e){
				var value = e.offsetX / $(this).width();
				if(value > 0.99){
					value = 1;
				}else if(value < 0.01){
					value = 0;
				}

				this.value = value;

				var alItem = $(this).closest('.al-item'),
					audio = alItem.find('audio')[0];

				audio.currentTime = audio.duration * value;
			})

			controllerVolume.on('mousedown',function(e){
				var value = e.offsetX / $(this).width();
				if(value > 0.99){
					value = 1;
				}else if(value < 0.01){
					value = 0;
				}

				this.value = value;

				var alItem = $(this).closest('.al-item'),
					audio = alItem.find('audio')[0];

					audio.volume = value;
				
			})

			alItem.addClass('loaded');
			
		})


	}

})(jQuery);


function getTime(ms) {

	var secs = ms.toFixed(0),
		min = 0;

	while(secs >= 60){
		secs -= 60;
		min++;
	}

	if(secs < 10){
		secs = ('0' + secs).slice(-2)
	}

	return min+':'+secs;
}
