const apiUrl = "http://localhost:5096/api/Notlar";
const liste = document.getElementById("liste");
const baslik = document.getElementById("baslik");
const icerik = document.getElementById("icerik");
const kaydet = document.getElementById("kaydet");
const yeni = document.getElementById("yeni");
const sil = document.getElementById("sil");
const sag = document.getElementById("sag");
let seciliNot = null;
sag.hidden = true;

yeni.addEventListener("click", function () {
    axios.post(apiUrl, {
        baslik: 'Yeni Not',
        icerik: ''
    })
        .then(function (response) {
            listele();
            notGetir(response.data)
        })
        .catch(function (error) {
            console.log(error);
        });

})

kaydet.addEventListener("click", function () {
    let activeItem = document.querySelector(".active");
    let not;
    axios.get(apiUrl + "/" + activeItem.id).then(res => {
        not = res.data;
    })
    axios({
        method: 'put',
        url: apiUrl + "/" + activeItem.id,
        data: {
            id: activeItem.id,
            baslik: baslik.value,
            icerik: icerik.value
        }
    });
    listele();
})

function listele() {
    liste.innerHTML = "";
    axios.get(apiUrl).then(res => {
        res.data.forEach(not => {
            let li = document.createElement("li");
            li.className += "list-group-item";
            li.textContent = not.baslik;
            li.id = not.id;
            li.onclick = (e) => notGetir(not);
            liste.appendChild(li);
        });
    })
}

listele();

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