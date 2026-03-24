output "backend_url" {
  value = azurerm_linux_web_app.backend.default_hostname
}