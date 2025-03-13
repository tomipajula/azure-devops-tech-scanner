# Osallistuminen projektiin

Kiitos kiinnostuksestasi osallistua Azure DevOps -teknologiaskanneri -projektiin! Tässä dokumentissa on ohjeita, miten voit osallistua projektiin.

## Kehitysympäristön pystyttäminen

1. Kloonaa repositorio:
   ```
   git clone https://github.com/sinun-käyttäjätunnus/azure-devops-tech-scanner.git
   cd azure-devops-tech-scanner
   ```

2. Asenna riippuvuudet:
   ```
   cd DevOpsLookup/src/WebApp
   npm install
   ```

3. Käynnistä kehityspalvelin:
   ```
   npm start
   ```

## Koodin tyyli

Tässä projektissa noudatetaan seuraavia koodauskäytäntöjä:

- Käytä merkityksellisiä muuttujien ja funktioiden nimiä
- Kirjoita kommentteja monimutkaisiin toimintoihin
- Käytä camelCase-nimeämiskäytäntöä JavaScript-koodissa
- Käytä 2 välilyönnin sisennystä

## Pull Request -prosessi

1. Luo uusi haara muutoksillesi:
   ```
   git checkout -b feature/ominaisuuden-nimi
   ```

2. Tee muutokset ja committaa ne:
   ```
   git add .
   git commit -m "Lisää selkeä kuvaus muutoksista"
   ```

3. Työnnä muutokset GitHubiin:
   ```
   git push origin feature/ominaisuuden-nimi
   ```

4. Avaa Pull Request GitHubissa ja täytä PR-lomake huolellisesti.

## Bugien raportointi

Jos löydät bugin, avaa GitHub Issue ja sisällytä siihen:

- Selkeä otsikko ja kuvaus
- Vaiheet bugin toistamiseen
- Odotettu käyttäytyminen
- Kuvakaappaukset (jos mahdollista)
- Käyttöympäristö (selain, käyttöjärjestelmä)

## Ominaisuuspyynnöt

Ominaisuuspyynnöt ovat tervetulleita! Avaa GitHub Issue ja kuvaile:

- Mitä ominaisuutta ehdotat
- Miksi se olisi hyödyllinen
- Miten se toimisi

## Lisenssi

Osallistumalla tähän projektiin hyväksyt, että työsi lisensoidaan projektin [MIT-lisenssin](LICENSE) mukaisesti. 