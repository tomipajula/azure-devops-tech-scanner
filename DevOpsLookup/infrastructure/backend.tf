# Tämä tiedosto määrittelee Terraform-tilan tallennuspaikan
# Kommentoi tämä pois paikallista kehitystä varten

# Terraform-tilan tallennuskonfiguraatio
# Kommentoi tämä osio pois, jos haluat käyttää paikallista tilaa kehityksen aikana

# Azure-backend
terraform {
  backend "azurerm" {
    # MUOKKAA: Aseta tähän resurssiryhmän nimi, jossa Storage Account sijaitsee
    resource_group_name  = "TerraformStateRG"
    # MUOKKAA: Aseta tähän Storage Account -nimi
    storage_account_name = "techscannertfstate"
    # MUOKKAA: Aseta tähän container-nimi
    container_name       = "tfstate"
    # MUOKKAA: Aseta tähän tilan tiedostonimi
    key                  = "terraform.tfstate"
  }
}

# Vaihtoehtoisesti voit käyttää Terraform Cloudia
# Kommentoi yllä oleva azurerm-backend pois ja poista kommentit tästä osiosta
/*
terraform {
  backend "remote" {
    # MUOKKAA: Aseta tähän Terraform Cloud -organisaatiosi nimi
    organization = "your-organization"

    workspaces {
      # MUOKKAA: Aseta tähän workspace-nimi
      name = "techscanner-workspace"
    }
  }
}
*/ 