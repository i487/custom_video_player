<template>
    <div class="w-4/5 p-8 bg-gray-800 rounded flex justify-center">
    <div class="relative w-3/5">
        <div class="cursor-pointer relative" id="player">
            <video :src="url" class="w-full rounded" ref="videoElem">
            </video>
            <div class="absolute top-0 w-full h-full flex justify-center items-center bg-gray-200 opacity-50 rounded
            transition duration-200 ease-in-out "
            :class="played ? 'invisible' : '' " >
                <i @click="play" class="fas fa-play-circle text-5xl opacity-100"></i>
            </div>
        </div>
        <div class="flex gap-4 items-end">
            <h2 class="text-3xl text-white mt-2"> {{ author }} :</h2>
            <h2 class="text-xl text-white mt-2"> {{ name }} </h2>
        </div>
        <div class="h-16 bg-gray-700 flex flex-col gap-4 w-full opacity-0
            transition duration-200 ease-in-out hover:opacity-100
            absolute bottom-10 
             ">
            <div class="bg-white h-1.5 cursor-pointer" @click="skipVideo">
                <div :style="{width: progressPercentage() + '%'}" class="bg-yellow-700 w-2/3 h-full rounded"></div>
            </div>
            <div class="controls flex justify-between px-8">
                <div class="flex gap-8">
                    <div class="flex gap-4 items-center">
                        <button @click="back">
                            <i class="fa fa-backward text-white" aria-hidden="true"></i>
                        </button>
                        <button v-on:keyup.tab="play" v-if="isPaused()" @click="play">
                            <i class="fa fa-fw fa-play text-white"></i>
                        </button>
                        <button v-if="!isPaused()" @click="pause">
                            <i class="fa fa-fw fa-pause text-white"></i>
                        </button>
                        <button @click="next">
                            <i class="fa fa-forward text-white" aria-hidden="true"></i>
                        </button>
                    </div>
                    <div class="flex items-center gap-4">
                        <button v-if="isMuted()" @click="muteToggle">
                            <i class="fa fa-fw fa-volume-off text-white"></i>
                        </button>
                        <button v-if="!isMuted()" @click="muteToggle">
                            <i class="fa fa-fw fa-volume-up text-white"></i>
                        </button>
                        <div class="w-24 h-1.5 bg-white cursor-pointer rounded" @click="changeVolume">
                            <div :style="{ width: volume() + '%' }" class="w-1/3 bg-yellow-700 h-full rounded"></div>
                        </div>
                    </div>
                </div>
                <div class="flex gap-8 items-center">
                    <div>
                        <span class="text-white"> {{formatTime(currentTime())}} </span>
                        <span class="text-white"> / </span>
                        <span class="text-white"> {{formatTime(durationTime())}} </span>
                    </div>
                    <div>
                        <button v-if="isFullScreen" @click="toggleFullScreen()">
                            <i class="fa fa-fw fa-compress text-white"></i>
                        </button>
                        <button v-if="!isFullScreen" @click="toggleFullScreen()">
                            <i class="fa fa-fw fa-expand text-white"></i>
                        </button>
                    </div>
                    <div class="relative">
                        <button @click="show">
                            <i class="fa fa-ellipsis-v text-white" aria-hidden="true"></i>
                        </button>
                        <div class="flex flex-col gap-4 justify-center
                            opacity-0
                            p-4 bg-gray-200 rounded 
                            absolute bottom-8 -right-6 " :class="showMe ? 'opacity-100' : '' ">
                            <button @click="speed1" class="text-gray-800"> 1.5x </button>
                            <button @click="speed2" class="text-gray-800"> 2x </button>
                            <button @click="speed3" class="text-gray-800"> 3x </button>
                            <button @click="speedNorm" class="text-gray-800"> 1 </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
    </div>
</template>
<script>
    export default {
        name: 'Player',
        props: ['url', 'name', 'author'],
        data() {
            return {
                isFullScreen: false,
                showMe: false,
                played: false,
            }
        },
        mounted: function () {

            let events = [
                'timeupdate',
                'volumechange',
                'seeked',
                'loadedmetadata'

            ];
            events.map(e => {
                this.$refs.videoElem.addEventListener(e, () => {
                    this.$forceUpdate()
                })
            });
            this.$refs.videoElem.addEventListener('loadedmetadata', () => {
                this.$refs.videoElem.volume = 0.3
                this.$forceUpdate()
            });
            this.$refs.videoElem.addEventListener('click', () => {
                if (this.isPaused()) {
                    this.play()
                } else {
                    this.pause()
                }
            });



        },
        methods: {
            // play and pause methods
            isPaused: function () {
                return this.$refs.videoElem ? this.$refs.videoElem.paused : true;
            },
            play: function () {
                this.$refs.videoElem.play()
                this.played = !this.played
            },
            pause: function () {
                this.$refs.videoElem.pause()
            },
            // volume methods
            muteToggle: function () {
                this.$refs.videoElem.muted = !this.$refs.videoElem.muted
            },
            isMuted: function () {
                return this.$refs.videoElem ? this.$refs.videoElem.muted : false;
            },
            // track bar / progress bar methods
            durationTime: function () {
                return this.$refs.videoElem?.duration || 0
            },
            currentTime: function () {
                return this.$refs.videoElem?.currentTime || 0
            },
            progressPercentage: function () {
                return (this.currentTime() / this.durationTime()) * 100;
            },
            // format time methods
            formatTime: function (time) {
                if (!time || !parseInt(time)) {
                    return `00:00`;
                }
                let hours, minutes, seconds;
                minutes = Math.floor(((time / 60) % 60));
                seconds = Math.floor(time % 60);
                hours = Math.floor(time / 60 / 60);
                if (minutes < 10) minutes = `0${minutes}`
                if (seconds < 10) seconds = `0${seconds}`
                return `${hours ? hours + ':' : ''}${minutes}:${seconds}`
            },
            // skipping video methods
            skipVideo(event) {
                let wrapper_offset = event.currentTarget.getBoundingClientRect().left;
                let clicked_offset = event.clientX - wrapper_offset;
                let progress_width = (clicked_offset / event.currentTarget.getBoundingClientRect().width) * 100;
                let newTime = (this.durationTime() / 100) * progress_width;
                this.$refs.videoElem.currentTime = newTime
            },
            // full screen

            toggleFullScreen() {
                this.isFullScreen = !this.isFullScreen;
            },

            // change volume
            changeVolume: function (event) {
                let wrapper_offset = event.currentTarget.getBoundingClientRect().left;
                let clicked_offset = event.clientX - wrapper_offset;
                let volume_bar_width = (clicked_offset / event.currentTarget.getBoundingClientRect().width) * 100;
                this.$refs.videoElem.volume = volume_bar_width / 100;
            },
            volume: function () {
                return this.$refs.videoElem ? this.$refs.videoElem.volume * 100 : 0;
            },
            // speed of video and related methods

            show: function () {
                this.showMe = !this.showMe
            },
            speed1: function () {
                this.$refs.videoElem.playbackRate = 1.5;
            },
            speed2: function () {
                this.$refs.videoElem.playbackRate = 2;
            },
            speed3: function () {
                this.$refs.videoElem.playbackRate = 3;
            },
            speedNorm: function () {
                this.$refs.videoElem.playbackRate = 1;
            },
            // next and back functions
            next: function() {
                this.$emit('next')
                console.log('ish qivomman')
            },
            back: function() {
                this.$emit('back')
                console.log('ishlar qivomman')
            },
        }
    }
</script>