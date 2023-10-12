console.log('load more script');

class LoadMore extends HTMLElement {
  constructor() {
    super();
  }

  handleButtonClick(event) {
    event.preventDefault();

    const searchParams = LoadMore.getSearchParams();

    LoadMore.renderPage(searchParams, event);
  }

  connectedCallback() {
    this.querySelector('a').addEventListener('click', this.handleButtonClick);
  }

  static getSearchParams() {
    const currentSearchParams = new URLSearchParams(window.location.search);

    const currentPage = currentSearchParams.get('page');

    const newPage = currentPage ? Number(currentPage) + 1 : 2;

    currentSearchParams.set('page', newPage);

    return currentSearchParams.toString();
  }

  static renderPage(searchParams, event, updateURLHash = true) {
    LoadMore.searchParamsPrev = searchParams;
    const sections = LoadMore.getSections();
    document.getElementById('ProductGridContainer').querySelector('.collection').classList.add('loading');

    sections.forEach((section) => {
      const url = `${window.location.pathname}?section_id=${section.section}&${searchParams}`;
      const cacheDataUrl = (element) => element.url === url;

      /** TODO: Add caching */
      LoadMore.renderSectionFromFetch(url, event);
    });

    document.getElementById('ProductGridContainer').querySelector('.collection').classList.remove('loading');

    if (updateURLHash) LoadMore.updateURLHash(searchParams);
  }

  static updateURLHash(searchParams) {
    history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`);
  }

  static getSections() {
    return [
      {
        section: document.getElementById('product-grid').dataset.id,
      },
    ];
  }

  static renderSectionFromFetch(url, event) {
    fetch(url)
      .then((response) => response.text())
      .then((responseText) => {
        const html = responseText;
        LoadMore.cacheData = [...LoadMore.cacheData, { html, url }];
        LoadMore.renderProductGridContainer(html);
        if (typeof initializeScrollAnimationTrigger === 'function') initializeScrollAnimationTrigger(html.innerHTML);
      });
  }

  /** Append product grid */
  static renderProductGridContainer(html) {
    document.getElementById('product-grid').innerHTML += new DOMParser()
      .parseFromString(html, 'text/html')
      .getElementById('product-grid').innerHTML;

    document.getElementById('LoadMoreContainer').innerHTML = new DOMParser()
      .parseFromString(html, 'text/html')
      .getElementById('LoadMoreContainer').innerHTML;

    document
      .getElementById('ProductGridContainer')
      .querySelectorAll('.scroll-trigger')
      .forEach((element) => {
        element.classList.add('scroll-trigger--cancel');
      });
  }
}

LoadMore.cacheData = [];
LoadMore.searchParamsInitial = window.location.search.slice(1);
LoadMore.searchParamsPrev = window.location.search.slice(1);

customElements.define('load-more', LoadMore);
