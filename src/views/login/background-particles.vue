<template>
  <vue-particles
    id="bg-particles"
    :particles-init="particlesInit"
    :options="particlesOpts"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ParticlesComponent as VueParticles } from 'particles.vue3'
import { loadFull } from 'tsparticles'

type ParticleOption = InstanceType<typeof VueParticles>['$props']['options']

export default defineComponent({
  name: 'BackgroundParticles',
  components: {
    VueParticles,
  },
  setup() {
    const particlesOpts: ParticleOption = {
      particles: {
        number: {
          value: 50,
          density: {
            enable: true,
            value_area: 800,
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
            opacity_min: 0.1,
            sync: false,
          },
        },
        size: {
          value: 5,
          random: true,
          anim: {
            enable: false,
            speed: 40,
            size_min: 0.1,
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
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
          push: {
            particles_nb: 4,
          },
          remove: {
            particles_nb: 2,
          },
        },
      },
      detectRetina: true,
    }

    const particlesInit = async engine => {
      await loadFull(engine)
    }

    return {
      particlesOpts,
      particlesInit,
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
