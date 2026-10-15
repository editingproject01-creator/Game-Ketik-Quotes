// Array quote bahasa Indonesia yang bisa kamu edit/tambah sesuka hati
const LOCAL_QUOTES = [
  "Ketika cinta tidak diterima, Berpindahlah. Ketika cinta tidak dihargai, Menjauhlah. Semoga waktu akan mengajarkan apa itu Cinta Sejati yang sesungguhnya.",
  "Jika Allah mengizinkanmu berdoa untuk sesuatu, artinya Allah mengizinkanmu untuk mendapatkannya. Jadi ulangi terus doanya, ulangi terus usahanya, sampai Allah bilang, Ini Waktunya.",
  "Pendidikan adalah senjata paling mematikan untuk mengubah dunia.",
  "Jangan takut melangkah lambat, takutlah jika kamu hanya berdiri diam.",
  "Berdoa tanpa ada aksi nyata itu sama aja bohong, Rezeki itu harus dikejar bukan ditunggu.",
  "Kesuksesan berawal dari keputusan untuk mulai mencoba.",
  "Jangan bersedih. Apa pun yang hilang darimu akan kembali dalam bentuk yang lain.",
  "Bagaimana bisa aku menyalahkan angin atas kekacauan yang dibuatnya, jika akulah yang membuka jendelanya.",
  "Kegagalan hanyalah kesuksesan yang tertunda, teruslah berlatih.",
  "Cara terbaik untuk memprediksi masa depan adalah dengan menciptakannya.",
  "Fokus pada prosesnya, hasil akhir akan mengikuti usaha terbaikmu.",
  "Belajar koding butuh ketekunan dan latihan yang konsisten setiap hari.",
  "Jangan pernah menyerah pada impianmu, karena itu adalah cerminan dari dirimu sendiri.",
  "Kesalahan adalah guru terbaik, jangan takut untuk membuatnya.",
  "Kreativitas adalah kunci untuk menemukan solusi baru dalam dunia pemrograman.",
  "Semangat belajar akan membawamu ke puncak kesuksesan, teruslah berusaha.",
  "Setiap baris kode yang kamu tulis adalah langkah menuju penguasaan skill yang lebih tinggi.",
  "Jangan biarkan rasa takut menghalangimu untuk mencoba hal baru dalam dunia teknologi.",
  "Konsistensi dalam belajar adalah kunci untuk menjadi programmer yang handal.",
  "Jangan takut untuk bertanya dan belajar dari orang lain, itu adalah cara terbaik untuk berkembang.",
  "Ribuan wanita akan luluh di masa jayamu. Tapi ingat, hanya ada dua wanita yang ada di masa sulitmu, yaitu Ibumu dan Wanita yang memahami masa sulitmu.",
  "Selagi masih ada secercah harapan, pasti ada jalan."
];

const quoteDisplayElement = document.getElementById("quoteDisplay");
const quoteInputElement = document.getElementById("quoteInput");
const timerElement = document.getElementById("timer");

let startTime;
let timerInterval;

// Initialize Web Audio API Context
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Fungsi pembuat efek suara (beeps)
function playSound(type) {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  if (type === 'start') {
    // Suara saat Quote Baru Masuk (Pop ringkas)
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, audioCtx.currentTime); // Nada A4
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
  } else if (type === 'finish') {
    // Suara Fanfare/Menang saat Selesai Ketik (2 nada naik)
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // Nada C5
    osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // Nada E5
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.35);
  }
}

// Fungsi pengecekan input ketikan
function checkInput() {
  const arrayQuote = quoteDisplayElement.querySelectorAll("span");
  const inputValue = quoteInputElement.value;
  const arrayValue = inputValue.split("");

  let correct = true;
  
  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index];
    if (character == null) {
      characterSpan.classList.remove("correct");
      characterSpan.classList.remove("incorrect");
      correct = false;
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("incorrect");
    } else {
      characterSpan.classList.remove("correct");
      characterSpan.classList.add("incorrect");
      correct = false;
    }
  });

  // Jika semua karakter benar DAN panjang input sudah sama persis dengan quote
  if (correct && arrayValue.length === arrayQuote.length) {
    playSound('finish'); // Mainkan suara selesai
    setTimeout(() => {
      renderNewQuote();
    }, 300); // Beri jeda sebentar sebelum quote baru muncul
  }
}

// Event listener untuk input standar dan event composition (khusus iOS/keyboard prediksi)
quoteInputElement.addEventListener("input", checkInput);
quoteInputElement.addEventListener("compositionend", checkInput);

// Ambil quote acak dari array LOCAL_QUOTES
function getRandomQuote() {
  const randomIndex = Math.floor(Math.random() * LOCAL_QUOTES.length);
  return LOCAL_QUOTES[randomIndex];
}

// Render quote baru ke tampilan
function renderNewQuote() {
  playSound('start'); // Mainkan suara saat quote baru muncul

  const quote = getRandomQuote();
  quoteDisplayElement.innerHTML = "";
  
  // Bungkus setiap karakter dengan <span>
  quote.split("").forEach((character) => {
    const characterSpan = document.createElement("span");
    characterSpan.innerText = character;
    quoteDisplayElement.appendChild(characterSpan);
  });

  quoteInputElement.value = null;
  startTimer();
}

// Jalankan & Reset Timer
function startTimer() {
  timerElement.innerText = 0;
  startTime = new Date();
  
  if (timerInterval) clearInterval(timerInterval);
  
  timerInterval = setInterval(() => {
    timerElement.innerText = getTimerTime();
  }, 1000);
}

function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000);
}

// Jalankan pertama kali saat halaman dibuka
renderNewQuote();
