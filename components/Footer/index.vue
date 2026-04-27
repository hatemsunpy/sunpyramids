<template>
  <footer
    class="w-full pt-11 xl:px-20  bg-no-repeat bg-cover px-4 lg:pb-8 pb-32 bg-[#181818] bg-[url(/images/footerbg.svg)]">
    <section class="grid grid-cols-5 gap-5">
      <div class="lg:col-span-2 col-span-5  flex flex-col gap-8">
        <NuxtImg src="/images/logo.png" alt="logo" class="w-[16.25rem]  mb-4" />


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

        <NuxtImg @click="router.push(localePath('/sustainability'))" src="/images/certified_footer_white.png" alt="logo" class="w-[18.25rem] cursor-pointer -ms-2  mb-4 brightness-150" />

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
            <img src="/images/whatsapp-footer.png" class="w-6" alt="">

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

          <div id="footer-cert" ref="trustindexContainerFooterCert"></div>
        </div>
      </div>
    </section>

    <div class="w-full mt-14 mb-8 h-[1px] bg-[#444444]"></div>

    <div class="flex md:flex-row flex-col-reverse  gap-8 justify-between w-full">
      <p class="text-white text-sm ">All rights reserved to sunpyramids company, Egypt ©2024</p>

      <div class="flex gap-12 ">
        <p class="text-white text-sm cursor-pointer " @click="router.push(localePath('/privacy-and-cookies'))">Privacy
          and Cookies</p>

        <p class="text-white text-sm cursor-pointer " @click="router.push(localePath('/terms-and-conditions'))">Terms
          and Conditions</p>
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

    trustindexContainerFooterCert.value.appendChild(script);
  }
});
</script>

<style scoped lang='scss'></style>