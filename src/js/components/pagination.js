import Pagination from 'tui-pagination';

const container = document.getElementById('pagination');

const pagination = new Pagination(container, {
  // Total number of items
  totalItems: 20000,
  // Items per page
  itemsPerPage: 20,
  // Visible pages
  visiblePages: 10,
  // Current page
  page: 1,
  // center aligned
  centerAlign: false,
  // default classes
  firstItemClassName: 'tui-first-child',
  lastItemClassName: 'tui-last-child',
  // enable usage statistics
  usageStatistics: false,
});

pagination.on('afterMove', e => {
  let currentPage = e.page;
  console.log(currentPage);
});

export default pagination;
