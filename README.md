## Leírás

A Vite keretrendszer segítségével készült React alkalmazás. Tervezése során kiemelt szempont volt a minimalista megközelítés és a minimális függőségek használata, hogy a fejlesztés egyszerű és hatékony legyen.

## Telepítés és Futtatás
- Klónozd le a projektet a saját gépedre.
- Navigálj a projekt gyökérkönyvtárába a terminálban.
- Telepítsd a szükséges függőségeket a "npm install" parancs segítségével.
- Indítsd el az alkalmazást a "npm run dev" paranccsal.

Ezen felül, az alkalmazás elérhető az alábbi linken is: 

## URL

https://garda-b.github.io/lottokeeper-game/

## Jellemzők

- **Minimális Függőségek:** Az alkalmazás tervezése során a lehető legkevesebb függőséget használtam fel, hogy hatékony és egyszerű maradjon.
- **Állapotkezelés:** Az állapotkezelés is külső könyvtár nélkül történik React hook-okkal, mint a useState, useEffect és useMemo.
- **Design:** A fő hangsúly a funkcionalitáson van, de így is teljes mértékben reszponzív.
- **Nyeremény Számítás:** Minden sorsoláskor az összbevétel 90%-a kerül kiosztásra. Minden találatnál súlyozottan kerül kiosztásra a rá szánt összeg, majd a találatok számával elosztva kapjuk meg az egy szelvény után járó összeget. (A pontos leírás a fő komponensben található.)
