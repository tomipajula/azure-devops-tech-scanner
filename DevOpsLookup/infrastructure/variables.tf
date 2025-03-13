variable "environment_name" {
  description = "Ympäristön nimi (dev, test, prod)"
  type        = string
  default     = "dev"
}

variable "location" {
  description = "Sijainti, johon resurssit luodaan"
  type        = string
  # MUOKKAA: Aseta tähän haluamasi Azure-sijainti
  default     = "northeurope"
}

variable "azure_devops_org_url" {
  description = "Azure DevOps -organisaation URL"
  type        = string
  # HUOM: Tämä arvo tulee asettaa .tfvars-tiedostossa
}

variable "scan_schedule" {
  description = "Skannauksen ajastus (CRON-muodossa)"
  type        = string
  # MUOKKAA: Aseta tähän haluamasi ajastus CRON-muodossa
  default     = "0 0 0 1 * *" # Oletuksena kuukauden 1. päivä klo 00:00
}

variable "sql_admin_username" {
  description = "SQL-palvelimen pääkäyttäjän käyttäjätunnus"
  type        = string
  # MUOKKAA: Aseta tähän haluamasi SQL-palvelimen käyttäjätunnus
  default     = "sqladmin"
}

variable "sql_admin_password" {
  description = "SQL-palvelimen pääkäyttäjän salasana"
  type        = string
  sensitive   = true
  # MUOKKAA: Aseta tähän turvallinen SQL-palvelimen salasana
  # HUOM: Tuotannossa tämä arvo tulisi asettaa .tfvars-tiedostossa
  default     = "P@ssw0rd1234!" # Tuotannossa käytä turvallisempaa salasanaa
} 