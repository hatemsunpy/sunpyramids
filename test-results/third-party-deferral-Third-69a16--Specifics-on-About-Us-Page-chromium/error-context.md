# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: third-party-deferral.spec.ts >> Third-Party Script Deferral Verification >> T016c: TrustIndex Specifics on About Us Page
- Location: tests\third-party-deferral.spec.ts:106:3

# Error details

```
Error: Expected no TrustIndex requests on a page without the widget container

expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 12
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - navigation [ref=e3]:
      - generic [ref=e4]:
        - img "logo" [ref=e5] [cursor=pointer]
        - generic [ref=e6]:
          - img [ref=e8]
          - textbox "Find places and things to do" [ref=e13]
        - generic [ref=e14]:
          - generic [ref=e16] [cursor=pointer]:
            - img "logo" [ref=e17]
            - generic [ref=e18]: EN - USD
          - button [ref=e19] [cursor=pointer]:
            - img [ref=e21]
          - button "Sign in" [ref=e29] [cursor=pointer]:
            - generic [ref=e30]: Sign in
    - navigation [ref=e31]:
      - list [ref=e33]:
        - listitem [ref=e34]:
          - link "Home" [ref=e35] [cursor=pointer]:
            - /url: /
        - listitem [ref=e36]:
          - generic [ref=e37]:
            - generic [ref=e38]: Egypt Tours
            - img [ref=e40]
        - listitem [ref=e42]:
          - link "Rent Car" [ref=e43] [cursor=pointer]:
            - /url: /rent-car
        - listitem [ref=e44]:
          - link "About Us" [ref=e45] [cursor=pointer]:
            - /url: /about-us
        - listitem [ref=e46]:
          - link "Contact Us" [ref=e47] [cursor=pointer]:
            - /url: /contact-us
        - listitem [ref=e48]:
          - link "Blogs" [ref=e49] [cursor=pointer]:
            - /url: /blogs/all-blogs
        - listitem [ref=e50]:
          - link "Events" [ref=e51] [cursor=pointer]:
            - /url: /events
        - listitem [ref=e52]:
          - link "Special Offer" [ref=e53] [cursor=pointer]:
            - /url: /trips?main=special-offers
            - img [ref=e55]
            - generic [ref=e57]: Special Offer
      - button "Make Your Trip" [ref=e58] [cursor=pointer]:
        - generic [ref=e59]: Make Your Trip
    - generic [ref=e60]:
      - generic [ref=e61]:
        - heading "About Us" [level=1] [ref=e62]
        - heading "Your Journey Begins with Us" [level=3] [ref=e63]
        - heading "Over 50 Years of Travel Expertise" [level=3] [ref=e64]
      - generic [ref=e71]:
        - generic [ref=e72]:
          - heading "About Sun Pyramids Tours" [level=3] [ref=e73]
          - generic [ref=e74]:
            - generic [ref=e75]:
              - img [ref=e78]
              - paragraph [ref=e82]: Sun Pyramids Tours is an Egyptian travel agency established in 1970 and licensed by the Ministry of Tourism (License No, 92, Class A) as one of the first hundred tourism companies in Egypt with over (50) years of experience in the tourism sector .
            - generic [ref=e83]:
              - img [ref=e86]
              - paragraph [ref=e90]: Sun Pyramids Tours has been working with tour operators, airlines, and hotels for over 48 years, giving us exclusive benefits for each service provider .
            - generic [ref=e91]:
              - img [ref=e94]
              - paragraph [ref=e98]: Our tours cover all the essentials while empowering you to customize your ideal vacation with modern transportation, comfortable accommodations, city tours, and plenty of meals included .
            - generic [ref=e99]:
              - img [ref=e102]
              - paragraph [ref=e106]: With Sun Pyramids Tours, we excel at helping you plan your vacation .
        - img "distination image" [ref=e108]
      - generic [ref=e109]:
        - heading "Where are our Customers from ?" [level=3] [ref=e110]
        - heading "Our customers are from all over the world" [level=6] [ref=e111]
        - img [ref=e112]
      - generic [ref=e113]:
        - img "distination image" [ref=e115]
        - generic [ref=e116]:
          - heading "Destinations and Services Offered" [level=3] [ref=e117]
          - generic [ref=e118]:
            - generic [ref=e119]:
              - img [ref=e122]
              - paragraph [ref=e124]: At Sun Pyramids Tours, we pride ourselves in providing unforgettable travel experiences for individuals or groups, corporate incentives, study programs, and even religious tours .
            - generic [ref=e125]:
              - img [ref=e128]
              - paragraph [ref=e130]: Aside from Cairo and Luxor, we service Aswan, Abu Simbel, Alexandria, the Red Sea, the Western Desert Oases, Sinai, Dahab, Nuweiba, St Catherine, and even the stunning region of Sinai .
            - generic [ref=e131]:
              - img [ref=e134]
              - paragraph [ref=e136]: Our extensive travel services include many exciting options such as airport transfers, shore excursions, desert safari tours, and stunning Nile Cruise tours from Aswan to Luxor .
            - generic [ref=e137]:
              - img [ref=e140]
              - paragraph [ref=e142]: With over 50 years of experience, we work with the best tourism operators and some airlines and hotels to provide exclusive privileges and exceptional services .
            - generic [ref=e143]:
              - img [ref=e146]
              - paragraph [ref=e148]: All our tours include modern transportation, comfortable hotels, and guided city tours accompanied by delicious meals, and are designed to suit your unique traveling requirements .
            - generic [ref=e149]:
              - img [ref=e152]
              - paragraph [ref=e154]: By having dedicated offices in every major destination, Sun Pyramids Tours commits to providing endless remarkable memories while taking the stress out of holiday planning .
      - generic [ref=e155]:
        - heading "Partnership Benefits and Custom Services" [level=3] [ref=e156]
        - generic [ref=e157]:
          - generic [ref=e158]:
            - img [ref=e161]
            - heading "Exclusive benefits from trusted partners" [level=6] [ref=e163]
          - generic [ref=e164]:
            - img [ref=e167]
            - 'heading "Complete planning: transport, stays, and city tours" [level=6] [ref=e169]'
          - generic [ref=e170]:
            - img [ref=e173]
            - heading "Essential tours with customizable options" [level=6] [ref=e178]
      - generic [ref=e179]:
        - generic [ref=e180]:
          - heading "Travelife Certified Certification" [level=3] [ref=e181]
          - paragraph [ref=e184]:
            - text: We at Sun Pyramids Tours believe that by taking proactive steps to minimize our environmental footprint, we can contribute to a healthier planet for future generations. We’re committed to sustainable travel and are proud to have achieved the travel life partner certificate, and aiming soon to achieve the travel life final certification, which means we meet international standards for responsible tourism. From reducing our environmental impact to supporting local communities, we’re dedicated to making a positive difference. When you choose us, you’re not just booking a trip, you’re supporting a greener, more ethical way to explore the world. Join us on this journey toward a more sustainable future! Explore responsibly with us, check our Privacy, Sustainability, and Responsible Travel policies. We proudly collaborate with a carefully selected group of hotels and resorts across Egypt that are certified for their commitment to sustainable and responsible tourism. Each property on this list meets international standards for environmental care, social responsibility, and quality service, ensuring you enjoy a stay that supports both comfort and conscious travel. See the list
            - link "here" [ref=e185] [cursor=pointer]:
              - /url: https://docs.google.com/spreadsheets/d/1SdEIAqsA571x1HMrbVIUlSjiw2_S7OXY/edit?usp=sharing&ouid=100898331197827306244&rtpof=true&sd=true
              - strong [ref=e186]: here
            - text: ",and See the Sustainability Policy"
            - link "here" [ref=e187] [cursor=pointer]:
              - /url: https://docs.google.com/document/d/1T5v8kwtWD__2CFd1q9zN-jmFmIwt6_Wk/edit?usp=sharing&ouid=103811166013034787069&rtpof=true&sd=true
              - strong [ref=e188]: here
            - strong [ref=e189]: "Contact email :"
            - text: sustainability@sunpyramidstours.com
        - img [ref=e191]
      - generic [ref=e192]:
        - generic [ref=e193]:
          - heading "Our Mission" [level=4] [ref=e195]
          - paragraph [ref=e196]:
            - text: At Sun Pyramids Tours, we are dedicated to delivering exceptional and immersive travel experiences that showcase Egypt's rich history and culture. With over 50 years of expertise, we prioritize long-term partnerships with travelers, airlines, hotels, and global tour operators to provide seamless, high-quality service.
            - text: Sustainability is at our core—we actively reduce our environmental footprint by integrating eco-friendly practices, digital solutions, and responsible tourism initiatives. Through continuous innovation and personalized service, we ensure unforgettable, hassle-free journeys that exceed expectations while preserving Egypt's heritage for future generations.
        - generic [ref=e197]:
          - heading "Our Vision" [level=4] [ref=e199]
          - paragraph [ref=e200]:
            - text: Our vision is to be Egypt's leading travel company, recognized for excellence, innovation, and sustainability. We aim to set new industry standards by delivering high-quality, value-driven tours while embracing cutting-edge technology and responsible tourism.
            - text: By fostering a dynamic team of experienced professionals and young talents, we strive to combine tradition with modern expertise, ensuring unparalleled customer satisfaction and meaningful cultural exchanges. Our commitment extends beyond travel—we seek to make a lasting impact on our clients, our community, and the environment.
      - generic [ref=e202]:
        - heading "Our partners" [level=3] [ref=e203]
        - generic [ref=e205]:
          - img "Partner1 logo" [ref=e207]
          - img "Civitatis logo" [ref=e209]
          - img "Partner logo" [ref=e211]
          - img "Partner2 logo" [ref=e213]
          - img "Partner3 logo" [ref=e215]
          - img "Partner4 logo" [ref=e217]
          - img "Partner5 logo" [ref=e219]
          - img "Partner6 logo" [ref=e221]
          - img "Partner7 logo" [ref=e223]
          - img "Partner8 logo" [ref=e225]
          - img "Partner9 logo" [ref=e227]
          - img "Partner12 logo" [ref=e229]
          - img "Partner99 logo" [ref=e231]
          - img "TourRadar logo" [ref=e233]
          - img "Viator logo" [ref=e235]
      - generic [ref=e236]:
        - heading "Our Team" [level=3] [ref=e237]
        - generic [ref=e238]:
          - generic [ref=e239]:
            - img "Adly Ebrahim" [ref=e240]
            - heading "Adly Ebrahim" [level=5] [ref=e241]
            - paragraph [ref=e242]: Responsible Manager
          - generic [ref=e243]:
            - img "Mahmoud Badia" [ref=e244]
            - heading "Mahmoud Badia" [level=5] [ref=e245]
            - paragraph [ref=e246]: Executive Manager
          - generic [ref=e247]:
            - img "Ahmed Samir" [ref=e248]
            - heading "Ahmed Samir" [level=5] [ref=e249]
            - paragraph [ref=e250]: Finance Manager
          - generic [ref=e251]:
            - img "Hussien Karem" [ref=e252]
            - heading "Hussien Karem" [level=5] [ref=e253]
            - paragraph [ref=e254]: HR Manager
          - generic [ref=e255]:
            - img "Ahmed Talaat" [ref=e256]
            - heading "Ahmed Talaat" [level=5] [ref=e257]
            - paragraph [ref=e258]: Customer Success Manager
          - generic [ref=e259]:
            - img "Yasmin Ahmed" [ref=e260]
            - heading "Yasmin Ahmed" [level=5] [ref=e261]
            - paragraph [ref=e262]: Operation Manager
          - generic [ref=e263]:
            - img "Mennatullah Esmail" [ref=e264]
            - heading "Mennatullah Esmail" [level=5] [ref=e265]
            - paragraph [ref=e266]: Reservation Manager
          - generic [ref=e267]:
            - img "Nada Abdelazim" [ref=e268]
            - heading "Nada Abdelazim" [level=5] [ref=e269]
            - paragraph [ref=e270]: Sales Manager
          - generic [ref=e271]:
            - img "Hagar Hassan" [ref=e272]
            - heading "Hagar Hassan" [level=5] [ref=e273]
            - paragraph [ref=e274]: Vice Tour Operators' Manager
          - generic [ref=e275]:
            - img "Alaa Ali" [ref=e276]
            - heading "Alaa Ali" [level=5] [ref=e277]
            - paragraph [ref=e278]: Transportation Manager
          - generic [ref=e279]:
            - img "Ahmed Badia" [ref=e280]
            - heading "Ahmed Badia" [level=5] [ref=e281]
            - paragraph [ref=e282]: Marketing Manager
      - generic [ref=e283]:
        - heading "CEO Message" [level=3] [ref=e284]
        - generic [ref=e285]:
          - generic [ref=e286]:
            - generic [ref=e287]:
              - img [ref=e288]
              - generic [ref=e289]:
                - heading "Mahmoud Badia" [level=6] [ref=e290]
                - paragraph [ref=e291]: Executive Manager
            - img [ref=e292]
          - generic [ref=e293]:
            - paragraph [ref=e294]: Dear Valued Visitor,
            - paragraph [ref=e295]:
              - text: Welcome to Sun Pyramids Tours! Our exceptional team of dedicated managers and staff is here to administer your travel program.
              - text: Our highly professional and experienced travel experts, with over 20 years of experience, work together in our knowledge-sharing office to benefit our valued customers. We are excited to hear from you, discuss your travel plans, and assist in developing your trip to make it both delightful and memorable. Please allow us to make your travel enjoyable with Sun Pyramids Tours. As the CEO of Sun Pyramids Tours, I reflect with great satisfaction on the incredible growth and accomplishments of our company. Since our modest beginning in 1970, we have evolved into one of the country's leading travel enterprises. Our team's enthusiasm, dedication, and hard work have positioned us as a trendsetter in travel services. With my over 20 years of travel experience worldwide, including in Africa, Egypt, India, and many other destinations, I have gained extensive knowledge to provide comfortable services to travelers of all classes. Our goal is to exceed your expectations of customer service and delight you in every possible way. We are honored that you have chosen us to serve your travel needs and assure you of the utmost convenience and safety wherever you wish to go. At Sun Pyramids Tours, we take pride in our network of employees and affiliates who strive for excellence and cater to the ever-evolving expectations of our valued customers. We appreciate the confidence you place in our team and services. We welcome the opportunity to work with you on all your travel needs.
            - paragraph [ref=e296]: Warm regards,
      - generic [ref=e297]:
        - heading "Frequently Asked Questions" [level=3] [ref=e299]
        - generic [ref=e300]:
          - generic [ref=e302] [cursor=pointer]:
            - heading "How does 24/7/365 support work?" [level=6] [ref=e303]
            - img [ref=e305]
          - button "See more" [ref=e311] [cursor=pointer]:
            - generic [ref=e312]: See more
            - img [ref=e314]
      - generic [ref=e318]:
        - generic [ref=e320]:
          - heading "Need help to Finding your Trip?" [level=3] [ref=e321]
          - generic [ref=e323]:
            - generic [ref=e327]:
              - textbox "Full Name" [ref=e328]:
                - /placeholder: ""
              - generic [ref=e329]: Full Name
            - button "Nationality" [ref=e333] [cursor=pointer]:
              - generic [ref=e334]:
                - button [ref=e335]:
                  - textbox [ref=e336]
                - button [ref=e337]:
                  - img [ref=e339]
                - button "Nationality" [ref=e341]
            - generic [ref=e345]:
              - button "AF +93" [ref=e348] [cursor=pointer]:
                - img "AF" [ref=e349]
                - paragraph [ref=e350]: "+93"
                - img [ref=e352]
                - paragraph [ref=e354]
              - generic [ref=e355]:
                - spinbutton "Phone" [ref=e356]
                - generic [ref=e357]: Phone
            - button "Contact Now" [ref=e358] [cursor=pointer]:
              - generic [ref=e359]: Contact Now
        - generic [ref=e360]:
          - generic [ref=e362]:
            - heading "Gallery of Exciting journeys" [level=3] [ref=e363]
            - heading "Follow us on social media to see more Exciting journeys" [level=6] [ref=e364]
          - generic [ref=e366]:
            - generic [ref=e367]:
              - link [ref=e368] [cursor=pointer]:
                - /url: https://youtube.com/shorts/kvS38V3N5_Q?si=ffmF622fPHZyKuRy
              - button "Open link" [ref=e369] [cursor=pointer]
            - generic:
              - link:
                - /url: https://youtu.be/R8ToDUiuFyE?si=7-lQlKWMAFJUzGyn
              - button "Open link" [ref=e370] [cursor=pointer]
            - generic [ref=e371]:
              - link [ref=e372] [cursor=pointer]:
                - /url: https://vt.tiktok.com/ZSAdunkgH/
              - button "Open link" [ref=e373] [cursor=pointer]
            - generic [ref=e374]:
              - link [ref=e375] [cursor=pointer]:
                - /url: https://www.instagram.com/reel/DBCmWQ0t_nr/?igsh=cDZ2M2xveXUweWM3
              - button "Open link" [ref=e376] [cursor=pointer]
            - generic:
              - link:
                - /url: https://www.facebook.com/share/r/15ANuuE3pZb/
              - button "Open link" [ref=e377] [cursor=pointer]
    - button [ref=e378] [cursor=pointer]:
      - img [ref=e379]
    - img "chair icon" [ref=e382]
    - contentinfo [ref=e383]:
      - generic [ref=e384]:
        - generic [ref=e385]:
          - img "logo" [ref=e386]
          - paragraph [ref=e387]: Need Our Help ?
          - paragraph [ref=e388]: We Would Happy To Help You ...
          - generic [ref=e389]:
            - button [ref=e390] [cursor=pointer]:
              - img [ref=e392]
            - button [ref=e394] [cursor=pointer]:
              - img [ref=e396]
            - button [ref=e399] [cursor=pointer]:
              - img [ref=e401]
            - button [ref=e403] [cursor=pointer]:
              - img [ref=e405]
          - img "certified footer" [ref=e410] [cursor=pointer]
        - generic [ref=e411]:
          - paragraph [ref=e412]: Sunpyramids Links
          - list [ref=e413]:
            - listitem [ref=e414]:
              - link "Home" [ref=e415] [cursor=pointer]:
                - /url: /
                - generic [ref=e416]: Home
            - listitem [ref=e417]:
              - link "One Day Tours" [ref=e418] [cursor=pointer]:
                - /url: /egypt-tours/one-day-tours
                - generic [ref=e419]: One Day Tours
            - listitem [ref=e420]:
              - link "Multi Days Tours" [ref=e421] [cursor=pointer]:
                - /url: /egypt-tours/multi-days-tours
                - generic [ref=e422]: Multi Days Tours
            - listitem [ref=e423]:
              - link "Nile Cruises" [ref=e424] [cursor=pointer]:
                - /url: /egypt-tours/nile-cruises
                - generic [ref=e425]: Nile Cruises
            - listitem [ref=e426]:
              - link "Shore Excursion" [ref=e427] [cursor=pointer]:
                - /url: /egypt-tours/shore-excursions
                - generic [ref=e428]: Shore Excursion
            - listitem [ref=e429]:
              - link "Special Offer" [ref=e430] [cursor=pointer]:
                - /url: /trips?main=special-offers
                - generic [ref=e431]: Special Offer
                - img [ref=e433]
            - listitem [ref=e435]:
              - link "Rent Car" [ref=e436] [cursor=pointer]:
                - /url: /rent-car
                - generic [ref=e437]: Rent Car
            - listitem [ref=e438]:
              - link "About Us" [ref=e439] [cursor=pointer]:
                - /url: /about-us
                - generic [ref=e440]: About Us
            - listitem [ref=e441]:
              - link "Contact Us" [ref=e442] [cursor=pointer]:
                - /url: /contact-us
                - generic [ref=e443]: Contact Us
            - listitem [ref=e444]:
              - link "Egypt Travel Guide" [ref=e445] [cursor=pointer]:
                - /url: /egypt-travel-guide
                - generic [ref=e446]: Egypt Travel Guide
            - listitem [ref=e447]:
              - link "faqs" [ref=e448] [cursor=pointer]:
                - /url: /faqs
                - generic [ref=e449]: faqs
            - listitem [ref=e450]:
              - link "Events" [ref=e451] [cursor=pointer]:
                - /url: /events
                - generic [ref=e452]: Events
            - listitem [ref=e453]:
              - link "Accessible Travel" [ref=e454] [cursor=pointer]:
                - /url: /accessible-travel
                - generic [ref=e455]: Accessible Travel
        - generic [ref=e456]:
          - paragraph [ref=e457]: Contact Info
          - generic [ref=e458]:
            - generic [ref=e460]:
              - paragraph [ref=e461]:
                - link "+20 109 588 8830" [ref=e462] [cursor=pointer]:
                  - /url: tel:+20 109 588 8830
              - paragraph [ref=e463]:
                - link "+20 109 588 8831" [ref=e464] [cursor=pointer]:
                  - /url: tel:+20 109 588 8831
              - paragraph [ref=e465]:
                - link "+20 109 588 8835" [ref=e466] [cursor=pointer]:
                  - /url: tel:+20 109 588 8835
            - generic [ref=e467]:
              - img [ref=e468]
              - paragraph [ref=e471] [cursor=pointer]: +20 109 588 8830
            - generic [ref=e473]:
              - paragraph [ref=e474]:
                - link "info@sunpyramidstours.com" [ref=e475] [cursor=pointer]:
                  - /url: mailto:info@sunpyramidstours.com
              - paragraph [ref=e476]:
                - link "sales@sunpyramidstours.com" [ref=e477] [cursor=pointer]:
                  - /url: mailto:sales@sunpyramidstours.com
              - paragraph [ref=e478]:
                - link "sustainability@sunpyramidstours.com" [ref=e479] [cursor=pointer]:
                  - /url: mailto:sustainability@sunpyramidstours.com
            - paragraph [ref=e482] [cursor=pointer]: Pyramids View Tower - Mansourieh Intersection with Faisal - Above Tseppas Pastry - Fourth Floor
      - generic [ref=e485]:
        - paragraph [ref=e486]: All rights reserved to sunpyramids company, Egypt ©2024
        - generic [ref=e487]:
          - link "Privacy and Cookies" [ref=e488] [cursor=pointer]:
            - /url: /privacy-and-cookies
          - link "Terms and Conditions" [ref=e489] [cursor=pointer]:
            - /url: /terms-and-conditions
  - generic [ref=e490]:
    - button "Toggle Nuxt DevTools" [ref=e491] [cursor=pointer]:
      - img [ref=e492]
    - generic "Page load time" [ref=e495]:
      - generic [ref=e496]: "880"
      - generic [ref=e497]: ms
    - button "Toggle Component Inspector" [ref=e499] [cursor=pointer]:
      - img [ref=e500]
  - generic [ref=e504] [cursor=pointer]:
    - generic [ref=e506]:
      - img "Trustindex" [ref=e508]
      - generic [ref=e509]: Excellent Reviews
    - generic [ref=e511]:
      - text: Verified by
      - strong [ref=e512]: Trustindex
```

# Test source

```ts
  22  |     expect(hasNoscript).toBe(true);
  23  |   });
  24  | 
  25  |   test('T009d, T020-5: Interaction Trigger (scripts load after interaction)', async ({ page }) => {
  26  |     const thirdPartyRequests: string[] = [];
  27  |     page.on('request', request => {
  28  |       const url = request.url();
  29  |       if (url.includes('googletagmanager.com') || url.includes('google.com/recaptcha')) {
  30  |         thirdPartyRequests.push(url);
  31  |       }
  32  |     });
  33  | 
  34  |     await page.goto('/', { waitUntil: 'load' });
  35  |     expect(thirdPartyRequests.length).toBe(0);
  36  | 
  37  |     await page.waitForTimeout(1000);
  38  | 
  39  |     await page.evaluate(() => {
  40  |       window.dispatchEvent(new Event('mousemove'));
  41  |       window.dispatchEvent(new Event('scroll'));
  42  |     });
  43  | 
  44  |     await expect.poll(() => thirdPartyRequests.length, { timeout: 10000 }).toBeGreaterThan(0);
  45  |     
  46  |     const hasGtm = thirdPartyRequests.some(url => url.includes('googletagmanager.com'));
  47  |     const hasRecaptcha = thirdPartyRequests.some(url => url.includes('google.com/recaptcha'));
  48  |     expect(hasGtm, 'Expected GTM request after interaction').toBe(true);
  49  |     expect(hasRecaptcha, 'Expected reCAPTCHA request after interaction').toBe(true);
  50  |   });
  51  | 
  52  |   test('T017a-c, T020-7: No Third-Party Query Param', async ({ page }) => {
  53  |     const thirdPartyRequests: string[] = [];
  54  |     page.on('request', request => {
  55  |       const url = request.url();
  56  |       if (url.includes('googletagmanager.com') || url.includes('google.com/recaptcha') || url.includes('cdn.trustindex.io')) {
  57  |         thirdPartyRequests.push(url);
  58  |       }
  59  |     });
  60  | 
  61  |     await page.goto('/?no-third-party', { waitUntil: 'load' });
  62  |     await page.waitForTimeout(1000);
  63  | 
  64  |     await page.evaluate(() => {
  65  |       window.dispatchEvent(new Event('mousemove'));
  66  |       window.dispatchEvent(new Event('scroll'));
  67  |     });
  68  |     await page.waitForTimeout(2000);
  69  | 
  70  |     expect(thirdPartyRequests.length, 'Expected ZERO third party requests when no-third-party is present').toBe(0);
  71  | 
  72  |     const hasNoscript = await page.evaluate(() => {
  73  |       const noscripts = document.querySelectorAll('noscript');
  74  |       return Array.from(noscripts).some(n => n.innerHTML.includes('googletagmanager.com'));
  75  |     });
  76  |     expect(hasNoscript).toBe(false);
  77  |   });
  78  | 
  79  |   test('T018a-d, T020-8: SPA Navigation & Deduplication', async ({ page }) => {
  80  |     await page.goto('/', { waitUntil: 'load' });
  81  |     
  82  |     await page.evaluate(() => {
  83  |       window.dispatchEvent(new Event('mousemove'));
  84  |     });
  85  |     await page.waitForTimeout(2000);
  86  | 
  87  |     const aboutLink = page.locator('a[href="/about-us"]').first();
  88  |     if (await aboutLink.isVisible()) {
  89  |       await aboutLink.click();
  90  |       await page.waitForLoadState('load');
  91  |     }
  92  | 
  93  |     const contactLink = page.locator('a[href="/contact-us"]').first();
  94  |     if (await contactLink.isVisible()) {
  95  |       await contactLink.click();
  96  |       await page.waitForLoadState('load');
  97  |     }
  98  | 
  99  |     const gtmScripts = await page.locator('script[src*="googletagmanager.com/gtag/js"]').count();
  100 |     const recaptchaScripts = await page.locator('script[src*="google.com/recaptcha"]').count();
  101 | 
  102 |     expect(gtmScripts).toBe(1);
  103 |     expect(recaptchaScripts).toBe(1);
  104 |   });
  105 | 
  106 |   test('T016c: TrustIndex Specifics on About Us Page', async ({ page }) => {
  107 |     // Avoid /cart because the Nuxt server crashes due to a bug in useCookie
  108 |     const trustIndexRequests: string[] = [];
  109 |     page.on('request', request => {
  110 |       if (request.url().includes('cdn.trustindex.io')) {
  111 |         trustIndexRequests.push(request.url());
  112 |       }
  113 |     });
  114 | 
  115 |     await page.goto('/about-us', { waitUntil: 'load' });
  116 |     
  117 |     await page.evaluate(() => {
  118 |       window.dispatchEvent(new Event('mousemove'));
  119 |     });
  120 |     await page.waitForTimeout(2000);
  121 | 
> 122 |     expect(trustIndexRequests.length, 'Expected no TrustIndex requests on a page without the widget container').toBe(0);
      |                                                                                                                 ^ Error: Expected no TrustIndex requests on a page without the widget container
  123 |   });
  124 | });
  125 | 
```