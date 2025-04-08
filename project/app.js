// Web3 setup
let web3;
let contract;
const contractAddress = '0x7b7a0A9BC73231490d3C7C8bebe7673C0Cf5211c'; // Адрес контракта
const contractABI = [ /* Вставь сюда свой ABI */ ];

window.addEventListener('load', async () => {
  if (typeof window.ethereum !== 'undefined') {
    web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.enable(); // Запрос доступа к кошельку
      contract = new web3.eth.Contract(contractABI, contractAddress);
      console.log('Web3 подключен');
    } catch (error) {
      console.error('User denied account access');
    }
  } else {
    alert('MetaMask не установлен');
  }
});

// Функция для сохранения данных
document.getElementById('save-btn').addEventListener('click', async () => {
  const data = document.getElementById('data-input').value;
  const category = document.getElementById('category-input').value;

  if (!data || !category) {
    alert('Пожалуйста, заполните все поля');
    return;
  }

  const accounts = await web3.eth.getAccounts();
  const sender = accounts[0];

  try {
    await contract.methods.saveData(data, category).send({ from: sender });
    alert('Данные успешно сохранены');
    document.getElementById('data-input').value = '';
    document.getElementById('category-input').value = '';
  } catch (error) {
    console.error('Ошибка при сохранении данных:', error);
  }
});

// Функция для загрузки данных
document.getElementById('load-data-btn').addEventListener('click', async () => {
  try {
    const data = await contract.methods.getAllData().call();
    const dataList = document.getElementById('data-list');
    dataList.innerHTML = ''; // Очистить текущие данные

    data.forEach(item => {
      const listItem = document.createElement('li');
      listItem.textContent = `Data: ${item.data}, Category: ${item.category}, Sender: ${item.sender}`;
      dataList.appendChild(listItem);
    });
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
  }
});
