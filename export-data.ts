// migrate-pandals-final.ts
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Your complete pandals data (106 unique pandals)
const ALL_PANDALS = [
    {
        appwrite_id: "68558b5a1877eeee667c",
        name: "Sreebhumi Sporting Club",
        address: "198 Canal Street (Canal St), Sreebhumi, Lake Town, Kolkata – 700048",
        latitude: 22.60056,
        longitude: 88.4026,
        rating: 4.7,
        description: "Sreebhumi Sporting Club Durga Puja is famous for its grand, theme-based pandals and massive crowd turnout. Located in Lake Town, it showcases stunning decor inspired by global landmarks each year.",
        category: "theme-based",
        crowd_level: "high",
        area: "north_kolkata"
    },
    {
        appwrite_id: "68559dab439a5a48e2da",
        name: "Dum Dum Park Sarbojanin",
        address: "225/1, Dum Dum Park, South Dumdum, Kolkata – 700055 (near Dum Dum Park bus stop, Dum Dum Junction & Metro)",
        latitude: 22.60953,
        longitude: 88.4164,
        rating: 4.4,
        description: "Known for its socially-conscious, theme-based pandals (e.g., unity or environmental themes), excellent decor, and community welfare activities including free medical camps and tree plantation drives.",
        category: "modern",
        crowd_level: "high",
        area: "north_kolkata"
    },
    {
        appwrite_id: "68559ec996034532c858",
        name: "Dum Dum Park Tarun Sangha",
        address: "60, Shyam Nagar Road, Dum Dum Park, Kolkata – 700055 (near Dum Dum Junction & Metro Station).",
        latitude: 22.61094,
        longitude: 88.41387,
        rating: 4.6,
        description: "An award-winning, theme-based community pandal known for artistic installations centered on social/environmental issues, blending aesthetics with meaningful messaging.",
        category: "modern",
        crowd_level: "high",
        area: "north_kolkata"
    },
    {
        appwrite_id: "68559f9e4732b625f1d1",
        name: "Dum Dum Park Bharat Chakra",
        address: "Tank No. 2, Dum Dum Park, South Dum Dum, Kolkata – 700055 (near Dum Dum Park bus stop/metro)",
        latitude: 22.61084,
        longitude: 88.41459,
        rating: 4.4,
        description: "A prestigious, theme-based pandal that emphasizes social and cultural responsibility—organizing tree plantations, relief efforts (after Amphan), free food, clothing, oxygen kits, and art installations.",
        category: "modern",
        crowd_level: "high",
        area: "north_kolkata"
    },
    {
        appwrite_id: "6855a0c6a96aaf61b2a1",
        name: "Baghbazar Sarbojanin Durga Puja",
        address: "78 Baghbazar Street, Kolkata – 700003 (near Baghbazar Ghat and Metro Station)",
        latitude: 22.60467,
        longitude: 88.36564,
        rating: 4.5,
        description: "Kolkata's oldest mass Durga Puja, founded in 1918 as a Swadeshi, community-inclusive celebration with traditional themes like Daker Saaj and carnival vibes through a mela.",
        category: "traditional",
        crowd_level: "high",
        area: "north_kolkata"
    },
    {
        appwrite_id: "6855a220f12c6029f870",
        name: "Kumartuli Park Sarbojanin",
        address: "8B Abhay Mitra St (Abhoy Mitra St), Sovabazar, Kumartuli, Shobhabazar, Kolkata – 700005",
        latitude: 22.59906,
        longitude: 88.36148,
        rating: 4.5,
        description: "A visually stunning celebration set in Kolkata's iconic potters' quarter—featuring handcrafted idols and ever-evolving thematic pandals blending traditional craftsmanship with modern artistry.",
        category: "traditional",
        crowd_level: "high",
        area: "north_kolkata"
    },
    {
        appwrite_id: "6855a2ef3b0b6bd18b52",
        name: "Jagat Mukherjee Park",
        address: "1 Jatindra Mohan Avenue, Sovabazar (near Sovabazar Sutanuti Metro), Kolkata – 700005",
        latitude: 22.59957,
        longitude: 88.36602,
        rating: 4.6,
        description: "A beloved pandal famous for its immersive, metro-themed installations—this year featuring an underwater metro and Ganga pollution messaging with realistic lighting, sound, and even vibrating coach effects.",
        category: "modern",
        crowd_level: "high",
        area: "north_kolkata"
    },
    {
        appwrite_id: "6855a3a02c79e6c9d5a7",
        name: "Sikdar Bagan Sadharan",
        address: "No. 69/1, Sikdar Bagan Street, Hati Bagan, Shyam Bazar, Kolkata – 700004",
        latitude: 22.59678,
        longitude: 88.37213,
        rating: 4.4,
        description: "One of Kolkata's oldest community pujas (est. 1913), known for its thoughtful Durga idol craftsmanship, spiritually rooted rituals (Bodhon, Kumari Puja, etc.), and culturally rich performances.",
        category: "traditional",
        crowd_level: "high",
        area: "north_kolkata"
    },
    {
        appwrite_id: "6855a462ea019a8cfda4",
        name: "Hatibagan Nabin Pally",
        address: "Nalin Sarkar Street, Hatibagan, Kolkata – 700004 (pandal spreads across the para & nearby lanes)",
        latitude: 22.59598,
        longitude: 88.37344,
        rating: 4.4,
        description: "A community-driven, theatre‑themed pandal that transforms the entire block into a tribute to Abol Tabol by Sukumar Ray—complete with retro play posters, live skits, and black‑and‑white house murals evoking early-Calcutta theatre.",
        category: "modern",
        crowd_level: "high",
        area: "north_kolkata"
    },
    {
        appwrite_id: "6856588f6554ffe721e4",
        name: "Hatibagan Sarbojonin Durga Puja",
        address: "134 Sri Aurobinda Sarani (Principal Khudiram Bose Road), Hati Bagan, Kolkata – 700006 (near Hatibagan Crossing; approx. 0.4 km from Shobhabazar Sutanuti Metro)",
        latitude: 22.59446,
        longitude: 88.37198,
        rating: 4.6,
        description: "A historic and highly creative community puja (est. 1934), celebrated for its conceptual, art-driven themes - 2023's \"Doshar\" explored human relationships through immersive pandal design.",
        category: "modern",
        crowd_level: "high",
        area: "north_kolkata"
    },
    {
        appwrite_id: "685659d3b8eada7d9ddd",
        name: "Kashi Bose Lane Durga Puja Committee",
        address: "5/1 Kashi Bose Lane, Manicktala (Darjipara), Kolkata – 700006 (near Girish Park Metro)",
        latitude: 22.59117,
        longitude: 88.3689,
        rating: 4.6,
        description: "Established in 1937, this historic Barowari pandal is celebrated for its annual conceptual and socially relevant themes. In 2023, the theme focused on child trafficking. The puja combines powerful community service, eco-friendly practices, and thoughtful art installations.",
        category: "modern",
        crowd_level: "high",
        area: "north_kolkata"
    },
    {
        appwrite_id: "68565b0f123ba6e8c3fe",
        name: "Sovabazar Rajbari Durga Puja",
        address: "36, Raja Naba Krishna Street, Sovabazar, Kolkata – 700005 (close to Sovabazar Sutanuti Metro)",
        latitude: 22.59636,
        longitude: 88.36739,
        rating: 4.5,
        description: "Kolkata's oldest bonedi-bari Durga Puja, first celebrated in 1757 by Raja Nabakrishna Deb. Held in the palace's historic \"thakurdalan,\" it features timeless rituals, iconic \"daker saj\" idol, cannon firing at Sandhi-kal, and famous sweet-only bhog.",
        category: "traditional",
        crowd_level: "high",
        area: "north_kolkata"
    },
    {
        appwrite_id: "6856a8a82b94e32f517c",
        name: "Ahiritola Jubak Brinda",
        address: "83 Ahiritola Street, Beniatola, Kolkata – 700005 (near Shobhabazar Sutanuti Metro & Sovabazar Crossing)",
        latitude: 22.59464,
        longitude: 88.36032,
        rating: 4.4,
        description: "A socially-driven pandal that spotlights marginalized communities—most notably the 2018 tribute to Sonagachi sex workers via a 300-ft street graffiti and a \"kotha\"-styled mandap.",
        category: "modern",
        crowd_level: "medium-high",
        area: "north_kolkata"
    },
    {
        appwrite_id: "6856a97e3f6c08823499",
        name: "Ahiritola Sarbojanin Durgotsab",
        address: "55 (or 172/C) BK Paul Avenue, Ahiritola, Kolkata – 700005",
        latitude: 22.59493,
        longitude: 88.35707,
        rating: 4.4,
        description: "This heritage-themed puja spotlights the historic Ahiritola Ghat, celebrating Kolkata's colonial past with nostalgic architecture and storytelling through immersive decor.",
        category: "traditional",
        crowd_level: "medium-high",
        area: "north_kolkata"
    },
    {
        appwrite_id: "6856ccfa08a91584f5dc",
        name: "Mohammad Ali Park",
        address: "41A Tara Chand Dutta Street, Kolkata – 700073 (near Mahatma Gandhi Road Metro Station)",
        latitude: 22.57738,
        longitude: 88.36076,
        rating: 4.4,
        description: "Founded in 1969 after the Fire Brigade Puja ended, it's now a prestigious and socially active pandal. Themes have ranged from Kerala's Murugan Temple (2019) to Kedarnath (2023) and the White House with water‐conservation messaging (2024).",
        category: "theme-based",
        crowd_level: "high",
        area: "central_kolkata"
    },
    {
        appwrite_id: "6856ce62a1e2312cf2c3",
        name: "College Square Sarbojanin",
        address: "53 College Street, Kolkata – 700073 (next to University of Calcutta & College Square Park)",
        latitude: 22.57461,
        longitude: 88.36447,
        rating: 4.5,
        description: "A top-tier central Kolkata puja famed for its lakeside setting with stunning reflections, themed installations (e.g., Swiss Parliament House 2024), kumari puja, and immersive light-and-sound shows. It also hosts social initiatives like blood donation, book drives, and medical aid.",
        category: "theme-based",
        crowd_level: "high",
        area: "central_kolkata"
    },
    {
        appwrite_id: "6856cf9de5e6a5d68634",
        name: "Santosh Mitra Square",
        address: "Santosh Mitra Square, Natabar Dutta Row Road, Lebutala, Kolkata – 700014",
        latitude: 22.56621,
        longitude: 88.36566,
        rating: 4.7,
        description: "Renowned for its ambitious annual themes—like the Las Vegas Sphere (2024), Ram Mandir replica (2023), Red Fort (2022)—and immersive tech shows including 11D visuals, along with street-style food stalls and community events.",
        category: "theme-based",
        crowd_level: "high",
        area: "central_kolkata"
    },
    {
        appwrite_id: "6856d173470a726f53ef",
        name: "Natunpally Pradeep Sangha",
        address: "85 S. K. Deb Road, Lake Town, Kolkata – 700048 (near Sealdah Railway Athletic Club route)",
        latitude: 22.60376,
        longitude: 88.39731,
        rating: 4.4,
        description: "Renowned for its innovative themes and eco-friendly décor, this pandal was the first in Eastern Kolkata to win the Asian Paints Sharad Samman three years straight (2006–2008). Past exhibits include earthy, village-style murals, denim installations, and upcycled materials.",
        category: "modern",
        crowd_level: "high",
        area: "central_kolkata"
    },
    {
        appwrite_id: "685d42a1948ad49ff8f3",
        name: "Nalin Sarkar Street",
        address: "205‑A, Shri Aurobindo Sarani Road (Nalin Sarkar Street), Shyam Bazar, Kolkata – 700006 (around Khanna Cinema, ~0.5 km from Shyambazar Metro)",
        latitude: 22.5946,
        longitude: 88.3743,
        rating: 4.5,
        description: "Nalin Sarkar Street is known for bold, socially relevant themes presented through artistic installations. From highlighting urban life to honoring unsung heroes like scavengers, each year they use recycled materials and strong visuals to deliver powerful messages.",
        category: "theme-based",
        crowd_level: "high",
        area: "north_kolkata"
    },
    {
        appwrite_id: "68752ae6637ad9712678",
        name: "A-9 Square Park",
        address: "A‑9 Square Park, Kalyani, Nadia District, West Bengal",
        latitude: 22.9678,
        longitude: 88.4623,
        rating: 4.4,
        description: "Created as a symbolic Chardham Yatra, this puja offers local devotees a chance to feel spiritually close to the four holy shrines, bringing together devotional aesthetics with rich cultural symbolism.",
        category: "theme-based",
        crowd_level: "high",
        area: "kalyani"
    },
    {
        appwrite_id: "68752c6c38223ea77bc4",
        name: "ITI More",
        address: "ITI More Ground, Block B‑9, Kalyani – 741235",
        latitude: 22.9796,
        longitude: 88.4385,
        rating: 4.7,
        description: "A spectacular suburban pandal known for its jaw-dropping replicas of iconic landmarks—such as the Grand Lisboa (Macau), Petronas Twin Towers, and in 2025, Myanmar's Hsinbyume Pagoda, following 2024's Bangkok Wat Arun theme.",
        category: "theme-based",
        crowd_level: "high",
        area: "kalyani"
    },
    {
        appwrite_id: "68753691aeb5ae609ba5",
        name: "Kalyani Rathtala",
        address: "Block B, Rathtala, Kalyani, Nadia, West Bengal",
        latitude: 22.95963,
        longitude: 88.42421,
        rating: 4.3,
        description: "A vibrant suburban celebration blending tradition and grandeur, this puja is famed for its immersive Vrindavan Prem Mandir–inspired theme with bamboo construction and ornate lighting. It's among Kalyani's most anticipated durgotsabs.",
        category: "theme-based",
        crowd_level: "medium-high",
        area: "kalyani"
    },
    {
        appwrite_id: "6875e37a60be348a7a6a",
        name: "Boat Park",
        address: "Block B‑9 \"Boat Park\" locality, Kalyani, Nadia District, West Bengal",
        latitude: 22.97735,
        longitude: 88.43962,
        rating: 4.2,
        description: "Known for its \"mega pandal\" setup that's well-organized and peaceful. Frequently mentioned by Kalyani locals as a favorite along with Rathtala, A‑9 Square Park, and ITI More.",
        category: "theme-based",
        crowd_level: "medium-high",
        area: "kalyani"
    },
    {
        appwrite_id: "6875e45691efbbc36b81",
        name: "Manimala Park",
        address: "Block B, B-12 (Manimala Park locality), Kalyani, Nadia district",
        latitude: 22.9711,
        longitude: 88.4385,
        rating: 4.2,
        description: "A community-run pandal set in the charming Manimala Park, offering a peaceful, thematic experience loved by locals. Known for a well-decorated yet intimate setting that makes it a favorite neighborhood celebration.",
        category: "theme-based",
        crowd_level: "medium-high",
        area: "kalyani"
    },
    {
        appwrite_id: "6875e95a5e2b5ed8c16b",
        name: "66 Pally",
        address: "Nepal Bhattacharjee Street (66 Pally), Kalighat, Kolkata – 70002",
        latitude: 22.51805,
        longitude: 88.34275,
        rating: 4.4,
        description: "A renowned community pandal known for its socially-conscious and artful themes. For instance, 2022's theme Khudito Pashaan emphasized the omnipresence of the divine amidst societal darkness, while 2023 highlighted women empowerment with female priestesses conducting the rituals.",
        category: "modern",
        crowd_level: "medium-high",
        area: "south_kolkata"
    },
    {
        appwrite_id: "6875eacda44d815084e9",
        name: "Abasar Sarbojanin",
        address: "6 Rakhal Mukherjee Road, Bhawanipore, Kolkata – 700025",
        latitude: 22.52819,
        longitude: 88.34839,
        rating: 4.2,
        description: "A well-established, community-based puja over 70 years old, known for its elegant idols and traditional setup, celebrated with heartfelt devotion and neighborhood participation.",
        category: "traditional",
        crowd_level: "medium-high",
        area: "south_kolkata"
    },
    {
        appwrite_id: "6875ec35866cc6d6b07f",
        name: "Alipore 78 Pally",
        address: "Alipore 78 Palli Club, Alipore, Kolkata – 700027",
        latitude: 22.52304,
        longitude: 88.33692,
        rating: 4.4,
        description: "A well-established community puja praised for its artistic and colorful décor. The simplicity of the idol is enhanced by a striking environment, creating a serene yet visually impactful atmosphere.",
        category: "theme-based",
        crowd_level: "high",
        area: "south_kolkata"
    },
    {
        appwrite_id: "6875ed51ee47ade3cad0",
        name: "Alipore Sarbojanin",
        address: "27/1A Alipore Road, Alipore Sarbojanin Durga Puja Committee, Kolkata – 700027",
        latitude: 22.5183,
        longitude: 88.33328,
        rating: 4.4,
        description: "Known for its striking fusion of traditional sabeki idol styles with contemporary visual storytelling. Last year's theme \"সং কল্প\" brought Bengal's folk traditions to life via street performers, roving Devi avatars, and open-air pulpits.",
        category: "theme-based",
        crowd_level: "high",
        area: "south_kolkata"
    },
    {
        appwrite_id: "6875eed656f7f825984c",
        name: "Badamtala Ashar Sangha",
        address: "5B Nepal Bhattacharjee Street, Kalighat, Kolkata – 700026",
        latitude: 22.51798,
        longitude: 88.34373,
        rating: 4.5,
        description: "Founded in 1939, this historic community puja is known for its creative themes—such as \"life's journey\" featuring boats and cityscapes—and its blend of traditional devotion with modern social initiatives.",
        category: "traditional",
        crowd_level: "high",
        area: "south_kolkata"
    },
    {
        appwrite_id: "6875f053c14ceeac89d7",
        name: "Bakul Bagan Sarbojanin",
        address: "36, Rajshekhar Bose Sarani, Bakul Bagan, Bhawanipore, Kolkata, West Bengal 700025",
        latitude: 22.52676,
        longitude: 88.34824,
        rating: 4.3,
        description: "A prestigious community pandal renowned for its artist-designed idols and globally inspired themes—such as 2022's tribute to Vincent van Gogh's Starry Night—crafted by celebrated artists often without charge.",
        category: "theme-based",
        crowd_level: "medium-high",
        area: "south_kolkata"
    },
    {
        appwrite_id: "6875f10fa53b9a337113",
        name: "Ballygunge Cultural Association",
        address: "57, Jatindas Road, Lake Terrace, Ballygunge, Kolkata – 700029",
        latitude: 22.51623,
        longitude: 88.35581,
        rating: 4.5,
        description: "Established in 1951, this iconic South Kolkata puja blends tradition and modernity. Known for its bamboo-and-steel structure, eco-friendly décor, and cultural-depth themes (like \"Jugalbandi of Indian arts\"), it draws over a million visitors daily during Puja.",
        category: "modern",
        crowd_level: "medium-high",
        area: "south_kolkata"
    },
    {
        appwrite_id: "6875f2455dc988608c29",
        name: "Bhawanipore 75 Pally",
        address: "Bhawanipore 75 Palli, Debendra Ghosh Road, Kolkata – 700025",
        latitude: 22.53332,
        longitude: 88.3457,
        rating: 4.2,
        description: "Celebrating its Diamond Jubilee in 2024, the pandal's theme \"Tobuo Tomar Kache Aamar Hridoy\" – \"Yet my heart is with you\" – combines rustic art, eco-friendly materials, and immersive storytelling by artists Shivshankar Das and Sanatan Dinda to reflect Kolkata's cultural identity.",
        category: "modern",
        crowd_level: "medium-high",
        area: "south_kolkata"
    },
    {
        appwrite_id: "6875f3511ae84af38aa7",
        name: "Bosepukur Sitala Mandir",
        address: "1/27 Bosepukur Road, Tal Bagan, Kasba, Kolkata – 700042",
        latitude: 22.51921,
        longitude: 88.38485,
        rating: 4.2,
        description: "A creative and award-winning puja known for its innovative thematic pandals—such as the 2023 \"Ayojon\" built with over 7,500 welded iron chairs that move—celebrating nostalgia and social commentary with powerful visual artistry.",
        category: "theme-based",
        crowd_level: "medium-high",
        area: "south_kolkata"
    },
    {
        appwrite_id: "6875f433942e3f6a2786",
        name: "Bosepukur Talbagan Sarbojanin",
        address: "26 Bosepukur Road, Tal Bagan, Kasba, Kolkata – 700042",
        latitude: 22.51895,
        longitude: 88.3827,
        rating: 4.3,
        description: "A creative pandal known for its forest-themed decor (Parnachhaya) using date-palm and sal leaves, and one of the first in Kolkata to use 3D projection mapping in its mandap.",
        category: "modern",
        crowd_level: "medium-high",
        area: "south_kolkata"
    },
    {
        appwrite_id: "6875f71e01417ca412cd",
        name: "Chakraberia Sarbojanin",
        address: "21–61 Chakraberia Road North, Paddapukur, Bhawanipore ,Kolkata – 700025",
        latitude: 22.533609,
        longitude: 88.35192,
        rating: 4.5,
        description: "A historic community puja started in 1946, Chakraberia is famed for its thematic pandals like \"Babu-Ani\" (reviving colonial babu culture), \"Bodhoday\" (mental health awareness), and \"Naari Shakti\" (women empowerment), blending artistic vision with social messaging.",
        category: "theme-based",
        crowd_level: "high",
        area: "south_kolkata"
    },
    {
        appwrite_id: "6875f803433311812e98",
        name: "Chetla Agrani Club",
        address: "14, Peary Mohan Roy Rd, Chetla, Kolkata - 700027",
        latitude: 22.516407,
        longitude: 88.336838,
        rating: 4.7,
        description: "Since 2007, this club has risen to fame for its theme-based pandals and environmentally-conscious decor. Recent themes include Shiva-Parvati love (Magical Love, 2015), Je Jekhane Dariye life's journey (2023), and a stark 2024 theme on Ganges pollution featuring actual waste from the river.",
        category: "theme-based",
        crowd_level: "high",
        area: "south_kolkata"
    },
    {
        appwrite_id: "6875f8e8418df3bafcf9",
        name: "Deshapriya Park",
        address: "Manoharpukur (beside Priya Cinema), Rashbehari Avenue, Kolkata – 700029",
        latitude: 22.518989,
        longitude: 88.353443,
        rating: 4.6,
        description: "A landmark puja in South Kolkata since 1938, known for spectacular idol sizes and grand thematic pandals, featuring innovative social messaging while retaining cultural authenticity.",
        category: "modern",
        crowd_level: "high",
        area: "south_kolkata"
    },
    {
        appwrite_id: "6875f971ca95c6c3a091",
        name: "Ekdalia Evergreen Club",
        address: "15 Ekdalia Road, Ballygunge, Kolkata – 700019",
        latitude: 22.521219,
        longitude: 88.36656,
        rating: 4.4,
        description: "A celebrated puja since 1943, this pandal is known for its traditional idol molds (sabeki style) set within elaborate replicas of world-renowned temples, blended with precise lighting and grand chandeliers.",
        category: "modern",
        crowd_level: "medium-high",
        area: "south_kolkata"
    },
    {
        appwrite_id: "6875fa37b45f63d35d2f",
        name: "Ballygunge 21 Pally",
        address: "17 Bondel Road (near Patha Bhawan), Ballygunge, Kolkata – 700019",
        latitude: 22.529195,
        longitude: 88.368823,
        rating: 4.4,
        description: "Founded in 1947 by eminent artists like Jamini Roy and Atul Basu, Ballygunge 21 Pally is a socially committed community puja. Themes often spotlight everyday heroes and Kolkata's heritage through artistic and cultural depth.",
        category: "theme-based",
        crowd_level: "medium-high",
        area: "south_kolkata"
    },
    {
        appwrite_id: "6875fc99d4b4fdc639c3",
        name: "Hindustan Club",
        address: "19A Hindustan Road (Dover Terrace), Ballygunge, Kolkata – 700019",
        latitude: 22.520208,
        longitude: 88.360801,
        rating: 4.4,
        description: "A long-standing social-club puja known for immersive artistic themes. In 2022, the theme \"Dariyapar\" (Crossing the River) featured boats symbolizing life's journey, with Devi seated in a boat vessel, overseen by a women-led organizing team.",
        category: "theme-based",
        crowd_level: "medium-high",
        area: "south_kolkata"
    },
    {
        appwrite_id: "6875ff10a09af048cc69",
        name: "Hindustan Park",
        address: "51 Golpark, Hindustan Park, Gariahat, Kolkata – 700019",
        latitude: 22.517653,
        longitude: 88.361901,
        rating: 4.6,
        description: "A historic community puja since 1931, Hindustan Park is celebrated for its imaginative, socially-aware themes. In 2024, the theme was \"Pran\", addressing deforestation with lush natural motifs and recycled elements.",
        category: "theme-based",
        crowd_level: "high",
        area: "south_kolkata"
    },
    {
        appwrite_id: "68760125158f6ef48297",
        name: "Kalighat yuba Maitry",
        address: "39, Mahim Halder St, Kalighat, Kolkata - 700026",
        latitude: 22.52243,
        longitude: 88.34389,
        rating: 4.1,
        description: "A modest but charming community puja, known for bright and artistic pandal decor. The simplicity of Maa Durga's idol enhances the overall ambiance, making it an appealing local favorite.",
        category: "traditional",
        crowd_level: "medium",
        area: "south_kolkata"
    },
    {
        appwrite_id: "68760820a5ee14072a37",
        name: "Kalighat Sree Sangha",
        address: "Near Kalighat Police Station, Gurupada Halder Road, Chetla, Kolkata – 700026",
        latitude: 22.52111,
        longitude: 88.34344,
        rating: 4.6,
        description: "A modest yet elegant community puja known for its beautifully lit pandal and the simplicity of Maa Durga's idol, creating a serene and heartwarming ambiance.",
        category: "modern",
        crowd_level: "medium-high",
        area: "south_kolkata"
    },
    {
        appwrite_id: "68772c11c4c083b59042",
        name: "25 Pally Club",
        address: "10 Gopal Ghosh Lane, Khidirpur, Kolkata – 700023",
        latitude: 22.53919,
        longitude: 88.32644,
        rating: 4.5,
        description: "One of the oldest theme-based pujas (since ~1945), 25 Palli is known for its imaginative installations built from recycled materials like bottles, wires, cups, and earthen pots. In 2024, the theme \"Paricharon\" honored caregivers and celebrated community care through creative décor.",
        category: "theme-based",
        crowd_level: "medium-high",
        area: "south_kolkata"
    },
    {
        appwrite_id: "68772d6919dcbc210e21",
        name: "74 Pally Club",
        address: "5B, Monilal Banerjee Rd, Khidirpur, Kolkata, West Bengal 700023",
        latitude: 22.53966,
        longitude: 88.32519,
        rating: 4.4,
        description: "A long-standing community puja, 74 Pally is celebrated for its elegantly understated and authentic setup. The mud-painted idol, narrow-lane pandal, and classic Kerala-style calm make for a serene and artistic experience.",
        category: "theme-based",
        crowd_level: "medium",
        area: "south_kolkata"
    },
    {
        appwrite_id: "68772e5be32f19758c04",
        name: "75 Pally Khidirpur",
        address: "11C, Khidirpur, Ramanath Pal Rd, Watganj, Kolkata, West Bengal 700023",
        latitude: 22.54026,
        longitude: 88.32054,
        rating: 4.5,
        description: "A long-standing community puja known for its authentic, traditional charm. The pandal features classic idol styles and a respectful setup, welcoming visitors into a serene festive space—ideal for those preferring a peaceful immersion in cultural heritage.",
        category: "traditional",
        crowd_level: "medium",
        area: "south_kolkata"
    },
    {
        appwrite_id: "68772f4edf61b6b7c8f9",
        name: "Kabitirthey Sarodotsab",
        address: "13/1, Ram Kamal St, Khidirpur, Kolkata - 700023",
        latitude: 22.54062,
        longitude: 88.32235,
        rating: 4.2,
        description: "Established in 1953, this heritage pandal is known for its traditional artistry and serene atmosphere. It features classic idol styles crafted by noted sculptors like Kalachand Rudra Pal.",
        category: "traditional",
        crowd_level: "medium",
        area: "south_kolkata"
    },
    {
        appwrite_id: "687730728c02ad94309c",
        name: "KhidirPur Pally Saradiya",
        address: "Kidderpore Pally Saradiya zone, Khidirpur, Kolkata - 700023",
        latitude: 22.54325,
        longitude: 88.32151,
        rating: 4.4,
        description: "A vibrant, mid-scale community pandal acclaimed for its creative themes. In 2024, it won the prestigious Asian Paints Sharad Shamman for its \"Black Hole\" theme—an immersive design by artist Raju Sarkar, with idol by Jayanta Pal.",
        category: "modern",
        crowd_level: "medium-high",
        area: "south_kolkata"
    },
    {
        appwrite_id: "687731383fab3ef320fa",
        name: "Maddox Square",
        address: "Garcha / Ritchie Road crossing, Ballygunge, Kolkata – 700025",
        latitude: 22.52657,
        longitude: 88.35464,
        rating: 4.2,
        description: "A traditional sabeki-style puja running since the 1930s, Maddox Square is loved for its warm, adda-friendly atmosphere, graceful idol adorned with the golden \"Daker Saaj\", and classic bamboo-and-fabric mandap.",
        category: "traditional",
        crowd_level: "medium",
        area: "south_kolkata"
    },
    {
        appwrite_id: "6877329e94362b018136",
        name: "Mudiali Club",
        address: "37, SR Das Rd, Mudiali, Kalighat, Kolkata, West Bengal 700026",
        latitude: 22.510208178935,
        longitude: 88.346312678497,
        rating: 4.5,
        description: "Established in 1935, this puja is known for its artistic innovation within a traditional framework. Recent themes include \"Pratiksha\" (hope after the pandemic), with rainbow-style solar-powered lighting, and \"Trimatrik\" (2024) depicting the cosmic balance of Brahma, Vishnu, and Maheshwar in three-dimensional form.",
        category: "modern",
        crowd_level: "high",
        area: "south_kolkata"
    },
    {
        appwrite_id: "687733f1c69bcc065847",
        name: "Nepal Bhattacharjee Street Club",
        address: "Nepal Bhattacharjee 1st Ln, Anami Sangha, Kalighat, Kolkata - 700026",
        latitude: 22.51788074517,
        longitude: 88.341273712106,
        rating: 4.2,
        description: "Founded in 1980 by barrister Nepal Bhattacharjee, this distinguished puja is renowned for its graceful idol work and thematic pandals.",
        category: "traditional",
        crowd_level: "medium-high",
        area: "south_kolkata"
    },
    {
        appwrite_id: "687734caa5ad06b4524f",
        name: "Tricone Park",
        address: "Tricone Park, 88‑Ward, Pratapaditya Road, Kolkata – 700026",
        latitude: 22.513466503116,
        longitude: 88.344713571777,
        rating: 4.3,
        description: "A charming barowari puja in a cozy triangular park, blending folk-inspired themes with strong visitor amenities and cultural programming like art shows and performances. Repeatedly commended for well-organized foot traffic and community spirit.",
        category: "modern",
        crowd_level: "medium",
        area: "south_kolkata"
    },
    {
        appwrite_id: "68773ab3c0ebb5c75dea",
        name: "Rajdanga Naba Uday Sangha",
        address: "Rajdanga Chakraborty Para, Sector A, East Kolkata Twp, Kolkata, West Bengal 700039",
        latitude: 22.516629061329,
        longitude: 88.390231200418,
        rating: 4.6,
        description: "Acclaimed for its socially relevant themes, Rajdanga Naba Uday Sangha has tackled pressing issues like global refugee crises (2019), ocean pollution (2022), and the evolving identity of Kolkata—blending tradition and modernity. Their installations often use eco‑materials and immersive storytelling to engage viewers.",
        category: "theme-based",
        crowd_level: "medium-high",
        area: "south_kolkata"
    },
    {
        appwrite_id: "68773b635859f9e13573",
        name: "Rupchand Mukherjee Lane",
        address: "Rupchand Mukherjee Lane, Bhawanipore, Kolkata – 700026",
        latitude: 22.52733129415,
        longitude: 88.344946190161,
        rating: 4.2,
        description: "A charming, small-scale community puja known for its creative yet understated pandal setups—often featuring thematic decor like folk motifs or nostalgic cultural symbols. The focus is on close-knit ambiance, local artistry, and serene idol presentation.",
        category: "traditional",
        crowd_level: "medium",
        area: "south_kolkata"
    },
    {
        appwrite_id: "68773bf9692d65693fb5",
        name: "Samaj Sebi Sangha",
        address: "24A Lake View Road (Hemanta Mukherjee Sarani), Kolkata – 700029",
        latitude: 22.515712419309,
        longitude: 88.356297891099,
        rating: 4.5,
        description: "A socially driven community puja founded in 1946 with roots in communal harmony built during riot relief efforts. Themes often have strong social messages—like 2022's Korshon on agriculture—and it's known for inclusive designs like tactile paths, braille, and sculptures for visually impaired visitors.",
        category: "modern",
        crowd_level: "high",
        area: "south_kolkata"
    },
    {
        appwrite_id: "68773d866b1c2a0bf792",
        name: "Singhi Park Sarbojanin",
        address: "Singhi Park Sarbojanin Durga Puja Committee, Gariahat Crossing, Kolkata – 700029",
        latitude: 22.520842173556,
        longitude: 88.363145758388,
        rating: 4.5,
        description: "A prestigious puja running over 84 years, Singhi Park is famed for its rotating thematic pandals—ranging from iconic temple replicas to eco-friendly installations. Notably, in 2022, it paid tribute to Narayan Debnath's beloved comic characters like Bantul The Great, Handa-Bhonda, and Nonte-Fonte, complete with life-size installations and thematic soundtracks.",
        category: "theme-based",
        crowd_level: "high",
        area: "south_kolkata"
    },
    {
        appwrite_id: "68773e56ab494e71cd6d",
        name: "Tridhara Sammilani",
        address: "Near intersection of Rashbehari Ave, Manohar Pukur Road & Mahanirban Road, Kolkata – 700029",
        latitude: 22.519558136385,
        longitude: 88.355388521358,
        rating: 4.5,
        description: "Founded in 1947, Tridhara is celebrated for its imaginative, exhibition-style themes that take over four days—presenting stories ranging from ancient civilizations to Indian cultural motifs. Thanks to its creative staging, it's regarded as one of the leading theme pujas in South Kolkata.",
        category: "theme-based",
        crowd_level: "high",
        area: "south_kolkata"
    },
    {
        appwrite_id: "687b840d3c99ef51c93e",
        name: "Arjunpur Amra Sabai Club",
        address: "Club grounds, NC‑15, Arjunpur, Taltala, Kolkata – 700059",
        latitude: 22.624291007084,
        longitude: 88.424535821583,
        rating: 4.5,
        description: "Arjunpur Amra Sabai Club is known for its unique blend of traditional artistry with modern themes. In recent years, they have embraced eco-friendly concepts, showcasing creativity that draws attention while maintaining simplicity. The puja offers a peaceful yet vibrant atmosphere, perfect for family visits and photography.",
        category: "modern",
        crowd_level: "medium-high",
        area: "north_kolkata"
    },
    {
        appwrite_id: "687b85576b5437d6f390",
        name: "Belgachia Sadharon Durgotsav",
        address: "J95M+33X, Tala, Belgachia, Kolkata, West Bengal 700037",
        latitude: 22.607730690317,
        longitude: 88.382736935392,
        rating: 4.2,
        description: "Belgachia Sadharan Durgotsav (Belgachia Sadharon Durgotsav) is a socially conscious community puja in North Kolkata's Tala Park, established around 1947. Known for supporting causes—with the 2023 puja dedicated to Manipur survivors—it blends traditional idol worship with contemporary messaging.",
        category: "modern",
        crowd_level: "medium-high",
        area: "north_kolkata"
    },
    {
        appwrite_id: "687b8753657a57618959",
        name: "Brindabon Matri Mandir",
        address: "16 Brindaban Mullick 1st Lane, Sukhiya Street, Kolkata – 700009",
        latitude: 22.582717772219,
        longitude: 88.372911977209,
        rating: 4.3,
        description: "A historic community puja (since 1910), celebrated for its elegant craftsmanship and socially enriching themes, rooted in education and welfare.",
        category: "traditional",
        crowd_level: "medium",
        area: "north_kolkata"
    },
    {
        appwrite_id: "687b887b5607a73006e6",
        name: "Gouriberia Sarbojanin Durgotsab",
        address: "Gouri Bari, CIT Park, Scheme‑VM, Kolkata – 700004",
        latitude: 22.594541804574,
        longitude: 88.379208700002,
        rating: 4.4,
        description: "An 89‑year‑old North Kolkata puja known for blending traditional rituals with thoughtful thematic exhibition—in 2025 exploring \"Athato Brahma Jijnasa\" to inspire deeper introspection.",
        category: "modern",
        crowd_level: "high",
        area: "north_kolkata"
    },
    {
        appwrite_id: "687b8b683d6ed6d52ea8",
        name: "Karbagan Sarbojanin Durgotsav",
        address: "Karbagan, Ultadanga, Kolkata – 700054",
        latitude: 22.595353090067,
        longitude: 88.38381291814,
        rating: 4.5,
        description: "A respected North Kolkata puja (77+ years old) featuring bamboo-and-wood installations and well-crafted idol décor, this year's theme \"Sheemana\" highlights defined boundaries through artistic lighting.",
        category: "traditional",
        crowd_level: "medium-high",
        area: "north_kolkata"
    },
    {
        appwrite_id: "687b8dba1a846886c1ad",
        name: "Kestopur Prafullakanan Adhibasibrinda",
        address: "Lipika Abasan, AA‑122 Prafullakanan (West), Kestopur, Kolkata – 700101",
        latitude: 22.607600172519,
        longitude: 88.421625462133,
        rating: 4.4,
        description: "A creative puja known for strong thematic installations—2024's \"Ekanno\" theme featured a concrete boat‑lotus installation symbolizing human impulses, with Maa Durga under a 28‑ft boat centerpiece.",
        category: "modern",
        crowd_level: "medium-high",
        area: "north_kolkata"
    },
    {
        appwrite_id: "687b8f44d858c9a55117",
        name: "Kestopur Prafullakanan Balak Brinda Purba Durga Puja",
        address: "AC‑62, Prafulla Kanan Road, Rabindrapally, Kestopur, Kolkata – 700101",
        latitude: 22.602043912662,
        longitude: 88.424858412806,
        rating: 4.1,
        description: "A socially conscious North Kolkata puja (started in 1992), the 2023 theme \"Ningrano\" honored laborers with artistic bamboo carvings and a sabeki decor vibe.",
        category: "modern",
        crowd_level: "medium",
        area: "north_kolkata"
    },
    {
        appwrite_id: "687b93fdb0437dc61616",
        name: "Nabankur Sarbojanin Durgotsav",
        address: "26/1 Shimla Road, Lalabagan, Kolkata – 700006 (near Girish Park)",
        latitude: 22.588372912359,
        longitude: 88.376766331561,
        rating: 4.5,
        description: "An eco‑friendly puja known for its 2024 \"Nabankur\" theme featuring over 8,000 living plants, creating a serene mini‑forest atmosphere.",
        category: "modern",
        crowd_level: "high",
        area: "north_kolkata"
    },
    {
        appwrite_id: "687b95008a514ba590b5",
        name: "Masterda Smriti Sangha",
        address: "AB‑61/1, Prafulla Kanan West, Kestopur, Kolkata – 700101",
        latitude: 22.603810630714,
        longitude: 88.422574431651,
        rating: 4.3,
        description: "A theme-focused North Kolkata puja known for bold artistic installations—2024 featured a striking 70 ft backbone structure symbolizing desire and societal tension.",
        category: "modern",
        crowd_level: "medium-high",
        area: "north_kolkata"
    },
    {
        appwrite_id: "687b95cccd7b79877ca2",
        name: "Mitali Sangha (Kankurgachi)",
        address: "180A Maniktala Main Road, Kankurgachi, Kolkata – 700054",
        latitude: 22.580030284065,
        longitude: 88.394153542276,
        rating: 4.4,
        description: "Known for vibrant, artistic pandals with simple yet elegant idol decor—e.g. 2024's theme set amid clouds, guarded by heavenly elephants for a surreal ambience.",
        category: "modern",
        crowd_level: "high",
        area: "north_kolkata"
    },
    {
        appwrite_id: "687b96ee234f787e0a39",
        name: "Nawpara Dada Bhai Sangha",
        address: "Naopara Dadabhai Sangha, Noapara, Baranagar, Kolkata – 700090",
        latitude: 22.641672137436,
        longitude: 88.38865507494,
        rating: 4.5,
        description: "A youthful puja (started ~2005), known for bold, heart‑centred themes. Past displays included a silicone idol address­ing marginalized lives, and in 2023 a towering \"Platform\" installation exploring life's societal platforms.",
        category: "theme-based",
        crowd_level: "high",
        area: "north_kolkata"
    },
    {
        appwrite_id: "687b97f8466951541a6b",
        name: "Netaji Colony Lowland Sarbojanin",
        address: "576 Netaji Colony, Lowland, Baranagar, Kolkata – 700090",
        latitude: 22.636625669839,
        longitude: 88.379062302461,
        rating: 4.6,
        description: "A standout puja famous for its awe-inspiring Titanic‑themed pandal installations—stunning inside and out—with elegant idol artistry and immersive design.",
        category: "theme-based",
        crowd_level: "high",
        area: "north_kolkata"
    },
    {
        appwrite_id: "687b998967ed60c68165",
        name: "North Tridhara Sarbojanin",
        address: "158N, Hati Bagan, Shyam Bazar, Kolkata, West Bengal 700004",
        latitude: 22.595835169734,
        longitude: 88.374555194283,
        rating: 4.3,
        description: "A heritage North Kolkata puja celebrated for blending traditional iconography with immersive sculptural themes. Known for intricate artistry and thematic continuity over years.",
        category: "modern",
        crowd_level: "high",
        area: "north_kolkata"
    },
    {
        appwrite_id: "687b9ad65f28d8abc0a5",
        name: "Pathuriaghata Pancher Pally",
        address: "66 Pathuriaghata Street, near Girish Park, North Kolkata – 700006",
        latitude: 22.588615498961,
        longitude: 88.357631399858,
        rating: 4.5,
        description: "A socially conscious puja celebrated for its bold Ritumati (menstrual hygiene) theme, challenging taboos and raising awareness through expressive visual art and public messaging",
        category: "modern",
        crowd_level: "medium-high",
        area: "north_kolkata"
    },
    {
        appwrite_id: "687b9bde5ba4fa73736b",
        name: "Patipukur Adi Sarbojonin",
        address: "145/1 Swamiji Sarani Road, Basak Bagan, Goala Bagan, South Dum Dum (Patipukur), Kolkata – 700048",
        latitude: 22.611009775196,
        longitude: 88.397886614218,
        rating: 4.5,
        description: "About 90 years old, this community puja featured the 2024 theme \"Basundhara\", crafted from local materials (bamboo, mud, rice straw) and celebrating environmental resilience.",
        category: "theme-based",
        crowd_level: "medium-high",
        area: "north_kolkata"
    },
    {
        appwrite_id: "687b9d0466b993a8838f",
        name: "Railpukur United Club",
        address: "DA/3, Rail Pukur Rd, Shastri Bagan, Desh Bandhu Nagar, Baguiati, Kolkata - 700059",
        latitude: 22.612327570088,
        longitude: 88.427442142025,
        rating: 4.4,
        description: "In 2023, the club presented a bold 500 kg idol made entirely from tree parts—using roots, branches, bark, and adhesives—with a strong message of environmental sustainability.",
        category: "modern",
        crowd_level: "medium-high",
        area: "north_kolkata"
    },
    {
        appwrite_id: "687ba76d75b4300308af",
        name: "Sammilita Lalabagan Sarbojanin",
        address: "88 Raja Direndra Street, Lalabagan, Kolkata – 700006",
        latitude: 22.587361487694,
        longitude: 88.376893924423,
        rating: 4.3,
        description: "A traditional North Kolkata puja celebrated for its beautifully crafted idol and elegantly simple pandal interiors. Despite being over 70 years old, it maintains a contemporary artistic freshness through subtle thematic décor.",
        category: "traditional",
        crowd_level: "medium",
        area: "north_kolkata"
    },
    {
        appwrite_id: "687ba8378044c810bb4b",
        name: "Sarkar Bagan Sammilita Sangha",
        address: "3/2 Nilmoni Mitra Row, Tala (near Tala Barowari), Shyambazar region, Kolkata – 700002",
        latitude: 22.606258956779,
        longitude: 88.377293921321,
        rating: 4,
        description: "A mid‑scale North Kolkata puja known for warm community energy and modest, tastefully decorated pandals—quiet yet celebrated in local circles.",
        category: "traditional",
        crowd_level: "medium",
        area: "north_kolkata"
    },
    {
        appwrite_id: "687ba92736906933f5e5",
        name: "Shyambazar Pally Sangha",
        address: "48 Shyambazar Street, Shyambazar, North Kolkata – 700004 (near Shyambazar Metro Station)",
        latitude: 22.60005516188,
        longitude: 88.36938572945,
        rating: 4.2,
        description: "This respected North Kolkata puja uses art to spark conversation—its 2023 theme on surrogate motherhood explored complex social narratives through sculptural installations and symbolic designs.",
        category: "traditional",
        crowd_level: "medium",
        area: "north_kolkata"
    },
    {
        appwrite_id: "687bab648d603c7476c7",
        name: "Swapnar Bagan Yubak Brinda",
        address: "175/D, near Ghosh Brothers, Kadapara, Phool Bagan, Kankurgachi, Kolkata - 700054",
        latitude: 22.579443304923,
        longitude: 88.395965050278,
        rating: 4.2,
        description: "A community puja in North Kolkata known for its gracefully crafted idols and visually appealing interior décor. The pandal is appreciated for thematic subtlety and clean aesthetics.",
        category: "traditional",
        crowd_level: "medium",
        area: "north_kolkata"
    },
    {
        appwrite_id: "687bac8394bdb170a87b",
        name: "Tala Barowari",
        address: "23/2 Banomali Chatterjee Street, Tala (Bidhan Sarani), Shyambazar, North Kolkata – 700002",
        latitude: 22.607184536648,
        longitude: 88.375951153561,
        rating: 4.5,
        description: "One of North Kolkata's oldest Barowari pujas (est. 1921), celebrated for its grand thematic pandals and simple yet captivating idol. In 2024, the theme Hirak Rajar Deshe paid homage to Satyajit Ray's classic, using theatrical installations to highlight the fight against ignorance and intellectual oppression.",
        category: "theme-based",
        crowd_level: "high",
        area: "north_kolkata"
    },
    {
        appwrite_id: "687bae7408866069ab81",
        name: "Tala Prattoy",
        address: "Tala Prattoy Durga Puja Art, Tara Sankar Sarani, Tala, Kolkata – 700037",
        latitude: 22.608780240761,
        longitude: 88.382516690577,
        rating: 4.6,
        description: "An acclaimed North Kolkata puja renowned for transforming the festival into immersive art installations. The 2024 theme \"Bihin – The Void\" depicted the divine as formless, inviting reflection on spiritual presence.",
        category: "theme-based",
        crowd_level: "high",
        area: "north_kolkata"
    },
    {
        appwrite_id: "687baf563d4aca3e7d9f",
        name: "Tala Ponero Pally",
        address: "Ponero Pally lane, Tala (Bidhan Sarani area), Shyambazar, Kolkata – 700002",
        latitude: 22.612483688662,
        longitude: 88.38476809011,
        rating: 4.3,
        description: "An inventive North Kolkata puja known for its themed pandals—recent years showcased nostalgic life-size scenes reflecting local heritage and literary motifs.",
        category: "modern",
        crowd_level: "medium",
        area: "north_kolkata"
    },
    {
        appwrite_id: "687bb068db85e48997ae",
        name: "Telengabagan Durgotsab",
        address: "65, Adhar Chandra Das Ln, Telenga Bagan, Ultadanga, Kolkata, West Bengal 700067",
        latitude: 22.594949235875,
        longitude: 88.385287902521,
        rating: 4.5,
        description: "A theme-focused North Kolkata puja (est. 1967) known for its artistic storytelling—2023's \"Prantajaner Atmokotha\" highlighted lives of marginalized women through eco-friendly tusur (traditional boat) inspired décor.",
        category: "theme-based",
        crowd_level: "high",
        area: "north_kolkata"
    },
    {
        appwrite_id: "687bb56f5ea2dd3f2b2c",
        name: "Ultadanga Bidhan Sangha",
        address: "Ultadanga Bidhan Sangha, Ultadanga, Kolkata – 700067 (Near Bidhannagar Road )",
        latitude: 22.593232660969,
        longitude: 88.385665825167,
        rating: 4.4,
        description: "Celebrated annually as a symbol of tradition and cultural unity in North Kolkata, this puja features a creative theme every year. In 2024, the theme \"Banijye Basate Laxmi\" (Lakshmi resides in trade) was beautifully represented with a massive 60–65 ft Betnai boat at the center of the pandal.",
        category: "modern",
        crowd_level: "high",
        area: "north_kolkata"
    },
    {
        appwrite_id: "687bb62539c4ee01b928",
        name: "Ultadanga Jagarani Sangha",
        address: "Ultadanga Jagarani Sangha, Ultadanga, Kolkata – 700067",
        latitude: 22.593340989079,
        longitude: 88.38492415215,
        rating: 4.3,
        description: "A socially aware community puja in North Kolkata known for blending traditional rituals with inclusive initiatives and local engagement. It's often part of thematic collaborations within the Ultadanga puja circuit.",
        category: "modern",
        crowd_level: "medium-high",
        area: "north_kolkata"
    },
    {
        appwrite_id: "687bb708cef7bfb3518a",
        name: "Ultadanga Pallyshree",
        address: "17/18 Jaharlal Dutta Lane, Muchibazar, Daspara, Ultadanga, North Kolkata – 700067",
        latitude: 22.595825323214,
        longitude: 88.384413822207,
        rating: 4.2,
        description: "An immersive North Kolkata puja that celebrates Bengal's heritage using traditional jute craftsmanship. The 2023 pandal revived declining jute trade memories and featured environmentally friendly organic colors.",
        category: "modern",
        crowd_level: "medium-high",
        area: "north_kolkata"
    },
    {
        appwrite_id: "687bb79e4851295a82de",
        name: "Ultadanga Yuba Brinda",
        address: "5N Ultadanga Main Road, Near Muchi Bazar Bus Stop, Ultadanga, Kolkata – 700067",
        latitude: 22.595918687755,
        longitude: 88.38230782523,
        rating: 4.3,
        description: "Founded in 1949, this North Kolkata puja is respected for its artistic pandal design, vibrant idol work, and active community outreach—including eye camps, book donations, and meals for local families.",
        category: "modern",
        crowd_level: "medium",
        area: "north_kolkata"
    },
    {
        appwrite_id: "687cfa4167139b65afe8",
        name: "Beniatola Sarbojanin Durgotsab",
        address: "67 Beniatola Street, near BK Paul Avenue crossing, North Kolkata – 700005",
        latitude: 22.595714342239,
        longitude: 88.361191812556,
        rating: 4.4,
        description: "A long-established Barowari puja (since 1947), known for a massive 11‑ft ashtadhatu idol (weighing 1,000 kg), exquisite traditional décor, and immersive cultural displays",
        category: "theme-based",
        crowd_level: "high",
        area: "north_kolkata"
    },
    {
        appwrite_id: "687cfc0aa9f49fbe69ff",
        name: "Beadon Street Sarbojanin",
        address: "Beadon Street (now Abhedananda Sarani), Girish Park area, North Kolkata – 700006",
        latitude: 22.589270665085,
        longitude: 88.367612961262,
        rating: 4.3,
        description: "An aristocratic family-heritage Durga Puja rooted in tradition—featuring classical rituals and ornate courtyard iconography, reflecting the grandeur of North Kolkata's old-world puja legacy.",
        category: "traditional",
        crowd_level: "medium",
        area: "north_kolkata"
    },
    {
        appwrite_id: "687d00a4dbc15e7b03ac",
        name: "Chaltabagan Sarbojanin Durgotsab",
        address: "Near Raja Rammohan Roy Sarani & Amherst Street (Manicktala), North Kolkata – 700006",
        latitude: 22.585126530114,
        longitude: 88.368987287942,
        rating: 4.4,
        description: "One of North Kolkata's iconic pujas since the 1940s; in 2024, the \"Antarlok\" theme featured mirrored tunnel-style mandaps to encourage introspection.",
        category: "modern",
        crowd_level: "high",
        area: "north_kolkata"
    },
    {
        appwrite_id: "687d0180a9e4e78b39e0",
        name: "Chorebagan Sarbojonin",
        address: "Ram Mandir, 127 F, Muktaram Babu St, Simla, Machuabazar, Kolkata - 700007",
        latitude: 22.583436158317,
        longitude: 88.36306551689,
        rating: 4.5,
        description: "Founded in 1935, this iconic heritage puja is celebrated for its elegant, thematic artistry—most recently focusing on women's identity and the 2024 theme \"Dugga\" highlighted the multifaceted roles of women in society.",
        category: "theme-based",
        crowd_level: "high",
        area: "north_kolkata"
    },
    {
        appwrite_id: "6888ab32a473e5329cda",
        name: "Beliaghata 33 Palli BashiBrinda",
        address: "Beleghata Main Road, near CIT More, Kolkata – 700010",
        latitude: 22.564989767474,
        longitude: 88.396497730124,
        rating: 4.1,
        description: "Beleghata Sandhani stands out for its creative and meaningful themes every year. The pandal is known to showcase concepts that mix art, social messages, and a true Bengali spirit, making it a favorite for people who appreciate thoughtful celebrations.",
        category: "theme-based",
        crowd_level: "medium-high",
        area: "central_kolkata"
    },
    {
        appwrite_id: "68924b368e77fd73aa50",
        name: "Suruchi Sangha",
        address: "New Alipore, Kolkata - 700053",
        latitude: 22.508996220414,
        longitude: 88.333948268953,
        rating: 4.6,
        description: "Suruchi Sangha creates a mesmerizing experience every year with stunning artwork vibrant lighting and a festive atmosphere that draws huge crowds making it one of South Kolkata's most loved pandals.",
        category: "theme-based",
        crowd_level: "high",
        area: "south_kolkata"
    },
    {
        appwrite_id: "68925cafc17297649c67",
        name: "Behala Friends' Club",
        address: "Behala, near Silpara, Kolkata – 700008",
        latitude: 22.501233022085,
        longitude: 88.320389771269,
        rating: 4.3,
        description: "Behala Friends Club creates artistic pandals with cultural themes each year, blending creativity and tradition while attracting moderate crowds in a peaceful neighborhood atmosphere.",
        category: "theme-based",
        crowd_level: "medium",
        area: "south_kolkata"
    },
    {
        appwrite_id: "68925fba71d952d275ec",
        name: "Behala Nutan Dal",
        address: "Behala, Kolkata –700034",
        latitude: 22.500218035047,
        longitude: 88.32024115445,
        rating: 4.4,
        description: "Behala Notun Dal presents imaginative and culturally rich pandals with unique concepts like phuchka themes and international art collaborations.",
        category: "theme-based",
        crowd_level: "medium-high",
        area: "south_kolkata"
    },
    {
        appwrite_id: "6892650b3c25250564f6",
        name: "Behala Notun Sangha",
        address: "Behala, Kolkata - 700034",
        latitude: 22.501655055767,
        longitude: 88.319432313322,
        rating: 4.2,
        description: "Behala Notun Sangha presents vibrant and socially conscious pandals featuring contemporary global folk art that engage viewers in thoughtful visual storytelling.",
        category: "theme-based",
        crowd_level: "medium-high",
        area: "south_kolkata"
    },
    {
        appwrite_id: "6892f803c3bc811d766d",
        name: "Behala Debdaru Fatak Club",
        address: "Arya Samity Road, Behala, Kolkata-700034",
        latitude: 22.502382883453,
        longitude: 88.317781140706,
        rating: 4.2,
        description: "Behala Debdaru Fatak Club celebrates Bengal's folk traditions and endangered crafts through artistic and socially aware theme based pandals.",
        category: "theme-based",
        crowd_level: "medium-high",
        area: "south_kolkata"
    },
    {
        appwrite_id: "6892f8d9579bc1d034f2",
        name: "Barisha Sarbojanin",
        address: "Barisha, near Sakherbazar/Dwadash Mandir, Kolkata 700008",
        latitude: 22.479827949293,
        longitude: 88.308121908565,
        rating: 4.4,
        description: "Barisha Sarbojanin evokes old Bengal heritage through rustic terracotta temple aesthetics and a laterite stone Durga idol with social storytelling.",
        category: "modern",
        crowd_level: "high",
        area: "south_kolkata"
    },
    {
        appwrite_id: "6892fa50351a66a6e436",
        name: "Barisha Club",
        address: "Barisha, Sakher Bazar, Santosh Roy Road, Kolkata-700008",
        latitude: 22.481283874803,
        longitude: 88.313238776151,
        rating: 4.5,
        description: "Barisha Club blends environmental and migrant‑crisis themes with immersive artistry to deliver socially relevant and emotionally resonant pandal installations.",
        category: "modern",
        crowd_level: "high",
        area: "south_kolkata"
    },
    {
        appwrite_id: "68bd88c20e4c930103d1",
        name: "Kalyani A-2",
        address: "Block A2, Block A, Kalyani - 741235",
        latitude: 22.972776879234,
        longitude: 88.462623051277,
        rating: 4,
        description: "Simple setup with cultural touch and devotional vibe",
        category: "modern",
        crowd_level: "medium",
        area: "kalyani"
    },
    {
        appwrite_id: "68beaa071c037262fce5",
        name: "Kalyani Central Park",
        address: "B8, Block B, Kalyani - 741235",
        latitude: 22.976848078068,
        longitude: 88.434964499,
        rating: 4,
        description: "Simple yet vibrant pandal ideal for adda, photos, and community mingling",
        category: "traditional",
        crowd_level: "medium",
        area: "kalyani"
    },
    {
        appwrite_id: "68beacee0cedabb1e214",
        name: "Nebula Park",
        address: "B1, Block B, Kalyani - 741235",
        latitude: 22.980352479117,
        longitude: 88.426626896124,
        rating: 4,
        description: "Spacious park with themed displays, nature's calm, and festive flair",
        category: "theme-based",
        crowd_level: "low",
        area: "kalyani"
    },
    {
        appwrite_id: "68cd37bbaed3eb805aa9",
        name: "Dum Dum Park Yubak Brinda",
        address: "Dum Dum Park Rd, Dum Dum Park, South Dumdum - 700055",
        latitude: 22.605543609865,
        longitude: 88.417802383884,
        rating: 4.4,
        description: "Creative themes yearly, striking idol design, open pandal with artistic surprises each visit",
        category: "theme-based",
        crowd_level: "high",
        area: "dumdum"
    },
    {
        appwrite_id: "68cd5377d8b38be8fecc",
        name: "Dum Dum Park Tarun Dal",
        address: "Near Dum Dum Park Post Office, South Dumdum, Kolkata - 700055",
        latitude: 22.611507205437,
        longitude: 88.418664897994,
        rating: 4.3,
        description: "Known for creative yearly themes, striking pandal decor, and vibrant Durga Puja crowds.",
        category: "theme-based",
        crowd_level: "high",
        area: "dumdum"
    },
    {
        appwrite_id: "68cd57f32e7d8f36d42a",
        name: "Lake Town Adhibasi Brinda",
        address: "Children's Park, Lake Town Road, Block A, Lake Town, South Dumdum, Kolkata - 700089",
        latitude: 22.604449060806,
        longitude: 88.403980473316,
        rating: 4.3,
        description: "Artistic themes each year, standout pandal decoration, warmly loved by locals.",
        category: "theme-based",
        crowd_level: "medium-high",
        area: "dumdum"
    },
    {
        appwrite_id: "68cd58fa17302bdeedbc",
        name: "Netaji Sporting Club",
        address: "Block A, Lake Town, South Dumdum - 700089",
        latitude: 22.6083271276,
        longitude: 88.400398034787,
        rating: 4.2,
        description: "Big, colorful pandal with impressive artwork and devotional simplicity in idol design.",
        category: "theme-based",
        crowd_level: "medium",
        area: "dumdum"
    },
    {
        appwrite_id: "68cecdb0ca20763eecd8",
        name: "41 pally",
        address: "276, Mahatma Gandhi Rd, Haridevpur, Paschim Putiary, Kolkata - 700041",
        latitude: 22.482809978533,
        longitude: 88.338689085536,
        rating: 4.6,
        description: "Known for creative themes, vibrant pandal lighting, and strong local crowd energy.",
        category: "theme-based",
        crowd_level: "high",
        area: "south_kolkata"
    },
    {
        appwrite_id: "68ced17136e117c88808",
        name: "Kendua Shanti Sangha",
        address: "45 Kendua Main Road, Patuli / Garia, Kolkata - 700047",
        latitude: 22.471981115025,
        longitude: 88.381499991691,
        rating: 4.6,
        description: "Mega puja club with artistic themes and elaborate pandal designs drawing large crowds.",
        category: "theme-based",
        crowd_level: "high",
        area: "south_kolkata"
    }
]

// Create Supabase table
async function createSupabaseTable() {
    console.log('🏗️ Creating/Updating Supabase table...')

    const createTableSQL = `
        -- Drop existing table and recreate for fresh migration
        DROP TABLE IF EXISTS pandals CASCADE;
        
        -- Create pandals table with proper schema
        CREATE TABLE pandals (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            appwrite_id TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            address TEXT NOT NULL,
            latitude DECIMAL(15, 10) NOT NULL,
            longitude DECIMAL(15, 10) NOT NULL,
            rating DECIMAL(3, 2),
            description TEXT,
            category TEXT CHECK (category IN ('traditional', 'modern', 'theme-based')) NOT NULL,
            crowd_level TEXT CHECK (crowd_level IN ('low', 'medium', 'medium-high', 'high')) NOT NULL,
            area TEXT CHECK (area IN ('north_kolkata', 'south_kolkata', 'central_kolkata', 'salt_lake', 'new_town', 'kalyani', 'other', 'dumdum')) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Create indexes for performance
        CREATE INDEX idx_pandals_appwrite_id ON pandals(appwrite_id);
        CREATE INDEX idx_pandals_area ON pandals(area);
        CREATE INDEX idx_pandals_category ON pandals(category);
        CREATE INDEX idx_pandals_crowd_level ON pandals(crowd_level);
        CREATE INDEX idx_pandals_rating ON pandals(rating DESC);
        CREATE INDEX idx_pandals_location ON pandals(latitude, longitude);
        CREATE INDEX idx_pandals_name_search ON pandals USING gin(to_tsvector('english', name));
        
        -- Add update trigger
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ language 'plpgsql';
        
        CREATE TRIGGER update_pandals_updated_at 
            BEFORE UPDATE ON pandals 
            FOR EACH ROW 
            EXECUTE FUNCTION update_updated_at_column();
    `

    try {
        // Try using RPC first
        const { error: rpcError } = await supabase.rpc('exec_sql', { sql: createTableSQL })
        if (rpcError) {
            console.log('⚠️ RPC not available. Please run this SQL in Supabase SQL Editor:')
            console.log(createTableSQL)
            return false
        }
        console.log('✅ Table created successfully')
        return true
    } catch (error) {
        console.log('📋 Please create table manually in Supabase SQL Editor:')
        console.log(createTableSQL)
        return false
    }
}

// Remove duplicates based on name and address similarity
function removeDuplicates(pandals: any[]) {
    const seen = new Set()
    const cleaned = []

    for (const pandal of pandals) {
        // Create a key based on name (normalized) and rough location
        const normalizedName = pandal.name.toLowerCase().replace(/[^a-z0-9]/g, '')
        const locationKey = `${Math.round(pandal.latitude * 1000)}-${Math.round(pandal.longitude * 1000)}`
        const uniqueKey = `${normalizedName}-${locationKey}`

        if (!seen.has(uniqueKey)) {
            seen.add(uniqueKey)
            cleaned.push(pandal)
        } else {
            console.log(`🔍 Duplicate removed: ${pandal.name}`)
        }
    }

    return cleaned
}

// Import pandals to Supabase
async function importPandals(pandals: any[]) {
    console.log(`🚀 Starting import of ${pandals.length} pandals...`)

    // Remove duplicates
    const cleanedPandals = removeDuplicates(pandals)
    console.log(`✅ After deduplication: ${cleanedPandals.length} unique pandals`)

    // Clear existing data
    console.log('🧹 Clearing existing pandals...')
    const { error: deleteError } = await supabase
        .from('pandals')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000')

    if (deleteError && deleteError.code !== 'PGRST116') { // PGRST116 means no rows to delete
        console.log('⚠️ Warning during cleanup:', deleteError.message)
    }

    // Insert in batches
    const batchSize = 50 // Smaller batches for reliability
    let totalSuccess = 0
    let totalErrors = 0

    for (let i = 0; i < cleanedPandals.length; i += batchSize) {
        const batch = cleanedPandals.slice(i, i + batchSize)
        const batchNumber = Math.floor(i / batchSize) + 1

        console.log(`📦 Processing batch ${batchNumber} (${batch.length} pandals)...`)

        const { data, error } = await supabase
            .from('pandals')
            .insert(batch)
            .select('id, appwrite_id, name')

        if (error) {
            console.error(`❌ Batch ${batchNumber} failed:`, error.message)
            totalErrors += batch.length

            // Try individual inserts for failed batch
            for (const pandal of batch) {
                try {
                    const { error: singleError } = await supabase
                        .from('pandals')
                        .insert(pandal)

                    if (singleError) {
                        console.error(`❌ Failed: ${pandal.name} - ${singleError.message}`)
                    } else {
                        totalSuccess++
                    }
                } catch (e) {
                    console.error(`❌ Error inserting ${pandal.name}:`, e)
                }
            }
        } else {
            totalSuccess += batch.length
            console.log(`✅ Batch ${batchNumber} successful`)
            if (data && data.length > 0) {
                console.log(`   Sample: ${data[0].name}`)
            }
        }
    }

    console.log(`\n📊 Import Summary:`)
    console.log(`   ✅ Successfully imported: ${totalSuccess}`)
    console.log(`   ❌ Failed imports: ${totalErrors}`)
    console.log(`   📍 Total processed: ${cleanedPandals.length}`)

    return { success: totalSuccess, errors: totalErrors, total: cleanedPandals.length }
}

// Verify the migration
async function verifyMigration() {
    console.log('\n🔍 Verifying migration...')

    const { data, error } = await supabase
        .from('pandals')
        .select('*')
        .order('name')

    if (error) {
        console.error('❌ Verification failed:', error.message)
        return
    }

    console.log(`✅ Database contains ${data.length} pandals`)

    // Area breakdown
    const areaStats = data.reduce((acc: any, p) => {
        acc[p.area] = (acc[p.area] || 0) + 1
        return acc
    }, {})

    console.log('\n📊 Distribution by area:')
    Object.entries(areaStats).forEach(([area, count]) => {
        console.log(`   ${area}: ${count}`)
    })

    // Category breakdown
    const categoryStats = data.reduce((acc: any, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1
        return acc
    }, {})

    console.log('\n🎨 Distribution by category:')
    Object.entries(categoryStats).forEach(([category, count]) => {
        console.log(`   ${category}: ${count}`)
    })

    // Show sample data
    console.log('\n📋 Sample pandals:')
    data.slice(0, 3).forEach(p => {
        console.log(`   ${p.name} (${p.area}, ${p.rating}⭐)`)
    })
}

// Update your existing service files
async function generateServiceUpdates() {
    console.log('\n📝 Next steps for your code:')
    console.log('\n1. Your database.ts is already updated ✅')
    console.log('2. Update your types.ts to match Supabase format:')
    console.log(`
interface Pandal {
    id: string;              // UUID from Supabase
    appwrite_id: string;     // Your original ID
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    rating: number;
    description: string;
    category: 'traditional' | 'modern' | 'theme-based';
    crowd_level: 'low' | 'medium' | 'medium-high' | 'high';
    area: 'north_kolkata' | 'south_kolkata' | 'central_kolkata' | 'salt_lake' | 'new_town' | 'kalyani' | 'other' | 'dumdum';
    created_at: string;
    updated_at: string;
}
    `)
    console.log('\n3. Your components should work without changes!')
    console.log('4. Test your app after migration ✅')
}

// Main migration function
async function migrate() {
    console.log('🚀 Starting Direct Data Import (Table Already Exists)\n')

    try {
        // Skip table creation - table already exists
        console.log('✅ Assuming table already exists, proceeding with data import...')

        // No need to wait since table exists

        // Step 2: Import data
        const result = await importPandals(ALL_PANDALS)

        // Step 3: Verify
        await verifyMigration()

        // Step 4: Show next steps
        await generateServiceUpdates()

        console.log('\n🎉 Migration completed successfully!')
        console.log(`📊 Final result: ${result.success}/${result.total} pandals imported`)

        if (result.errors > 0) {
            console.log(`⚠️ ${result.errors} pandals failed - check logs above`)
        }

    } catch (error) {
        console.error('\n💥 Migration failed:', error)
    }
}

// Run migration
if (require.main === module) {
    migrate().catch(console.error)
}

export { migrate, createSupabaseTable, importPandals, verifyMigration }