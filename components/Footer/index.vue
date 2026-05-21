<template>
  <footer
    class="w-full pt-11 xl:px-20  bg-no-repeat bg-cover px-4 lg:pb-8 pb-32 bg-[#181818] bg-[url(/images/footerbg.svg)]">
    <section class="grid grid-cols-5 gap-5">
      <div class="lg:col-span-2 col-span-5  flex flex-col gap-8">
        <NuxtImg src="/images/logo.png" alt="logo" class="w-[16.25rem] mb-4" width="260" height="56" />


        <p class="text-white leading- text-xl font-medium">Need Our Help ?
        </p>
        <p class="text-white -mt-5 ">We Would Happy To Help You ...
        </p>

        <section v-if="settings" class="flex items-center gap-6">
          <button @click="getURL(item.value)" v-for="(item, index) in socials" :key="index"
            class="flex w-14 h-14 hover:bg-[#d19026] hover:border-[#d19026] duration-300 transition-colors  items-center justify-center border border-[#CCCCCC] rounded-2xl">
            <NuxtIcon  :name="item.icon" class="text-white text-2xl min-h-6 min-w-6 max-w-6 max-h-6 " />
          </button>
        </section>

        <NuxtImg @click="router.push(localePath('/sustainability'))" src="/images/certified_footer_white.webp" alt="certified footer" class="w-[18.25rem] cursor-pointer -ms-2 mb-4 brightness-150" loading="lazy" width="292" height="80" />

      </div>

      <div class="lg:col-span-1 md:col-span-2 col-span-5 ">
        <p class="mb-8 text-[#666666] text-xl font-medium">{{ $t("labels.sunpyramidsLinks") }}</p>

        <ul class="flex flex-col gap-3">
          <li v-for="(link, index) in links" :key="index" class="">
            <NuxtLink
              class=" flex items-center font-normal gap-1 text-base text-[#FFFFFF] hover:text-secondary hover:underline transition-all duration-200"
              :to="localePath(link.path)">
              <span>{{ $t(`labels.${link.name}`) }}</span>

              <NuxtIcon v-if="link.icon" :name="link.icon" class="" />
            </NuxtLink>
          </li>
        </ul>
      </div>

      <div class="lg:col-span-2 md:col-span-3 col-span-5">
        <p class="mb-8 text-[#666666] text-xl font-medium">{{ $t("labels.contactInfo") }}</p>

        <div class="flex flex-col gap-6">
          <div class="flex gap-3 items-start">
            <img src="~/assets/icons/phone-footer.svg" alt="">

            <div>
              <p v-for="(item, index) in phones" :key="index" class="text-[#FFFFFF]">
                <a :href="'tel:' + item">{{ item }}</a>
              </p>
            </div>
          </div>
          <div class="flex gap-3 items-start">
            <svg class="w-6 h-6 min-w-[1.5rem]" viewBox="0 0 24 24" fill="#25D366" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>

            <div>
              <p v-for="(item, index) in whatsPhones" :key="index" @click="goToWhatsApp"
                class="text-[#FFFFFF] cursor-pointer">
                {{ item }}
              </p>
            </div>
          </div>
          <div class="flex gap-3 items-start">
            <img src="~/assets/icons/email-footer.svg" alt="">

            <div>
              <p v-for="item in settings.find((option) => option.option_key == 'notification_emails')?.option_value"
                class="text-[#FFFFFF]"> <a :href="`mailto:${item}`">{{ item }}</a>
              </p>
              <p class="text-[#FFFFFF]"> <a
                  :href="`mailto:sustainability@sunpyramidstours.com`">sustainability@sunpyramidstours.com</a>
              </p>
            </div>
          </div>
          <div class="flex gap-3 items-start">
            <img src="~/assets/icons/location-footer.svg" alt="">

            <div>
              <p @click="openLocation(settings.find((option) => option.option_key == 'company_location_url')?.option_value)"
                class="text-[#FFFFFF] cursor-pointer">Pyramids View Tower - Mansourieh Intersection with Faisal - Above
                Tseppas Pastry
                - Fourth Floor</p>
            </div>
          </div>

          <ClientOnly>
            <div id="footer-cert" ref="trustindexContainerFooterCert"></div>
          </ClientOnly>
        </div>
      </div>
    </section>

    <div class="w-full mt-14 mb-8 h-[1px] bg-[#444444]"></div>

    <div class="flex md:flex-row flex-col-reverse  gap-8 justify-between w-full">
      <p class="text-white text-sm ">All rights reserved to sunpyramids company, Egypt ©2024</p>

      <div class="flex gap-12 ">
        <NuxtLink :to="localePath('/privacy-and-cookies')" :prefetch="false" class="text-white text-sm cursor-pointer hover:underline">Privacy
          and Cookies</NuxtLink>

        <NuxtLink :to="localePath('/terms-and-conditions')" :prefetch="false" class="text-white text-sm cursor-pointer hover:underline">Terms
          and Conditions</NuxtLink>
      </div>
    </div>
  </footer>
</template>

<script setup lang='js'>
import { storeToRefs } from 'pinia'
import { sharedStore } from '~/stores/sharedStore.js'

const { settings } = storeToRefs(sharedStore())
const socials = [{ title: "Youtube", icon: "youtube-white", value: "youtube" }, { title: "Google", icon: "g-plus", value: "google-plus" }, { title: "Facebook", icon: "facebook", value: "facebook" }, { title: "Instagram", icon: "instagram", value: "instagram" }]
const trustindexContainerFooterCert = ref(null);

const getURL = (val) => {
  window.open(settings.value.find(setting => setting.option_key == 'social_links').option_value.find(ele => ele.type == val).url, "_blank")
}
const router = useRouter()
const localePath = useLocalePath()
const phones = ['+20 109 588 8830', '+20 109 588 8831', '+20 109 588 8835']
const whatsPhones = ['+20 109 588 8830']

const links = [{ name: "home", path: "/" },
{ name: "oneDay", path: "/egypt-tours/one-day-tours" },
{ name: "multiDays", path: "/egypt-tours/multi-days-tours" },
{ name: "nileCruises", path: "/egypt-tours/nile-cruises" },
{ name: "shoreExsurision", path: "/egypt-tours/shore-excursions" },
{ name: "spaicalOffer", path: "/trips?main=special-offers", icon: "discount" },
{ name: "rentcar", path: "/rent-car" },
{ name: "about", path: "/about-us" },
{ name: "contact", path: "/contact-us" },
{ name: "egyptTravelGuide", path: "/egypt-travel-guide" },
{ name: "faqs.faqs", path: "/faqs" },
{ name: "events", path: "/events" },
{ name: "accessibleTravel", path: "/accessible-travel" }
]

const openLocation = (url) => {
  window.open(url[0], "_blank")
}

const goToWhatsApp = () => {
  window.open('https://api.whatsapp.com/send?phone=201095888830', '_blank')
}

onMounted(() => {
  // Check if running on client side
  if (process.client) {
    const script = document.createElement('script');
    script.src = 'https://cdn.trustindex.io/loader-cert.js?c80e286451c98153d1567b8885a';
    script.async = true;
    script.defer = true;

    // Add data attributes if needed by TrustIndex
    script.setAttribute('data-type', 'stripe');
    script.setAttribute('data-location', 'footer-cert');

    if (trustindexContainerFooterCert.value) {
      trustindexContainerFooterCert.value.appendChild(script);
    }
  }
});
</script>

<style scoped lang='scss'></style>