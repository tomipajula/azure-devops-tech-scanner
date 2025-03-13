locals {
  # MUOKKAA: Voit muuttaa sovelluksen nimeä tarvittaessa
  app_name              = "techscanner"
  storage_account_name  = "${local.app_name}${var.environment_name}storage"
  app_insights_name     = "${local.app_name}-${var.environment_name}-insights"
  key_vault_name        = "${local.app_name}-${var.environment_name}-kv"
  sql_server_name       = "${local.app_name}-${var.environment_name}-sql"
  sql_database_name     = "TechScannerDB"
  function_app_name     = "${local.app_name}-${var.environment_name}-func"
  app_service_plan_name = "${local.app_name}-${var.environment_name}-plan"
  static_web_app_name   = "${local.app_name}-${var.environment_name}-web"
  
  # Yleiset tagit
  # MUOKKAA: Voit lisätä tai muuttaa tageja tarpeen mukaan
  common_tags = {
    Environment = var.environment_name
    Project     = "TechnologyScanner"
    ManagedBy   = "Terraform"
  }
} 