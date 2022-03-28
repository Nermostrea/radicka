# Řadička

Řadička je nástroj pro pomoc s řízením provozu tramvají v kritických místech městské infrastruktury. Jedná se na první pohled o světelné signalizační zařízení jako u běžné výhybky v Praze. Ale ona je mnohem víc než to.

Pracuje s aktuálními daty z provozu napojenými na páteřní databázi Golemio, kterou provozuje městský podnik Operátor ICT. Řadička je tak schopna v reálném čase sledovat provoz a vyhodnotit u vlaků přijíždějících ze dvou větví do frekventovaného úseku, který z nich má jet první.
 
Po vyhodnocení tuto zprávu předá řidičům, kteří pak mají dostatek informací o tom, co se děje. Už dost chaotickému ukazování prstů, nejasností a rozhněvaných řidičů i cestujících. Řadička pomáhá přesně tam, kde je to třeba: na vytíženém místě dopravní sítě. Pomáhá zajistit plynulejší provoz a přehlednou situaci pro naše řidiče.

Tento repozitář je kopií aplikace, která nám v Dockeru běží na **CodeNow**: https://radicka-radicka.trials.codenow.com/


## O aplikaci

Za pomoci dat z Golemio API zobrazuje reálná data o tramvajích blížících se do křižovatky na Senovážném náměstí ze zastávek Masarykovo nádraží a Hlavní nádraží.

V případě, že dojde ke sjezdu tramvají, u kterých bychom chtěli řidičům pomoci a doporučit jim pořadí průjezdu, zobrazíme tuto informaci uprostřed.

Příjezd do zastávky Jindřišská a tedy i kontrolu správnosti vyhodnocení situace samotnými řidiči bez pomoci řadičky můžeme sledovat po pravé straně.

### Cíl aplikace 
- **Analýza** - sbírání dat o správnosti vyhodnocení situace bez Řadičky
  - zodpoví otázků - Jak často se to děje?
- **Evaluace** - počítání odhadovaného snížení zpoždění pokud by situaci řidič vyhodnotil lépe za pomoci Řadičky, než ji vyhodnotil bez ní
  - zodpoví otázku - Co nám to přinese?
- **Praxe** - poskytnutí dat jednotlivým Řadičkám
  - zodpoví otázku - Jak to bude reálně fungovat?
