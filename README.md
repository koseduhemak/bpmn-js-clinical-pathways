# bpmn-js-clinical-pathways
Dieses Projekt ist ein Modellierungseditor zur Abbildung von Konzepten Klinischer Pfade, die in die abstrakte Syntax des Metamodells der BPMN 2.0 integriert wurden.
Die implementierten Konzepte stützen sich weitestgehend auf die Forschungsarbeiten von `BRAUN ET AL. (2014)`, `BRAUN ET AL. (2015)`, `BRAUN ET AL. (2016)`. 
Die vollständigen Literaturverweise können im Abschnitt [Literatur](#Literatur) eingesehen werden.

Dabei wird die JavaScript-Library **bpmn-js** als Ausgangsbasis herangezogen und an notwendigen Stellen erweitert.

## Struktur
### app
Dieser Ordner beinhaltet alle Quelldateien, um die bpmn-js erweitert wurde. Bpmn-js wurde nicht-destruktiv erweitert. Damit ist gemeint, dass die Quelldateien nicht modifiziert worden sind und die Library weiterhin gekapselt ist.

Das hat den Vorteil, dass bpmn-js unabhängig von diesem Projekt aktualisiert werden kann, um so von neuen Features und Bug-Fixes zu profitieren.

Im Folgenden wird auf die einzelnen Unterordner kurz eingegangen.

#### clinical-pathways
In diesem Ordner sind die Erweiterungen gemäß des Ordner-Schemas von bpmn-js organisiert.

#### php
In diesem Verzeichnis befindet sich das Server-Backend auf Basis des Zend Framework 3.
![Ordnerinhalt 'php'](docs/folder-php.png "Ordnerinhalt 'php'")


##### config/autoload/elFinder.global.php
 Diese Datei enthält die Konfiguration für das Dateibrowser-Modul **"ElFinder"**.
##### module/Application
 Das Application Modul. In diesem Modul befinden sich Controller und Views zur Anzeige und Konfiguration des Modellierungseditors und der Dateibrowserfunktionalität von **"ElFinder"**.
##### module/Application/module.config.php
 Diese Datei beinhaltet die Konfiguration des Moduls Application. Darin enthalten sind z. B. die Konfiguration des Routers, der festlegt, welche URLs von welchem Controller verarbeitet werden.
##### module/Application/src/Application/Controller
 Hier befinden sich die Controller, die für die Verarbeitung bestimmter URLs angelegt worden sind und passende Views bzw. JSON-Daten zurückliefern.
##### module/Application/view/layout/layout.phtml
 Diese Datei stellt das Grundgerüst des HTML-Layouts zur Verfügung.
##### module/Application/view/application/index
 In diesem Ordner befinden sich Views. **"index.phtml"** ist für die Anzeige des BPMN-Modellierungseditors zuständig, **"index-dmn"** für die Darstellung des DMN-Modellierungseditors.
##### public/cp-modeler
 In diesen Ordner werden beim Deployment-Prozess durch **"grunt"** alle für die Ausführung des Modellierungseditors notwendigen Dateien kopiert.
 
 **AUSNAHME: app/index.html und app/dmn/index.html!** Ergeben sich Änderungen im Projekt an diesen Dateien, müssen diese Änderungen momentan manuell
in den View-Scripts **"module/Application/view/application/index/index.phtml"** sowie **"module/Application/view/application/index/index-dmn.phtml"** nachgezogen werden!
##### public/workspace
 Hier befindet sich der workspace, in dem Dateien gespeichert und geladen werden können vom integrierten Dateibrowser **"ElFinder"**.
##### composer.json
 In dieser Datei werden die Abhängigkeiten des Zend Frameworks 3 vorgehalten.

## Ausführung
Im Folgenden wird erklärt, wie das Projekt in einer lokalen Testumgebung ausgeführt werden kann.

### Abhängigkeiten installieren
 ```
 npm install
 ```
### Ausführen des Projektes (ohne PHP Funktionalitäten)
 Der Befehl
 ```
 grunt auto-build
 ```
 kopiert alle notwendigen Dateien in den **"dist"** Ordner, führt den integrierten WebServer **Karma** aus und lädt das Projekt im Browser
 unter **http://localhost:9013**.
 
 ### Produktiv-Version erzeugen (inkl. PHP Funktionalitäten)
 Der Befehl
 ```
 grunt php-release
 ```
 kopiert alle notwendigen Dateien in den Ordner **php/public/cp-modeler** und stellt diese für die Verwendung innerhalb des integrierten Zend Framework 3 bereit.
 
## Literatur <a name="Literator"></a>
[BRAUN ET AL. 2014] BRAUN, Richard ; SCHLIETER, Hannes ; BURWITZ, Martin ; ESSWEIN,
Werner: Bpmn4cp: Design and implementation of a bpmn extension for clinical pathways.
In: Bioinformatics and Biomedicine (BIBM), 2014 IEEE International Conference on IEEE,
2014, S. 9–16

[BRAUN ET AL. 2015] BRAUN, R. ; BURWITZ, M. ; SCHLIETER, H. ; BENEDICT, M.: Clinical
processes from various angles - amplifying BPMN for integrated hospital management. In:
2015 IEEE International Conference on Bioinformatics and Biomedicine (BIBM), 2015, S.
837–845

[BRAUN ET AL. 2016] BRAUN, Richard ; SCHLIETER, Hannes ; BURWITZ, Martin ; ESSWEIN,
Werner: BPMN4CP Revised – Extending BPMN for Multi-perspective Modeling of Clinical
Pathways. In: Hawaii International Conference on System Sciences (HICSS) 49 (2016), S.
3249–3258. http://dx.doi.org/doi.ieeecomputersociety.org/10.11
09/HICSS.2016.407. – DOI doi.ieeecomputersociety.org/10.1109/HICSS.2016.407. –
ISSN 1530–1605