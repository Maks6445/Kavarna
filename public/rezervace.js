async function OdeslatData(){
  const data = {
    jmeno: document.getElementById('jmeno').value,
    email: document.getElementById('email').value,
    telefon: document.getElementById('telefon').value,
    pocet: parseInt(document.getElementById('pocet').value),
    datum: document.getElementById('datum').value,
    cas_od: document.getElementById('cas_od').value,
    cas_do: document.getElementById('cas_do').value,
  };
}


async function nactiRezervace() {
  const vystup = document.getElementById('vystupRezervaci');
  vystup.innerHTML = '<p>Načítání...</p>';

  try {
    const response = await fetch('/api/get');
    const data = await response.json();

    if (!data) {
      vystup.innerHTML = '<p>Žádné rezervace nenalezeny.</p>';
      return;
    }

    const rezervace = Object.entries(data);

    vystup.innerHTML = ''; // Vyčištění

    rezervace.forEach(([id, rez]) => {
      const div = document.createElement('div');
      div.classList.add('rezervace');
     div.innerHTML = `
        <p><strong>${rez.jmeno}</strong> (${rez.email})<br>
        ${rez.datum}, ${rez.cas_od} – ${rez.cas_do}<br>
        Počet osob: ${rez.pocet}<br>
        Telefon: ${rez.telefon}</p>

        <button onclick="smazatRezervaci('${id}')">Smazat</button>
        <button onclick="zobrazUpravitForm('${id}', ${JSON.stringify(rez).replace(/"/g, '&quot;')})">Upravit</button>
        <div id="uprava-${id}"></div>
     `;

      vystup.appendChild(div);
    });

  } catch (err) {
    console.error('Chyba při načítání:', err);
    vystup.innerHTML = '<p>Chyba při načítání rezervací.</p>';
  }
}

// Automatické načtení při otevření stránky
document.addEventListener('DOMContentLoaded', nactiRezervace);



async function smazatRezervaci(id) {
  if (!confirm('Opravdu chcete smazat tuto rezervaci?')) return;

  try {
    const response = await fetch('/api/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(id)
    });

    if (response.ok) {
      alert('Rezervace byla smazána.');
      nactiRezervace(); // aktualizace výpisu
    } else {
      alert('Nepodařilo se smazat rezervaci.');
    }
  } catch (err) {
    console.error('Chyba při mazání:', err);
    alert('Došlo k chybě při mazání.');
  }
}



function zobrazUpravitForm(id, data) {
  const formDiv = document.getElementById(`uprava-${id}`);
  formDiv.innerHTML = `
    <form onsubmit="ulozZmeny(event, '${id}')">
      <input name="jmeno" value="${data.jmeno}" required>
      <input name="email" value="${data.email}" required>
      <input name="telefon" value="${data.telefon}" required>
      <input name="pocet" type="number" value="${data.pocet}" required>
      <input name="datum" type="date" value="${data.datum}" required>
      <input name="cas_od" type="time" value="${data.cas_od}" required>
      <input name="cas_do" type="time" value="${data.cas_do}" required>
      <button type="submit">Uložit změny</button>
    </form>
  `;
}

async function ulozZmeny(e, id) {
  e.preventDefault();
  const form = e.target;

  const hodnoty = [
    form.jmeno.value,
    form.email.value,
    form.telefon.value,
    parseInt(form.pocet.value),
    form.datum.value,
    form.cas_od.value,
    form.cas_do.value
  ];

  const parametry = ['jmeno', 'email', 'telefon', 'pocet', 'datum', 'cas_od', 'cas_do'];

  try {
    const response = await fetch('/api/edit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idFirebase: id, parametry, hodnoty })
    });

    if (response.ok) {
      alert('Rezervace upravena.');
      nactiRezervace();
    } else {
      alert('Chyba při úpravě.');
    }
  } catch (err) {
    console.error(err);
    alert('Došlo k chybě.');
  }
}
