# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: third-party-deferral.spec.ts >> Third-Party Script Deferral Verification >> T009d, T016b, T020-2: Initial Load (no third-party requests)
- Location: tests\third-party-deferral.spec.ts:4:3

# Error details

```
Error: Expected no third-party requests on initial load

expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 20
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - navigation [ref=e3]:
      - generic [ref=e4]:
        - img "logo" [ref=e5] [cursor=pointer]
        - list [ref=e6]:
          - listitem [ref=e7]:
            - link "Home" [ref=e8] [cursor=pointer]:
              - /url: /
          - listitem [ref=e9]:
            - generic [ref=e10]:
              - generic [ref=e11]: Egypt Tours
              - img [ref=e13]
          - listitem [ref=e15]:
            - link "About Us" [ref=e16] [cursor=pointer]:
              - /url: /about-us
          - listitem [ref=e17]:
            - link "Contact Us" [ref=e18] [cursor=pointer]:
              - /url: /contact-us
          - listitem [ref=e19]:
            - link "Blogs" [ref=e20] [cursor=pointer]:
              - /url: /blogs/all-blogs
          - listitem [ref=e21]:
            - link "Events" [ref=e22] [cursor=pointer]:
              - /url: /events
        - generic [ref=e23]:
          - generic [ref=e25] [cursor=pointer]:
            - img "logo" [ref=e26]
            - generic [ref=e27]: EN - USD
          - button [ref=e28] [cursor=pointer]:
            - img [ref=e30]
          - button "Sign in" [ref=e38] [cursor=pointer]:
            - generic [ref=e39]: Sign in
      - generic [ref=e40]:
        - generic [ref=e41]:
          - img [ref=e42]
          - img [ref=e43]
        - paragraph [ref=e44]: Book Your Egypt Easter Tour Now – Explore Pyramids, Nile Cruises & Limited Spring Offers - Book Our Egypt Easter Tour Itineraries
        - button "View Easter Tours" [ref=e45] [cursor=pointer]:
          - generic [ref=e46]: View Easter Tours
    - generic [ref=e47]:
      - generic [ref=e49]:
        - generic [ref=e50]:
          - generic [ref=e51]:
            - img "main-banner-images-0" [ref=e53]
            - img "main-banner-images-1" [ref=e55]
            - img "main-banner-images-2" [ref=e57]
            - img "main-banner-images-3" [ref=e59]
            - img "main-banner-images-4" [ref=e61]
            - img "main-banner-images-5" [ref=e63]
            - img "main-banner-images-6" [ref=e65]
            - img "main-banner-images-7" [ref=e67]
          - generic [ref=e77]:
            - generic [ref=e78]:
              - heading "Get started your" [level=3] [ref=e79]
              - heading "Exciting Journey With Us" [level=1] [ref=e80]
            - generic [ref=e81]:
              - generic [ref=e82]:
                - generic [ref=e83]:
                  - img [ref=e85]
                  - button "Make Your Trip" [ref=e87] [cursor=pointer]:
                    - generic [ref=e88]: Make Your Trip
                  - img [ref=e90]
                - generic [ref=e92]:
                  - img [ref=e94]
                  - button "Find your trip" [ref=e96] [cursor=pointer]:
                    - generic [ref=e97]: Find your trip
                  - img [ref=e99]
                - generic [ref=e101]:
                  - img [ref=e103]
                  - button "Rent Car" [ref=e105] [cursor=pointer]:
                    - generic [ref=e106]: Rent Car
                  - img [ref=e108]
              - generic [ref=e111]:
                - generic [ref=e112]:
                  - heading "When will you be traveling?" [level=6] [ref=e113]
                  - generic [ref=e114]:
                    - generic [ref=e118] [cursor=pointer]: Have An Exact Time
                    - generic [ref=e122] [cursor=pointer]: Have An Approximate Time
                    - generic [ref=e126] [cursor=pointer]: Not Sure Yet
                - generic [ref=e127]:
                  - generic [ref=e128] [cursor=pointer]:
                    - generic [ref=e129]:
                      - generic [ref=e130]: From
                      - generic [ref=e133]:
                        - textbox "Datepicker input" [ref=e134]:
                          - /placeholder: Select the start date of the trip
                        - img [ref=e135]
                    - img [ref=e141]
                  - generic [ref=e153] [cursor=pointer]:
                    - generic [ref=e154]:
                      - generic [ref=e155]: To
                      - generic [ref=e158]:
                        - textbox "Datepicker input" [ref=e159]:
                          - /placeholder: Select the end date of the trip
                        - img [ref=e160]
                    - img [ref=e166]
                  - button "Make Trip" [ref=e178] [cursor=pointer]:
                    - generic [ref=e179]: Make Trip
        - generic [ref=e180]:
          - generic [ref=e182]:
            - paragraph [ref=e183]: +100K
            - paragraph [ref=e184]: Happy customer
          - generic [ref=e186]:
            - paragraph [ref=e187]: "+50"
            - paragraph [ref=e188]: Years of experience
          - generic [ref=e190]:
            - paragraph [ref=e191]: "+60"
            - paragraph [ref=e192]: Total Destinations
          - generic [ref=e194]:
            - paragraph [ref=e195]: "5.0"
            - paragraph [ref=e196]: Rating in Tripadvisor
      - generic [ref=e197]:
        - generic [ref=e200]:
          - heading "Egypt Easter Tours" [level=3] [ref=e202]
          - heading "Celebrate Easter with unforgettable Egypt Itineraries" [level=6] [ref=e203]
        - generic [ref=e204]:
          - generic [ref=e206]:
            - generic [ref=e207]:
              - generic [ref=e208]:
                - generic [ref=e209]:
                  - link "Pyramids & Nile Cruise By Train During Easter image" [ref=e211] [cursor=pointer]:
                    - /url: /tour/pyramids-nile-cruise-by-train
                    - img "Pyramids & Nile Cruise By Train During Easter image" [ref=e212]
                  - link "Pyramids & Nile Cruise By Train During Easter image" [ref=e214] [cursor=pointer]:
                    - /url: /tour/pyramids-nile-cruise-by-train
                    - img "Pyramids & Nile Cruise By Train During Easter image" [ref=e215]
                  - link "Pyramids & Nile Cruise By Train During Easter image" [ref=e217] [cursor=pointer]:
                    - /url: /tour/pyramids-nile-cruise-by-train
                    - img "Pyramids & Nile Cruise By Train During Easter image" [ref=e218]
                  - link "Pyramids & Nile Cruise By Train During Easter image" [ref=e220] [cursor=pointer]:
                    - /url: /tour/pyramids-nile-cruise-by-train
                    - img "Pyramids & Nile Cruise By Train During Easter image" [ref=e221]
                  - link "Pyramids & Nile Cruise By Train During Easter image" [ref=e223] [cursor=pointer]:
                    - /url: /tour/pyramids-nile-cruise-by-train
                    - img "Pyramids & Nile Cruise By Train During Easter image" [ref=e224]
                  - link "Pyramids & Nile Cruise By Train During Easter image" [ref=e226] [cursor=pointer]:
                    - /url: /tour/pyramids-nile-cruise-by-train
                    - img "Pyramids & Nile Cruise By Train During Easter image" [ref=e227]
                - button [ref=e235] [cursor=pointer]:
                  - img [ref=e237]
              - generic [ref=e239]:
                - link "Pyramids & Nile Cruise By Train During Easter" [ref=e240] [cursor=pointer]:
                  - /url: /tour/pyramids-nile-cruise-by-train
                  - heading "Pyramids & Nile Cruise By Train During Easter" [level=6] [ref=e241]
                - generic [ref=e242]:
                  - generic [ref=e243]:
                    - generic [ref=e244]:
                      - img [ref=e246]
                      - paragraph [ref=e250]: 4 Cities
                    - paragraph [ref=e251]: Multi Days Tours
                  - generic [ref=e252]:
                    - generic [ref=e253]:
                      - paragraph [ref=e254]: Start From
                      - paragraph [ref=e256]: $1940.00
                    - generic [ref=e257]:
                      - img [ref=e259]
                      - paragraph [ref=e263]: 8 Days / 7 Night
            - generic [ref=e264]:
              - generic [ref=e265]:
                - generic [ref=e266]:
                  - 'link "4-Day Nile Cruise on the Royal Beau Rivage: Easter Hot Deals (Aswan to Luxor). image" [ref=e268] [cursor=pointer]':
                    - /url: /tour/4-Day-Nile-Cruise-on-the-Royal-Beau-Rivage-Easter-Hot-Deals-Aswan-to-Luxor
                    - 'img "4-Day Nile Cruise on the Royal Beau Rivage: Easter Hot Deals (Aswan to Luxor). image" [ref=e269]'
                  - 'link "4-Day Nile Cruise on the Royal Beau Rivage: Easter Hot Deals (Aswan to Luxor). image" [ref=e271] [cursor=pointer]':
                    - /url: /tour/4-Day-Nile-Cruise-on-the-Royal-Beau-Rivage-Easter-Hot-Deals-Aswan-to-Luxor
                    - 'img "4-Day Nile Cruise on the Royal Beau Rivage: Easter Hot Deals (Aswan to Luxor). image" [ref=e272]'
                  - 'link "4-Day Nile Cruise on the Royal Beau Rivage: Easter Hot Deals (Aswan to Luxor). image" [ref=e274] [cursor=pointer]':
                    - /url: /tour/4-Day-Nile-Cruise-on-the-Royal-Beau-Rivage-Easter-Hot-Deals-Aswan-to-Luxor
                    - 'img "4-Day Nile Cruise on the Royal Beau Rivage: Easter Hot Deals (Aswan to Luxor). image" [ref=e275]'
                  - 'link "4-Day Nile Cruise on the Royal Beau Rivage: Easter Hot Deals (Aswan to Luxor). image" [ref=e277] [cursor=pointer]':
                    - /url: /tour/4-Day-Nile-Cruise-on-the-Royal-Beau-Rivage-Easter-Hot-Deals-Aswan-to-Luxor
                    - 'img "4-Day Nile Cruise on the Royal Beau Rivage: Easter Hot Deals (Aswan to Luxor). image" [ref=e278]'
                  - 'link "4-Day Nile Cruise on the Royal Beau Rivage: Easter Hot Deals (Aswan to Luxor). image" [ref=e280] [cursor=pointer]':
                    - /url: /tour/4-Day-Nile-Cruise-on-the-Royal-Beau-Rivage-Easter-Hot-Deals-Aswan-to-Luxor
                    - 'img "4-Day Nile Cruise on the Royal Beau Rivage: Easter Hot Deals (Aswan to Luxor). image" [ref=e281]'
                  - 'link "4-Day Nile Cruise on the Royal Beau Rivage: Easter Hot Deals (Aswan to Luxor). image" [ref=e283] [cursor=pointer]':
                    - /url: /tour/4-Day-Nile-Cruise-on-the-Royal-Beau-Rivage-Easter-Hot-Deals-Aswan-to-Luxor
                    - 'img "4-Day Nile Cruise on the Royal Beau Rivage: Easter Hot Deals (Aswan to Luxor). image" [ref=e284]'
                - button [ref=e292] [cursor=pointer]:
                  - img [ref=e294]
              - generic [ref=e296]:
                - 'link "4-Day Nile Cruise on the Royal Beau Rivage: E..." [ref=e297] [cursor=pointer]':
                  - /url: /tour/4-Day-Nile-Cruise-on-the-Royal-Beau-Rivage-Easter-Hot-Deals-Aswan-to-Luxor
                  - 'heading "4-Day Nile Cruise on the Royal Beau Rivage: E..." [level=6] [ref=e298]'
                - generic [ref=e299]:
                  - generic [ref=e300]:
                    - generic [ref=e301]:
                      - img [ref=e303]
                      - paragraph [ref=e307]: Cairo
                    - paragraph [ref=e308]: Easter Tours
                  - generic [ref=e309]:
                    - generic [ref=e310]:
                      - paragraph [ref=e311]: Start From
                      - paragraph [ref=e313]: $1130.00
                    - generic [ref=e314]:
                      - img [ref=e316]
                      - paragraph [ref=e320]: 4 Days
            - generic [ref=e321]:
              - generic [ref=e322]:
                - generic [ref=e323]:
                  - 'link "Easter Escape: 4-Day White Desert & Bahariya Oasis Adventure. image" [ref=e325] [cursor=pointer]':
                    - /url: /tour/Easter-Escape-4-Day-White-Desert-Bahariya-Oasis-Adventure
                    - 'img "Easter Escape: 4-Day White Desert & Bahariya Oasis Adventure. image" [ref=e326]'
                  - 'link "Easter Escape: 4-Day White Desert & Bahariya Oasis Adventure. image" [ref=e328] [cursor=pointer]':
                    - /url: /tour/Easter-Escape-4-Day-White-Desert-Bahariya-Oasis-Adventure
                    - 'img "Easter Escape: 4-Day White Desert & Bahariya Oasis Adventure. image" [ref=e329]'
                  - 'link "Easter Escape: 4-Day White Desert & Bahariya Oasis Adventure. image" [ref=e331] [cursor=pointer]':
                    - /url: /tour/Easter-Escape-4-Day-White-Desert-Bahariya-Oasis-Adventure
                    - 'img "Easter Escape: 4-Day White Desert & Bahariya Oasis Adventure. image" [ref=e332]'
                  - 'link "Easter Escape: 4-Day White Desert & Bahariya Oasis Adventure. image" [ref=e334] [cursor=pointer]':
                    - /url: /tour/Easter-Escape-4-Day-White-Desert-Bahariya-Oasis-Adventure
                    - 'img "Easter Escape: 4-Day White Desert & Bahariya Oasis Adventure. image" [ref=e335]'
                  - 'link "Easter Escape: 4-Day White Desert & Bahariya Oasis Adventure. image" [ref=e337] [cursor=pointer]':
                    - /url: /tour/Easter-Escape-4-Day-White-Desert-Bahariya-Oasis-Adventure
                    - 'img "Easter Escape: 4-Day White Desert & Bahariya Oasis Adventure. image" [ref=e338]'
                  - 'link "Easter Escape: 4-Day White Desert & Bahariya Oasis Adventure. image" [ref=e340] [cursor=pointer]':
                    - /url: /tour/Easter-Escape-4-Day-White-Desert-Bahariya-Oasis-Adventure
                    - 'img "Easter Escape: 4-Day White Desert & Bahariya Oasis Adventure. image" [ref=e341]'
                - button [ref=e349] [cursor=pointer]:
                  - img [ref=e351]
              - generic [ref=e353]:
                - 'link "Easter Escape: 4-Day White Desert & Bahariya ..." [ref=e354] [cursor=pointer]':
                  - /url: /tour/Easter-Escape-4-Day-White-Desert-Bahariya-Oasis-Adventure
                  - 'heading "Easter Escape: 4-Day White Desert & Bahariya ..." [level=6] [ref=e355]'
                - generic [ref=e356]:
                  - generic [ref=e357]:
                    - generic [ref=e358]:
                      - img [ref=e360]
                      - paragraph [ref=e364]: Cairo
                    - paragraph [ref=e365]: Easter Tours
                  - generic [ref=e366]:
                    - generic [ref=e367]:
                      - paragraph [ref=e368]: Start From
                      - paragraph [ref=e370]: $230.00
                    - generic [ref=e371]:
                      - img [ref=e373]
                      - paragraph [ref=e377]: 4 Days
            - generic [ref=e378]:
              - generic [ref=e379]:
                - generic [ref=e380]:
                  - 'link "5-Day Private Tour: Easter Holiday Escape to Siwa’s Warmth & Oases image" [ref=e382] [cursor=pointer]':
                    - /url: /tour/5-Day-Private-Tour-Easter-Holiday-Escape-to-Siwa%E2%80%99s-Warmth-Oases
                    - 'img "5-Day Private Tour: Easter Holiday Escape to Siwa’s Warmth & Oases image" [ref=e383]'
                  - 'link "5-Day Private Tour: Easter Holiday Escape to Siwa’s Warmth & Oases image" [ref=e385] [cursor=pointer]':
                    - /url: /tour/5-Day-Private-Tour-Easter-Holiday-Escape-to-Siwa%E2%80%99s-Warmth-Oases
                    - 'img "5-Day Private Tour: Easter Holiday Escape to Siwa’s Warmth & Oases image" [ref=e386]'
                  - 'link "5-Day Private Tour: Easter Holiday Escape to Siwa’s Warmth & Oases image" [ref=e388] [cursor=pointer]':
                    - /url: /tour/5-Day-Private-Tour-Easter-Holiday-Escape-to-Siwa%E2%80%99s-Warmth-Oases
                    - 'img "5-Day Private Tour: Easter Holiday Escape to Siwa’s Warmth & Oases image" [ref=e389]'
                  - 'link "5-Day Private Tour: Easter Holiday Escape to Siwa’s Warmth & Oases image" [ref=e391] [cursor=pointer]':
                    - /url: /tour/5-Day-Private-Tour-Easter-Holiday-Escape-to-Siwa%E2%80%99s-Warmth-Oases
                    - 'img "5-Day Private Tour: Easter Holiday Escape to Siwa’s Warmth & Oases image" [ref=e392]'
                  - 'link "5-Day Private Tour: Easter Holiday Escape to Siwa’s Warmth & Oases image" [ref=e394] [cursor=pointer]':
                    - /url: /tour/5-Day-Private-Tour-Easter-Holiday-Escape-to-Siwa%E2%80%99s-Warmth-Oases
                    - 'img "5-Day Private Tour: Easter Holiday Escape to Siwa’s Warmth & Oases image" [ref=e395]'
                  - 'link "5-Day Private Tour: Easter Holiday Escape to Siwa’s Warmth & Oases image" [ref=e397] [cursor=pointer]':
                    - /url: /tour/5-Day-Private-Tour-Easter-Holiday-Escape-to-Siwa%E2%80%99s-Warmth-Oases
                    - 'img "5-Day Private Tour: Easter Holiday Escape to Siwa’s Warmth & Oases image" [ref=e398]'
                - button [ref=e406] [cursor=pointer]:
                  - img [ref=e408]
              - generic [ref=e410]:
                - 'link "5-Day Private Tour: Easter Holiday Escape to ..." [ref=e411] [cursor=pointer]':
                  - /url: /tour/5-Day-Private-Tour-Easter-Holiday-Escape-to-Siwa%E2%80%99s-Warmth-Oases
                  - 'heading "5-Day Private Tour: Easter Holiday Escape to ..." [level=6] [ref=e412]'
                - generic [ref=e413]:
                  - generic [ref=e414]:
                    - generic [ref=e415]:
                      - img [ref=e417]
                      - paragraph [ref=e421]: Cairo
                    - paragraph [ref=e422]: Easter Tours
                  - generic [ref=e423]:
                    - generic [ref=e424]:
                      - paragraph [ref=e425]: Start From
                      - paragraph [ref=e427]: $0.00
                    - generic [ref=e428]:
                      - img [ref=e430]
                      - paragraph [ref=e434]: 5 days
          - button "See more" [ref=e439] [cursor=pointer]:
            - generic [ref=e440]: See more
            - img [ref=e442]
      - generic [ref=e446]:
        - generic [ref=e448]:
          - heading "Popular Distination" [level=3] [ref=e449]
          - heading "Many very Exciting places for you to visit for the next trip" [level=6] [ref=e450]
        - generic [ref=e452]:
          - button "Recomanded" [ref=e453] [cursor=pointer]:
            - generic [ref=e454]: Recomanded
          - button "One Day" [ref=e455] [cursor=pointer]:
            - generic [ref=e456]: One Day
          - button "Multi Days" [ref=e457] [cursor=pointer]:
            - generic [ref=e458]: Multi Days
          - button "Nile Cruises" [ref=e459] [cursor=pointer]:
            - generic [ref=e460]: Nile Cruises
          - button "Shore Excursion" [ref=e461] [cursor=pointer]:
            - generic [ref=e462]: Shore Excursion
        - generic [ref=e463]:
          - generic [ref=e465]:
            - generic [ref=e466]:
              - generic [ref=e467]:
                - generic [ref=e468]:
                  - 'link "From Cairo: 6 Days Package to El Fayoum Oasis, White Desert and Bahariya Oasis image" [ref=e470] [cursor=pointer]':
                    - /url: /tour/from-cairo-6-days-package-to-el-fayoum-oasis-white-desert-and-bahariya-oasis
                    - 'img "From Cairo: 6 Days Package to El Fayoum Oasis, White Desert and Bahariya Oasis image" [ref=e471]'
                  - 'link "From Cairo: 6 Days Package to El Fayoum Oasis, White Desert and Bahariya Oasis image" [ref=e473] [cursor=pointer]':
                    - /url: /tour/from-cairo-6-days-package-to-el-fayoum-oasis-white-desert-and-bahariya-oasis
                    - 'img "From Cairo: 6 Days Package to El Fayoum Oasis, White Desert and Bahariya Oasis image" [ref=e474]'
                  - 'link "From Cairo: 6 Days Package to El Fayoum Oasis, White Desert and Bahariya Oasis image" [ref=e476] [cursor=pointer]':
                    - /url: /tour/from-cairo-6-days-package-to-el-fayoum-oasis-white-desert-and-bahariya-oasis
                    - 'img "From Cairo: 6 Days Package to El Fayoum Oasis, White Desert and Bahariya Oasis image" [ref=e477]'
                  - 'link "From Cairo: 6 Days Package to El Fayoum Oasis, White Desert and Bahariya Oasis image" [ref=e479] [cursor=pointer]':
                    - /url: /tour/from-cairo-6-days-package-to-el-fayoum-oasis-white-desert-and-bahariya-oasis
                    - 'img "From Cairo: 6 Days Package to El Fayoum Oasis, White Desert and Bahariya Oasis image" [ref=e480]'
                  - 'link "From Cairo: 6 Days Package to El Fayoum Oasis, White Desert and Bahariya Oasis image" [ref=e482] [cursor=pointer]':
                    - /url: /tour/from-cairo-6-days-package-to-el-fayoum-oasis-white-desert-and-bahariya-oasis
                    - 'img "From Cairo: 6 Days Package to El Fayoum Oasis, White Desert and Bahariya Oasis image" [ref=e483]'
                  - 'link "From Cairo: 6 Days Package to El Fayoum Oasis, White Desert and Bahariya Oasis image" [ref=e485] [cursor=pointer]':
                    - /url: /tour/from-cairo-6-days-package-to-el-fayoum-oasis-white-desert-and-bahariya-oasis
                    - 'img "From Cairo: 6 Days Package to El Fayoum Oasis, White Desert and Bahariya Oasis image" [ref=e486]'
                - button [ref=e494] [cursor=pointer]:
                  - img [ref=e496]
              - generic [ref=e498]:
                - 'link "From Cairo: 6 Days Package to El Fayoum Oasis..." [ref=e499] [cursor=pointer]':
                  - /url: /tour/from-cairo-6-days-package-to-el-fayoum-oasis-white-desert-and-bahariya-oasis
                  - 'heading "From Cairo: 6 Days Package to El Fayoum Oasis..." [level=6] [ref=e500]'
                - generic [ref=e501]:
                  - generic [ref=e502]:
                    - generic [ref=e503]:
                      - img [ref=e505]
                      - paragraph [ref=e509]: Cairo
                    - paragraph [ref=e510]: Desert Tours
                  - generic [ref=e511]:
                    - generic [ref=e512]:
                      - paragraph [ref=e513]: Start From
                      - paragraph [ref=e515]: $667.00
                    - generic [ref=e516]:
                      - img [ref=e518]
                      - paragraph [ref=e522]: 6 Days
            - generic [ref=e523]:
              - generic [ref=e524]:
                - generic [ref=e525]:
                  - link "Package 4 Days El-Fayoum Oasis, White Desert and Bahariya Oasis Tour image" [ref=e527] [cursor=pointer]:
                    - /url: /tour/package-4-days-el-fayoum-oasis-white-desert-and-bahariya-oasis-tour
                    - img "Package 4 Days El-Fayoum Oasis, White Desert and Bahariya Oasis Tour image" [ref=e528]
                  - link "Package 4 Days El-Fayoum Oasis, White Desert and Bahariya Oasis Tour image" [ref=e530] [cursor=pointer]:
                    - /url: /tour/package-4-days-el-fayoum-oasis-white-desert-and-bahariya-oasis-tour
                    - img "Package 4 Days El-Fayoum Oasis, White Desert and Bahariya Oasis Tour image" [ref=e531]
                  - link "Package 4 Days El-Fayoum Oasis, White Desert and Bahariya Oasis Tour image" [ref=e533] [cursor=pointer]:
                    - /url: /tour/package-4-days-el-fayoum-oasis-white-desert-and-bahariya-oasis-tour
                    - img "Package 4 Days El-Fayoum Oasis, White Desert and Bahariya Oasis Tour image" [ref=e534]
                  - link "Package 4 Days El-Fayoum Oasis, White Desert and Bahariya Oasis Tour image" [ref=e536] [cursor=pointer]:
                    - /url: /tour/package-4-days-el-fayoum-oasis-white-desert-and-bahariya-oasis-tour
                    - img "Package 4 Days El-Fayoum Oasis, White Desert and Bahariya Oasis Tour image" [ref=e537]
                  - link "Package 4 Days El-Fayoum Oasis, White Desert and Bahariya Oasis Tour image" [ref=e539] [cursor=pointer]:
                    - /url: /tour/package-4-days-el-fayoum-oasis-white-desert-and-bahariya-oasis-tour
                    - img "Package 4 Days El-Fayoum Oasis, White Desert and Bahariya Oasis Tour image" [ref=e540]
                  - link "Package 4 Days El-Fayoum Oasis, White Desert and Bahariya Oasis Tour image" [ref=e542] [cursor=pointer]:
                    - /url: /tour/package-4-days-el-fayoum-oasis-white-desert-and-bahariya-oasis-tour
                    - img "Package 4 Days El-Fayoum Oasis, White Desert and Bahariya Oasis Tour image" [ref=e543]
                - button [ref=e551] [cursor=pointer]:
                  - img [ref=e553]
              - generic [ref=e555]:
                - link "Package 4 Days El-Fayoum Oasis, White Desert ..." [ref=e556] [cursor=pointer]:
                  - /url: /tour/package-4-days-el-fayoum-oasis-white-desert-and-bahariya-oasis-tour
                  - heading "Package 4 Days El-Fayoum Oasis, White Desert ..." [level=6] [ref=e557]
                - generic [ref=e558]:
                  - generic [ref=e559]:
                    - generic [ref=e560]:
                      - img [ref=e562]
                      - paragraph [ref=e566]: Egypt
                    - paragraph [ref=e567]: Desert Tours
                  - generic [ref=e568]:
                    - generic [ref=e569]:
                      - paragraph [ref=e570]: Start From
                      - paragraph [ref=e572]: $360.00
                    - generic [ref=e573]:
                      - img [ref=e575]
                      - paragraph [ref=e579]: 4 Days
            - generic [ref=e580]:
              - generic [ref=e581]:
                - generic [ref=e582]:
                  - link "5 Days Trip to Siwa and Bahariya Oasis image" [ref=e584] [cursor=pointer]:
                    - /url: /tour/5-days-trip-to-siwa-and-bahariya-oasis
                    - img "5 Days Trip to Siwa and Bahariya Oasis image" [ref=e585]
                  - link "5 Days Trip to Siwa and Bahariya Oasis image" [ref=e587] [cursor=pointer]:
                    - /url: /tour/5-days-trip-to-siwa-and-bahariya-oasis
                    - img "5 Days Trip to Siwa and Bahariya Oasis image" [ref=e588]
                  - link "5 Days Trip to Siwa and Bahariya Oasis image" [ref=e590] [cursor=pointer]:
                    - /url: /tour/5-days-trip-to-siwa-and-bahariya-oasis
                    - img "5 Days Trip to Siwa and Bahariya Oasis image" [ref=e591]
                  - link "5 Days Trip to Siwa and Bahariya Oasis image" [ref=e593] [cursor=pointer]:
                    - /url: /tour/5-days-trip-to-siwa-and-bahariya-oasis
                    - img "5 Days Trip to Siwa and Bahariya Oasis image" [ref=e594]
                  - link "5 Days Trip to Siwa and Bahariya Oasis image" [ref=e596] [cursor=pointer]:
                    - /url: /tour/5-days-trip-to-siwa-and-bahariya-oasis
                    - img "5 Days Trip to Siwa and Bahariya Oasis image" [ref=e597]
                  - link "5 Days Trip to Siwa and Bahariya Oasis image" [ref=e599] [cursor=pointer]:
                    - /url: /tour/5-days-trip-to-siwa-and-bahariya-oasis
                    - img "5 Days Trip to Siwa and Bahariya Oasis image" [ref=e600]
                - button [ref=e608] [cursor=pointer]:
                  - img [ref=e610]
              - generic [ref=e612]:
                - link "5 Days Trip to Siwa and Bahariya Oasis" [ref=e613] [cursor=pointer]:
                  - /url: /tour/5-days-trip-to-siwa-and-bahariya-oasis
                  - heading "5 Days Trip to Siwa and Bahariya Oasis" [level=6] [ref=e614]
                - generic [ref=e615]:
                  - generic [ref=e616]:
                    - generic [ref=e617]:
                      - img [ref=e619]
                      - paragraph [ref=e623]: Egypt
                    - paragraph [ref=e624]: Desert Tours
                  - generic [ref=e625]:
                    - generic [ref=e626]:
                      - paragraph [ref=e627]: Start From
                      - paragraph [ref=e629]: $505.00
                    - generic [ref=e630]:
                      - img [ref=e632]
                      - paragraph [ref=e636]: 5 Days
            - generic [ref=e637]:
              - generic [ref=e638]:
                - generic [ref=e639]:
                  - link "Classic 8 Days Egypt Tour Package To Pyramids, Luxor & Aswan by Train image" [ref=e641] [cursor=pointer]:
                    - /url: /tour/classic-8-days-egypt-tour-package-to-pyramids-luxor-aswan-by-train
                    - img "Classic 8 Days Egypt Tour Package To Pyramids, Luxor & Aswan by Train image" [ref=e642]
                  - link "Classic 8 Days Egypt Tour Package To Pyramids, Luxor & Aswan by Train image" [ref=e644] [cursor=pointer]:
                    - /url: /tour/classic-8-days-egypt-tour-package-to-pyramids-luxor-aswan-by-train
                    - img "Classic 8 Days Egypt Tour Package To Pyramids, Luxor & Aswan by Train image" [ref=e645]
                  - link "Classic 8 Days Egypt Tour Package To Pyramids, Luxor & Aswan by Train image" [ref=e647] [cursor=pointer]:
                    - /url: /tour/classic-8-days-egypt-tour-package-to-pyramids-luxor-aswan-by-train
                    - img "Classic 8 Days Egypt Tour Package To Pyramids, Luxor & Aswan by Train image" [ref=e648]
                  - link "Classic 8 Days Egypt Tour Package To Pyramids, Luxor & Aswan by Train image" [ref=e650] [cursor=pointer]:
                    - /url: /tour/classic-8-days-egypt-tour-package-to-pyramids-luxor-aswan-by-train
                    - img "Classic 8 Days Egypt Tour Package To Pyramids, Luxor & Aswan by Train image" [ref=e651]
                  - link "Classic 8 Days Egypt Tour Package To Pyramids, Luxor & Aswan by Train image" [ref=e653] [cursor=pointer]:
                    - /url: /tour/classic-8-days-egypt-tour-package-to-pyramids-luxor-aswan-by-train
                    - img "Classic 8 Days Egypt Tour Package To Pyramids, Luxor & Aswan by Train image" [ref=e654]
                  - link "Classic 8 Days Egypt Tour Package To Pyramids, Luxor & Aswan by Train image" [ref=e656] [cursor=pointer]:
                    - /url: /tour/classic-8-days-egypt-tour-package-to-pyramids-luxor-aswan-by-train
                    - img "Classic 8 Days Egypt Tour Package To Pyramids, Luxor & Aswan by Train image" [ref=e657]
                - button [ref=e665] [cursor=pointer]:
                  - img [ref=e667]
              - generic [ref=e669]:
                - link "Classic 8 Days Egypt Tour Package To Pyramids..." [ref=e670] [cursor=pointer]:
                  - /url: /tour/classic-8-days-egypt-tour-package-to-pyramids-luxor-aswan-by-train
                  - heading "Classic 8 Days Egypt Tour Package To Pyramids..." [level=6] [ref=e671]
                - generic [ref=e672]:
                  - generic [ref=e673]:
                    - generic [ref=e674]:
                      - img [ref=e676]
                      - paragraph [ref=e680]: 4 Cities
                    - paragraph [ref=e681]: Egypt Classic Tours
                  - generic [ref=e682]:
                    - generic [ref=e683]:
                      - paragraph [ref=e684]: Start From
                      - paragraph [ref=e686]: $975.00
                    - generic [ref=e687]:
                      - img [ref=e689]
                      - paragraph [ref=e693]: 8 Days
            - generic [ref=e694]:
              - generic [ref=e695]:
                - generic [ref=e696]:
                  - link "2-Day White Desert, Bahariya Oasis & Fayoum Adventure from Cairo image" [ref=e698] [cursor=pointer]:
                    - /url: /tour/2-day-white-desert-bahariya-fayoum-tour-from-cairo
                    - img "2-Day White Desert, Bahariya Oasis & Fayoum Adventure from Cairo image" [ref=e699]
                  - link "2-Day White Desert, Bahariya Oasis & Fayoum Adventure from Cairo image" [ref=e701] [cursor=pointer]:
                    - /url: /tour/2-day-white-desert-bahariya-fayoum-tour-from-cairo
                    - img "2-Day White Desert, Bahariya Oasis & Fayoum Adventure from Cairo image" [ref=e702]
                  - link "2-Day White Desert, Bahariya Oasis & Fayoum Adventure from Cairo image" [ref=e704] [cursor=pointer]:
                    - /url: /tour/2-day-white-desert-bahariya-fayoum-tour-from-cairo
                    - img "2-Day White Desert, Bahariya Oasis & Fayoum Adventure from Cairo image" [ref=e705]
                  - link "2-Day White Desert, Bahariya Oasis & Fayoum Adventure from Cairo image" [ref=e707] [cursor=pointer]:
                    - /url: /tour/2-day-white-desert-bahariya-fayoum-tour-from-cairo
                    - img "2-Day White Desert, Bahariya Oasis & Fayoum Adventure from Cairo image" [ref=e708]
                  - link "2-Day White Desert, Bahariya Oasis & Fayoum Adventure from Cairo image" [ref=e710] [cursor=pointer]:
                    - /url: /tour/2-day-white-desert-bahariya-fayoum-tour-from-cairo
                    - img "2-Day White Desert, Bahariya Oasis & Fayoum Adventure from Cairo image" [ref=e711]
                  - link "2-Day White Desert, Bahariya Oasis & Fayoum Adventure from Cairo image" [ref=e713] [cursor=pointer]:
                    - /url: /tour/2-day-white-desert-bahariya-fayoum-tour-from-cairo
                    - img "2-Day White Desert, Bahariya Oasis & Fayoum Adventure from Cairo image" [ref=e714]
                - button [ref=e722] [cursor=pointer]:
                  - img [ref=e724]
              - generic [ref=e726]:
                - link "2-Day White Desert, Bahariya Oasis & Fayoum A..." [ref=e727] [cursor=pointer]:
                  - /url: /tour/2-day-white-desert-bahariya-fayoum-tour-from-cairo
                  - heading "2-Day White Desert, Bahariya Oasis & Fayoum A..." [level=6] [ref=e728]
                - generic [ref=e729]:
                  - generic [ref=e730]:
                    - generic [ref=e731]:
                      - img [ref=e733]
                      - paragraph [ref=e737]: 3 Cities
                    - paragraph [ref=e738]: Multi Days Tours
                  - generic [ref=e739]:
                    - generic [ref=e740]:
                      - paragraph [ref=e741]: Start From
                      - paragraph [ref=e743]: $315.00
                    - generic [ref=e744]:
                      - img [ref=e746]
                      - paragraph [ref=e750]: 2 Days
            - generic [ref=e751]:
              - generic [ref=e752]:
                - generic [ref=e753]:
                  - 'link "8 Day: Luxor Nile Cruise & Cairo image" [ref=e755] [cursor=pointer]':
                    - /url: /tour/8-day-luxor-nile-cruise-cairo
                    - 'img "8 Day: Luxor Nile Cruise & Cairo image" [ref=e756]'
                  - 'link "8 Day: Luxor Nile Cruise & Cairo image" [ref=e758] [cursor=pointer]':
                    - /url: /tour/8-day-luxor-nile-cruise-cairo
                    - 'img "8 Day: Luxor Nile Cruise & Cairo image" [ref=e759]'
                  - 'link "8 Day: Luxor Nile Cruise & Cairo image" [ref=e761] [cursor=pointer]':
                    - /url: /tour/8-day-luxor-nile-cruise-cairo
                    - 'img "8 Day: Luxor Nile Cruise & Cairo image" [ref=e762]'
                  - 'link "8 Day: Luxor Nile Cruise & Cairo image" [ref=e764] [cursor=pointer]':
                    - /url: /tour/8-day-luxor-nile-cruise-cairo
                    - 'img "8 Day: Luxor Nile Cruise & Cairo image" [ref=e765]'
                  - 'link "8 Day: Luxor Nile Cruise & Cairo image" [ref=e767] [cursor=pointer]':
                    - /url: /tour/8-day-luxor-nile-cruise-cairo
                    - 'img "8 Day: Luxor Nile Cruise & Cairo image" [ref=e768]'
                  - 'link "8 Day: Luxor Nile Cruise & Cairo image" [ref=e770] [cursor=pointer]':
                    - /url: /tour/8-day-luxor-nile-cruise-cairo
                    - 'img "8 Day: Luxor Nile Cruise & Cairo image" [ref=e771]'
                - button [ref=e779] [cursor=pointer]:
                  - img [ref=e781]
              - generic [ref=e783]:
                - 'link "8 Day: Luxor Nile Cruise & Cairo" [ref=e784] [cursor=pointer]':
                  - /url: /tour/8-day-luxor-nile-cruise-cairo
                  - 'heading "8 Day: Luxor Nile Cruise & Cairo" [level=6] [ref=e785]'
                - generic [ref=e786]:
                  - generic [ref=e787]:
                    - generic [ref=e788]:
                      - img [ref=e790]
                      - paragraph [ref=e794]: 4 Cities
                    - paragraph [ref=e795]: Culture Tours
                  - generic [ref=e796]:
                    - generic [ref=e797]:
                      - paragraph [ref=e798]: Start From
                      - paragraph [ref=e800]: $1605.00
                    - generic [ref=e801]:
                      - img [ref=e803]
                      - paragraph [ref=e807]: 8 Days
            - generic [ref=e808]:
              - generic [ref=e809]:
                - generic [ref=e810]:
                  - link "7 Day Package For Cairo, Luxor, Aswan and Abu Simbel image" [ref=e812] [cursor=pointer]:
                    - /url: /tour/7-day-package-for-cairo-luxor-aswan-and-abu-simbel
                    - img "7 Day Package For Cairo, Luxor, Aswan and Abu Simbel image" [ref=e813]
                  - link "7 Day Package For Cairo, Luxor, Aswan and Abu Simbel image" [ref=e815] [cursor=pointer]:
                    - /url: /tour/7-day-package-for-cairo-luxor-aswan-and-abu-simbel
                    - img "7 Day Package For Cairo, Luxor, Aswan and Abu Simbel image" [ref=e816]
                  - link "7 Day Package For Cairo, Luxor, Aswan and Abu Simbel image" [ref=e818] [cursor=pointer]:
                    - /url: /tour/7-day-package-for-cairo-luxor-aswan-and-abu-simbel
                    - img "7 Day Package For Cairo, Luxor, Aswan and Abu Simbel image" [ref=e819]
                  - link "7 Day Package For Cairo, Luxor, Aswan and Abu Simbel image" [ref=e821] [cursor=pointer]:
                    - /url: /tour/7-day-package-for-cairo-luxor-aswan-and-abu-simbel
                    - img "7 Day Package For Cairo, Luxor, Aswan and Abu Simbel image" [ref=e822]
                  - link "7 Day Package For Cairo, Luxor, Aswan and Abu Simbel image" [ref=e824] [cursor=pointer]:
                    - /url: /tour/7-day-package-for-cairo-luxor-aswan-and-abu-simbel
                    - img "7 Day Package For Cairo, Luxor, Aswan and Abu Simbel image" [ref=e825]
                  - link "7 Day Package For Cairo, Luxor, Aswan and Abu Simbel image" [ref=e827] [cursor=pointer]:
                    - /url: /tour/7-day-package-for-cairo-luxor-aswan-and-abu-simbel
                    - img "7 Day Package For Cairo, Luxor, Aswan and Abu Simbel image" [ref=e828]
                - button [ref=e836] [cursor=pointer]:
                  - img [ref=e838]
              - generic [ref=e840]:
                - link "7 Day Package For Cairo, Luxor, Aswan and Abu..." [ref=e841] [cursor=pointer]:
                  - /url: /tour/7-day-package-for-cairo-luxor-aswan-and-abu-simbel
                  - heading "7 Day Package For Cairo, Luxor, Aswan and Abu..." [level=6] [ref=e842]
                - generic [ref=e843]:
                  - generic [ref=e844]:
                    - generic [ref=e845]:
                      - img [ref=e847]
                      - paragraph [ref=e851]: 4 Cities
                    - paragraph [ref=e852]: Culture Tours
                  - generic [ref=e853]:
                    - generic [ref=e854]:
                      - paragraph [ref=e855]: Start From
                      - paragraph [ref=e857]: $387.00
                    - generic [ref=e858]:
                      - img [ref=e860]
                      - paragraph [ref=e864]: 7 Days
            - generic [ref=e865]:
              - generic [ref=e866]:
                - generic [ref=e867]:
                  - link "Package 8 Days 7 Nights to Pyramids, Luxor and Aswan by Train image" [ref=e869] [cursor=pointer]:
                    - /url: /tour/package-8-days-7-nights-to-pyramids-luxor-and-aswan-by-train
                    - img "Package 8 Days 7 Nights to Pyramids, Luxor and Aswan by Train image" [ref=e870]
                  - link "Package 8 Days 7 Nights to Pyramids, Luxor and Aswan by Train image" [ref=e872] [cursor=pointer]:
                    - /url: /tour/package-8-days-7-nights-to-pyramids-luxor-and-aswan-by-train
                    - img "Package 8 Days 7 Nights to Pyramids, Luxor and Aswan by Train image" [ref=e873]
                  - link "Package 8 Days 7 Nights to Pyramids, Luxor and Aswan by Train image" [ref=e875] [cursor=pointer]:
                    - /url: /tour/package-8-days-7-nights-to-pyramids-luxor-and-aswan-by-train
                    - img "Package 8 Days 7 Nights to Pyramids, Luxor and Aswan by Train image" [ref=e876]
                  - link "Package 8 Days 7 Nights to Pyramids, Luxor and Aswan by Train image" [ref=e878] [cursor=pointer]:
                    - /url: /tour/package-8-days-7-nights-to-pyramids-luxor-and-aswan-by-train
                    - img "Package 8 Days 7 Nights to Pyramids, Luxor and Aswan by Train image" [ref=e879]
                  - link "Package 8 Days 7 Nights to Pyramids, Luxor and Aswan by Train image" [ref=e881] [cursor=pointer]:
                    - /url: /tour/package-8-days-7-nights-to-pyramids-luxor-and-aswan-by-train
                    - img "Package 8 Days 7 Nights to Pyramids, Luxor and Aswan by Train image" [ref=e882]
                  - link "Package 8 Days 7 Nights to Pyramids, Luxor and Aswan by Train image" [ref=e884] [cursor=pointer]:
                    - /url: /tour/package-8-days-7-nights-to-pyramids-luxor-and-aswan-by-train
                    - img "Package 8 Days 7 Nights to Pyramids, Luxor and Aswan by Train image" [ref=e885]
                - button [ref=e893] [cursor=pointer]:
                  - img [ref=e895]
              - generic [ref=e897]:
                - link "Package 8 Days 7 Nights to Pyramids, Luxor an..." [ref=e898] [cursor=pointer]:
                  - /url: /tour/package-8-days-7-nights-to-pyramids-luxor-and-aswan-by-train
                  - heading "Package 8 Days 7 Nights to Pyramids, Luxor an..." [level=6] [ref=e899]
                - generic [ref=e900]:
                  - generic [ref=e901]:
                    - generic [ref=e902]:
                      - img [ref=e904]
                      - paragraph [ref=e908]: 4 Cities
                    - paragraph [ref=e909]: Egypt Classic Tours
                  - generic [ref=e910]:
                    - generic [ref=e911]:
                      - paragraph [ref=e912]: Start From
                      - paragraph [ref=e914]: $2095.00
                    - generic [ref=e915]:
                      - img [ref=e917]
                      - paragraph [ref=e921]: 8 Days
          - button "See more" [ref=e926] [cursor=pointer]:
            - generic [ref=e927]: See more
            - img [ref=e929]
      - generic [ref=e934]:
        - heading "Make Your Trip" [level=3] [ref=e935]
        - generic [ref=e937]:
          - generic [ref=e938]:
            - heading "When will you be traveling?" [level=6] [ref=e939]
            - generic [ref=e940]:
              - generic [ref=e944] [cursor=pointer]: Have An Exact Time
              - generic [ref=e948] [cursor=pointer]: Have An Approximate Time
              - generic [ref=e952] [cursor=pointer]: Not Sure Yet
          - generic [ref=e953]:
            - generic [ref=e954] [cursor=pointer]:
              - generic [ref=e955]:
                - generic [ref=e956]: From
                - generic [ref=e959]:
                  - textbox "Datepicker input" [ref=e960]:
                    - /placeholder: Select the start date of the trip
                  - img [ref=e961]
              - img [ref=e967]
            - generic [ref=e979] [cursor=pointer]:
              - generic [ref=e980]:
                - generic [ref=e981]: To
                - generic [ref=e984]:
                  - textbox "Datepicker input" [ref=e985]:
                    - /placeholder: Select the end date of the trip
                  - img [ref=e986]
              - img [ref=e992]
            - button "Make Trip" [ref=e1004] [cursor=pointer]:
              - generic [ref=e1005]: Make Trip
      - generic [ref=e1006]:
        - generic [ref=e1009]:
          - generic [ref=e1010]:
            - img [ref=e1012]
            - heading "Special offers for you" [level=3] [ref=e1014]
          - heading "Find the right offer before it's too late" [level=6] [ref=e1015]
        - generic [ref=e1016]:
          - generic [ref=e1018]:
            - generic [ref=e1019]:
              - generic [ref=e1020]:
                - generic [ref=e1021]:
                  - link "Package 12 Days 11 Nights Luxury Cairo, Luxor, Aswan & Lake Cruise image" [ref=e1023] [cursor=pointer]:
                    - /url: /tour/package-12-days-11-nights-luxury-cairo-luxor-aswan-lake-cruise
                    - img "Package 12 Days 11 Nights Luxury Cairo, Luxor, Aswan & Lake Cruise image" [ref=e1024]
                  - link "Package 12 Days 11 Nights Luxury Cairo, Luxor, Aswan & Lake Cruise image" [ref=e1026] [cursor=pointer]:
                    - /url: /tour/package-12-days-11-nights-luxury-cairo-luxor-aswan-lake-cruise
                    - img "Package 12 Days 11 Nights Luxury Cairo, Luxor, Aswan & Lake Cruise image" [ref=e1027]
                  - link "Package 12 Days 11 Nights Luxury Cairo, Luxor, Aswan & Lake Cruise image" [ref=e1029] [cursor=pointer]:
                    - /url: /tour/package-12-days-11-nights-luxury-cairo-luxor-aswan-lake-cruise
                    - img "Package 12 Days 11 Nights Luxury Cairo, Luxor, Aswan & Lake Cruise image" [ref=e1030]
                  - link "Package 12 Days 11 Nights Luxury Cairo, Luxor, Aswan & Lake Cruise image" [ref=e1032] [cursor=pointer]:
                    - /url: /tour/package-12-days-11-nights-luxury-cairo-luxor-aswan-lake-cruise
                    - img "Package 12 Days 11 Nights Luxury Cairo, Luxor, Aswan & Lake Cruise image" [ref=e1033]
                  - link "Package 12 Days 11 Nights Luxury Cairo, Luxor, Aswan & Lake Cruise image" [ref=e1035] [cursor=pointer]:
                    - /url: /tour/package-12-days-11-nights-luxury-cairo-luxor-aswan-lake-cruise
                    - img "Package 12 Days 11 Nights Luxury Cairo, Luxor, Aswan & Lake Cruise image" [ref=e1036]
                  - link "Package 12 Days 11 Nights Luxury Cairo, Luxor, Aswan & Lake Cruise image" [ref=e1038] [cursor=pointer]:
                    - /url: /tour/package-12-days-11-nights-luxury-cairo-luxor-aswan-lake-cruise
                    - img "Package 12 Days 11 Nights Luxury Cairo, Luxor, Aswan & Lake Cruise image" [ref=e1039]
                - button [ref=e1047] [cursor=pointer]:
                  - img [ref=e1049]
                - generic [ref=e1051]:
                  - img [ref=e1053]
                  - paragraph [ref=e1055]: Special Offer
              - generic [ref=e1056]:
                - link "Package 12 Days 11 Nights Luxury Cairo, Luxor..." [ref=e1057] [cursor=pointer]:
                  - /url: /tour/package-12-days-11-nights-luxury-cairo-luxor-aswan-lake-cruise
                  - heading "Package 12 Days 11 Nights Luxury Cairo, Luxor..." [level=6] [ref=e1058]
                - generic [ref=e1059]:
                  - generic [ref=e1060]:
                    - generic [ref=e1061]:
                      - img [ref=e1063]
                      - paragraph [ref=e1067]: 5 Cities
                    - paragraph [ref=e1068]: Luxury Packages
                  - generic [ref=e1069]:
                    - generic [ref=e1070]:
                      - paragraph [ref=e1071]: "177"
                      - paragraph [ref=e1072]: Days
                    - generic [ref=e1073]:
                      - paragraph [ref=e1074]: "14"
                      - paragraph [ref=e1075]: Hours
                    - generic [ref=e1076]:
                      - paragraph [ref=e1077]: "23"
                      - paragraph [ref=e1078]: Minutes
                    - generic [ref=e1079]:
                      - paragraph [ref=e1080]: "56"
                      - paragraph [ref=e1081]: Seconds
                  - generic [ref=e1082]:
                    - generic [ref=e1083]:
                      - paragraph [ref=e1084]: Start From
                      - generic [ref=e1085]:
                        - paragraph [ref=e1086]: $3918.80
                        - paragraph [ref=e1087]: $4040.00
                    - generic [ref=e1088]:
                      - img [ref=e1090]
                      - paragraph [ref=e1094]: 12 Days / 11 Nights
            - generic [ref=e1095]:
              - generic [ref=e1096]:
                - generic [ref=e1097]:
                  - link "Package 13 Days 12 Nights To Cairo, Luxor, Aswan and Red Sea Vacation image" [ref=e1099] [cursor=pointer]:
                    - /url: /tour/package-13-days-12-nights-to-cairo-luxor-aswan-and-red-sea-vacation
                    - img "Package 13 Days 12 Nights To Cairo, Luxor, Aswan and Red Sea Vacation image" [ref=e1100]
                  - link "Package 13 Days 12 Nights To Cairo, Luxor, Aswan and Red Sea Vacation image" [ref=e1102] [cursor=pointer]:
                    - /url: /tour/package-13-days-12-nights-to-cairo-luxor-aswan-and-red-sea-vacation
                    - img "Package 13 Days 12 Nights To Cairo, Luxor, Aswan and Red Sea Vacation image" [ref=e1103]
                  - link "Package 13 Days 12 Nights To Cairo, Luxor, Aswan and Red Sea Vacation image" [ref=e1105] [cursor=pointer]:
                    - /url: /tour/package-13-days-12-nights-to-cairo-luxor-aswan-and-red-sea-vacation
                    - img "Package 13 Days 12 Nights To Cairo, Luxor, Aswan and Red Sea Vacation image" [ref=e1106]
                  - link "Package 13 Days 12 Nights To Cairo, Luxor, Aswan and Red Sea Vacation image" [ref=e1108] [cursor=pointer]:
                    - /url: /tour/package-13-days-12-nights-to-cairo-luxor-aswan-and-red-sea-vacation
                    - img "Package 13 Days 12 Nights To Cairo, Luxor, Aswan and Red Sea Vacation image" [ref=e1109]
                  - link "Package 13 Days 12 Nights To Cairo, Luxor, Aswan and Red Sea Vacation image" [ref=e1111] [cursor=pointer]:
                    - /url: /tour/package-13-days-12-nights-to-cairo-luxor-aswan-and-red-sea-vacation
                    - img "Package 13 Days 12 Nights To Cairo, Luxor, Aswan and Red Sea Vacation image" [ref=e1112]
                  - link "Package 13 Days 12 Nights To Cairo, Luxor, Aswan and Red Sea Vacation image" [ref=e1114] [cursor=pointer]:
                    - /url: /tour/package-13-days-12-nights-to-cairo-luxor-aswan-and-red-sea-vacation
                    - img "Package 13 Days 12 Nights To Cairo, Luxor, Aswan and Red Sea Vacation image" [ref=e1115]
                - button [ref=e1123] [cursor=pointer]:
                  - img [ref=e1125]
                - generic [ref=e1127]:
                  - img [ref=e1129]
                  - paragraph [ref=e1131]: Special Offer
              - generic [ref=e1132]:
                - link "Package 13 Days 12 Nights To Cairo, Luxor, As..." [ref=e1133] [cursor=pointer]:
                  - /url: /tour/package-13-days-12-nights-to-cairo-luxor-aswan-and-red-sea-vacation
                  - heading "Package 13 Days 12 Nights To Cairo, Luxor, As..." [level=6] [ref=e1134]
                - generic [ref=e1135]:
                  - generic [ref=e1136]:
                    - generic [ref=e1137]:
                      - img [ref=e1139]
                      - paragraph [ref=e1143]: 5 Cities
                    - paragraph [ref=e1144]: Luxury Packages
                  - generic [ref=e1145]:
                    - generic [ref=e1146]:
                      - paragraph [ref=e1147]: "177"
                      - paragraph [ref=e1148]: Days
                    - generic [ref=e1149]:
                      - paragraph [ref=e1150]: "14"
                      - paragraph [ref=e1151]: Hours
                    - generic [ref=e1152]:
                      - paragraph [ref=e1153]: "23"
                      - paragraph [ref=e1154]: Minutes
                    - generic [ref=e1155]:
                      - paragraph [ref=e1156]: "56"
                      - paragraph [ref=e1157]: Seconds
                  - generic [ref=e1158]:
                    - generic [ref=e1159]:
                      - paragraph [ref=e1160]: Start From
                      - generic [ref=e1161]:
                        - paragraph [ref=e1162]: $4413.50
                        - paragraph [ref=e1163]: $4550.00
                    - generic [ref=e1164]:
                      - img [ref=e1166]
                      - paragraph [ref=e1170]: 13 Days
            - generic [ref=e1171]:
              - generic [ref=e1172]:
                - generic [ref=e1173]:
                  - link "Tour To Pyramids and The Egyptian Museum image" [ref=e1175] [cursor=pointer]:
                    - /url: /tour/tour-to-pyramids-and-the-egyptian-museum
                    - img "Tour To Pyramids and The Egyptian Museum image" [ref=e1176]
                  - link "Tour To Pyramids and The Egyptian Museum image" [ref=e1178] [cursor=pointer]:
                    - /url: /tour/tour-to-pyramids-and-the-egyptian-museum
                    - img "Tour To Pyramids and The Egyptian Museum image" [ref=e1179]
                  - link "Tour To Pyramids and The Egyptian Museum image" [ref=e1181] [cursor=pointer]:
                    - /url: /tour/tour-to-pyramids-and-the-egyptian-museum
                    - img "Tour To Pyramids and The Egyptian Museum image" [ref=e1182]
                  - link "Tour To Pyramids and The Egyptian Museum image" [ref=e1184] [cursor=pointer]:
                    - /url: /tour/tour-to-pyramids-and-the-egyptian-museum
                    - img "Tour To Pyramids and The Egyptian Museum image" [ref=e1185]
                  - link "Tour To Pyramids and The Egyptian Museum image" [ref=e1187] [cursor=pointer]:
                    - /url: /tour/tour-to-pyramids-and-the-egyptian-museum
                    - img "Tour To Pyramids and The Egyptian Museum image" [ref=e1188]
                  - link "Tour To Pyramids and The Egyptian Museum image" [ref=e1190] [cursor=pointer]:
                    - /url: /tour/tour-to-pyramids-and-the-egyptian-museum
                    - img "Tour To Pyramids and The Egyptian Museum image" [ref=e1191]
                - button [ref=e1199] [cursor=pointer]:
                  - img [ref=e1201]
                - generic [ref=e1203]:
                  - img [ref=e1205]
                  - paragraph [ref=e1207]: Special Offer
              - generic [ref=e1208]:
                - link "Tour To Pyramids and The Egyptian Museum" [ref=e1209] [cursor=pointer]:
                  - /url: /tour/tour-to-pyramids-and-the-egyptian-museum
                  - heading "Tour To Pyramids and The Egyptian Museum" [level=6] [ref=e1210]
                - generic [ref=e1211]:
                  - generic [ref=e1212]:
                    - generic [ref=e1213]:
                      - img [ref=e1215]
                      - paragraph [ref=e1219]: 3 Cities
                    - paragraph [ref=e1220]: Day Tour
                  - generic [ref=e1221]:
                    - generic [ref=e1222]:
                      - paragraph [ref=e1223]: "177"
                      - paragraph [ref=e1224]: Days
                    - generic [ref=e1225]:
                      - paragraph [ref=e1226]: "14"
                      - paragraph [ref=e1227]: Hours
                    - generic [ref=e1228]:
                      - paragraph [ref=e1229]: "23"
                      - paragraph [ref=e1230]: Minutes
                    - generic [ref=e1231]:
                      - paragraph [ref=e1232]: "56"
                      - paragraph [ref=e1233]: Seconds
                  - generic [ref=e1234]:
                    - generic [ref=e1235]:
                      - paragraph [ref=e1236]: Start From
                      - generic [ref=e1237]:
                        - paragraph [ref=e1238]: $75.33
                        - paragraph [ref=e1239]: $81.00
                    - generic [ref=e1240]:
                      - img [ref=e1242]
                      - paragraph [ref=e1246]: About 6 Hours
            - generic [ref=e1247]:
              - generic [ref=e1248]:
                - generic [ref=e1249]:
                  - link "Package 7 Days 6 Nights to Egypt and Jordan image" [ref=e1251] [cursor=pointer]:
                    - /url: /tour/Package-7-Days-6-Nights-to-Egypt-and-Jordan
                    - img "Package 7 Days 6 Nights to Egypt and Jordan image" [ref=e1252]
                  - link "Package 7 Days 6 Nights to Egypt and Jordan image" [ref=e1254] [cursor=pointer]:
                    - /url: /tour/Package-7-Days-6-Nights-to-Egypt-and-Jordan
                    - img "Package 7 Days 6 Nights to Egypt and Jordan image" [ref=e1255]
                  - link "Package 7 Days 6 Nights to Egypt and Jordan image" [ref=e1257] [cursor=pointer]:
                    - /url: /tour/Package-7-Days-6-Nights-to-Egypt-and-Jordan
                    - img "Package 7 Days 6 Nights to Egypt and Jordan image" [ref=e1258]
                  - link "Package 7 Days 6 Nights to Egypt and Jordan image" [ref=e1260] [cursor=pointer]:
                    - /url: /tour/Package-7-Days-6-Nights-to-Egypt-and-Jordan
                    - img "Package 7 Days 6 Nights to Egypt and Jordan image" [ref=e1261]
                  - link "Package 7 Days 6 Nights to Egypt and Jordan image" [ref=e1263] [cursor=pointer]:
                    - /url: /tour/Package-7-Days-6-Nights-to-Egypt-and-Jordan
                    - img "Package 7 Days 6 Nights to Egypt and Jordan image" [ref=e1264]
                  - link "Package 7 Days 6 Nights to Egypt and Jordan image" [ref=e1266] [cursor=pointer]:
                    - /url: /tour/Package-7-Days-6-Nights-to-Egypt-and-Jordan
                    - img "Package 7 Days 6 Nights to Egypt and Jordan image" [ref=e1267]
                - button [ref=e1275] [cursor=pointer]:
                  - img [ref=e1277]
                - generic [ref=e1279]:
                  - img [ref=e1281]
                  - paragraph [ref=e1283]: Special Offer
              - generic [ref=e1284]:
                - link "Package 7 Days 6 Nights to Egypt and Jordan" [ref=e1285] [cursor=pointer]:
                  - /url: /tour/Package-7-Days-6-Nights-to-Egypt-and-Jordan
                  - heading "Package 7 Days 6 Nights to Egypt and Jordan" [level=6] [ref=e1286]
                - generic [ref=e1287]:
                  - generic [ref=e1288]:
                    - generic [ref=e1289]:
                      - img [ref=e1291]
                      - paragraph [ref=e1295]: 3 Cities
                    - paragraph [ref=e1296]: Egypt Classic Tours
                  - generic [ref=e1297]:
                    - generic [ref=e1298]:
                      - paragraph [ref=e1299]: "177"
                      - paragraph [ref=e1300]: Days
                    - generic [ref=e1301]:
                      - paragraph [ref=e1302]: "14"
                      - paragraph [ref=e1303]: Hours
                    - generic [ref=e1304]:
                      - paragraph [ref=e1305]: "23"
                      - paragraph [ref=e1306]: Minutes
                    - generic [ref=e1307]:
                      - paragraph [ref=e1308]: "56"
                      - paragraph [ref=e1309]: Seconds
                  - generic [ref=e1310]:
                    - generic [ref=e1311]:
                      - paragraph [ref=e1312]: Start From
                      - generic [ref=e1313]:
                        - paragraph [ref=e1314]: $1333.75
                        - paragraph [ref=e1315]: $1375.00
                    - generic [ref=e1316]:
                      - img [ref=e1318]
                      - paragraph [ref=e1322]: 7 days 6 nights
          - button "See more" [ref=e1327] [cursor=pointer]:
            - generic [ref=e1328]: See more
            - img [ref=e1330]
      - generic [ref=e1334]:
        - generic [ref=e1335]:
          - generic [ref=e1337]:
            - heading "How it works ?" [level=3] [ref=e1338]
            - heading "Only three steps away from Egypt" [level=6] [ref=e1339]
          - generic [ref=e1340]:
            - generic [ref=e1341]:
              - generic [ref=e1342]: "1"
              - generic [ref=e1343]:
                - heading "Finding Trip" [level=4] [ref=e1344]
                - paragraph [ref=e1345]: Select your favorite trip
            - img [ref=e1346]
            - generic [ref=e1347]:
              - generic [ref=e1348]: "2"
              - generic [ref=e1349]:
                - heading "Booking" [level=4] [ref=e1350]
                - paragraph [ref=e1351]: Trip booking and payment
            - img [ref=e1352]
            - generic [ref=e1353]:
              - generic [ref=e1354]: "3"
              - generic [ref=e1355]:
                - heading "Enjoy" [level=4] [ref=e1356]
                - paragraph [ref=e1357]: Start your Exciting Journey
        - generic [ref=e1358]:
          - generic [ref=e1360]:
            - heading "Highlights of Egypt" [level=3] [ref=e1361]
            - heading "Discover the most important landmarks in Egypt" [level=6] [ref=e1362]
          - generic [ref=e1364]:
            - link "Cairo Cairo" [ref=e1366] [cursor=pointer]:
              - /url: /egypt-tours/one-day-tours/cairo
              - img "Cairo" [ref=e1367]
              - paragraph [ref=e1368]: Cairo
            - link "Luxor Luxor" [ref=e1371] [cursor=pointer]:
              - /url: /egypt-tours/one-day-tours/luxor
              - img "Luxor" [ref=e1372]
              - paragraph [ref=e1373]: Luxor
            - link "Aswan Aswan" [ref=e1376] [cursor=pointer]:
              - /url: /egypt-tours/one-day-tours/aswan
              - img "Aswan" [ref=e1377]
              - paragraph [ref=e1378]: Aswan
            - link "Hurghada Hurghada" [ref=e1381] [cursor=pointer]:
              - /url: /egypt-tours/one-day-tours/hurghada
              - img "Hurghada" [ref=e1382]
              - paragraph [ref=e1383]: Hurghada
            - link "Sharm El Sheikh Sharm El Sheikh" [ref=e1386] [cursor=pointer]:
              - /url: /egypt-tours/one-day-tours/sharm-el-sheikh
              - img "Sharm El Sheikh" [ref=e1387]
              - paragraph [ref=e1388]: Sharm El Sheikh
            - link "Dahab Dahab" [ref=e1391] [cursor=pointer]:
              - /url: /egypt-tours/one-day-tours/dahab
              - img "Dahab" [ref=e1392]
              - paragraph [ref=e1393]: Dahab
            - link "Alexandria Alexandria" [ref=e1396] [cursor=pointer]:
              - /url: /egypt-tours/one-day-tours/alexandria
              - img "Alexandria" [ref=e1397]
              - paragraph [ref=e1398]: Alexandria
            - link "Taba Taba" [ref=e1401] [cursor=pointer]:
              - /url: /egypt-tours/one-day-tours/taba
              - img "Taba" [ref=e1402]
              - paragraph [ref=e1403]: Taba
            - link "Marsa Alam Marsa Alam" [ref=e1406] [cursor=pointer]:
              - /url: /egypt-tours/one-day-tours/marsa-alam
              - img "Marsa Alam" [ref=e1407]
              - paragraph [ref=e1408]: Marsa Alam
      - generic [ref=e1418]:
        - heading "Our Travel Blogs" [level=3] [ref=e1420]
        - generic [ref=e1421]:
          - generic [ref=e1423]:
            - generic [ref=e1425]:
              - link "BlogCard" [ref=e1426] [cursor=pointer]:
                - /url: /blog/why-choose-egypt%20-desert-tours
                - img "BlogCard" [ref=e1428]
              - 'link "Experience the Sahara Desert of Egypt: Camping, Dunes & Stargazing Adventures" [ref=e1430] [cursor=pointer]':
                - /url: /blog/why-choose-egypt%20-desert-tours
                - 'heading "Experience the Sahara Desert of Egypt: Camping, Dunes & Stargazing Adventures" [level=6] [ref=e1431]'
            - generic [ref=e1433]:
              - link "BlogCard" [ref=e1434] [cursor=pointer]:
                - /url: /blog/first-time-desert
                - img "BlogCard" [ref=e1436]
              - 'link "First Time Desert Camping in Egypt: Essential Sahara Travel Tips" [ref=e1438] [cursor=pointer]':
                - /url: /blog/first-time-desert
                - 'heading "First Time Desert Camping in Egypt: Essential Sahara Travel Tips" [level=6] [ref=e1439]'
            - generic [ref=e1441]:
              - link "BlogCard" [ref=e1442] [cursor=pointer]:
                - /url: /blog/egypt-desert-tours
                - img "BlogCard" [ref=e1444]
              - 'link "Egypt Desert Tours: Discover Egypt’s Most Thrilling Desert Adventures" [ref=e1446] [cursor=pointer]':
                - /url: /blog/egypt-desert-tours
                - 'heading "Egypt Desert Tours: Discover Egypt’s Most Thrilling Desert Adventures" [level=6] [ref=e1447]'
            - generic [ref=e1449]:
              - link "BlogCard" [ref=e1450] [cursor=pointer]:
                - /url: /blog/best-easter-destinations
                - img "BlogCard" [ref=e1452]
              - 'link "Best Easter Destinations for Families: Why Egypt Should Be Your Top Choice" [ref=e1454] [cursor=pointer]':
                - /url: /blog/best-easter-destinations
                - 'heading "Best Easter Destinations for Families: Why Egypt Should Be Your Top Choice" [level=6] [ref=e1455]'
            - generic [ref=e1457]:
              - link "BlogCard" [ref=e1458] [cursor=pointer]:
                - /url: /blog/egyptian-pharaohs
                - img "BlogCard" [ref=e1460]
              - link "Top 10 Secrets You Didn't Know About Egyptian Pharaohs" [ref=e1462] [cursor=pointer]:
                - /url: /blog/egyptian-pharaohs
                - heading "Top 10 Secrets You Didn't Know About Egyptian Pharaohs" [level=6] [ref=e1463]
            - generic [ref=e1465]:
              - link "BlogCard" [ref=e1466] [cursor=pointer]:
                - /url: /blog/how-the-pyramids-were-built
                - img "BlogCard" [ref=e1468]
              - 'link "How The Pyramids Were Built: Classic Vs. Alternative Theories" [ref=e1470] [cursor=pointer]':
                - /url: /blog/how-the-pyramids-were-built
                - 'heading "How The Pyramids Were Built: Classic Vs. Alternative Theories" [level=6] [ref=e1471]'
            - generic [ref=e1473]:
              - link "BlogCard" [ref=e1474] [cursor=pointer]:
                - /url: /blog/white-desert-national-park
                - img "BlogCard" [ref=e1476]
              - 'link "White Desert National Park: Egypt’s Timeless Wilderness of Stars, Sand, and Stone" [ref=e1478] [cursor=pointer]':
                - /url: /blog/white-desert-national-park
                - 'heading "White Desert National Park: Egypt’s Timeless Wilderness of Stars, Sand, and Stone" [level=6] [ref=e1479]'
            - generic [ref=e1481]:
              - link "BlogCard" [ref=e1482] [cursor=pointer]:
                - /url: /blog/exploring-egypt-deserts
                - img "BlogCard" [ref=e1484]
              - 'link "Exploring Egypt Deserts: Hidden Wonders Beyond the Nile" [ref=e1486] [cursor=pointer]':
                - /url: /blog/exploring-egypt-deserts
                - 'heading "Exploring Egypt Deserts: Hidden Wonders Beyond the Nile" [level=6] [ref=e1487]'
          - button "See more" [ref=e1492] [cursor=pointer]:
            - generic [ref=e1493]: See more
            - img [ref=e1495]
      - generic [ref=e1499]:
        - generic [ref=e1500]:
          - heading "Tailored guidance for your sustainability journey" [level=3] [ref=e1501]
          - generic [ref=e1502]:
            - paragraph [ref=e1504]: Sustainability is not an add-on — it is integrated into how we design, operate, and deliver travel experiences across Egypt.
            - button "See more" [ref=e1507] [cursor=pointer]:
              - generic [ref=e1508]: See more
        - generic:
          - img
      - generic [ref=e1509]:
        - generic [ref=e1511]:
          - heading "Gallery of Exciting journeys" [level=3] [ref=e1512]
          - heading "Follow us on social media to see more Exciting journeys" [level=6] [ref=e1513]
        - generic [ref=e1515]:
          - generic [ref=e1516]:
            - link [ref=e1517] [cursor=pointer]:
              - /url: https://youtube.com/shorts/kvS38V3N5_Q?si=ffmF622fPHZyKuRy
            - button "Open link" [ref=e1518] [cursor=pointer]
          - generic:
            - link:
              - /url: https://youtu.be/R8ToDUiuFyE?si=7-lQlKWMAFJUzGyn
            - button "Open link" [ref=e1519] [cursor=pointer]
          - generic [ref=e1520]:
            - link [ref=e1521] [cursor=pointer]:
              - /url: https://vt.tiktok.com/ZSAdunkgH/
            - button "Open link" [ref=e1522] [cursor=pointer]
          - generic [ref=e1523]:
            - link [ref=e1524] [cursor=pointer]:
              - /url: https://www.instagram.com/reel/DBCmWQ0t_nr/?igsh=cDZ2M2xveXUweWM3
            - button "Open link" [ref=e1525] [cursor=pointer]
          - generic:
            - link:
              - /url: https://www.facebook.com/share/r/15ANuuE3pZb/
            - button "Open link" [ref=e1526] [cursor=pointer]
      - generic [ref=e1527]:
        - heading "Frequently Asked Questions" [level=3] [ref=e1529]
        - generic [ref=e1530]:
          - generic [ref=e1532] [cursor=pointer]:
            - heading "▪ Can I take pictures and videos everywhere?" [level=6] [ref=e1533]
            - img [ref=e1535]
          - generic [ref=e1538] [cursor=pointer]:
            - heading "▪ Can I bring a drone to Egypt?" [level=6] [ref=e1539]
            - img [ref=e1541]
          - generic [ref=e1544] [cursor=pointer]:
            - heading "▪ Is Egypt safe for female tourists?" [level=6] [ref=e1545]
            - img [ref=e1547]
          - generic [ref=e1550] [cursor=pointer]:
            - heading "▪ Can unmarried couples stay together in Egypt?" [level=6] [ref=e1551]
            - img [ref=e1553]
          - generic [ref=e1556] [cursor=pointer]:
            - heading "▪ Why should I book with a Travel agency and not by myself" [level=6] [ref=e1557]
            - img [ref=e1559]
          - button "See more" [ref=e1565] [cursor=pointer]:
            - generic [ref=e1566]: See more
            - img [ref=e1568]
      - generic [ref=e1573]:
        - heading "Need help to Finding your Trip?" [level=3] [ref=e1574]
        - generic [ref=e1576]:
          - generic [ref=e1580]:
            - textbox "Full Name" [ref=e1581]:
              - /placeholder: ""
            - generic [ref=e1582]: Full Name
          - button "Nationality" [ref=e1586] [cursor=pointer]:
            - generic [ref=e1587]:
              - button [ref=e1588]:
                - textbox [ref=e1589]
              - button [ref=e1590]:
                - img [ref=e1592]
              - button "Nationality" [ref=e1594]
          - generic [ref=e1598]:
            - button "AF +93" [ref=e1601] [cursor=pointer]:
              - img "AF" [ref=e1602]
              - paragraph [ref=e1603]: "+93"
              - img [ref=e1605]
              - paragraph [ref=e1607]
            - generic [ref=e1608]:
              - spinbutton "Phone" [ref=e1609]
              - generic [ref=e1610]: Phone
          - button "Contact Now" [ref=e1611] [cursor=pointer]:
            - generic [ref=e1612]: Contact Now
      - generic [ref=e1615]:
        - img "Partner1 logo" [ref=e1617]
        - img "Civitatis logo" [ref=e1619]
        - img "Partner logo" [ref=e1621]
        - img "Partner2 logo" [ref=e1623]
        - img "Partner3 logo" [ref=e1625]
        - img "Partner4 logo" [ref=e1627]
        - img "Partner5 logo" [ref=e1629]
        - img "Partner6 logo" [ref=e1631]
        - img "Partner7 logo" [ref=e1633]
        - img "Partner8 logo" [ref=e1635]
        - img "Partner9 logo" [ref=e1637]
        - img "Partner12 logo" [ref=e1639]
        - img "Partner99 logo" [ref=e1641]
        - img "TourRadar logo" [ref=e1643]
        - img "Viator logo" [ref=e1645]
    - button [ref=e1646] [cursor=pointer]:
      - img [ref=e1647]
    - img "chair icon" [ref=e1650]
    - contentinfo [ref=e1651]:
      - generic [ref=e1652]:
        - generic [ref=e1653]:
          - img "logo" [ref=e1654]
          - paragraph [ref=e1655]: Need Our Help ?
          - paragraph [ref=e1656]: We Would Happy To Help You ...
          - generic [ref=e1657]:
            - button [ref=e1658] [cursor=pointer]:
              - img [ref=e1660]
            - button [ref=e1662] [cursor=pointer]:
              - img [ref=e1664]
            - button [ref=e1667] [cursor=pointer]:
              - img [ref=e1669]
            - button [ref=e1671] [cursor=pointer]:
              - img [ref=e1673]
          - img "certified footer" [ref=e1678] [cursor=pointer]
        - generic [ref=e1679]:
          - paragraph [ref=e1680]: Sunpyramids Links
          - list [ref=e1681]:
            - listitem [ref=e1682]:
              - link "Home" [ref=e1683] [cursor=pointer]:
                - /url: /
                - generic [ref=e1684]: Home
            - listitem [ref=e1685]:
              - link "One Day Tours" [ref=e1686] [cursor=pointer]:
                - /url: /egypt-tours/one-day-tours
                - generic [ref=e1687]: One Day Tours
            - listitem [ref=e1688]:
              - link "Multi Days Tours" [ref=e1689] [cursor=pointer]:
                - /url: /egypt-tours/multi-days-tours
                - generic [ref=e1690]: Multi Days Tours
            - listitem [ref=e1691]:
              - link "Nile Cruises" [ref=e1692] [cursor=pointer]:
                - /url: /egypt-tours/nile-cruises
                - generic [ref=e1693]: Nile Cruises
            - listitem [ref=e1694]:
              - link "Shore Excursion" [ref=e1695] [cursor=pointer]:
                - /url: /egypt-tours/shore-excursions
                - generic [ref=e1696]: Shore Excursion
            - listitem [ref=e1697]:
              - link "Special Offer" [ref=e1698] [cursor=pointer]:
                - /url: /trips?main=special-offers
                - generic [ref=e1699]: Special Offer
                - img [ref=e1701]
            - listitem [ref=e1703]:
              - link "Rent Car" [ref=e1704] [cursor=pointer]:
                - /url: /rent-car
                - generic [ref=e1705]: Rent Car
            - listitem [ref=e1706]:
              - link "About Us" [ref=e1707] [cursor=pointer]:
                - /url: /about-us
                - generic [ref=e1708]: About Us
            - listitem [ref=e1709]:
              - link "Contact Us" [ref=e1710] [cursor=pointer]:
                - /url: /contact-us
                - generic [ref=e1711]: Contact Us
            - listitem [ref=e1712]:
              - link "Egypt Travel Guide" [ref=e1713] [cursor=pointer]:
                - /url: /egypt-travel-guide
                - generic [ref=e1714]: Egypt Travel Guide
            - listitem [ref=e1715]:
              - link "faqs" [ref=e1716] [cursor=pointer]:
                - /url: /faqs
                - generic [ref=e1717]: faqs
            - listitem [ref=e1718]:
              - link "Events" [ref=e1719] [cursor=pointer]:
                - /url: /events
                - generic [ref=e1720]: Events
            - listitem [ref=e1721]:
              - link "Accessible Travel" [ref=e1722] [cursor=pointer]:
                - /url: /accessible-travel
                - generic [ref=e1723]: Accessible Travel
        - generic [ref=e1724]:
          - paragraph [ref=e1725]: Contact Info
          - generic [ref=e1726]:
            - generic [ref=e1728]:
              - paragraph [ref=e1729]:
                - link "+20 109 588 8830" [ref=e1730] [cursor=pointer]:
                  - /url: tel:+20 109 588 8830
              - paragraph [ref=e1731]:
                - link "+20 109 588 8831" [ref=e1732] [cursor=pointer]:
                  - /url: tel:+20 109 588 8831
              - paragraph [ref=e1733]:
                - link "+20 109 588 8835" [ref=e1734] [cursor=pointer]:
                  - /url: tel:+20 109 588 8835
            - generic [ref=e1735]:
              - img [ref=e1736]
              - paragraph [ref=e1739] [cursor=pointer]: +20 109 588 8830
            - generic [ref=e1741]:
              - paragraph [ref=e1742]:
                - link "info@sunpyramidstours.com" [ref=e1743] [cursor=pointer]:
                  - /url: mailto:info@sunpyramidstours.com
              - paragraph [ref=e1744]:
                - link "sales@sunpyramidstours.com" [ref=e1745] [cursor=pointer]:
                  - /url: mailto:sales@sunpyramidstours.com
              - paragraph [ref=e1746]:
                - link "sustainability@sunpyramidstours.com" [ref=e1747] [cursor=pointer]:
                  - /url: mailto:sustainability@sunpyramidstours.com
            - paragraph [ref=e1750] [cursor=pointer]: Pyramids View Tower - Mansourieh Intersection with Faisal - Above Tseppas Pastry - Fourth Floor
      - generic [ref=e1753]:
        - paragraph [ref=e1754]: All rights reserved to sunpyramids company, Egypt ©2024
        - generic [ref=e1755]:
          - link "Privacy and Cookies" [ref=e1756] [cursor=pointer]:
            - /url: /privacy-and-cookies
          - link "Terms and Conditions" [ref=e1757] [cursor=pointer]:
            - /url: /terms-and-conditions
  - generic [ref=e1758]:
    - button "Toggle Nuxt DevTools" [ref=e1759] [cursor=pointer]:
      - img [ref=e1760]
    - generic "Page load time" [ref=e1763]:
      - generic [ref=e1764]: "1.1"
      - generic [ref=e1765]: s
    - button "Toggle Component Inspector" [ref=e1767] [cursor=pointer]:
      - img [ref=e1768]
  - generic [ref=e1772] [cursor=pointer]:
    - generic [ref=e1774]:
      - img "Trustindex" [ref=e1776]
      - generic [ref=e1777]: Excellent Reviews
    - generic [ref=e1778]:
      - text: Verified by
      - strong [ref=e1779]: Trustindex
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Third-Party Script Deferral Verification', () => {
  4   |   test('T009d, T016b, T020-2: Initial Load (no third-party requests)', async ({ page }) => {
  5   |     const thirdPartyRequests: string[] = [];
  6   |     page.on('request', request => {
  7   |       const url = request.url();
  8   |       if (url.includes('googletagmanager.com') || url.includes('google.com/recaptcha') || url.includes('cdn.trustindex.io')) {
  9   |         thirdPartyRequests.push(url);
  10  |       }
  11  |     });
  12  | 
  13  |     await page.goto('/', { waitUntil: 'load' });
  14  |     await page.waitForTimeout(1000);
  15  | 
> 16  |     expect(thirdPartyRequests.length, 'Expected no third-party requests on initial load').toBe(0);
      |                                                                                           ^ Error: Expected no third-party requests on initial load
  17  | 
  18  |     const hasNoscript = await page.evaluate(() => {
  19  |       const noscripts = document.querySelectorAll('noscript');
  20  |       return Array.from(noscripts).some(n => n.innerHTML.includes('googletagmanager.com'));
  21  |     });
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
```