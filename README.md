# Furnichannel Test
----
## installazione
    git clone https://github.com/gbuonc/furnichannel.git
    cd furnichannel && npm install
    npm start

L'app è un prototipo per la gestione degli appuntamenti, per data e fasce orarie.

L'interfaccia nella root dell'app è dedicata al cliente finale per la prenotazione di un appuntamento, mentre all'indirizzo */manage* è possibile gestire le fasce orarie per i singoli giorni.

Ho ipotizzato una impresa con diversi showroom fisici, in varie città d'italia.
L'utente può selezionare una città oppure geolocalizzare lo showroom più vicino alla posizione rilevata dal browser.

Scelta la città è poi possibile tramite calendario  selezionare una data e una fascia oraria tra quelle disponibili, e confermare la prenotazione dopo aver lasciato i propri dati di contatto.

Il gestore degli showroom può stabilire i giorni abilitati agli appuntamenti e specificare per ognuno le fasce orarie attive.
Ha inoltre visibile la lista degli appuntamenti prenotati per lo specifico showroom e i dettagli di contatto dei clienti.
Il calendario del gestore ha evidenziati i giorni con appuntamenti e quelli disabilitati.

## Specifiche tecniche
Il front end dell'applicazione è realizzato con react.js, mentre l'interfaccia grafica è realizzata principalmente con componenti semantic-ui ottimizzati per react.

Il backend viene simulato con una API fake scrivibile gestita dalla library JSON Server, i cui dati sono presenti nel file db.json.
All'avvio dell'app in modalità di sviluppo via *npm start*  viene lanciato anche il server API, su localhost alle porte 3000 e 3001 rispettivamente.

L'API prevede due endpoint, richiamati dall'applicazione in maniera asincrona via GET, */locations* che ritorna l'elenco degli showroom, comprensivi di indirizzo e coordinate di geolocalizzazione, e /*calendars/[:idShowroom]* che ritorna un array di date per lo specifico showroom. Ogni data riporta le fasce orarie prenotate (con dettagli anagrafici del cliente) e le fasce orarie in cui le prenotazioni sono disabilitate.
Gli stessi endpoint sono scrivibili via PUT.

## Limitazioni
Rispetto a una applicazione production-ready ci sono diverse limitazioni:

INTERFACCIA:
* la suddivisione in fasce orarie prevede una fascia mattutina (dalle 9 alle 12) e una pomeridiana (dalle 15 alle 18) a intervalli orari. Non è possibile specificare una durata diversa dell'appuntamento.
* ho ipotizzato lo showroom disponibile agli appuntamenti per l'intera giornata, per cui di default le fasce orarie sono tutte abilitate. E' possibile selezionare i singoli orari da disabilitare o l'intera giornata.
* non è possibile modificare gli appuntamenti in calendario, il gestore può solo vedere i giorni e le ore interessate
* la scelta delle date è limitata al mese corrente + 2 mesi solari seguenti
* Sono disabilitati di default i giorni precendenti la data corrente e le domeniche, nonchè i giorni disabilitati dal pannello di gestione. Nei calendari non sono state considerate le festività (es. 1 maggio) che sono quindi attive
* pur essendo fluida l'interfaccia non è ottimizzata per dispositivi mobile.


API:

* il server API simulato non prevede una scrittura puntuale del singolo nodo JSON per cui il salvataggio avviene sovrascrivendo tutto l'albero JSON dell'endpoint corrispondente (es. tutto il calendario del singolo showroom) e non solo inviando l'elemento modificato, aumentando il carico dell'elaborazione sul client.
* per semplicità non ho gestito gli errori nelle chiamate all'API (es. server error, errori 404 ecc.)
* per semplicità i path per l'interfaccia di prenotazione e quella di gestione sono gestiti tramite semplice switch che renderizza i due diversi componenti base. Non ho utilizzato router nè entry point diversi in webpack.
* testato solo su brower di ultima generazione su piattaforma MAC
* il prototipo non è provvisto di test
