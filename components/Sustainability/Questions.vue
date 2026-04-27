<template>
  <div class="relative" id="sustainability-questions">
    <div
      class="md:flex hidden items-end gap-[1px] overflow-x-auto  absolute -top-[3.30rem] start-[4.5rem] max-h-fit max-w-fit">
      <HomeMainBannerShortcutsTopTap v-for="(item, index) in sustainabilityContent" :key="item.objectId"
        :title="item.title" :value="item.objectId" @changeValue="currentValue = $event" :currentValue="currentValue" />
    </div>

    <div class="w-full flex md:hidden overflow-x-auto scroll-container mb-4 gap-2">
      <UIButton v-for="(item, index) in sustainabilityContent" :key="item.objectId"
        @click="currentValue = item.objectId"
        :classes="['px-14 transition-color !min-w-fit !rounded-full  duration-75 rounded-t-[1.25rem] font-medium rounded-b-none', currentValue == item.objectId ? 'bg-white text-primary pb-4 pt-[0.875rem]' : 'bg-[#eeeeee] text-[#333333] pb-[0.875rem] pt-[0.875rem] text-textDark border-2']"
        :text="item.title" />
    </div>

    <!-- v-html="selectedparagraph" -->
    <div @click="console.log('test')" class="p-6 xl:px-16 px-4  bg-white w-full relative text-xl z-30 rounded-[2.5rem]"
      v-html="selectedparagraph">
    </div>
    <!-- <component :is="selectedComponent" /> -->
  </div>
</template>

<script setup lang="js">
import MakeYourTrip from '../Home/MainBanner/Shortcuts/MakeYourTrip.vue';
import RentCar from '../Home/MainBanner/Shortcuts/RentCar.vue';
import FindYourTrip from '../Home/MainBanner/Shortcuts/FindYourTrip.vue';
const isMounted = ref(false);

const localePath = useLocalePath()
const { locale } = useI18n()
const router = useRouter()

onMounted(() => {
  isMounted.value = true;
})
const currentValue = ref(1);
const selectedparagraph = computed(() => {
  return sustainabilityContent.find((para) => para.objectId === currentValue.value)?.[locale.value] || "";
});
const tabs = [{ title: "makeYourTrip", value: "MakeYourTrip", component: MakeYourTrip }, { title: "findYourTrep", value: "FindYourTrip", component: FindYourTrip }, { title: "rentcar", value: "RentCar", component: RentCar },]



const sustainabilityContent = [
  {
    objectId: 1,
    title: "About Sustainability",
    en:
      `<div>
        <p class="text-xl">We believe tourism should protect destinations, empower local communities, and preserve
          cultural heritage for
          future generations. As a Destination Management Company operating since 1970, we recognize our responsibility
          to minimize environmental impact while maximizing positive social and economic contributions.</p>

        <p class="font-medium text-xl mt-4">Our sustainability approach focuses on:</p>

        <ul class="list-disc list-inside mt-4 ps-4 text-lg">
          <li>Reducing operational environmental impact.</li>
          <li>Promoting responsible travel behavior among our guests.</li>
          <li>Supporting local communities and suppliers.</li>
          <li>Preserving Egypt’s natural and cultural heritage.</li>
          <li>Partnering with certified sustainable hotels and service providers.</li>
        </ul>


        <p class="text-xl mt-4">From desert safaris to Nile cruises and cultural tours, we carefully plan
          experiences that respect ecosystems, local traditions, and protected areas.
        </p>
      </div>`,
    es: `<div>
        <p class="text-xl">Creemos que el turismo debe proteger los destinos, empoderar a las comunidades locales y preservar
          el patrimonio cultural para las generaciones futuras. Como empresa de gestión de destinos que opera desde 1970, reconocemos nuestra responsabilidad
          de minimizar el impacto ambiental mientras maximizamos las contribuciones sociales y económicas positivas.</p>

        <p class="font-medium text-xl mt-4">Nuestro enfoque de sostenibilidad se centra en:</p>

        <ul class="list-disc list-inside mt-4 ps-4 text-lg">
          <li>Reducir el impacto ambiental operativo.</li>
          <li>Promover comportamientos de viaje responsables entre nuestros huéspedes.</li>
          <li>Apoyar a las comunidades locales y proveedores.</li>
          <li>Preservar el patrimonio natural y cultural de Egipto.</li>
          <li>Asociarnos con hoteles y proveedores de servicios certificados sostenibles.</li>
        </ul>

        <p class="text-xl mt-4">Desde safaris por el desierto hasta cruceros por el Nilo y tours culturales, planificamos cuidadosamente
          experiencias que respetan los ecosistemas, las tradiciones locales y las áreas protegidas.
        </p>
      </div>`,
    de: `<div>
        <p class="text-xl">Wir glauben, dass Tourismus Reiseziele schützen, lokale Gemeinschaften stärken und das kulturelle Erbe für zukünftige Generationen bewahren sollte. Als Destination Management Company, die seit 1970 tätig ist, erkennen wir unsere Verantwortung an, die Umweltauswirkungen zu minimieren und gleichzeitig positive soziale und wirtschaftliche Beiträge zu maximieren.</p>

        <p class="font-medium text-xl mt-4">Unser Nachhaltigkeitsansatz konzentriert sich auf:</p>

        <ul class="list-disc list-inside mt-4 ps-4 text-lg">
          <li>Reduzierung der betrieblichen Umweltauswirkungen.</li>
          <li>Förderung verantwortungsvollen Reiseverhaltens bei unseren Gästen.</li>
          <li>Unterstützung lokaler Gemeinschaften und Lieferanten.</li>
          <li>Bewahrung des natürlichen und kulturellen Erbes Ägyptens.</li>
          <li>Partnerschaft mit zertifizierten nachhaltigen Hotels und Dienstleistern.</li>
        </ul>

        <p class="text-xl mt-4">Von Wüstensafaris über Nilkreuzfahrten bis hin zu Kulturreisen planen wir sorgfältig Erlebnisse, die Ökosysteme, lokale Traditionen und Schutzgebiete respektieren.
        </p>
      </div>`,
    it: `<div>
        <p class="text-xl">Crediamo che il turismo debba proteggere le destinazioni, rafforzare le comunità locali e preservare il patrimonio culturale per le generazioni future. Come Destination Management Company operante dal 1970, riconosciamo la nostra responsabilità di minimizzare l'impatto ambientale massimizzando al contempo i contributi sociali ed economici positivi.</p>

        <p class="font-medium text-xl mt-4">Il nostro approccio alla sostenibilità si concentra su:</p>

        <ul class="list-disc list-inside mt-4 ps-4 text-lg">
          <li>Ridurre l'impatto ambientale operativo.</li>
          <li>Promuovere comportamenti di viaggio responsabili tra i nostri ospiti.</li>
          <li>Sostenere le comunità locali e i fornitori.</li>
          <li>Preservare il patrimonio naturale e culturale dell'Egitto.</li>
          <li>Collaborare con hotel e fornitori di servizi certificati sostenibili.</li>
        </ul>

        <p class="text-xl mt-4">Dai safari nel deserto alle crociere sul Nilo e ai tour culturali, pianifichiamo attentamente esperienze che rispettano gli ecosistemi, le tradizioni locali e le aree protette.
        </p>
      </div>`,
    fr: `<div>
        <p class="text-xl">Nous croyons que le tourisme doit protéger les destinations, autonomiser les communautés locales et préserver le patrimoine culturel pour les générations futures. En tant que société de gestion de destinations opérant depuis 1970, nous reconnaissons notre responsabilité de minimiser l'impact environnemental tout en maximisant les contributions sociales et économiques positives.</p>

        <p class="font-medium text-xl mt-4">Notre approche de durabilité se concentre sur :</p>

        <ul class="list-disc list-inside mt-4 ps-4 text-lg">
          <li>Réduire l'impact environnemental opérationnel.</li>
          <li>Promouvoir un comportement de voyage responsable parmi nos invités.</li>
          <li>Soutenir les communautés locales et les fournisseurs.</li>
          <li>Préserver le patrimoine naturel et culturel de l'Égypte.</li>
          <li>S'associer avec des hôtels et prestataires de services certifiés durables.</li>
        </ul>

        <p class="text-xl mt-4">Des safaris dans le désert aux croisières sur le Nil et aux visites culturelles, nous planifions soigneusement des expériences qui respectent les écosystèmes, les traditions locales et les zones protégées.
        </p>
      </div>`,
    pt: `<div>
        <p class="text-xl">Acreditamos que o turismo deve proteger os destinos, capacitar as comunidades locais e preservar o patrimônio cultural para as gerações futuras. Como uma empresa de gestão de destinos que opera desde 1970, reconhecemos nossa responsabilidade de minimizar o impacto ambiental enquanto maximizamos as contribuições sociais e econômicas positivas.</p>

        <p class="font-medium text-xl mt-4">Nossa abordagem de sustentabilidade concentra-se em:</p>

        <ul class="list-disc list-inside mt-4 ps-4 text-lg">
          <li>Reduzir o impacto ambiental operacional.</li>
          <li>Promover comportamento de viagem responsável entre nossos hóspedes.</li>
          <li>Apoiar comunidades locais e fornecedores.</li>
          <li>Preservar o patrimônio natural e cultural do Egito.</li>
          <li>Fazer parcerias com hotéis e prestadores de serviços certificados sustentáveis.</li>
        </ul>

        <p class="text-xl mt-4">De safáris no deserto a cruzeiros no Nilo e passeios culturais, planejamos cuidadosamente experiências que respeitam os ecossistemas, as tradições locais e as áreas protegidas.
        </p>
      </div>`,
    zh: `<div>
        <p class="text-xl">我们相信旅游业应该保护目的地，赋能当地社区，并为子孙后代保护文化遗产。作为自1970年开始运营的目的地管理公司，我们认识到自己有责任最大限度地减少环境影响，同时最大化积极的社会和经济贡献。</p>

        <p class="font-medium text-xl mt-4">我们的可持续发展方法侧重于：</p>

        <ul class="list-disc list-inside mt-4 ps-4 text-lg">
          <li>减少运营对环境的影响。</li>
          <li>在我们的客人中推广负责任的旅行行为。</li>
          <li>支持当地社区和供应商。</li>
          <li>保护埃及的自然和文化遗产。</li>
          <li>与经过认证的可持续酒店和服务提供商合作。</li>
        </ul>

        <p class="text-xl mt-4">从沙漠野生动物园到尼罗河游轮和文化之旅，我们精心策划尊重生态系统、当地传统和保护区体验。
        </p>
      </div>`
  },
  {
    objectId: 2,
    title: "Sustainability Certifications",
    en:
      `<div>
        <p class="text-xl">Sun Pyramids Tours is proud to be a <span class="font-medium text-secondary">Travelife
            Partner</span>, working toward full Travelife
          Certification. Travelife is a globally recognized sustainability certification program for tour operators,
          aligned with international standards for responsible tourism.</p>

        <p class="font-medium text-xl mt-4">As a Travelife Partner, We:</p>

        <ul class="list-disc list-inside mt-4 ps-4 text-lg">
          <li>Monitor and reduce our environmental footprint.</li>
          <li>Implement fair labor and human rights policies.</li>
          <li>Support local communities and suppliers.</li>
          <li>Promote sustainable transport and accommodation.</li>
          <li>Integrate sustainability into business decision-making.</li>
        </ul>


        <p class="text-xl mt-4">We are actively progressing toward achieving the final <span
            class="font-medium text-secondary">Travelife Certified</span>
          status, demonstrating full compliance with international sustainability criteria.
        </p>

        <p class="text-xl">In addition, we collaborate with a carefully selected network of hotels and resorts
          across Egypt that hold sustainability certifications. These properties meet international standards for
          environmental protection, social responsibility, and quality service.
        </p>

        <p class="font-medium text-xl mt-4">To learn more about our policies, please visit:
        </p>

        <ul class="list-disc list-inside mt-4 ps-4 text-lg">
          <li>
            <a @click="router.push('https://docs.google.com/document/d/1T5v8kwtWD__2CFd1q9zN-jmFmIwt6_Wk/edit')"
 class="underline text-primary "
              href="https://docs.google.com/document/d/1T5v8kwtWD__2CFd1q9zN-jmFmIwt6_Wk/edit" target="_blank">Sustainability
              Policy</a>
          </li>
          <li>
            <a class="underline text-primary"
              href="https://docs.google.com/spreadsheets/d/1SdEIAqsA571x1HMrbVIUlSjiw2_S7OXY/edit?gid=741107480#gid=741107480" target="_blank">
              Certified
              accommodations in Egypt
            </a>
          </li>
          <li>
            <a class="underline text-primary" href="${localePath('/privacy-and-cookies')}">
              Privacy Policy
            </a>
          </li>
        </ul>

        <p class="text-xl mt-4 font-medium">For inquiries related to sustainability, contact us at:
          📧 sustainability@sunpyramidstours.com
          .
        </p>
      </div>`,
    es: `<div>
        <p class="text-xl">Sun Pyramids Tours se enorgullece de ser <span class="font-medium text-secondary">Travelife Partner</span>, trabajando para obtener la Certificación Travelife completa. Travelife es un programa de certificación de sostenibilidad reconocido mundialmente para operadores turísticos, alineado con los estándares internacionales de turismo responsable.</p>

        <p class="font-medium text-xl mt-4">Como Travelife Partner, Nosotros:</p>

        <ul class="list-disc list-inside mt-4 ps-4 text-lg">
          <li>Monitoreamos y reducimos nuestra huella ambiental.</li>
          <li>Implementamos políticas de trabajo justo y derechos humanos.</li>
          <li>Apoyamos a comunidades locales y proveedores.</li>
          <li>Promovemos el transporte y alojamiento sostenibles.</li>
          <li>Integramos la sostenibilidad en la toma de decisiones empresariales.</li>
        </ul>

        <p class="text-xl mt-4">Estamos progresando activamente hacia la obtención del estatus final <span class="font-medium text-secondary">Travelife Certified</span>, demostrando el cumplimiento total de los criterios internacionales de sostenibilidad.</p>

        <p class="text-xl">Además, colaboramos con una red cuidadosamente seleccionada de hoteles y resorts en todo Egipto que poseen certificaciones de sostenibilidad. Estas propiedades cumplen con estándares internacionales de protección ambiental, responsabilidad social y calidad de servicio.</p>

        <p class="font-medium text-xl mt-4">Para obtener más información sobre nuestras políticas, visite:</p>

        <ul class="list-disc list-inside mt-4 ps-4 text-lg">
          <li>
            <a class="underline text-primary" target="_blank" href="https://docs.google.com/document/d/1T5v8kwtWD__2CFd1q9zN-jmFmIwt6_Wk/edit">Política de Sostenibilidad</a>
          </li>
          <li>
            <a class="underline text-primary" target="_blank" href="https://docs.google.com/spreadsheets/d/1SdEIAqsA571x1HMrbVIUlSjiw2_S7OXY/edit?gid=741107480#gid=741107480">
              Alojamientos certificados en Egipto
            </a>
          </li>
          <li>
            <a class="underline text-primary" href="${localePath('/privacy-and-cookies')}">
              Política de Privacidad
            </a>
          </li>
        </ul>

        <p class="text-xl mt-4 font-medium">Para consultas relacionadas con sostenibilidad, contáctenos en:
          📧 sustainability@sunpyramidstours.com
        </p>
      </div>`,
    de: `<div>
        <p class="text-xl">Sun Pyramids Tours ist stolz darauf, <span class="font-medium text-secondary">Travelife Partner</span> zu sein und arbeitet auf die vollständige Travelife-Zertifizierung hin. Travelife ist ein weltweit anerkanntes Nachhaltigkeitszertifizierungsprogramm für Reiseveranstalter, das mit internationalen Standards für verantwortungsvollen Tourismus übereinstimmt.</p>

        <p class="font-medium text-xl mt-4">Als Travelife Partner:</p>

        <ul class="list-disc list-inside mt-4 ps-4 text-lg">
          <li>Überwachen und reduzieren wir unseren ökologischen Fußabdruck.</li>
          <li>Implementieren wir Richtlinien für faire Arbeit und Menschenrechte.</li>
          <li>Unterstützen wir lokale Gemeinschaften und Lieferanten.</li>
          <li>Fördern wir nachhaltigen Transport und Unterkunft.</li>
          <li>Integrieren wir Nachhaltigkeit in Geschäftsentscheidungen.</li>
        </ul>

        <p class="text-xl mt-4">Wir arbeiten aktiv daran, den endgültigen <span class="font-medium text-secondary">Travelife Certified</span>-Status zu erreichen und die vollständige Einhaltung internationaler Nachhaltigkeitskriterien nachzuweisen.</p>

        <p class="text-xl">Darüber hinaus arbeiten wir mit einem sorgfältig ausgewählten Netzwerk von Hotels und Resorts in ganz Ägypten zusammen, die Nachhaltigkeitszertifizierungen besitzen. Diese Unterkünfte erfüllen internationale Standards für Umweltschutz, soziale Verantwortung und Servicequalität.</p>

        <p class="font-medium text-xl mt-4">Weitere Informationen zu unseren Richtlinien finden Sie unter:</p>

        <ul class="list-disc list-inside mt-4 ps-4 text-lg">
          <li>
            <a class="underline text-primary" target="_blank" href="https://docs.google.com/document/d/1T5v8kwtWD__2CFd1q9zN-jmFmIwt6_Wk/edit">Nachhaltigkeitsrichtlinie</a>
          </li>
          <li>
            <a class="underline text-primary" target="_blank" href="https://docs.google.com/spreadsheets/d/1SdEIAqsA571x1HMrbVIUlSjiw2_S7OXY/edit?gid=741107480#gid=741107480">
              Zertifizierte Unterkünfte in Ägypten
            </a>
          </li>
          <li>
            <a class="underline text-primary" href="${localePath('/privacy-and-cookies')}">
              Datenschutzrichtlinie
            </a>
          </li>
        </ul>

        <p class="text-xl mt-4 font-medium">Bei Fragen zur Nachhaltigkeit kontaktieren Sie uns unter:
          📧 sustainability@sunpyramidstours.com
        </p>
      </div>`,
    it: `<div>
        <p class="text-xl">Sun Pyramids Tours è orgogliosa di essere <span class="font-medium text-secondary">Travelife Partner</span>, lavorando per ottenere la piena Certificazione Travelife. Travelife è un programma di certificazione della sostenibilità riconosciuto a livello mondiale per gli operatori turistici, allineato con gli standard internazionali per il turismo responsabile.</p>

        <p class="font-medium text-xl mt-4">Come Travelife Partner, Noi:</p>

        <ul class="list-disc list-inside mt-4 ps-4 text-lg">
          <li>Monitoriamo e riduciamo la nostra impronta ambientale.</li>
          <li>Implementiamo politiche di lavoro equo e diritti umani.</li>
          <li>Sosteniamo le comunità locali e i fornitori.</li>
          <li>Promuoviamo trasporti e alloggi sostenibili.</li>
          <li>Integriamo la sostenibilità nel processo decisionale aziendale.</li>
        </ul>

        <p class="text-xl mt-4">Stiamo progredendo attivamente verso il raggiungimento dello stato finale <span class="font-medium text-secondary">Travelife Certified</span>, dimostrando la piena conformità con i criteri internazionali di sostenibilità.</p>

        <p class="text-xl">Inoltre, collaboriamo con una rete accuratamente selezionata di hotel e resort in tutto l'Egitto che possiedono certificazioni di sostenibilità. Queste strutture soddisfano gli standard internazionali per la protezione ambientale, la responsabilità sociale e la qualità del servizio.</p>

        <p class="font-medium text-xl mt-4">Per saperne di più sulle nostre politiche, visitare:</p>

        <ul class="list-disc list-inside mt-4 ps-4 text-lg">
          <li>
            <a target="_blank" class="underline text-primary" href="https://docs.google.com/document/d/1T5v8kwtWD__2CFd1q9zN-jmFmIwt6_Wk/edit">Politica di Sostenibilità</a>
          </li>
          <li>
            <a target="_blank" class="underline text-primary" href="https://docs.google.com/spreadsheets/d/1SdEIAqsA571x1HMrbVIUlSjiw2_S7OXY/edit?gid=741107480#gid=741107480">
              Strutture ricettive certificate in Egitto
            </a>
          </li>
          <li>
            <a class="underline text-primary" href="${localePath('/privacy-and-cookies')}">
              Informativa sulla Privacy
            </a>
          </li>
        </ul>

        <p class="text-xl mt-4 font-medium">Per domande relative alla sostenibilità, contattaci a:
          📧 sustainability@sunpyramidstours.com
        </p>
      </div>`,
    fr: `<div>
        <p class="text-xl">Sun Pyramids Tours est fière d'être <span class="font-medium text-secondary">Travelife Partner</span> et travaille à l'obtention de la certification complète Travelife. Travelife est un programme de certification de durabilité reconnu mondialement pour les voyagistes, aligné sur les normes internationales du tourisme responsable.</p>

        <p class="font-medium text-xl mt-4">En tant que Travelife Partner, Nous :</p>

        <ul class="list-disc list-inside mt-4 ps-4 text-lg">
          <li>Surveillons et réduisons notre empreinte environnementale.</li>
          <li>Mettons en œuvre des politiques de travail équitable et de droits humains.</li>
          <li>Soutenons les communautés locales et les fournisseurs.</li>
          <li>Promouvons les transports et l'hébergement durables.</li>
          <li>Intégrons la durabilité dans la prise de décision commerciale.</li>
        </ul>

        <p class="text-xl mt-4">Nous progressons activement vers l'obtention du statut final <span class="font-medium text-secondary">Travelife Certified</span>, démontrant une conformité totale avec les critères internationaux de durabilité.</p>

        <p class="text-xl">De plus, nous collaborons avec un réseau soigneusement sélectionné d'hôtels et de complexes à travers l'Égypte qui détiennent des certifications de durabilité. Ces établissements répondent aux normes internationales en matière de protection de l'environnement, de responsabilité sociale et de qualité de service.</p>

        <p class="font-medium text-xl mt-4">Pour en savoir plus sur nos politiques, veuillez visiter :</p>

        <ul class="list-disc list-inside mt-4 ps-4 text-lg">
          <li>
            <a class="underline text-primary" target="_blank" href="https://docs.google.com/document/d/1T5v8kwtWD__2CFd1q9zN-jmFmIwt6_Wk/edit">Politique de Durabilité</a>
          </li>
          <li>
            <a class="underline text-primary" target="_blank" href="https://docs.google.com/spreadsheets/d/1SdEIAqsA571x1HMrbVIUlSjiw2_S7OXY/edit?gid=741107480#gid=741107480">
              Hébergements certifiés en Égypte
            </a>
          </li>
          <li>
            <a class="underline text-primary" href="${localePath('/privacy-and-cookies')}">
              Politique de Confidentialité
            </a>
          </li>
        </ul>

        <p class="text-xl mt-4 font-medium">Pour toute question relative à la durabilité, contactez-nous à :
          📧 sustainability@sunpyramidstours.com
        </p>
      </div>`,
    pt: `<div>
        <p class="text-xl">A Sun Pyramids Tours orgulha-se de ser <span class="font-medium text-secondary">Travelife Partner</span>, trabalhando para obter a Certificação Travelife completa. A Travelife é um programa de certificação de sustentabilidade reconhecido globalmente para operadores turísticos, alinhado com os padrões internacionais de turismo responsável.</p>

        <p class="font-medium text-xl mt-4">Como Travelife Partner, Nós:</p>

        <ul class="list-disc list-inside mt-4 ps-4 text-lg">
          <li>Monitoramos e reduzimos nossa pegada ambiental.</li>
          <li>Implementamos políticas de trabalho justo e direitos humanos.</li>
          <li>Apoiamos comunidades locais e fornecedores.</li>
          <li>Promovemos transporte e acomodação sustentáveis.</li>
          <li>Integramos a sustentabilidade na tomada de decisões comerciais.</li>
        </ul>

        <p class="text-xl mt-4">Estamos progredindo ativamente para alcançar o status final <span class="font-medium text-secondary">Travelife Certified</span>, demonstrando conformidade total com os critérios internacionais de sustentabilidade.</p>

        <p class="text-xl">Além disso, colaboramos com uma rede cuidadosamente selecionada de hotéis e resorts em todo o Egito que possuem certificações de sustentabilidade. Essas propriedades atendem aos padrões internacionais de proteção ambiental, responsabilidade social e qualidade de serviço.</p>

        <p class="font-medium text-xl mt-4">Para saber mais sobre nossas políticas, visite:</p>

        <ul class="list-disc list-inside mt-4 ps-4 text-lg">
          <li>
            <a class="underline text-primary" target="_blank" href="https://docs.google.com/document/d/1T5v8kwtWD__2CFd1q9zN-jmFmIwt6_Wk/edit">Política de Sustentabilidade</a>
          </li>
          <li>
            <a class="underline text-primary" target="_blank" href="https://docs.google.com/spreadsheets/d/1SdEIAqsA571x1HMrbVIUlSjiw2_S7OXY/edit?gid=741107480#gid=741107480">
              Acomodações certificadas no Egito
            </a>
          </li>
          <li>
            <a class="underline text-primary" href="${localePath('/privacy-and-cookies')}">
              Política de Privacidade
            </a>
          </li>
        </ul>

        <p class="text-xl mt-4 font-medium">Para consultas relacionadas à sustentabilidade, entre em contato:
          📧 sustainability@sunpyramidstours.com
        </p>
      </div>`,
    zh: `<div>
        <p class="text-xl">Sun Pyramids Tours很自豪能成为<span class="font-medium text-secondary">Travelife合作伙伴</span>，正在努力获得完整的Travelife认证。Travelife是一个全球公认的旅游运营商可持续发展认证计划，符合国际负责任旅游标准。</p>

        <p class="font-medium text-xl mt-4">作为Travelife合作伙伴，我们：</p>

        <ul class="list-disc list-inside mt-4 ps-4 text-lg">
          <li>监测和减少我们的环境足迹。</li>
          <li>实施公平劳动和人权政策。</li>
          <li>支持当地社区和供应商。</li>
          <li>推广可持续交通和住宿。</li>
          <li>将可持续发展融入商业决策。</li>
        </ul>

        <p class="text-xl mt-4">我们正在积极进步，争取达到最终的<span class="font-medium text-secondary">Travelife认证</span>状态，证明完全符合国际可持续性标准。</p>

        <p class="text-xl">此外，我们与埃及各地经过精心挑选的拥有可持续发展认证的酒店和度假村网络合作。这些物业符合环境保护、社会责任和优质服务的国际标准。</p>

        <p class="font-medium text-xl mt-4">要了解有关我们政策的更多信息，请访问：</p>

        <ul class="list-disc list-inside mt-4 ps-4 text-lg">
          <li>
            <a class="underline text-primary" href="https://docs.google.com/document/d/1T5v8kwtWD__2CFd1q9zN-jmFmIwt6_Wk/edit">可持续发展政策</a>
          </li>
          <li>
            <a class="underline text-primary" href="https://docs.google.com/spreadsheets/d/1SdEIAqsA571x1HMrbVIUlSjiw2_S7OXY/edit?gid=741107480#gid=741107480">
              埃及认证住宿
            </a>
          </li>
          <li>
            <a class="underline text-primary" href="${localePath('/privacy-and-cookies')}">
              隐私政策
            </a>
          </li>
        </ul>

        <p class="text-xl mt-4 font-medium">有关可持续发展的咨询，请联系我们：
          📧 sustainability@sunpyramidstours.com
        </p>
      </div>`
  },
  {
    objectId: 3,
    title: "Sustainability Education",
    en:
      `<div>
        <p class="text-xl">Responsible tourism is a shared responsibility.</p>
        <p class="text-xl">At Sun Pyramids Tours, sustainability education is embedded in our operations — from internal
          team training to guest awareness initiatives.</p>

        <h3 class="font-bold text-secondary text-2xl mt-4 ">Internal Training & Awareness</h3>

        <p class="font-medium text-xl mt-2">Our team members receive regular guidance on:
        </p>

        <ul class="list-disc list-inside mt-4 ps-4 text-lg">
          <li>Environmental responsibility
            .</li>
          <li>Waste reduction practices.</li>
          <li>Cultural sensitivity.</li>
          <li>Protection of natural sites.</li>
          <li>Ethical engagement with local communities.</li>
        </ul>


        <p class="text-xl mt-4">We ensure our guides and staff understand how to communicate sustainability principles
          to travelers while delivering exceptional service.
        </p>

        <h3 class="font-bold text-secondary text-2xl mt-4 ">Guest Awareness & Responsible Travel Guidance
        </h3>

        <p class="font-medium text-xl mt-2">We actively encourage our travelers to:
        </p>

        <ul class="list-disc list-inside mt-4 ps-4 text-lg">
          <li>Respect archaeological and natural sites.</li>
          <li>Minimize plastic use.</li>
          <li>Support local businesses and artisans.</li>
          <li>Conserve water and energy during their stay.</li>
          <li>Follow conservation guidelines in protected areas.</li>
        </ul>

        <h3 class="font-bold text-secondary text-2xl mt-4 ">Partner Collaboration
        </h3>

        <p class="text-xl mt-4">Before and during tours, we provide information that helps guests make environmentally
          conscious choices without compromising comfort or enjoyment.
        </p>

        <p class="text-xl">Education is an ongoing process. By raising awareness among our team, partners, and
          guests, we contribute to a tourism industry that benefits both travelers and the destinations they explore.
        </p>
      </div>`,
    es: `<div>
        <p class="text-xl">El turismo responsable es una responsabilidad compartida.</p>
        <p class="text-xl">En Sun Pyramids Tours, la educación en sostenibilidad está integrada en nuestras operaciones, desde la capacitación interna del equipo hasta las iniciativas de concienciación de los huéspedes.</p>

        <h3 class="font-bold text-secondary text-2xl mt-4">Capacitación Interna y Concienciación</h3>

        <p class="font-medium text-xl mt-2">Nuestros miembros del equipo reciben orientación regular sobre:</p>

        <ul class="list-disc list-inside mt-4 ps-4 text-lg">
          <li>Responsabilidad ambiental.</li>
          <li>Prácticas de reducción de residuos.</li>
          <li>Sensibilidad cultural.</li>
          <li>Protección de sitios naturales.</li>
          <li>Compromiso ético con las comunidades locales.</li>
        </ul>

        <p class="text-xl mt-4">Nos aseguramos de que nuestros guías y personal entiendan cómo comunicar los principios de sostenibilidad a los viajeros mientras brindan un servicio excepcional.</p>

        <h3 class="font-bold text-secondary text-2xl mt-4">Concienciación de los Huéspedes y Guía de Viaje Responsable</h3>

        <p class="font-medium text-xl mt-2">Animamos activamente a nuestros viajeros a:</p>

        <ul class="list-disc list-inside mt-4 ps-4 text-lg">
          <li>Respetar los sitios arqueológicos y naturales.</li>
          <li>Minimizar el uso de plástico.</li>
          <li>Apoyar a negocios locales y artesanos.</li>
          <li>Conservar agua y energía durante su estancia.</li>
          <li>Seguir las pautas de conservación en áreas protegidas.</li>
        </ul>

        <h3 class="font-bold text-secondary text-2xl mt-4">Colaboración con Socios</h3>

        <p class="text-xl mt-4">Antes y durante los tours, proporcionamos información que ayuda a los huéspedes a tomar decisiones ambientalmente conscientes sin comprometer la comodidad o el disfrute.</p>

        <p class="text-xl">La educación es un proceso continuo. Al crear conciencia entre nuestro equipo, socios y huéspedes, contribuimos a una industria turística que beneficia tanto a los viajeros como a los destinos que exploran.</p>
      </div>`,
    de: `<div>
        <p class="text-xl">Verantwortungsvoller Tourismus ist eine gemeinsame Verantwortung.</p>
        <p class="text-xl">Bei Sun Pyramids Tours ist Nachhaltigkeitsbildung in unseren Betrieb integriert – von der internen Teammitgliedschulung bis hin zu Initiativen zur Gästesensibilisierung.</p>

        <h3 class="font-bold text-secondary text-2xl mt-4">Interne Schulung und Sensibilisierung</h3>

        <p class="font-medium text-xl mt-2">Unsere Teammitglieder erhalten regelmäßige Anleitungen zu:</p>

        <ul class="list-disc list-inside mt-4 ps-4 text-lg">
          <li>Umweltverantwortung.</li>
          <li>Abfallreduzierungspraktiken.</li>
          <li>Kulturelle Sensibilität.</li>
          <li>Schutz von Naturstätten.</li>
          <li>Ethische Zusammenarbeit mit lokalen Gemeinschaften.</li>
        </ul>

        <p class="text-xl mt-4">Wir stellen sicher, dass unsere Reiseleiter und Mitarbeiter verstehen, wie sie Nachhaltigkeitsprinzipien an Reisende vermitteln können, während sie einen außergewöhnlichen Service bieten.</p>

        <h3 class="font-bold text-secondary text-2xl mt-4">Gästesensibilisierung und verantwortungsvolle Reiseleitung</h3>

        <p class="font-medium text-xl mt-2">Wir ermutigen unsere Reisenden aktiv dazu:</p>

        <ul class="list-disc list-inside mt-4 ps-4 text-lg">
          <li>Archäologische und natürliche Stätten zu respektieren.</li>
          <li>Den Plastikverbrauch zu minimieren.</li>
          <li>Lokale Unternehmen und Handwerker zu unterstützen.</li>
          <li>Wasser und Energie während ihres Aufenthalts zu sparen.</li>
          <li>Die Schutzrichtlinien in geschützten Gebieten zu befolgen.</li>
        </ul>

        <h3 class="font-bold text-secondary text-2xl mt-4">Partnerschaftliche Zusammenarbeit</h3>

        <p class="text-xl mt-4">Vor und während der Touren bieten wir Informationen, die Gästen helfen, umweltbewusste Entscheidungen zu treffen, ohne Komfort oder Vergnügen zu beeinträchtigen.</p>

        <p class="text-xl">Bildung ist ein fortlaufender Prozess. Indem wir das Bewusstsein unseres Teams, unserer Partner und Gäste schärfen, tragen wir zu einer Tourismusbranche bei, die sowohl Reisenden als auch den von ihnen besuchten Zielen zugutekommt.</p>
      </div>`,
    it: `<div>
        <p class="text-xl">Il turismo responsabile è una responsabilità condivisa.</p>
        <p class="text-xl">In Sun Pyramids Tours, l'educazione alla sostenibilità è integrata nelle nostre operazioni, dalla formazione interna del team alle iniziative di sensibilizzazione degli ospiti.</p>

        <h3 class="font-bold text-secondary text-2xl mt-4">Formazione Interna e Sensibilizzazione</h3>

        <p class="font-medium text-xl mt-2">I nostri membri del team ricevono regolarmente indicazioni su:</p>

        <ul class="list-disc list-inside mt-4 ps-4 text-lg">
          <li>Responsabilità ambientale.</li>
          <li>Pratiche di riduzione dei rifiuti.</li>
          <li>Sensibilità culturale.</li>
          <li>Protezione dei siti naturali.</li>
          <li>Coinvolgimento etico con le comunità locali.</li>
        </ul>

        <p class="text-xl mt-4">Ci assicuriamo che le nostre guide e il personale comprendano come comunicare i principi di sostenibilità ai viaggiatori fornendo al contempo un servizio eccezionale.</p>

        <h3 class="font-bold text-secondary text-2xl mt-4">Consapevolezza degli Ospiti e Guida al Viaggio Responsabile</h3>

        <p class="font-medium text-xl mt-2">Incoraggiamo attivamente i nostri viaggiatori a:</p>

        <ul class="list-disc list-inside mt-4 ps-4 text-lg">
          <li>Rispettare i siti archeologici e naturali.</li>
          <li>Minimizzare l'uso della plastica.</li>
          <li>Sostenere le imprese locali e gli artigiani.</li>
          <li>Conservare acqua ed energia durante il soggiorno.</li>
          <li>Seguire le linee guida di conservazione nelle aree protette.</li>
        </ul>

        <h3 class="font-bold text-secondary text-2xl mt-4">Collaborazione con i Partner</h3>

        <p class="text-xl mt-4">Prima e durante i tour, forniamo informazioni che aiutano gli ospiti a fare scelte ambientalmente consapevoli senza compromettere il comfort o il divertimento.</p>

        <p class="text-xl">L'istruzione è un processo continuo. Sensibilizzando il nostro team, i partner e gli ospiti, contribuiamo a un'industria turistica che avvantaggia sia i viaggiatori che le destinazioni che esplorano.</p>
      </div>`,
    fr: `<div>
        <p class="text-xl">Le tourisme responsable est une responsabilité partagée.</p>
        <p class="text-xl">Chez Sun Pyramids Tours, l'éducation à la durabilité est intégrée à nos opérations, de la formation interne de l'équipe aux initiatives de sensibilisation des clients.</p>

        <h3 class="font-bold text-secondary text-2xl mt-4">Formation Interne et Sensibilisation</h3>

        <p class="font-medium text-xl mt-2">Les membres de notre équipe reçoivent régulièrement des conseils sur :</p>

        <ul class="list-disc list-inside mt-4 ps-4 text-lg">
          <li>La responsabilité environnementale.</li>
          <li>Les pratiques de réduction des déchets.</li>
          <li>La sensibilité culturelle.</li>
          <li>La protection des sites naturels.</li>
          <li>L'engagement éthique avec les communautés locales.</li>
        </ul>

        <p class="text-xl mt-4">Nous veillons à ce que nos guides et notre personnel comprennent comment communiquer les principes de durabilité aux voyageurs tout en offrant un service exceptionnel.</p>

        <h3 class="font-bold text-secondary text-2xl mt-4">Sensibilisation des Clients et Guide de Voyage Responsable</h3>

        <p class="font-medium text-xl mt-2">Nous encourageons activement nos voyageurs à :</p>

        <ul class="list-disc list-inside mt-4 ps-4 text-lg">
          <li>Respecter les sites archéologiques et naturels.</li>
          <li>Minimiser l'utilisation du plastique.</li>
          <li>Soutenir les entreprises locales et les artisans.</li>
          <li>Économiser l'eau et l'énergie pendant leur séjour.</li>
          <li>Suivre les directives de conservation dans les zones protégées.</li>
        </ul>

        <h3 class="font-bold text-secondary text-2xl mt-4">Collaboration avec les Partenaires</h3>

        <p class="text-xl mt-4">Avant et pendant les visites, nous fournissons des informations qui aident les clients à faire des choix respectueux de l'environnement sans compromettre le confort ou le plaisir.</p>

        <p class="text-xl">L'éducation est un processus continu. En sensibilisant notre équipe, nos partenaires et nos clients, nous contribuons à une industrie touristique qui profite à la fois aux voyageurs et aux destinations qu'ils explorent.</p>
      </div>`,
    pt: `<div>
        <p class="text-xl">O turismo responsável é uma responsabilidade compartilhada.</p>
        <p class="text-xl">Na Sun Pyramids Tours, a educação em sustentabilidade está incorporada em nossas operações — desde o treinamento interno da equipe até iniciativas de conscientização dos hóspedes.</p>

        <h3 class="font-bold text-secondary text-2xl mt-4">Treinamento Interno e Conscientização</h3>

        <p class="font-medium text-xl mt-2">Nossos membros da equipe recebem orientação regular sobre:</p>

        <ul class="list-disc list-inside mt-4 ps-4 text-lg">
          <li>Responsabilidade ambiental.</li>
          <li>Práticas de redução de resíduos.</li>
          <li>Sensibilidade cultural.</li>
          <li>Proteção de sítios naturais.</li>
          <li>Engajamento ético com comunidades locais.</li>
        </ul>

        <p class="text-xl mt-4">Garantimos que nossos guias e funcionários entendam como comunicar princípios de sustentabilidade aos viajantes enquanto oferecem um serviço excepcional.</p>

        <h3 class="font-bold text-secondary text-2xl mt-4">Conscientização dos Hóspedes e Orientação de Viagem Responsável</h3>

        <p class="font-medium text-xl mt-2">Incentivamos ativamente nossos viajantes a:</p>

        <ul class="list-disc list-inside mt-4 ps-4 text-lg">
          <li>Respeitar sítios arqueológicos e naturais.</li>
          <li>Minimizar o uso de plástico.</li>
          <li>Apoiar empresas locais e artesãos.</li>
          <li>Conservar água e energia durante a estadia.</li>
          <li>Seguir as diretrizes de conservação em áreas protegidas.</li>
        </ul>

        <h3 class="font-bold text-secondary text-2xl mt-4">Colaboração com Parceiros</h3>

        <p class="text-xl mt-4">Antes e durante os passeios, fornecemos informações que ajudam os hóspedes a fazer escolhas ambientalmente conscientes sem comprometer o conforto ou o prazer.</p>

        <p class="text-xl">A educação é um processo contínuo. Ao aumentar a conscientização entre nossa equipe, parceiros e hóspedes, contribuímos para uma indústria do turismo que beneficia tanto os viajantes quanto os destinos que eles exploram.</p>
      </div>`,
    zh: `<div>
        <p class="text-xl">负责任的旅游是共同的责任。</p>
        <p class="text-xl">在Sun Pyramids Tours，可持续发展教育贯穿我们的运营中——从内部团队培训到客人意识倡议。</p>

        <h3 class="font-bold text-secondary text-2xl mt-4">内部培训与意识提升</h3>

        <p class="font-medium text-xl mt-2">我们的团队成员定期接受以下方面的指导：</p>

        <ul class="list-disc list-inside mt-4 ps-4 text-lg">
          <li>环境责任。</li>
          <li>减少浪费的做法。</li>
          <li>文化敏感性。</li>
          <li>自然遗址的保护。</li>
          <li>与当地社区的道德接触。</li>
        </ul>

        <p class="text-xl mt-4">我们确保我们的导游和员工了解如何向旅行者传达可持续发展原则，同时提供卓越的服务。</p>

        <h3 class="font-bold text-secondary text-2xl mt-4">客人意识与负责任旅行指导</h3>

        <p class="font-medium text-xl mt-2">我们积极鼓励我们的旅行者：</p>

        <ul class="list-disc list-inside mt-4 ps-4 text-lg">
          <li>尊重考古和自然遗址。</li>
          <li>尽量减少塑料使用。</li>
          <li>支持当地企业和工匠。</li>
          <li>在住宿期间节约水和能源。</li>
          <li>遵守保护区的保护指南。</li>
        </ul>

        <h3 class="font-bold text-secondary text-2xl mt-4">合作伙伴协作</h3>

        <p class="text-xl mt-4">在旅行之前和期间，我们提供信息帮助客人在不妥协舒适或享受的情况下做出环保选择。</p>

        <p class="text-xl">教育是一个持续的过程。通过提高我们的团队、合作伙伴和客人的意识，我们为旅游业做出贡献，使旅行者和他们探索的目的地都受益。</p>
      </div>`
  }
];

</script>

<style scoped lang="scss"></style>
