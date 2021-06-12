const BEVERAGE = 'beverage';
const FOOD = 'food';
const DEFAULT = 'default';
const DEFAULT_PRODUCT_VALUE = 'Selecione o produto...';

const menu = [
  {
    id: 0,
    name: DEFAULT_PRODUCT_VALUE,
    optionValue: '',
    type: DEFAULT,
  },

  {
    id: 1,
    name: 'Chop 300ml',
    optionValue: 'chop300',
    type: BEVERAGE,
  },
  {
    id: 2,
    name: 'Milkshake',
    optionValue: 'milkshake',
    type: BEVERAGE,
  },
  {
    id: 3,
    name: 'Hamburger',
    optionValue: 'hamburguer',
    type: FOOD,
  },
  {
    id: 4,
    name: 'Pizza',
    optionValue: 'pizza',
    type: FOOD,
  },
  {
    id: 5,
    name: 'Coca-cola 500ml',
    optionValue: 'coca500',
    type: BEVERAGE,
  },
];

function productTypeHandler(event) {
  const productType = event?.target?.value;

  if (productType && productType.trim() !== '') {
    clearProductSelectList();
    renderProductSelectList(productType);
  }
}

function renderProductSelectList(productType) {
  //TO-DO
}

function clearProductSelectList() {
  const productSelect = document.getElementById('produto');

  while (productSelect?.firstChild) {
    productSelect.removeChild(productSelect.firstChild);
  }
}
