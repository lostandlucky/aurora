<template>
    <div class="noselect">
        <div class="panel">
            <div class="channel">
                <span class="channel-label" title="Modulation">M</span>

                <div class="channel-value modulation">
                    <vue-modulation />
                </div>
            </div>
        </div>

        <div class="panel">
            <div class="channel">
                <span class="channel-label" title="Master">#</span>

                <div class="channel-value">
                    <input type="text" :value="Number.isNaN(hex) ? '' : hex" :placeholder="Number.isNaN(hex) ? 'Calculated' : ''" spellcheck="false" class="input channel-input" @click.stop="focus('master')" @blur="updateHex" @keyup.enter="updateHex">

                    <ul v-if="focused === 'master'" class="channel-presets">
                        <li v-for="preset in masterPresets" class="preset" @click="applyPreset(preset)">
                            <span class="preset-name">{{preset.name}}</span>

                            <ul class="preset-tags">
                                <li v-for="tag in preset.tags" class="tag">{{tag}}</li>
                            </ul>
                        </li>
                    </ul>

                    <input type="color" :value="Number.isNaN(hex) ? '#ffffff' : hex" class="channel-color channel-input" @input="updateHex">
                </div>
            </div>
        </div>

        <div class="panel">
            <div class="channel">
                <span class="channel-label" title="Red">R</span>

                <div class="channel-value">
                    <input type="text" :value="Number.isNaN(redInterpreted) ? '' : redInterpreted" :placeholder="Number.isNaN(redInterpreted) ? 'Calculated' : ''" spellcheck="false" class="input channel-input" @click.stop="focus('red')" @blur="updateRed" @keyup.enter="updateRed">

                    <ul v-if="focused === 'red'" class="channel-presets">
                        <li v-for="preset in redPresets" class="preset" :class="{selected: red === preset.values.red}" @click="applyPreset(preset, 'red')">
                            <span class="preset-name">{{preset.name}}</span>

                            <ul class="preset-tags">
                                <li v-for="tag in preset.tags" class="tag">{{tag}}</li>
                            </ul>
                        </li>
                    </ul>

                    <div class="channel-picker" :style="redGradient">
                        <input type="range" min="0" max="255" :value="redFixed" class="channel-slider red" @input="updateRed">
                    </div>
                </div>
            </div>

            <div class="channel">
                <span class="channel-label" title="Green">G</span>

                <div class="channel-value">
                    <input type="text" :value="Number.isNaN(greenInterpreted) ? '' : greenInterpreted" :placeholder="Number.isNaN(greenInterpreted) ? 'Calculated' : ''" spellcheck="false" class="input channel-input" @click.stop="focus('green')" @blur="updateGreen" @keyup.enter="updateGreen">

                    <ul v-if="focused === 'green'" class="channel-presets">
                        <li v-for="preset in greenPresets" class="preset" :class="{selected: green === preset.values.green}" @click="applyPreset(preset, 'green')">
                            <span class="preset-name">{{preset.name}}</span>

                            <ul class="preset-tags">
                                <li v-for="tag in preset.tags" class="tag">{{tag}}</li>
                            </ul>
                        </li>
                    </ul>

                    <div class="channel-picker" :style="greenGradient">
                        <input type="range" min="0" max="255" :value="greenFixed" class="channel-slider green" @input="updateGreen">
                    </div>
                </div>
            </div>

            <div class="channel">
                <span class="channel-label" title="Blue">B</span>

                <div class="channel-value">
                    <input type="text" :value="Number.isNaN(blueInterpreted) ? '' : blueInterpreted" :placeholder="Number.isNaN(blueInterpreted) ? 'Calculated' : ''" spellcheck="false" class="input channel-input" @click.stop="focus('blue')" @blur="updateBlue" @keyup.enter="updateBlue">

                    <ul v-if="focused === 'blue'" class="channel-presets">
                        <li v-for="preset in bluePresets" class="preset" :class="{selected: blue === preset.values.blue}" @click="applyPreset(preset, 'blue')">
                            <span class="preset-name">{{preset.name}}</span>

                            <ul class="preset-tags">
                                <li v-for="tag in preset.tags" class="tag">{{tag}}</li>
                            </ul>
                        </li>
                    </ul>

                    <div class="channel-picker" :style="blueGradient">
                        <input type="range" min="0" max="255" :value="blueFixed" class="channel-slider blue" @input="updateBlue">
                    </div>
                </div>
            </div>
        </div>

        <div class="panel">
            <div class="channel">
                <span class="channel-label" title="Hue">H</span>

                <div class="channel-value">
                    <input type="text" :value="Number.isNaN(hueInterpreted) ? '' : hueInterpreted" :placeholder="Number.isNaN(hueInterpreted) ? 'Calculated' : ''" spellcheck="false" class="input channel-input" @click.stop="focus('hue')" @blur="updateHue" @keyup.enter="updateHue">

                    <ul v-if="focused === 'hue'" class="channel-presets">
                        <li v-for="preset in huePresets" class="preset" :class="{selected: hue === preset.values.hue}" @click="applyPreset(preset, 'hue')">
                            <span class="preset-name">{{preset.name}}</span>

                            <ul class="preset-tags">
                                <li v-for="tag in preset.tags" class="tag">{{tag}}</li>
                            </ul>
                        </li>
                    </ul>

                    <div class="channel-picker" :style="hueGradient">
                        <input type="range" min="0" max="360" :value="hueFixed" class="channel-slider hue" @input="updateHue">
                    </div>
                </div>
            </div>

            <div class="channel">
                <span class="channel-label" title="Saturation">S</span>

                <div class="channel-value">
                    <input type="text" :value="Number.isNaN(saturationInterpreted) ? '' : saturationInterpreted" :placeholder="Number.isNaN(saturationInterpreted) ? 'Calculated' : ''" spellcheck="false" class="input channel-input" @click.stop="focus('saturation')" @blur="updateSaturation" @keyup.enter="updateSaturation">

                    <ul v-if="focused === 'saturation'" class="channel-presets">
                        <li v-for="preset in saturationPresets" class="preset" :class="{selected: saturation === preset.values.saturation}" @click="applyPreset(preset, 'saturation')">
                            <span class="preset-name">{{preset.name}}</span>

                            <ul class="preset-tags">
                                <li v-for="tag in preset.tags" class="tag">{{tag}}</li>
                            </ul>
                        </li>
                    </ul>

                    <div class="channel-picker" :style="saturationGradient">
                        <input type="range" min="0" max="1" step="0.01" :value="saturationFixed" class="channel-slider saturation" @input="updateSaturation">
                    </div>
                </div>
            </div>

            <div class="channel">
                <span class="channel-label" title="Value">V</span>

                <div class="channel-value">
                    <input type="text" :value="Number.isNaN(valueInterpreted) ? '' : valueInterpreted" :placeholder="Number.isNaN(valueInterpreted) ? 'Calculated' : ''" spellcheck="false" class="input channel-input" @click.stop="focus('value')" @blur="updateValue" @keyup.enter="updateValue">

                    <ul v-if="focused === 'value'" class="channel-presets">
                        <li v-for="preset in valuePresets" class="preset" :class="{selected: value === preset.values.value}" @click="applyPreset(preset, 'value')">
                            <span class="preset-name">{{preset.name}}</span>

                            <ul class="preset-tags">
                                <li v-for="tag in preset.tags" class="tag">{{tag}}</li>
                            </ul>
                        </li>
                    </ul>

                    <div class="channel-picker" :style="valueGradient">
                        <input type="range" min="0" max="1" step="0.01" :value="valueFixed" class="channel-slider value" @input="updateValue">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import convert from 'color-convert';
    import {mapState} from 'vuex';

    import debounce from '../../js/utils/debounce.js';

    import Modulation from '../modulation/modulation.vue';

    const methodMap = {
        hex: 'updateHex',
        red: 'updateRed',
        green: 'updateGreen',
        blue: 'updateBlue',
        hue: 'updateHue',
        saturation: 'updateSaturation',
        value: 'updateValue'
    };

    // proxy value from event or value argument, do not fire if value is falsy (prevents defaulting to black when defocusing from calculated, thus empty, channel)
    const checkValue = function(func) {
        return function(event, customValue) {
            const context = this;
            const value = event ? event.target.value : customValue;

            if(value !== '') {
                func.apply(context, [value]);
            }
        };
    };

    export default {
        components: {
            'vue-modulation': Modulation
        },
        data() {
            return {
                focused: null
            };
        },
        computed: {
            ...mapState({
                red(state) { return state.pattern.red; },
                green(state) { return state.pattern.green; },
                blue(state) { return state.pattern.blue; },
                hue(state) { return state.pattern.hue; },
                saturation(state) { return state.pattern.saturation; },
                value(state) { return state.pattern.value; },
                masterPresets(state) { return state.presets.presets.filter(preset => preset.targets.includes('master')); },
                redPresets(state) { return state.presets.presets.filter(preset => preset.targets.includes('red')); },
                greenPresets(state) { return state.presets.presets.filter(preset => preset.targets.includes('green')); },
                bluePresets(state) { return state.presets.presets.filter(preset => preset.targets.includes('blue')); },
                huePresets(state) { return state.presets.presets.filter(preset => preset.targets.includes('hue')); },
                saturationPresets(state) { return state.presets.presets.filter(preset => preset.targets.includes('saturation')); },
                valuePresets(state) { return state.presets.presets.filter(preset => preset.targets.includes('value')); }
            }),
            hex() {
                if(Number.isNaN(this.red) || Number.isNaN(this.green) || Number.isNaN(this.blue)) {
                    return NaN;
                }

                return '#' + convert.rgb.hex(this.red, this.green, this.blue).toLowerCase();
            },
            redFixed() { return isNaN(this.red) ? 0 : Math.round(this.red); },
            greenFixed() { return isNaN(this.green) ? 0 : Math.round(this.green); },
            blueFixed() { return isNaN(this.blue) ? 0 : Math.round(this.blue); },
            hueFixed() { return isNaN(this.hue) ? 0 : this.hue; },
            saturationFixed() { return isNaN(this.saturation) ? 1 : this.saturation; },
            valueFixed() { return isNaN(this.value) ? 1 : this.value; },
            redInterpreted() {
                if(Number.isNaN(this.red)) { return NaN; }
                if(isNaN(this.red)) { return this.red; }

                return Math.round(this.red);
            },
            greenInterpreted() {
                if(Number.isNaN(this.green)) { return NaN; }
                if(isNaN(this.green)) { return this.green; }

                return Math.round(this.green);
            },
            blueInterpreted() {
                if(Number.isNaN(this.blue)) { return NaN; }
                if(isNaN(this.blue)) { return this.blue; }

                return Math.round(this.blue);
            },
            hueInterpreted() {
                if(Number.isNaN(this.hue)) { return NaN; }
                if(isNaN(this.hue)) { return this.hue; }

                return Math.round(this.hue);
            },
            saturationInterpreted() {
                if(Number.isNaN(this.saturation)) { return NaN; };
                if(isNaN(this.saturation)) { return this.saturation; };

                return Number(this.saturation).toFixed(2);
            },
            valueInterpreted() {
                if(Number.isNaN(this.value)) { return NaN; };
                if(isNaN(this.value)) { return this.value; };

                return Number(this.value).toFixed(2);
            },
            redGradient() {
                return {
                    background: `linear-gradient(to right, rgb(0, ${this.greenFixed}, ${this.blueFixed}), rgb(255, ${this.greenFixed}, ${this.blueFixed}))`
                };
            },
            greenGradient() {
                return {
                    background: `linear-gradient(to right, rgb(${this.redFixed}, 0, ${this.blueFixed}), rgb(${this.redFixed}, 255, ${this.blueFixed}))`
                };
            },
            blueGradient() {
                return {
                    background: `linear-gradient(to right, rgb(${this.redFixed}, ${this.greenFixed}, 0), rgb(${this.redFixed}, ${this.greenFixed}, 255))`
                };
            },
            hueGradient() {
                return {
                    background: `linear-gradient(to right, ${this.hueToHex(0)}, ${this.hueToHex(60)}, ${this.hueToHex(120)}, ${this.hueToHex(180)}, ${this.hueToHex(240)}, ${this.hueToHex(300)}, ${this.hueToHex(360)})`
                };
            },
            saturationGradient() {
                return {
                    background: `linear-gradient(to right, ${this.saturationToHex(0)}, ${this.saturationToHex(1)})`
                };
            },
            valueGradient() {
                return {
                    background: `linear-gradient(to right, ${this.valueToHex(0)}, ${this.valueToHex(1)})`
                };
            }
        },
        methods: {
            focus(channel) { this.focused = channel; },
            updateHex: debounce(checkValue(function(value) {
                this.$store.dispatch('hex', value);
            }), 10),
            updateRed: checkValue(function(value) { this.$store.dispatch('red', value); }),
            updateGreen: checkValue(function(value) { this.$store.dispatch('green', value); }),
            updateBlue: checkValue(function(value) { this.$store.dispatch('blue', value); }),
            updateHue: checkValue(function(value) { this.$store.dispatch('hue', value); }),
            updateSaturation: checkValue(function(value) { this.$store.dispatch('saturation', value); }),
            updateValue: checkValue(function(value) { this.$store.dispatch('value', value); }),
            applyPreset(preset, channel) {
                Object.keys(preset.values).forEach(key => {
                    // only apply to source channel, unless none is specified (master)
                    if(channel === undefined || key === channel) {
                        this[methodMap[key]](null, preset.values[key]);
                    }
                });
            },
            hueToHex(hue) { return '#' + convert.hsv.hex(hue, this.saturationFixed * 100, this.valueFixed * 100); },
            saturationToHex(saturation) { return '#' + convert.hsv.hex(this.hueFixed, saturation * 100, this.valueFixed * 100); },
            valueToHex(value) { return '#' + convert.hsv.hex(this.hueFixed, this.saturationFixed * 100, value * 100); }
        },
        mounted() {
            document.addEventListener('click', event => {
                this.focused = null;
            });
        }
    };
</script>

<style scoped lang="sass">
    @import '../../css/theme';

    .channel {
        display: flex;

        &:not(:last-child) {
            margin: 0 0 1rem 0;
        }
    }

    .channel-label {
        color: $grey2;
        display: flex;
        align-items: center;
        padding: 0 1rem 0 0;
        font-size: .8rem;
        font-weight: bold;
        cursor: default;
    }

    .channel-value {
        position: relative;
        flex-grow: 1;
    }

    .channel-input {
        width: 100%;
    }

    .channel-picker {
        height: 1.25rem;
        border: solid 1px $border;
        border-top: none;
    }

    .channel-slider {
        width: calc(100% + .4rem); /* allow thumb center to touch end */
        -webkit-appearance: none;
        background: none;
        border: none;
        margin: 0 0 0 -.2rem;
        cursor: crosshair;

        &::-moz-range-track {
            background: none;
        }

        &::-webkit-slider-thumb {
            width: 0;
            height: 0;
            -webkit-appearance: none;
            border-bottom: solid .4rem $text;
            border-left: solid .3rem transparent;
            border-right: solid .3rem transparent;
            margin: 1rem 0 0;
        }

        &::-moz-range-thumb {
            background: none;
            width: 0;
            height: 0;
            border-radius: 0;
            border-bottom: solid .4rem $text;
            border-left: solid .3rem transparent;
            border-right: solid .3rem transparent;
            margin: 3rem 0 0 0
        }
    }

    .channel-color {
        height: 1.3rem;
        box-sizing: border-box;
        padding: 0;
        border: solid 1px $border;
        border-top: none;
        cursor: pointer;

        &::-webkit-color-swatch-wrapper {
            padding: 0;
            border: none;
        }

        &::-webkit-color-swatch {
            border: none;
        }

        &::moz-color-swatch {
            border: none;
        }
    }

    .channel-presets {
        background: $background;
        width: 100%;
        list-style: none;
        position: absolute;
        z-index: 1;
        padding: 0;
        margin: 0;
        box-shadow: 0 0 2px $shadow;

        .preset {
            display: flex;
            padding: .5rem;

            &:hover {
                color: $text-light;
                background: $primary;
                cursor: pointer;

                .tag {
                    color: $primary;
                    background: $background;
                }
            }

            &.selected {
                font-weight: bold;
            }
        }

        .preset-name {
            flex-grow: 1;
        }

        .preset-tags {
            list-style: none;
            padding: 0;
            margin: 0;

            .tag {
                color: $grey2;
                background: $grey;
                display: inline-block;
                padding: .25rem;
                border-radius: .25rem;
                font-size: .75rem;

                &:not(:last-child) {
                    margin: 0 .25rem 0 0;
                }
            }
        }
    }
</style>
