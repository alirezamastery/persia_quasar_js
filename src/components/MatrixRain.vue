<template>
  <div id="rain-canvas"></div>
</template>

<script setup>
import makeItRain from 'src/composables/make-it-rain'
import {onBeforeMount, onMounted, onUnmounted} from 'vue'

onBeforeMount(() => document.body.classList.add('matrix'))
onMounted(() => makeItRain())
onUnmounted(() => document.body.classList.remove('matrix'))
</script>

<style lang="scss">
body {
  &.matrix {
    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-image: linear-gradient(
          to top,
          rgba(255, 255, 255, 0.2) 33.33333%,
          rgba(255, 255, 255, 0.4) 33.33333%,
          rgba(255, 255, 255, 0.4) 66.66666%,
          rgba(255, 255, 255, 0.6) 66.66666%
      ),
      linear-gradient(
          to right,
          rgba(255, 0, 0, 0.7) 33.33333%,
          rgba(0, 255, 0, 0.7) 33.33333%,
          rgba(0, 255, 0, 0.7) 66.66666%,
          rgba(0, 0, 255, 0.7) 66.66666%
      );
      background-repeat: repeat;

      background-size: 3px 3px;
      mix-blend-mode: multiply;
    }
  }
}

#rain-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: SFSquare;
  background-color: black;
  line-height: 1;
}

.drop-line {
  position: absolute;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  width: 3.5rem;
}

.drop-char {
  font-size: 2.5rem;
  color: white;
  margin: 3px 0;
  padding: 0;
  height: 36px;
}

.drop-line > .drop-char:not(:first-child, :nth-child(2), :nth-child(3)) {
  text-shadow: 0 0 0.125em hsl(0 0% 100% / 0.3),
  0 0 0.45em currentColor;
}
</style>
