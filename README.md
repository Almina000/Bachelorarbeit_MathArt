# Instagram Scraper Bot

## 📋 **Beschreibung**
Dieser Bot nutzt Selenium, um Bilder, Hashtags und das Datum von den Posts eines angegebenen Instagram-Profils zu scrapen. Die Daten werden lokal in einem Ordner gespeichert und als CSV-Dateien exportiert. Anschließend werden die Datumsangaben normalisiert und nach Monaten sowie Wochen aggregiert. Außerdem werden die Hashtags gezählt und die Ergebnisse als JavaScript-Dateien ausgegeben, die für Visualisierungen genutzt werden können.

Das Skript kann über die Konsole aufgerufen werden, wobei der Profilname als Argument übergeben wird.

---

## 🧩 **Voraussetzungen**
- Betriebssystem: Windows, macOS oder Linux
- Installiert: Python 3.7 oder höher
- Ein gültiger Instagram-Account (für den Login)
- Webdriver: [Geckodriver](https://github.com/mozilla/geckodriver/releases) für Firefox

---

## ⚙️ **Installation**

### 1. **Python installieren**
- [Lade Python herunter](https://www.python.org/downloads/) und installiere es.
- Achte darauf, dass die Option **"Add Python to PATH"** während der Installation aktiviert ist.

### 2. **Python-Abhängigkeiten installieren**
Führe den folgenden Befehl in der Konsole aus:
```bash
pip install selenium pandas wget python-dotenv

```

### 3. **Geckodriver einrichten**
- Lade den [Geckodriver](https://github.com/mozilla/geckodriver/releases) für dein Betriebssystem herunter.
- Entpacke die Datei und platziere sie in einem Ordner deiner Wahl.
- Füge den Pfad des Ordners zur **System-Umgebungsvariable PATH** hinzu.
  - **Windows:**
    - Systemsteuerung > System > Erweiterte Systemeinstellungen > Umgebungsvariablen
    - Bearbeite die Variable `Path` und füge den Geckodriver-Pfad hinzu.
  - **macOS/Linux:**
    ```bash
    export PATH=$PATH:/path/to/geckodriver
    ```

### 4. **Firefox-Browser installieren**
- Stelle sicher, dass Firefox installiert ist. Du kannst es [hier herunterladen](https://www.mozilla.org/de/firefox/new/).

### 5. **.env-Datei konfigurieren**
Erstelle im Hauptverzeichnis des Projekts eine Datei namens `.env` und trage die folgenden Werte ein:
```env
# Geckodriver und Firefox-Pfad
GECKODRIVER_PATH=C:/Pfad/zum/geckodriver.exe
FIREFOX_BINARY_PATH=C:/Program Files/Mozilla Firefox/firefox.exe

# Instagram-Zugangsdaten
INSTAGRAM_USERNAME=dein_benutzername
INSTAGRAM_PASSWORD=dein_passwort

# Speicherpfade für die Ausgaben
IMAGE_SAVE_PATH=C:/Pfad/zum/images
CSV_SAVE_PATH=C:/Pfad/zum/csv
JS_SAVE_PATH=C:/Pfad/zum/js
```
> **Hinweis:** Achte darauf, dass die Pfade an dein Betriebssystem angepasst sind.

---


## 🚀 **Ausführung des Skripts**
Navigiere mit cd in das Verzeichnis, in dem sich die Datei befindet, und führe folgenden Befehl aus:
```bash
python scraperRun.py <profilename> <testMode>
```
🔹 **Beispiel:**
```bash
python scraperRun.py google short
```

## 🕒 **TestModes:**
- **short:** 1 Minute 20 Sekunden – ca. 10-15 Posts
- **medium:** 4 Minuten 45 Sekunden – ca. 70-75 Posts
- **long:** 12 Minuten 15 Sekunden – ca. 200-205 Posts


---

## 💾 **Ausgabe & Speicherung**
- Die heruntergeladenen Bilder werden im Ordner `/images/<profilename>_Pics` gespeichert.
- Die gescrapten Daten werden in folgenden Dateien gespeichert:
  - `<profilename>_date_data.csv` (Post-Daten)
  - `<profilename>_hashtag_data.csv` (Hashtags)

---

## ❗ **Fehlerbehebung**
- **"Profilname fehlt!"** → Gib den Profilnamen als Argument an.
- **"Webdriver nicht gefunden"** → Überprüfe den PATH deiner Geckodriver-Installation.
- **"Instagram-Login fehlgeschlagen"** → Stelle sicher, dass deine Login-Daten korrekt sind.

---


