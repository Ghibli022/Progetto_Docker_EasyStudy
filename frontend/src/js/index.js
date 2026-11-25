const arrayPhrases = [
    ["Ogni giorno è un nuovo giorno. Una nuova opportunità. Una nuova possibilità", "Amel Cehic"],
    ["Non devi essere il migliore oggi, devi solo essere migliore di ieri", "Jan Vidal"],
    ["Anche il passo più piccolo ti porta più lontano di quanto immagini", "Amel Cehic"],
    ["Sbagliare non significa fallire, significa avere il coraggio di imparare", "Jan Vidal"],
    ["Il tuo futuro non si costruisce in un giorno, ma con le scelte di ogni giorno", "Amel Cehic"],
    ["La vera forza è continuare a provarci anche quando nessuno vede i tuoi sforzi", "Jan Vidal"],
    ["Ogni domanda che fai è una porta che apri verso qualcosa di nuovo", "Amel Cehic"],
    ["Non confrontare il tuo percorso con quello degli altri: ognuno ha il proprio ritmo", "Jan Vidal"],
    ["La conoscenza cresce quando la condividi, non quando la tieni per te", "Amel Cehic"],
    ["Non serve avere tutte le risposte per iniziare, basta avere voglia di scoprire", "Jan Vidal"],
    ["Un gesto gentile può trasformare una giornata e lasciare un ricordo per sempre", "Amel Cehic"],
    ["La costanza trasforma i piccoli sforzi in grandi risultati", "Jan Vidal"],
    ["A scuola impari le materie, ma ogni giorno impari anche qualcosa su te stesso", "Amel Cehic"],
    ["Il talento apre una porta, la determinazione ti aiuta a percorrere la strada", "Jan Vidal"],
    ["Le idee più belle nascono quando abbiamo il coraggio di pensare diversamente", "Amel Cehic"],
    ["Non lasciare che una giornata difficile ti faccia dimenticare quanto vali", "Jan Vidal"],
    ["Insieme possiamo trasformare le differenze in occasioni per crescere", "Amel Cehic"],
    ["Ogni obiettivo sembra lontano finché non inizi a raggiungerlo un passo alla volta", "Jan Vidal"],
    ["Il successo non è arrivare prima degli altri, ma non smettere di credere nel proprio percorso", "Amel Cehic"],
    ["Il domani appartiene a chi oggi trova il coraggio di fare un primo tentativo", "Jan Vidal"],
    ["Un giorno ti guarderai indietro e capirai che non erano i giorni perfetti a renderti più forte, ma tutte quelle volte in cui volevi mollare e hai scelto di provarci ancora. Perché la persona che diventerai dipende anche dal coraggio che trovi oggi, quando nessuno ti sta guardando.","Amel Cehic"]
];

const phrase = document.getElementById("phrase-of-the-day");

document.addEventListener("DOMContentLoaded", (event) => {
    generaFrase();    
});


function generaFrase(){
    let selected = Math.floor(Math.random() * arrayPhrases.length)
    let phraseInArray = arrayPhrases[selected];

    phrase.innerHTML = `
        <em>"${phraseInArray[0]}"</em>, ${phraseInArray[1]}
    `;
}