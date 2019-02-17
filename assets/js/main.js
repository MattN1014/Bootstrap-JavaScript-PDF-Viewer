//Set desitnation of PDF
const url = '../docs/pdf.pdf';

//Set Global variables
let pdfDoc = null,
    pageNum = 1,
    pageIsRendering = false,
    pageNumIsPending = null;


const scale = 1.5,
    canvas = document.querySelector('#pdf-render'),
    ctx = canvas.getContext('2d');

//Render the page
const renderPage = num => {
    //Let know state of page rendering
    pageIsRendering = true;

    //get page
    pdfDoc.getPage(num).then(page => {
        //set scale
        const viewport = page.getViewport({ scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;  

        const renderCtx = {
            canvasContext: ctx,
            viewport
        }

        page.render(renderCtx).promise.then(() => {
            //page is done rendering
            pageIsRendering = false;

            if(pageNumisPending !== null) {
                renderPage(pageNumIsPending);
                pageNumIsPending = null;
            }
        });

        //Output current page num
        document.querySelector('#page-num').textContent = num;
    });
};

//Check for pages rendering
const queueRenderPage = num => {
    if(pageIsRendering){
        pageNumIsPending = num;
    }
    else {
        renderPage(num);
    }
}

// Show Prev Page
const showPrevPage = () => {
    if(pageNum <= 1) {
        return;
    }
    pageNum--;
    queueRenderPage(pageNum);
}

// Show Next Page
const showNextPage = () => {
    if(pageNum >= pdfDoc.numPages){
        return;
    }
    pageNum++;
    queueRenderPage(pageNum);
}

//Get the document
pdfjsLib
  .getDocument(url)
  .promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_;

    document.querySelector('#page-count').textContent = pdfDoc.numPages;

    renderPage(pageNum);
  });

//Button events
document.querySelector('#prev-page').addEventListener('click', showPrevPage);
document.querySelector('#next-page').addEventListener('click', showNextPage);