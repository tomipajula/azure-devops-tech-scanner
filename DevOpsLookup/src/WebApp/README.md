# Azure DevOps Teknologiaskanneri - Frontend

Tämä on Azure DevOps teknologiaskannerin frontend-sovellus, joka on toteutettu React-kirjastolla ja Material UI -komponenteilla.

## Sovelluksen käynnistäminen lokaalisti

Sovelluksen käynnistäminen vaatii seuraavat työkalut:
- Node.js (versio 14 tai uudempi)
- npm (tulee Node.js:n mukana)

### Asennus ja käynnistys

1. Asenna riippuvuudet:
```
npm install
```

2. Käynnistä kehityspalvelin:
```
npm start
```

Sovellus käynnistyy osoitteeseen [http://localhost:3000](http://localhost:3000).

### Sovelluksen rakenne

- `src/components` - Uudelleenkäytettävät komponentit
- `src/pages` - Sovelluksen sivut
- `src/services` - API-palvelut ja mock-data
- `src/utils` - Apufunktiot

### Huomioitavaa

Sovellus käyttää tällä hetkellä mock-dataa, joka on määritelty `src/services/mockData.js`-tiedostossa. Kun backend-palvelu on valmis, voit ottaa sen käyttöön kommentoimalla pois mock-data-rivit ja ottamalla käyttöön API-kutsut.

## Ominaisuudet

- Kojelauta, joka näyttää yhteenvedon projekteista, repositorioista ja teknologioista
- Projektien listaus ja yksityiskohtanäkymä
- Repositorioiden yksityiskohtanäkymä
- Teknologiahaku
- Responsiivinen käyttöliittymä, joka toimii hyvin erikokoisilla näytöillä

## Ongelmanratkaisu

Jos kohtaat ongelmia sovelluksen käynnistämisessä:

1. Varmista, että sinulla on oikea Node.js-versio (tarkista komennolla `node -v`)
2. Poista node_modules-kansio ja package-lock.json-tiedosto ja aja `npm install` uudelleen
3. Jos saat virheen "ENOSPC: System limit for number of file watchers reached", kasvata tiedostojen tarkkailun rajaa:
   ```
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
   ```
   (Huom: Tämä komento toimii vain Linux-järjestelmissä) 