//
// For guidance on how to add JavaScript see:
// https://prototype-kit.service.gov.uk/docs/adding-css-javascript-and-images
//

window.GOVUKPrototypeKit.documentReady(() => {
  // Add JavaScript here
  const showHiddenContent = (event) => {
    const contentToHide = event.target.parentElement;
    contentToHide.style.display = 'none'

    const switchContentBlock = contentToHide.parentElement;

    const contentToShow = switchContentBlock.querySelector('.content-to-show');
    contentToShow.style.display = 'block'
  }

  const contentToHide = document.querySelectorAll('.switch-content a');
  contentToHide.forEach(content => content.addEventListener('click', showHiddenContent))
})