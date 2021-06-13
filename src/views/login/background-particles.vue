<template>
  <vue-particles
    id="bg-particles"
    :options="particlesOpts"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ParticlesComponent as VueParticles } from 'particles.vue3'

export default defineComponent({
  name: 'BackgroundParticles',
  components: {
    VueParticles,
  },
  setup() {
    const particlesOpts = {
      particles: {
        number: {
          value: 50,
          density: {
            enable: true,
            valueArea: 800,
          },
        },
        color: {
          value: '#3b485f',
        },
        shape: {
          type: 'circle',
          stroke: {
            width: 0,
            color: '#000000',
          },
          polygon: {
            nbSides: 5,
          },
        },
        opacity: {
          value: 1,
          random: false,
          anim: {
            enable: false,
            speed: 1,
            opacityMin: 0.1,
            sync: false,
          },
        },
        size: {
          value: 5,
          random: true,
          anim: {
            enable: false,
            speed: 40,
            sizeMin: 0.1,
            sync: false,
          },
        },
        lineLinked: {
          enable: true,
          distance: 160,
          color: '#7488a4',
          opacity: 0.5,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1,
          direction: 'none',
          random: true,
          straight: false,
          outMode: 'out',
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200,
          },
        },
      },
      interactivity: {
        detectsOn: 'canvas',
        events: {
          onHover: {
            enable: true,
            mode: 'bubble',
          },
          onClick: {
            enable: false,
            mode: 'push',
          },
          resize: true,
        },
        modes: {
          grab: {
            distance: 400,
            lineLinked: {
              opacity: 1,
            },
          },
          bubble: {
            distance: 400,
            size: 8,
            duration: 10,
            opacity: 0.24775224775224775,
            speed: 3,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
          push: {
            particlesNb: 4,
          },
          remove: {
            particlesNb: 2,
          },
        },
      },
      detectRetina: true,
    }

    return {
      particlesOpts,
    }
  },
})
</script>

<style scoped>
#bg-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
