# Azure DevOps -teknologiaskannerin käyttöönotto-ohjeet

Tämä dokumentti sisältää ohjeet Azure DevOps -teknologiaskannerin käyttöönottoon Azure-ympäristössä Terraformin avulla.

## Esitietovaatimukset

1. **Azure-tilaus** - Tarvitset Azure-tilauksen resurssien luomiseen
2. **Azure CLI** - Asenna Azure CLI komentorivin käyttöä varten
3. **Terraform** - Asenna Terraform (vähintään versio 1.0.0)
4. **Azure DevOps -organisaatio** - Tarvitset Azure DevOps -organisaation, jota haluat skannata
5. **Personal Access Token (PAT)** - Luo PAT-token Azure DevOps -organisaatioon koodin lukuoikeuksilla

## Käyttöönottovaiheet

### 1. Kirjaudu Azure CLI:hin

```bash
az login
```

### 2. Alusta Terraform

```bash
# Siirry infrastructure-hakemistoon
cd infrastructure

# Alusta Terraform
terraform init
```

### 3. Muokkaa ympäristökohtaisia muuttujatiedostoja

Muokkaa tiedostoja `dev.tfvars`, `test.tfvars` tai `prod.tfvars` ympäristösi mukaan. Erityisesti seuraavat muuttujat:

- `azure_devops_org_url`: Azure DevOps -organisaatiosi URL (esim. "https://dev.azure.com/sinun-organisaatiosi")
- `sql_admin_password`: Turvallinen salasana SQL-palvelimelle

### 4. Tarkista Terraform-suunnitelma

```bash
# Kehitysympäristö
terraform plan -var-file=dev.tfvars -out=dev.tfplan

# Testiympäristö
# terraform plan -var-file=test.tfvars -out=test.tfplan

# Tuotantoympäristö
# terraform plan -var-file=prod.tfvars -out=prod.tfplan
```

### 5. Ota käyttöön Azure-infrastruktuuri

```bash
# Kehitysympäristö
terraform apply dev.tfplan

# Testiympäristö
# terraform apply test.tfplan

# Tuotantoympäristö
# terraform apply prod.tfplan
```

### 6. Tallenna Azure DevOps PAT-token Key Vaultiin

```bash
# Hae Key Vault -nimi
KEY_VAULT_NAME=$(terraform output -raw key_vault_name)

# Tallenna PAT-token Key Vaultiin
# MUOKKAA: Korvaa YOUR_PAT_TOKEN omalla PAT-tokenillasi
az keyvault secret set --vault-name $KEY_VAULT_NAME --name "AzureDevOpsPat" --value "YOUR_PAT_TOKEN"
```

### 7. Luo tietokantarakenne

```bash
# Hae SQL Server -nimi
SQL_SERVER_NAME=$(terraform output -raw sql_server_name)
RESOURCE_GROUP_NAME=$(terraform output -raw resource_group_name)
SQL_DATABASE_NAME=$(terraform output -raw sql_database_name)

# Suorita SQL-skripti
az sql db execute --resource-group $RESOURCE_GROUP_NAME --server $SQL_SERVER_NAME --name $SQL_DATABASE_NAME --file create-database.sql
```

### 8. Julkaise Azure Functions -sovellus

```bash
# Siirry Functions-hakemistoon
cd ../src/Functions

# Hae Function App -nimi
FUNCTION_APP_NAME=$(cd ../../infrastructure && terraform output -raw function_app_name)

# Julkaise Functions-sovellus
func azure functionapp publish $FUNCTION_APP_NAME --csharp
```

### 9. Julkaise Static Web App -sovellus (valinnainen)

```bash
# Siirry WebApp-hakemistoon
cd ../WebApp

# Julkaise Static Web App -sovellus
# Tämä vaihe riippuu käyttämästäsi frontend-teknologiasta (React, Angular, jne.)
```

## Ympäristöjen hallinta

### Ympäristön päivittäminen

```bash
# Päivitä Terraform-suunnitelma
terraform plan -var-file=dev.tfvars -out=dev.tfplan

# Ota muutokset käyttöön
terraform apply dev.tfplan
```

### Ympäristön poistaminen

```bash
# Poista ympäristö
terraform destroy -var-file=dev.tfvars
```

## Tietoturvahuomiot

1. **PAT-token** - Käytä mahdollisimman rajoitettuja oikeuksia (vain luku-oikeudet koodiin)
2. **SQL-tietokanta** - Tuotantoympäristössä vaihda SQL-palvelimen salasana ja tallenna se Key Vaultiin
3. **Käyttöoikeudet** - Määritä Azure AD -autentikaatio ja -valtuutus käyttöliittymälle
4. **Verkkorajoitukset** - Rajoita pääsyä Function App -sovellukseen IP-rajoituksilla
5. **Terraform-tila** - Käytä etätilaa (Azure Storage, Terraform Cloud) tuotantoympäristössä

## Kustannusten optimointi

1. **Consumption Plan** - Azure Functions käyttää Consumption Plan -hinnoittelua, joten maksat vain käytön mukaan
2. **Basic-tason SQL-tietokanta** - Käytä Basic-tason SQL-tietokantaa kustannusten minimoimiseksi
3. **Free-tason Static Web App** - Käytä ilmaista Static Web App -palvelua käyttöliittymälle

## Käyttö

1. **Teknologiaskannaus** - Skannaus suoritetaan automaattisesti kuukauden 1. päivä
2. **Teknologiahaku** - Käytä käyttöliittymää teknologioiden hakemiseen
3. **API-kutsut** - Voit kutsua API-endpointeja suoraan:
   - `GET /api/technologies/search?name=react` - Hae teknologioita nimen perusteella
   - `GET /api/projects` - Hae kaikki projektit
   - `GET /api/projects/{projectId}/repositories` - Hae projektin repositoriot
   - `GET /api/repositories/{repositoryId}/technologies` - Hae repositorion teknologiat

## Vianmääritys

1. **Lokitiedot** - Tarkista Application Insights -lokitiedot virheiden varalta
2. **Manuaalinen skannaus** - Voit käynnistää skannauksen manuaalisesti kutsumalla `ScanTechnologies`-funktiota
3. **Tietokantayhteys** - Tarkista SQL-tietokantayhteys, jos tietoja ei näy
4. **Terraform-virheet** - Tarkista Terraform-virheviestit ja varmista, että sinulla on riittävät oikeudet 