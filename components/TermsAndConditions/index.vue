<template>
  <section class="w-full h-[16.6875rem] flex relative items-end ">
    <div class="w-full h-full absolute top-0 categoryBox start-0" :class="[privacyData ? '' : 'blur-lg']">
      <img class="w-full h-full  object-cover object-center z-0" v-if="privacyData && privacyData.banner"
        :src="privacyData.banner" alt="" loading="lazy" />

      <NuxtImg class="w-full h-full  object-cover object-center z-0" v-else src="/images/faqs-banner.png" />

      <div class="absolute bottom-0 start-0 w-full h-[70%] categoryBox"></div>
    </div>

    <h1 class="lg:text-[3rem] text-3xl text-white z-10 lg:px-20 px-4 pb-11 font-bold textShadow">
      {{ $t("labels.privacy.banner") }}
    </h1>
  </section>

  <section v-if="data"
    class="2xl:px-20 px-4 py-14 grid lg:grid-flow-col  2xl:grid-cols-7 grid-cols-8 relative gap-5 bg-white">
    <div class="2xl:col-span-5 lg:col-span-5  col-span-8 hidden lg:block">
      <div v-html="data?.newBlog"></div>
    </div>

    <div class="2xl:col-span-2 lg:col-span-3  col-span-8 lg:sticky h-fit top-20  overflow-hidden">
      <div class="bg-[#F9FAFB] rounded-[2rem]  py-4 mb-4  overflow-hidden ">
        <h6 class="text-xl lg:px-8 px-2 mb-6 font-medium text-textLight">
          {{ $t("labels.privacy.onThisPage") }}
        </h6>
        <div class="lg:max-h-[400px] lg:px-8 px-2 lg:overflow-y-auto">

          <BlogsBlogSideBar v-for="item in data.structure" :item="item" @updateRelation="changeRelation"
            :selectedChild="selectedChild" />
        </div>
      </div>
    </div>

    <div class="xl:col-span-5 mb-8 lg:col-span-5 col-span-8 lg:hidden block">
      <div v-html="data?.newBlog"></div>
    </div>
  </section>
</template>

<script setup lang='js'>
const { getData } = useApi()
const router = useRouter()

const privacyData = ref(null)
const data = ref(null);
const isLoading = ref(true)

const getprivacyData = async () => {
  await getData("pages/terms-and-conditions?includes=seo").then((res) => {
    privacyData.value = res.data
    parseStrongParagraphsAsHeadings(privacyData.value.content)
  })
}

getprivacyData()

const selectedChild = ref(null)

const changeRelation = (child) => {
  selectedChild.value = child

  nextTick(() => {
    const element = document.getElementById(child)
    if (element) {
      const yOffset = -150
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  })
}

function parseStrongParagraphsAsHeadings(htmlString) {
  const lines = htmlString.split(/\r?\n/).filter(line => line.trim() !== "");
  let idCounter = 1;
  let hierarchy = [];
  let stack = [];

  // Modify HTML to include unique IDs for each detected heading
  let newHtml = htmlString.replace(/(.*)/g, (match, content) => {
    if (lines.includes(content.trim())) {
      let id = `custom-heading-${idCounter++}`;
      return `<p id="${id}">${content}</p>`;
    }
    return match;
  });

  idCounter = 1; // Reset counter for structure generation
  for (let line of lines) {
    const title = line.trim();
    const node = {
      id: `custom-heading-${idCounter++}`,
      title,
      children: []
    };

    if (stack.length === 0) {
      hierarchy.push(node);
      stack = [node];
    } else {
      while (stack.length) {
        stack.pop();
      }
      hierarchy.push(node);
      stack = [node];
    }
  }

  data.value = {
    structure: updateH2Headings(hierarchy), // Hierarchical structure
    newBlog: newHtml // HTML with IDs added
  };
}

function updateH2Headings(data) {
  const result = [];
  let lastH2 = null;
  data = data.filter(item => item.title.includes('<h4') || item.title.includes('<h3'))

  data.forEach(item => {
    if (item.title.includes('<h4')) {
      // Process and store the H2
      lastH2 = {
        ...item,
        title: item.title.replace(/<[^>]+>/g, '').trim(),
        children: []
      };
      result.push(lastH2);
    } else if (item.title.includes('<strong>') && lastH2) {
      // Process and push the H3 as a child of the last H2
      lastH2.children.push({
        ...item,
        title: item.title.replace(/<[^>]+>/g, '').trim()
      });
    }
  });
  return result;

  // return data.filter(item => item.title.includes('<h2') || item.title.includes('<h3')).map(item => {
  //   return {
  //     ...item,
  //     title: item.title.replace(/<[^>]+>/g, '').trim() // Remove HTML tags
  //   };
  // });
}
</script>

<style scoped lang='scss'>
.textShadow {
  text-shadow: 0 4px 40px #00000066, 0 4px 24px #00000033;
}

.categoryBox {
  background: linear-gradient(to bottom,
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0.363),
      rgba(0, 0, 0, 0.726));
}
</style>