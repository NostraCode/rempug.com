const url = '../assets/rempug.pdf';



let pdfDoc = null,
  pageNum = 1,
  pageIsRendering = false,
  pageNumIsPending = null;

const scale = 1.5,
  canvas = document.querySelector('#pdf-render'),
  ctx = canvas.getContext('2d');

// Render the page
const renderPage = num => {
  pageIsRendering = true;
  // Get page
  pdfDoc.getPage(num).then(page => {
    // Set scale
    const viewport = page.getViewport({ scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const renderCtx = {
      canvasContext: ctx,
      viewport
    };
    page.render(renderCtx).promise.then(() => {
      pageIsRendering = false;
      if (pageNumIsPending !== null) {
        renderPage(pageNumIsPending);
        pageNumIsPending = null;
      }
    });
    // Output current page
    document.querySelector('#page-num').textContent = num;
  });
};

// Check for pages rendering
const queueRenderPage = num => {
  if (pageIsRendering) {
    pageNumIsPending = num;
  } else {
    renderPage(num);
  }
};

// Show Prev Page
const showPrevPage = () => {
  if (pageNum <= 1) {
    return;
  }
  pageNum--;
  queueRenderPage(pageNum);
};

// Show Next Page
const showNextPage = () => {
  if (pageNum >= pdfDoc.numPages) {
    return;
  }
  pageNum++;
  queueRenderPage(pageNum);
};

// Send WA Message
const sendWaMessage = () => {
  window.open(`https://wa.me/+6285179647948?text=Saya%20mendukung%20pergerakan%20ini%20dan%20siap%20mencoblos%20utusan%20kita.`, '_blank');
};

// Get Document
pdfjsLib
  .getDocument(url)
  .promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_;
    document.querySelector('#page-count').textContent = pdfDoc.numPages;
    renderPage(pageNum);
  })
  .catch(err => {
    // Display error
    const div = document.createElement('div');
    div.className = 'error';
    div.appendChild(document.createTextNode(err.message));
    document.querySelector('body').insertBefore(div, canvas);
    // Remove top bar
    document.querySelector('.top-bar').style.display = 'none';
  });

// Button Events
document.querySelector('#prev-page').addEventListener('click', showPrevPage);
document.querySelector('#next-page').addEventListener('click', showNextPage);
document.querySelector('#whatsapp').addEventListener('click', sendWaMessage);


//! START of => view counters with realtime database

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCh3s7zWoG5GQr0szw8hhSqiNTgIEIx3MI",
  authDomain: "rempugx.firebaseapp.com",
  databaseURL: "https://rempugx-default-rtdb.firebaseio.com",
  projectId: "rempugx",
  storageBucket: "rempugx.appspot.com",
  messagingSenderId: "157369730535",
  appId: "1:157369730535:web:fb22e1f379624e819c2942",
  measurementId: "G-EPEPRGKWBE"
};

firebase.initializeApp(firebaseConfig);

const hitCounter = document.getElementById("hit-counter");
const hitCounterContainer = document.getElementById("hit-counter-container");
hitCounterContainer.style.display = "none";
hitCounter.style.display = "none";

const db = firebase.database().ref("totalHits");

db.on("value", (snapshot) => {
  hitCounter.textContent = snapshot.val();  
});

db.transaction(
  (totalHits) => totalHits + 1,
  (error) => {
    if (error) {
      console.log(error);
    } else {
      hitCounterContainer.style.display = "flex";
      hitCounter.style.display = "inline-block";
    }
  }
);

//! END of => view counters with realtime database
