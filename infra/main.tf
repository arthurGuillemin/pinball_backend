provider "azurerm" {
  features {}
}

variable "supabase_url" {
  type = string
}

variable "supabase_key" {
  type = string
}

resource "azurerm_resource_group" "rg" {
  name     = "rg-flipper"
  location = "France Central"
}

resource "azurerm_service_plan" "plan" {
  name                = "plan-flipper"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  os_type             = "Linux"
  sku_name            = "B1"
}

resource "azurerm_linux_web_app" "backend" {
  name                = "flipper-backend-app"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  service_plan_id     = azurerm_service_plan.plan.id

site_config {
  application_stack {
    docker_image_name        = "arthurguill/pinball-backend:latest"
    docker_registry_url      = "https://index.docker.io/"
  }

  websockets_enabled = true
}

app_settings = {
  WEBSITES_PORT     = "3000"
  NODE_ENV          = "production"
  SUPABASE_URL      = var.supabase_url
  SUPABASE_ANON_KEY = var.supabase_key
}
}