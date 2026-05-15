// oggetto "CalcolatoreSalute" che racchiude funzioni correlate
const CalcolatoreSalute = {
    // metodo per calcolare l'IMC 
    calcolaIMC: function(peso, altezzaCm) {
        const altezzaM = altezzaCm / 100;
        return (peso / (altezzaM * altezzaM)).toFixed(1);
    },
    // metodo per valutare la categoria IMC
    valutaIMC: function(imc) {
        if (imc < 18.5) return 'Sottopeso';
        if (imc < 25) return 'Normopeso';
        if (imc < 30) return 'Sovrappeso';
        return 'Obesita';
    },
    // metodo per calcolare il fabbisogno calorico 
    calcolaFabbisogno: function(sesso, peso, altezzaCm, eta, livello) {
        let bmr = (sesso === 'uomo') 
            ? 88.362 + (13.397 * peso) + (4.799 * altezzaCm) - (5.677 * eta)
            : 447.593 + (9.247 * peso) + (3.098 * altezzaCm) - (4.330 * eta);
        return Math.round(bmr * livello);
    }
};

// array associativo per contenere gli articoli.
const articoli = {
    nutrizione: [
        { titolo: 'Alimentazione Consapevole', testo: 'Una corretta nutrizione è la base del benessere. Scegli alimenti integrali, verdure stagionali e proteine magre. Evita cibi processati e zuccheri aggiunti.' },
        { titolo: 'L’Importanza dell’Idratazione', testo: 'Bevi almeno 2 litri di acqua al giorno per mantenere idratazione ottimale. L’acqua migliora metabolismo, concentrazione e salute della pelle.' }
    ],
    esercizio: [
        { titolo: 'Iniziare una Routine Fitness', testo: 'Comincia con 30 minuti 3 volte a settimana. Combina cardio e forza. La costanza batte l’intensità.' },
        { titolo: 'Stretching e Flessibilità', testo: '10-15 minuti al giorno riducono dolori e migliorano mobilità, prevenendo infortuni.' }
    ],
    'salute-mentale': [
        { titolo: 'Meditazione e Consapevolezza', testo: 'Anche 5 minuti al giorno riducono stress. Usa app come Headspace o Calm.' },
        { titolo: 'Il Sonno, Pilastro del Benessere', testo: 'Dormi 7-9 ore a notte. Il sonno regolare migliora memoria, umore e sistema immunitario.' }
    ],
    prevenzione: [
        { titolo: 'Check-up Regolari', testo: 'Visite periodiche anche se stai bene. Monitora pressione, colesterolo e parametri vitali.' },
        { titolo: 'Educazione Sanitaria', testo: 'Conosci il tuo corpo, impara a riconoscere segnali d’allarme. La prevenzione inizia dalla conoscenza.' }
    ]
};

function caricaArticoli(categoria) {
    const container = document.getElementById('articles-container');
    if (!container) return;
    // svuota del tutto il div
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    const lista = articoli[categoria] || [];
    lista.forEach(art => {
        //crea il div
        const cardDiv = document.createElement('div');
        cardDiv.className = 'articolo-card';
        //crea il nodo di testo h3 con il contenuto del titolo 
        const titleNode = document.createElement('h3');
        titleNode.appendChild(document.createTextNode(art.titolo));
        //crea il nodo di testo p con il contenuto del testo 
        const pNode = document.createElement('p');
        pNode.appendChild(document.createTextNode(art.testo));
        //aggiunge al div h3 e p, e poi il div al container
        cardDiv.appendChild(titleNode);
        cardDiv.appendChild(pNode);
        container.appendChild(cardDiv);
    });
}

// gestione dei btn di Impara il benessere
document.querySelectorAll('.btn-filtro').forEach(btn => {
    btn.addEventListener('click', function() {
        // seleziona i btn con classe btn-filtro (restituendo una NodeList), itera ogni elemento e lo rimuove dalla classe attivo 
        document.querySelectorAll('.btn-filtro').forEach(b => b.classList.remove('attivo'));
        this.classList.add('attivo'); //applica la classe attivo al btn selezionato
        caricaArticoli(this.dataset.categoria); //accede al suo attributo personalizzato
    });
});
caricaArticoli('nutrizione'); // di default

// per caricare i dati salvati in precedenza o inizializzare un array vuoto
let storicoIMC = JSON.parse(localStorage.getItem('storicoIMC')) || [];
// per aggiornare lo storico IMC
function aggiornaStoricoUI() {
    const listaUl = document.getElementById('listaStorico');
    const contatore = document.getElementById('contatoreStorico');
    if (!listaUl) return;
    // pulisce del tutto la lista
    while (listaUl.firstChild) {
        listaUl.removeChild(listaUl.firstChild);
    }
    //se lo storico è vuoto
    if (storicoIMC.length === 0) {
        const emptyLi = document.createElement('li');
        emptyLi.style.opacity = '0.7';
        emptyLi.appendChild(document.createTextNode('Nessuna misurazione salvata.'));
        listaUl.appendChild(emptyLi);
        if (contatore) contatore.innerText = '0 misurazioni salvate';
        return;
    }
    // itera sull'array e crea gli elementi <li> con bottone di eliminazione
    storicoIMC.forEach((item, idx) => {
        const li = document.createElement('li');
        const textSpan = document.createElement('span');
        textSpan.innerHTML = `<strong>${item.data}</strong> – ${item.nome} (${item.eta} anni) – IMC: ${item.imc} – ${item.valutazione}`;
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Cancella';
        //rimuove dallo storico
        delBtn.setAttribute('data-index', idx);
        delBtn.addEventListener('click', () => {
            storicoIMC.splice(idx, 1);               
            localStorage.setItem('storicoIMC', JSON.stringify(storicoIMC));
            aggiornaStoricoUI();
        });
        li.appendChild(textSpan);
        li.appendChild(delBtn);
        listaUl.appendChild(li);
    });
    if (contatore) contatore.innerText = `${storicoIMC.length} misurazioni salvate`;
}

// gestione IMC 
document.getElementById('formIMC')?.addEventListener('submit', (e) => {
    e.preventDefault(); 
    
    const nome = document.getElementById('nomeIMC').value.trim();
    const eta = parseInt(document.getElementById('etaIMC').value);
    const altezzaCm = parseFloat(document.getElementById('altezzaIMC').value);
    const peso = parseFloat(document.getElementById('pesoIMC').value);
    const risultatoDiv = document.getElementById('risultatoIMC');

    // controlli di validità 
    const regexNome = /^[A-Za-z\s]{2,50}$/; 
    let errore = false;
    let messaggioErrore = '';
    if (!regexNome.test(nome)) {
        errore = true;
        messaggioErrore += 'Il nome deve contenere solo lettere (spazi consentiti) e almeno 2 caratteri.\n';
    }

    if (isNaN(eta) || eta < 1 || eta > 120) {
        errore = true;
        messaggioErrore += 'Inserire un\'età valida tra 1 e 120 anni.\n';
    }

    if (isNaN(altezzaCm) || altezzaCm < 50 || altezzaCm > 250) {
        errore = true;
        messaggioErrore += 'L\'altezza deve essere compresa tra 50 cm e 250 cm.\n';
    }

    if (isNaN(peso) || peso < 10 || peso > 300) {
        errore = true;
        messaggioErrore += 'Il peso deve essere compreso tra 10 kg e 300 kg.\n';
    }
    
    if (errore) {
        risultatoDiv.style.display = 'block';
        risultatoDiv.innerHTML = `ATTENZIONE: Dati non validi:<br>${messaggioErrore.replace(/\n/g, '<br>')}`;  
        return;
    }

    // calcola IMC
    const imc = CalcolatoreSalute.calcolaIMC(peso, altezzaCm);
    const valutazione = CalcolatoreSalute.valutaIMC(imc);
    // Mostra il risultato
    risultatoDiv.style.display = 'block';
    risultatoDiv.innerHTML = `<strong>${nome}</strong> (${eta} anni) – IMC = <strong>${imc}</strong> – ${valutazione}.`;
    // aggiunge allo storico
    storicoIMC.unshift({
        data: new Date().toLocaleDateString('it-IT'), //stringa con DD/MM/YYYY
        nome: nome,
        eta: eta,
        imc: imc,
        valutazione: valutazione
    });
    // per mantenere solo gli ultimi 10 elementi
    if (storicoIMC.length > 10) storicoIMC.pop();
    // salvataggio su localStorage e aggiornamento interfaccia
    localStorage.setItem('storicoIMC', JSON.stringify(storicoIMC));
    aggiornaStoricoUI();
});

// gestione pulisci storico
document.getElementById('btnPulisciStorico')?.addEventListener('click', () => {
    storicoIMC = [];
    localStorage.setItem('storicoIMC', JSON.stringify(storicoIMC));
    aggiornaStoricoUI();
});

// gestione fabbisogno 
document.getElementById('formFabbisogno')?.addEventListener('submit', (e) => {
    e.preventDefault(); 
    
    const eta = parseFloat(document.getElementById('etaFB').value);
    const altezza = parseFloat(document.getElementById('altezzaFB').value);
    const peso = parseFloat(document.getElementById('pesoFB').value);
    const sessoElem = document.querySelector('input[name="sesso"]:checked');
    const sesso = sessoElem ? sessoElem.value : 'uomo';
    const livello = parseFloat(document.getElementById('livelloAttivita').value);
    const risultatoDiv = document.getElementById('risultatoFabbisogno');

    let errore = false;
    let messaggioErrore = '';

    // controlli di validita
    if (!sesso) {
        errore = true;
        messaggioErrore += '• Selezionare un sesso (Uomo/Donna).\n';
    }

    if (isNaN(eta) || eta < 1 || eta > 120) {
        errore = true;
        messaggioErrore += 'Inserire un\'età valida tra 1 e 120 anni.\n';
    }

    if (isNaN(altezza) || altezza < 50 || altezza > 250) {
        errore = true;
        messaggioErrore += 'L\'altezza deve essere compresa tra 50 cm e 250 cm.\n';
    }

    if (isNaN(peso) || peso < 10 || peso > 300) {
        errore = true;
        messaggioErrore += 'Il peso deve essere compreso tra 10 kg e 300 kg.\n';
    }

    if (errore) {
        risultatoDiv.style.display = 'block';
        risultatoDiv.innerHTML = `ATTENZIONE: Dati non validi:<br>${messaggioErrore.replace(/\n/g, '<br>')}`;
        return;
    }

    // calcola fabbisogno calorico
    const fabbisogno = CalcolatoreSalute.calcolaFabbisogno(sesso, peso, altezza, eta, livello);
    // Mostra il risultato
    risultatoDiv.style.display = 'block';
    risultatoDiv.innerHTML = `Il tuo fabbisogno calorico giornaliero è <strong>${fabbisogno} kcal</strong>.`;
});


//variabili globali per il timer
let timerInterval = null;
let secondiRimanenti = 0;

function aggiornaTimerDisplay() {
    const display = document.getElementById('timerDisplay');
    if (display) {
        const min = Math.floor(secondiRimanenti / 60);
        const sec = secondiRimanenti % 60;
        display.innerText = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    }
}
// gestione timer (?. per evitare errori se l'elemento non esiste)
document.getElementById('btnAvviaTimer')?.addEventListener('click', () => {
    const msg = document.getElementById('timerMessaggio');
    let minuti = parseInt(document.getElementById('timerMinuti').value);
    
    // controlli di validita
    if (isNaN(minuti) || minuti < 1) minuti = 5; 
    //nasconde i messaggi vecchi del div se msg esiste
    if (msg) msg.style.display = 'none';
    //se ce un timer gia in esecuzione lo interrompe
    if (timerInterval) clearInterval(timerInterval);

    secondiRimanenti = minuti * 60;
    aggiornaTimerDisplay();
    //avvia un conto alla rovescia setInterval( ... , 1000); – esegue la funzione interna ogni secondo
    timerInterval = setInterval(() => {
        if (secondiRimanenti <= 1) {
            clearInterval(timerInterval);
            timerInterval = null;
            document.getElementById('timerDisplay').innerText = '00:00';
            if (msg) {
                msg.style.display = 'block';
                msg.innerText = 'Tempo scaduto! Ottimo lavoro!';
            }
        } else {
            secondiRimanenti--;
            aggiornaTimerDisplay();
        }
    }, 1000); //la funzione viene eseguita ogni sec (1 sec è composto da 1000 millisec)
});

document.getElementById('btnFermaTimer')?.addEventListener('click', () => {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
});

document.getElementById('btnReimpostaTimer')?.addEventListener('click', () => {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
    //se non e 'un numero valido, imposta i minuti = 5
    let minuti = parseInt(document.getElementById('timerMinuti').value) || 5;
    secondiRimanenti = minuti * 60;
    aggiornaTimerDisplay();
    document.getElementById('timerMessaggio').style.display = 'none';
}); //? FINE cernenchii


//array per le attivita
let attivitaLista = JSON.parse(localStorage.getItem('diarioAttivita')) || [];

function aggiornaDiarioUI() {
    const ul = document.getElementById('listaAttivita');
    if (!ul) return;
    // svuota la lista 
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }
    if (attivitaLista.length === 0) {
        const emptyLi = document.createElement('li');
        emptyLi.style.opacity = '0.7';
        emptyLi.appendChild(document.createTextNode('Nessuna attività registrata.'));
        ul.appendChild(emptyLi);
        return;
    }
    attivitaLista.forEach((att, idx) => {
        const li = document.createElement('li');
        const textSpan = document.createElement('span');
        textSpan.textContent = att;
        const delBtn = document.createElement('button');
        delBtn.textContent = '✖️';
        delBtn.style.background = 'none';
        delBtn.style.border = 'none';
        delBtn.style.cursor = 'pointer';
        delBtn.style.marginLeft = '12px';
        //rimuove dalla lista
        delBtn.setAttribute('data-remove', idx);
        delBtn.addEventListener('click', () => {
            attivitaLista.splice(idx, 1);
            localStorage.setItem('diarioAttivita', JSON.stringify(attivitaLista));
            aggiornaDiarioUI();
        });

        li.appendChild(textSpan);
        li.appendChild(delBtn);
        ul.appendChild(li);
    });
}

// aggiungere attività 
document.getElementById('formDiario')?.addEventListener('submit', (e) => {
    e.preventDefault(); 
    
    const inputField = document.getElementById('inputAttivita');
    const nuova = inputField.value.trim();
    if (nuova === "") return; 
    attivitaLista.push(nuova);
    localStorage.setItem('diarioAttivita', JSON.stringify(attivitaLista));
    aggiornaDiarioUI();
    inputField.value = "";  
}); 


// consiglio del giorno 
async function fetchConsiglio() {
    const container = document.getElementById('quoteContainer');
    container.innerHTML = 'Caricamento in corso...';
    try {
        const response = await fetch("https://api.adviceslip.com/advice", {
            cache: 'no-cache'   // evita la cache del browser 
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        const consiglio = data.slip.advice;
        container.innerHTML = `<span style="font-size: 1.2rem;"> ${consiglio}</span>`;
    } catch (error) {
        console.error('Fetch fallito:', error);
        // per garantire funzionalità anche senza rete
        const fallbackConsigli = [
            "Bevi un bicchiere d'acqua appena sveglio.",
            "Fai 5 minuti di respirazione profonda oggi.",
            "Una passeggiata di 10 minuti migliora l'umore.",
            "Dormire 7-8 ore rigenera corpo e mente.",
            "Ascolta il tuo corpo: riposati quando serve."
        ];
        const random = Math.floor(Math.random() * fallbackConsigli.length);
        container.innerHTML = `
            <span style="font-size: 1.2rem;"> ${fallbackConsigli[random]}</span>
            <span style="display: block; font-size: 0.8rem; margin-top: 8px;">(consiglio offline)</span>
        `;
    }
}

// inizializzazione
document.addEventListener('DOMContentLoaded', () => {
    fetchConsiglio();
    aggiornaStoricoUI();
    aggiornaDiarioUI();
    secondiRimanenti = (parseInt(document.getElementById('timerMinuti')?.value) || 5) * 60;
    aggiornaTimerDisplay();
});

// pulsante per nuovo consiglio
document.getElementById('btnNuovoConsiglio')?.addEventListener('click', fetchConsiglio); //?cernenchii

//tema dinamico
const themeBtn = document.getElementById('toggleThemeBtn');
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
}
themeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    document.body.classList.toggle('light-mode'); //alterna il tema
    const isLight = document.body.classList.contains('light-mode'); //tema chiaro = true, tema scuro = false
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
});