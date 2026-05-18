<template>
  <!-- noscript rendered via v-html to avoid Vue SSR hydration mismatch.
       Browsers parse noscript contents as text when JS is enabled,
       but Vue SSR renders them as DOM nodes. v-html outputs a text node. -->
  <noscript v-if="!noThirdPartyQuery" v-html="gtmIframe"></noscript>

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <NuxtLoadingIndicator
    color="#F7951D"
    :height="4"
    class="absolute top-0 left-0 w-full z-[99999]"
  />
</template>

<script setup lang="js">
import '@vuepic/vue-datepicker/dist/main.css'
const {locale} = useI18n()
const route = useRoute()
const noThirdPartyQuery = computed(() => !!route.query['no-third-party'])

const gtmIframe = '<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KDF33T7" height="0" width="0" style="display:none;visibility:hidden"></iframe>'

useHead(() => ({
  htmlAttrs: {
    lang: locale.value
  }
}))

useHead(() => {
  if (route.query['no-third-party']) return {}

  return {
    script: [
      {
        src: 'https://www.googletagmanager.com/gtag/js?id=G-NKZ6W32C4J',
        async: true,
        defer: true
      },
      {
        children: `
          (function(){
            function loadGtm(){
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-NKZ6W32C4J');
              (function(w,d,s,l,i){
                w[l]=w[l]||[];
                w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
                var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
                j.async=true; j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-KDF33T7');
            }
            if(document.readyState==='complete'){ loadGtm(); }
            else { window.addEventListener('load', loadGtm); }
          })();
        `,
        type: 'text/javascript'
      }
    ]
  }
})
</script>

<style lang="scss">
.v3dp__datepicker {
  @apply w-full;

  .v3dp__element__button__day,
  .v3dp__element__button__month,
  .v3dp__element__button__year {
    &:hover {
      span {
        background-color: #163a96 !important;
      }
    }
  }

  .v3dp__elements button.selected span {
    background-color: #163a96 !important;
  }
}

.v3dp__input_wrapper {
  @apply w-full;

  input {
    @apply focus:outline-none w-full cursor-pointer;
  }
}

.v3dp__popout {
  @apply z-50 relative bottom-0;
}

.dp__active_date,
.dp__overlay_cell_active {
  @apply bg-primary;
}

.dp__disabled {
  @apply bg-transparent cursor-not-allowed !important;
}

.dp__action_select {
  background-color: #f7951d !important;
}

.dp__input_reg {
  @apply p-0 border-none font-medium;
}

.dp__input_reg::placeholder {
  @apply text-textLight font-medium opacity-100;
  // #{!important}
}

.dp__input_icons {
  @apply hidden;
}
</style>
