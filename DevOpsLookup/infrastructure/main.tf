terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

# Muuttujat
variable "environment_name" {
  description = "Ympäristön nimi (dev, test, prod)"
  type        = string
  default     = "dev"
}

variable "location" {
  description = "Sijainti, johon resurssit luodaan"
  type        = string
  default     = "northeurope"
}

variable "azure_devops_org_url" {
  description = "Azure DevOps -organisaation URL"
  type        = string
}

variable "scan_schedule" {
  description = "Skannauksen ajastus (CRON-muodossa)"
  type        = string
  default     = "0 0 0 1 * *" # Oletuksena kuukauden 1. päivä klo 00:00
}

variable "sql_admin_username" {
  description = "SQL Serverin käyttäjänimi"
  type        = string
}

variable "sql_admin_password" {
  description = "SQL Serverin salasana"
  type        = string
}

# Resurssien nimet
locals {
  app_name              = "techscanner"
  storage_account_name  = "${local.app_name}${var.environment_name}storage"
  app_insights_name     = "${local.app_name}-${var.environment_name}-insights"
  key_vault_name        = "${local.app_name}-${var.environment_name}-kv"
  sql_server_name       = "${local.app_name}-${var.environment_name}-sql"
  sql_database_name     = "TechScannerDB"
  function_app_name     = "${local.app_name}-${var.environment_name}-func"
  app_service_plan_name = "${local.app_name}-${var.environment_name}-plan"
  static_web_app_name   = "${local.app_name}-${var.environment_name}-web"
  common_tags           = {
    "Environment" = var.environment_name
    "Application" = local.app_name
  }
}

# Resurssiryhmä
resource "azurerm_resource_group" "rg" {
  name     = "TechnologyScannerRG-${var.environment_name}"
  location = var.location
  tags     = local.common_tags
}

# Storage Account
resource "azurerm_storage_account" "storage" {
  name                     = local.storage_account_name
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  min_tls_version          = "TLS1_2"
  tags                     = local.common_tags

  blob_properties {
    versioning_enabled = false
  }
}

# Application Insights
resource "azurerm_application_insights" "insights" {
  name                = local.app_insights_name
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  application_type    = "web"
  tags                = local.common_tags
}

# Key Vault
data "azurerm_client_config" "current" {}

resource "azurerm_key_vault" "kv" {
  name                        = local.key_vault_name
  location                    = azurerm_resource_group.rg.location
  resource_group_name         = azurerm_resource_group.rg.name
  enabled_for_disk_encryption = false
  tenant_id                   = data.azurerm_client_config.current.tenant_id
  soft_delete_retention_days  = 7
  purge_protection_enabled    = false
  tags                        = local.common_tags

  sku_name = "standard"
}

# SQL Server
resource "azurerm_mssql_server" "sql" {
  name                         = local.sql_server_name
  resource_group_name          = azurerm_resource_group.rg.name
  location                     = azurerm_resource_group.rg.location
  version                      = "12.0"
  administrator_login          = var.sql_admin_username
  administrator_login_password = var.sql_admin_password
  tags                         = local.common_tags

  azuread_administrator {
    login_username = "AzureAD Admin"
    object_id      = data.azurerm_client_config.current.object_id
  }
}

# SQL Database
resource "azurerm_mssql_database" "db" {
  name           = local.sql_database_name
  server_id      = azurerm_mssql_server.sql.id
  collation      = "SQL_Latin1_General_CP1_CI_AS"
  license_type   = "LicenseIncluded"
  max_size_gb    = 1
  sku_name       = "Basic"
  zone_redundant = false
  tags           = local.common_tags
}

# SQL Server Firewall Rule (Allow Azure Services)
resource "azurerm_mssql_firewall_rule" "allow_azure_services" {
  name             = "AllowAllAzureIPs"
  server_id        = azurerm_mssql_server.sql.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}

# App Service Plan (Consumption)
resource "azurerm_service_plan" "plan" {
  name                = local.app_service_plan_name
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  os_type             = "Linux"
  sku_name            = "Y1"
  tags                = local.common_tags
}

# Function App
resource "azurerm_linux_function_app" "function" {
  name                = local.function_app_name
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  tags                = local.common_tags

  storage_account_name       = azurerm_storage_account.storage.name
  storage_account_access_key = azurerm_storage_account.storage.primary_access_key
  service_plan_id            = azurerm_service_plan.plan.id

  site_config {
    application_stack {
      dotnet_version = "6.0"
    }
    ftps_state       = "Disabled"
    min_tls_version  = "1.2"
  }

  identity {
    type = "SystemAssigned"
  }

  app_settings = {
    "FUNCTIONS_EXTENSION_VERSION"    = "~4"
    "APPINSIGHTS_INSTRUMENTATIONKEY" = azurerm_application_insights.insights.instrumentation_key
    "FUNCTIONS_WORKER_RUNTIME"       = "dotnet"
    "KeyVaultUri"                    = azurerm_key_vault.kv.vault_uri
    "SqlConnectionString"            = "Server=tcp:${azurerm_mssql_server.sql.fully_qualified_domain_name},1433;Initial Catalog=${azurerm_mssql_database.db.name};Persist Security Info=False;User ID=${var.sql_admin_username};Password=${var.sql_admin_password};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
    "AzureDevOpsOrganizationUrl"     = var.azure_devops_org_url
    "ScanSchedule"                   = var.scan_schedule
  }

  https_only = true
}

# Static Web App
resource "azurerm_static_site" "web" {
  name                = local.static_web_app_name
  resource_group_name = azurerm_resource_group.rg.name
  location            = var.location
  sku_tier            = "Free"
  sku_size            = "Free"
  tags                = local.common_tags
}

# Key Vault Access Policy for Function App
resource "azurerm_key_vault_access_policy" "function_app_policy" {
  key_vault_id = azurerm_key_vault.kv.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = azurerm_linux_function_app.function.identity[0].principal_id

  secret_permissions = [
    "Get",
    "List"
  ]
}

# Key Vault Secret for Azure DevOps PAT
resource "azurerm_key_vault_secret" "azure_devops_pat" {
  name         = "AzureDevOpsPat"
  # MUOKKAA: Korvaa tämä oikealla PAT-tokenilla tai käytä turvallisempaa tapaa asettaa se
  value        = "YOUR_PAT_TOKEN" # Tuotannossa käytä turvallisempaa tapaa salasanan asettamiseen
  key_vault_id = azurerm_key_vault.kv.id
  depends_on   = [azurerm_key_vault_access_policy.function_app_policy]
}

# Outputs
output "function_app_url" {
  value = "https://${azurerm_linux_function_app.function.default_hostname}"
}

output "static_web_app_url" {
  value = azurerm_static_site.web.default_host_name
}

output "key_vault_name" {
  value = azurerm_key_vault.kv.name
}

output "sql_server_name" {
  value = azurerm_mssql_server.sql.name
}

output "sql_database_name" {
  value = azurerm_mssql_database.db.name
} 