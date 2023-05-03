import Pagination from 'tui-pagination';

const container = document.getElementById('tui-pagination-container');

let itemsPerPage = 20;

const createLibPagination = (renderFunc, array) => {
  const pagination = new Pagination(container, {
    totalItems: array.length,
    itemsPerPage: itemsPerPage,
    visiblePages: 7,
    page: 1,
    centerAlign: true,
    firstItemClassName: 'tui-first-child',
    lastItemClassName: 'tui-last-child',
    usageStatistics: false,
  });

  pagination.on('afterMove', e => {
    let currentPage = e.page;
    let paginatedArray = array.slice(
      itemsPerPage * (currentPage - 1),
      //   array.length - (array.length - itemsPerPage) + 1,
      itemsPerPage * (currentPage - 1) + itemsPerPage,
    );
    renderFunc(paginatedArray);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
};

const createHomePagination = renderFunc => {
  const pagination = new Pagination(container, {
    totalItems: 20000,
    itemsPerPage: itemsPerPage,
    visiblePages: 7,
    page: 1,
    centerAlign: true,
    firstItemClassName: 'tui-first-child',
    lastItemClassName: 'tui-last-child',
    usageStatistics: false,
  });

  pagination.on('afterMove', e => {
    let currentPage = e.page;
    renderFunc(currentPage);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
};
export { createLibPagination, createHomePagination };
