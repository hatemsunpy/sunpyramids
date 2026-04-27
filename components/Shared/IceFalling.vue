<template>
  <div ref="iceContainer" class="ice-container">
    <NuxtIcon name="snow" v-for="drop in drops" :key="drop.id" class="snow-drop" :style="drop.style" />
  </div>
</template>

<script setup lang='js'>
  const props = defineProps({
    iceCount: {
      type: Number,
      default: 120
    }
  })
const iceContainer = ref(null)

const dropCount = props.iceCount
const drops = ref([])

for (let i = 0; i < dropCount; i++) {
  const size = Math.random() * 15 + 15
  const rotationSpeed = 2 + Math.random() * 6
  const shineDelay = Math.random() * 3

  drops.value.push({
    id: i,
    style: {
      left: `${Math.random() * 100}vw`,
      width: `${size}px`,
      height: `${size}px`,
      fontSize: `${size}px`,
      animationDuration: `${3 + Math.random() * 8}s`,
      animationDelay: `${Math.random() * 5}s`,
      opacity: 0.5 + Math.random() * 0.5,
      '--spin-speed': `${rotationSpeed}s`,
      '--shine-delay': `${shineDelay}s`
    }
  })
}
</script>

<style scoped lang='scss'>
.ice-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
  pointer-events: none;
}

.snow-drop {
  position: absolute;
  top: -30px;
  color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  filter:
    drop-shadow(0 0 6px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 12px rgba(173, 216, 230, 0.7));
  backdrop-filter: blur(3px);
  animation: fall linear infinite;
  animation-delay: var(--shine-delay);
}

@keyframes fall {
  0% {
    transform: translate(-20px, -10vh) scale(1) rotate(0deg);
    opacity: 1;
    filter: brightness(1);
  }

  50% {
    transform: translate(20px, 50vh) scale(0.9) rotate(180deg);
    opacity: 0.7;
  }

  100% {
    transform: translate(-15px, 110vh) scale(0.8) rotate(360deg);
    opacity: 0.4;
    filter: brightness(1);
  }
}

</style>