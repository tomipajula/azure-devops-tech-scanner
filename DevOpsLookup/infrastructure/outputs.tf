output "resource_group_name" {
  value = azurerm_resource_group.rg.name
}

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

output "storage_account_name" {
  value = azurerm_storage_account.storage.name
}

output "app_insights_name" {
  value = azurerm_application_insights.insights.name
}

output "app_insights_instrumentation_key" {
  value     = azurerm_application_insights.insights.instrumentation_key
  sensitive = true
} 