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

function getProductSelectElement() {
  return document.getElementById('produto');
}

function getProductQuantityElement() {
  return document.getElementById('produto_quantidade');
}

function renderProductSelectList(productType) {
  const productSelect = getProductSelectElement();
  const produtoQuantidade = getProductQuantityElement();

  if (!productSelect) {
    return;
  }

  const productList = menu
    .filter((product) => product.type === productType)
    .sort((a, b) => a.name.localeCompare(b.name));

  let products = [];
  if (productType === DEFAULT) {
    products = [...productList];
  } else {
    products = [menu[0], ...productList];
  }

  for (const product of products) {
    const option = document.createElement('option');

    option.value = product.optionValue;
    option.text = product.name;

    productSelect.appendChild(option);
  }

  productSelect.disabled = products.length <= 1;
  produtoQuantidade.disabled = products.length <= 1;
}

function clearProductSelectList() {
  const productSelect = document.getElementById('produto');

  while (productSelect?.firstChild) {
    productSelect.removeChild(productSelect.firstChild);
  }
}
