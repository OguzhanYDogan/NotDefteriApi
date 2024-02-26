const apiUrl = "http://localhost:5096/api/Notlar";
const liste = document.getElementById("liste");
const baslik = document.getElementById("baslik");
const icerik = document.getElementById("icerik");
const yeni = document.getElementById("yeni");
const sil = document.getElementById("sil");
const sag = document.getElementById("sag");
const frmNot = document.getElementById("frmNot");
let seciliNot = null;
sag.hidden = true;

function notlariCek() {
    axios.get(apiUrl).then(res => {
        notlar = res.data;
        notlariListele();
    });
}

function notlariListele() {
    liste.innerHTML = "";
    notlar.forEach(not => {
        let li = document.createElement("li");
        li.className += "list-group-item";
        li.textContent = not.baslik;
        li.id = not.id;
        li.onclick = (e) => notGetir(not);
        liste.appendChild(li);
    });
}

function notGetir(not) {
    seciliNot = not;
    sag.hidden = false;
    baslik.value = not.baslik;
    icerik.value = not.icerik;
    secimiGuncelle();
}

function secimiGuncelle() {
    liste.childNodes.forEach(el => {
        if (el.id == seciliNot?.id) {
            el.classList.add("active");
        }
        else {
            el.classList.remove("active");
        }
    });

}

yeni.addEventListener("click", function () {
    axios.post(apiUrl, {
        baslik: 'Yeni Not',
        icerik: ''
    })
        .then(function (response) {
            notlar.push(response.data);
            notlariListele();
            notGetir(response.data);
        })
        .catch(function (error) {
            alert(error);
        });

})

frmNot.onsubmit = (e) => {
    e.preventDefault();
    let not = {
        id: seciliNot.id,
        baslik: baslik.value,
        icerik: icerik.value
    };

    axios.put(apiUrl + "/" + not.id, not).then(res => {
        seciliNot.baslik = baslik.value;
        seciliNot.icerik = icerik.value;
        notlariListele();
        notGetir(not);
    });
};

sil.onclick = (e) => {
    axios.delete(apiUrl + "/" + seciliNot.id).then(res => {
        let seciliIndex = notlar.indexOf(seciliNot);
        notlar.splice(seciliIndex, 1);
        notlariListele();
        sag.hidden = true;
        // Gösterecek not kalmadığında sağ taraf gizli kalacak. Not varsa silinenin olduğu yerdeki not seçili olacak, son eleman silindiyse de bir üstündeki seçili olacak.
        if (notlar.length)
            notGetir(notlar[Math.min(seciliIndex, notlar.length - 1)]);
    });
}

notlariCek();