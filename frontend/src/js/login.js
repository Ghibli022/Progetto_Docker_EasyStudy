const loginForm = document.querySelector('#form');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    //Take inputs
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    try{
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email,password})
        });

        const data = await response.json();

        if(response.ok){
            alert('Login effettuato con successo');

            windows.location.href = '/index.html';
        } else{
            alert(data.error || 'Errore durante il login');
        }
    }
    catch(error){
        console.error('Errore di connessione', error);
        alert('Impossibile connettersi al server.');
    }
});
