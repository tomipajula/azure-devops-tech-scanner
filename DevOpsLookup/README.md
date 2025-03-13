# Azure DevOps -teknologiaskanneri

Azure DevOps -teknologiaskanneri on sovellus, joka skannaa Azure DevOps -organisaation repositoriot ja tunnistaa niissä käytetyt teknologiat. Sovellus auttaa organisaatioita hallitsemaan teknistä velkaa ja saamaan kokonaiskuvan käytetyistä teknologioista.

## Ominaisuudet

- **Automaattinen skannaus**: Skannaa Azure DevOps -repositoriot automaattisesti ja tunnistaa käytetyt teknologiat
- **Teknologioiden tunnistus**: Tunnistaa yleisimmät ohjelmistokehityksen teknologiat ja niiden versiot
- **Hakutoiminnot**: Etsi projekteja ja teknologioita eri kriteerien perusteella
- **Tietoturva**: Azure Key Vault -integraatio arkaluontoisten tietojen suojaamiseen
- **Kustannustehokkuus**: Serverless-arkkitehtuuri Azure Functions -palvelulla
- **Infrastruktuuri koodina**: Terraform-skriptit infrastruktuurin hallintaan

## Arkkitehtuuri

Sovellus koostuu seuraavista komponenteista:

- **Azure Functions**: Backend-palvelut teknologioiden skannaukseen ja API-rajapinnat
- **Azure SQL Database**: Tietokanta tunnistettujen teknologioiden tallentamiseen
- **Azure Static Web App**: Frontend-sovellus käyttöliittymää varten
- **Azure Key Vault**: Arkaluontoisten tietojen, kuten PAT-tokenien, turvallinen säilytys

## Hakemistorakenne

```
DevOpsLookup/
├── docs/                  # Dokumentaatio
├── infrastructure/        # Terraform-tiedostot
└── src/
    ├── Functions/         # Azure Functions -sovellus
    └── WebApp/            # React-frontend-sovellus
```

## Käyttöönotto

### Vaatimukset

- Azure-tilaus
- Azure CLI
- Terraform (versio 1.0.0 tai uudempi)
- Node.js (versio 14 tai uudempi)
- Azure DevOps -organisaatio ja Personal Access Token (PAT)

### Pika-aloitus

1. Kloonaa repositorio:
   ```
   git clone https://github.com/sinun-käyttäjätunnus/azure-devops-tech-scanner.git
   cd azure-devops-tech-scanner
   ```

2. Alusta Terraform:
   ```
   cd DevOpsLookup/infrastructure
   terraform init
   ```

3. Muokkaa `terraform.tfvars`-tiedostoa omilla tiedoillasi.

4. Tarkista Terraform-suunnitelma:
   ```
   terraform plan -var-file="environments/dev.tfvars"
   ```

5. Luo infrastruktuuri:
   ```
   terraform apply -var-file="environments/dev.tfvars"
   ```

6. Tallenna PAT Azure Key Vaultiin:
   ```
   az keyvault secret set --vault-name <key-vault-nimi> --name "DevOpsPAT" --value "<sinun-pat-tokenisi>"
   ```

7. Julkaise Azure Functions -sovellus:
   ```
   cd ../src/Functions
   func azure functionapp publish <function-app-nimi>
   ```

8. Julkaise frontend-sovellus:
   ```
   cd ../WebApp
   npm install
   npm run build
   az staticwebapp deploy --app-location build --api-location ../Functions --output-location build
   ```

Katso tarkemmat ohjeet [deployment-guide.md](docs/deployment-guide.md) -tiedostosta.

## Kehitys

### Paikallinen kehitys

1. Asenna riippuvuudet:
   ```
   cd DevOpsLookup/src/WebApp
   npm install
   ```

2. Käynnistä kehityspalvelin:
   ```
   npm start
   ```

3. Avaa selain osoitteessa [http://localhost:3000](http://localhost:3000)

### Testaus

```
cd DevOpsLookup/src/WebApp
npm test
```
