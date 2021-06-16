const BEVERAGE = 'beverage';
const FOOD = 'food';
const DEFAULT = 'default';
const DEFAULT_PRODUCT_VALUE = 'Selecione o produto...';

const menu = [
  {
    id: 0,
    name: DEFAULT_PRODUCT_VALUE,
    value: '',
    type: DEFAULT,
  },

  {
    id: 1,
    name: 'Chop 300ml',
    value: 'chop300',
    type: BEVERAGE,
  },
  {
    id: 2,
    name: 'Milkshake',
    value: 'milkshake',
    type: BEVERAGE,
  },
  {
    id: 3,
    name: 'Hamburger',
    value: 'hamburguer',
    type: FOOD,
  },
  {
    id: 4,
    name: 'Pizza',
    value: 'pizza',
    type: FOOD,
  },
  {
    id: 5,
    name: 'Coca-cola 500ml',
    value: 'coca500',
    type: BEVERAGE,
  },
];

function getProductSelectElement() {
  return document.getElementById('produto');
}

function getProductQuantityElement() {
  return document.getElementById('produto_quantidade');
}

function appendOptionsToSelect(options, selectElement) {
  for (const option of options) {
    const optionElement = document.createElement('option');

    optionElement.value = option.value;
    optionElement.text = option.name;

    selectElement.appendChild(optionElement);
  }
}

function validateEnablingRuleForFields(rule = () => true, fields = []) {
  fields.forEach((field) => (field.disabled = !rule()));
}

function findProductsByTypeOrderByName(type) {
  const productList = menu
    .filter((product) => product.type === type)
    .sort((a, b) => a.name.localeCompare(b.name));
  return productList;
}

function filterProductListByTypeWithDefaultOption(type) {
  let products = findProductsByTypeOrderByName(type);

  if (type === DEFAULT) {
    return [...products];
  }
  return [menu[0], ...products];
}

function clearChildElementsOf(parentElement) {
  while (parentElement?.firstChild) {
    parentElement.removeChild(parentElement.firstChild);
  }
}

function productTypeHandler(event) {
  const productType = event?.target?.value;
  const productSelect = getProductSelectElement();
  const productQuantity = getProductQuantityElement();

  if (!productType || !productSelect) {
    return;
  }

  clearChildElementsOf(productSelect);

  const productOptions = filterProductListByTypeWithDefaultOption(productType);
  appendOptionsToSelect(productOptions, productSelect);

  const fields = [productSelect, productQuantity];
  validateEnablingRuleForFields(() => productOptions.length > 1, fields);
}
