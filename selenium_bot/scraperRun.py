#!/usr/bin/env python3
from selenium import webdriver
from selenium.common import TimeoutException
from selenium.webdriver.firefox.service import Service as FirefoxService
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
import pandas as pd
from datetime import datetime
import locale
from collections import Counter
import ast
import time
from dotenv import load_dotenv
import os
import wget
import json
import sys
import threading



# Erhalte den Variablen aus den Argumenten
if len(sys.argv) < 3:
    print("Verwendung: python scraper.py <profilename> <testMode>")
    print("testMode-Optionen: short, medium, long")
    sys.exit(1)

profilename = sys.argv[1]
testMode = sys.argv[2]

# Testmodus-Einstellungen
if testMode == "short":
    initial_scroll_count = 1
    additional_scroll_count = 0
    repeat_count = 0
    print("testMode-Optionen: short")
elif testMode == "medium":
    initial_scroll_count = 3
    additional_scroll_count = 2
    repeat_count = 1
    print("testMode-Optionen: medium")
elif testMode == "long":
    initial_scroll_count = 3
    additional_scroll_count = 2
    repeat_count = 5
    print("testMode-Optionen: long")
else:
    print("Ungültiger Testmodus. Bitte verwenden Sie 'short', 'medium' oder 'long'.")
    sys.exit(1)

print(f"scroll counts: {initial_scroll_count} {additional_scroll_count} {repeat_count}")

# .env-Datei laden
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')

if os.path.exists('.env'):
    print(".env-Datei gefunden")
else:
    print(".env-Datei nicht gefunden")

print(f"Lade .env-Datei von: {dotenv_path}")
load_dotenv(dotenv_path=dotenv_path, override=True)
# load_dotenv()
with open(dotenv_path, 'r') as file:
    print("Inhalt der .env-Datei:")
    print(file.read())

# Zugriff auf die Variablen
geckodriver_path = os.getenv('GECKODRIVER_PATH')
firefox_path = os.getenv('FIREFOX_BINARY_PATH')

username_value = os.getenv('INSTAGRAM_USERNAME')
password_value = os.getenv('INSTAGRAM_PASSWORD')

image_save_path = os.getenv('IMAGE_SAVE_PATH')
csv_save_path = os.getenv('CSV_SAVE_PATH')
js_save_path = os.getenv('JS_SAVE_PATH')

print(f"Geckodriver binary path: {geckodriver_path}")
print(f"Firefox binary path: {firefox_path}")

print(f"username binary path: {username_value}")
print(f"password binary path: {password_value}")

print(f"image_save_path binary path: {image_save_path}")
print(f"csv_save_path binary path: {csv_save_path}")
print(f"js_save_path binary path: {js_save_path}")

# Initialisiere die Optionen für Firefox und setze den Pfad zur Binary
options = Options()
options.binary_location = firefox_path

# Initialisiere den Service
service = FirefoxService(executable_path=geckodriver_path)

# Initialisiere den Firefox WebDriver mit dem korrekten Pfad zum geckodriver
driver = webdriver.Firefox(service=service, options=options)

# Öffne Instagram
driver.get("https://www.instagram.com/")

#Cookies akzeptieren
accept_cookie = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Alle Cookies erlauben')]"))).click()

#Log In
username_field = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, "input[name='username']")))
password_field = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, "input[name='password']")))


username_field.clear()
password_field.clear()
username_field.send_keys(username_value)
password_field.send_keys(password_value)


# Warte, bis der Einloggen-Button sichtbar ist
log_in = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.CSS_SELECTOR, "button[type='submit']"))
)

# Scrolle zum Button
driver.execute_script("arguments[0].scrollIntoView(true);", log_in)

# Warte einen Moment, um sicherzustellen, dass das Scrollen abgeschlossen ist
time.sleep(1)

# Klicke auf den Button
driver.execute_script("arguments[0].click();", log_in)


try:
    # Überprüfe, ob das Popup-Element innerhalb der Wartezeit verfügbar ist
    decline_safe = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//div[contains(text(), 'Jetzt nicht')]"))
    )
    decline_safe.click()  # Klicke nur, wenn das Element gefunden wurde
except TimeoutException:
    print("Das Popup mit 'Jetzt nicht' ist nicht erschienen, daher wird der Button nicht geklickt.")


try:
    # Überprüfe, ob das Popup-Element innerhalb der Wartezeit verfügbar ist
    decline_alert = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Jetzt nicht')]"))
    )
    decline_alert.click()  # Klicke nur, wenn das Element gefunden wurde
except TimeoutException:
    print("Das Popup ist nicht erschienen, daher wird der Button nicht geklickt.")


driver.get(f"https://www.instagram.com/{profilename}/")


def scroll_and_collect_images(image_urls, path):
    images = driver.find_elements(By.TAG_NAME, 'img')
    new_image_urls = [image.get_attribute('src') for image in images if image.get_attribute('src') not in image_urls]

    for image_url in new_image_urls:
        try:
            counter = len(image_urls)
            save_as = os.path.join(path, f"{profilename}_{counter}.jpg")
            wget.download(image_url, save_as)
            image_urls.append(image_url)
        except Exception as e:
            print(f"Fehler beim Herunterladen des Bildes {image_url}: {e}")
    return image_urls



def scroll_page(scroll_count):
    for _ in range(scroll_count):
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(2)


# Initiales Scrollen
scroll_page(initial_scroll_count)

# Finde und speichere Bilder
image_urls = []

path = os.path.join(image_save_path, f"{profilename}_Pics")
if not os.path.exists(path):
    os.makedirs(path)

image_urls = scroll_and_collect_images(image_urls, path)

all_hashtags = []
post_dates = []
post_urls = []


def extract_post_data():
    post_links = driver.find_elements(By.XPATH, "//a[contains(@href, '/p/') or contains(@href, '/reel/')]")
    for link in post_links:
        post_url = link.get_attribute('href')
        if post_url not in post_urls:
            post_urls.append(post_url)
            try:
                driver.execute_script("arguments[0].click();", link)
                time.sleep(1.5)
                post_date = driver.find_element(By.XPATH, "//time").get_attribute('title')
                post_dates.append(post_date)
                hashtags = driver.find_elements(By.XPATH, "//h1//a[contains(@href, '/explore/tags/')]")
                post_hashtags = [hashtag.text for hashtag in hashtags]
                all_hashtags.append(post_hashtags)
                driver.back()
                time.sleep(1.5)
            except Exception as e:
                print(f"Fehler beim Abrufen des Datums: {e}")
                post_dates.append('Datum nicht gefunden')


extract_post_data()

# Wiederholtes Scrollen, Daten auslesen und Bilder speichern
for _ in range(repeat_count):
    scroll_page(additional_scroll_count)
    image_urls = scroll_and_collect_images(image_urls, path)
    extract_post_data()

# Schließe den WebDriver
driver.quit()

# Speichere die Daten in CSV-Dateien
df_dates = pd.DataFrame({'Post URL': post_urls, 'Post Date': post_dates})
df_hashtags = pd.DataFrame({'Post URL': post_urls, 'Hashtags': all_hashtags})

df_dates.to_csv(os.path.join(csv_save_path, f'{profilename}_date_data.csv'), index=False)
df_hashtags.to_csv(os.path.join(csv_save_path, f'{profilename}_hashtag_data.csv'), index=False)


print("Daten erfolgreich gespeichert!")

#-------------------------------------------------------------------------------------------------------------------
#Data-Aufbereitung:
#-------------------------------------------------------------------------------------------------------------------
###########################################################################################################################################
# Transform Date Data:

german_months = {
    "Januar": "January",
    "Februar": "February",
    "März": "March",
    "April": "April",
    "Mai": "May",
    "Juni": "June",
    "Juli": "July",
    "August": "August",
    "September": "September",
    "Oktober": "October",
    "November": "November",
    "Dezember": "December"
}

# Lokalisierung setzen
try:
    locale.setlocale(locale.LC_TIME, 'en_US.UTF-8')  # Für Linux/Mac
except locale.Error:
    try:
        locale.setlocale(locale.LC_TIME, 'en_US')  # Für Windows
    except locale.Error:
        print("Die deutsche Lokalisierung ist auf diesem System nicht verfügbar.")
        exit()

print(f"Aktuelle Lokalisierung: {locale.getlocale(locale.LC_TIME)}")

file_path = os.path.join(csv_save_path, f'{profilename}_date_data.csv')
print(f"Dateipfad: {file_path}")

# CSV-Datei laden
try:
    df_dates = pd.read_csv(file_path)
except FileNotFoundError:
    print(f'{profilename}_date_data.csv wurde nicht gefunden {file_path}')
    exit()

# Funktion zur Bestimmung der Woche im Monat
def week_of_month(date):
    first_day = date.replace(day=1)
    dom = date.day
    adjusted_dom = dom + first_day.weekday()
    return (adjusted_dom - 1) // 7 + 1

# Funktion zum Normalisieren von Datumsangaben und Umwandeln deutscher Monatsnamen
def normalize_date_format(date_string):
    normalized = date_string.replace('.', '. ').replace('  ', ' ').strip()
    for de_month, en_month in german_months.items():
        if de_month in normalized:
            normalized = normalized.replace(de_month, en_month)
            break  # Beende die Schleife, wenn der Monat gefunden wurde
    return normalized

# Konvertiere das Datum und aggregiere die Daten
month_counts = {}
week_counts = {}

for _, row in df_dates.iterrows():
    try:
        # Datum normalisieren und parsen
        post_date_str = normalize_date_format(row['Post Date'])
        post_date = datetime.strptime(post_date_str, '%d. %B %Y')

        # Monat bestimmen
        month = post_date.strftime('%B')
        month_counts[month] = month_counts.get(month, 0) + 1

        # Woche bestimmen
        week = week_of_month(post_date)
        week_key = f"W{week}"
        week_counts[week_key] = week_counts.get(week_key, 0) + 1

    except Exception as e:
        print(f"Fehler beim Verarbeiten des Datums '{row['Post Date']}': {e}")

# Dynamischer Speicherpfad
output_base_path = js_save_path

# Sicherstellen, dass der Ordner existiert
os.makedirs(output_base_path, exist_ok=True)

monthly_output_path = os.path.join(output_base_path, f"{profilename}_months_count.js")
with open(monthly_output_path, 'w', encoding='utf-8') as f:
    f.write(f"const {profilename}_monthlyCounts = ")
    f.write(json.dumps({f"monthly_counts": [{"data": month, "count": count} for month, count in month_counts.items()]}, ensure_ascii=False, indent=4))
    f.write(";")

print(f"Daten für Monate erfolgreich in '{monthly_output_path}' gespeichert!")

# Wochendaten im JavaScript-Format speichern
weekly_output_path = os.path.join(output_base_path, f"{profilename}_weeks_count.js")
with open(weekly_output_path, 'w', encoding='utf-8') as f:
    f.write(f"const {profilename}_weeklyCounts = ")
    f.write(json.dumps({"weekly_counts": [{"data": week, "count": count} for week, count in week_counts.items()]}, ensure_ascii=False, indent=4))
    f.write(";")

print(f"Daten für Wochen erfolgreich in '{weekly_output_path}' gespeichert!")

###########################################################################################################################################
# Transform Hashtag Data:

file_path = os.path.join(csv_save_path, f'{profilename}_hashtag_data.csv')
print(file_path)

try:
    df_hashtags = pd.read_csv(file_path)
except FileNotFoundError:
    print(f'{profilename}_hashtag_data.csv wurde nicht gefunden')
    exit()

# Alle Hashtags zu einer Liste zusammenfügen und zählen
all_hashtags = []
for hashtags in df_hashtags['Hashtags']:
    try:
        hashtags_list = ast.literal_eval(hashtags)  # Konvertiert String-Listen in tatsächliche Listen
        all_hashtags.extend(hashtags_list)
    except (ValueError, SyntaxError):
        continue

# Häufigkeit der Hashtags berechnen
hashtag_counts = Counter(all_hashtags)

# Daten im JavaScript-Format vorbereiten
hashtag_data = [{"data": tag, "count": count} for tag, count in hashtag_counts.items()]

os.makedirs(js_save_path, exist_ok=True)

hashtag_output_path = os.path.join(js_save_path, f"{profilename}_hashtags_count.js")
with open(hashtag_output_path, "w", encoding="utf-8") as js_file:
    js_file.write(f"const {profilename}_hashtagData = ")
    js_file.write(json.dumps(hashtag_data, indent=2))
    js_file.write(";")

print(f"{profilename}_hashtags_counts.js wurde erfolgreich erstellt und die Hashtag-Daten wurden gespeichert!")
