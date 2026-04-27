<template>
  <ClientOnly>
    <div class="relative h-full w-full overflow-hidden">
      <GMapMap v-if="center" :center="center" class="focus:border-none custom-map" :zoom="props.zoom"
        map-type-id="hybrid" :options="{
          zoomControl: props.zoomControl,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: props.fullscreenControl,
          keyboardShortcuts: false,
        }" style="width: 100%; height: 100%">
        <!-- <GMapMarker :position="center" :clickable="false" :draggable="false">
        </GMapMarker> -->

        <!-- Conditionally render the Polygon or Polyline based on a boolean -->
        <GMapPolyline v-if="shouldDraw" :path="props.PolygonCoords" :options="{
          strokeColor: '#0a7bbd',
          strokeOpacity: 0,
          strokeWeight: 3
        }"></GMapPolyline>

        <GMapMarker v-for="(coord, index) in props.PolygonCoords" :key="index" :position="coord" :clickable="false"
          :draggable="false" :options="{
            icon: {
              url: '/images/map-location-2.png',
              scaledSize: { width: 60, height: 60 },
              anchor: { x: 30, y: 30 }
            }
          }" />
      </GMapMap>
    </div>
  </ClientOnly>
</template>

<script setup>

const props = defineProps({
  zoom: {
    type: Number,
    default: 6
  },
  fullscreenControl: {
    type: Boolean,
    default: false
  },
  zoomControl: {
    type: Boolean,
    default: false
  },
  PolygonCoords: {
    type: Array,
    default: []
  }
});
const center = ref({ lat: 30.033333, lng: 31.233334 });

const shouldDraw = ref(true); // Set this to false to hide the shape

</script>

<style scoped lang="scss"></style>