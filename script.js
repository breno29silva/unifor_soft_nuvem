Parse.serverURL = 'https://parseapi.back4app.com'; // This is your Server URL
// Remember to inform BOTH the Back4App Application ID AND the JavaScript KEY
Parse.initialize(
  'DTLoiWzUtIYPysxVYHODEQ1uykksCoQSyXSMRlDT', // This is your Application ID
  'wtIAXkH6W3oRqINGTHNCm5PB3eRZUvOh5mi92Xwl' // This is your Javascript key
);

const modal = document.querySelector('.modal-container')
const modalTask = document.querySelector('.modal-tasks-container')
const tbody = document.querySelector('tbody')
const userName = document.querySelector('#name')
const userSetor = document.querySelector('#setor')
const userLastName = document.querySelector('#lastName')
const userFunc = document.querySelector('#func')
const userTasks = document.querySelector('#tasks')
const btnSalvar = document.querySelector('#btnSalvar')
const btnAdd = document.querySelector('#btnAdd')


let itens
let id

function openModal(edit = false, index = 0) {
  modal.classList.add('active')

  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active')
    }
  }

  if (edit) {
    userName.value = itens[index].name
    userLastName.value = itens[index].lastName
    userSetor.value = itens[index].Setor
    userFunc.value = itens[index].func
    id = index
  } else {
    userName.value = ''
    userLastName.value = ''
    userSetor.value = ''
    userFunc.value = ''
    
  }

}
function openTaskModal(index = 0) {
  modalTask.classList.add('active')

  modalTask.onclick = e => {
    if (e.target.className.indexOf('modal-tasks-container') !== -1) {
      modalTask.classList.remove('active')
    }
  }

  userTasks.value = ""
  id = index

}

function editItem(index) {

  openModal(true, index)
}

function deleteItem(index) {
  itens.splice(index, 1)
  setItensBD()
  loadItens()
}

function insertItem(item, index) {
  let tr = document.createElement('tr')

  tr.innerHTML = `
    <td>${item.name}</td>
    <td>${item.lastName}</td>
    <td>${item.setor}</td>
    <td>${item.func}</td>
    ${item.tasks.length > 0 ? `<td>${item.tasks?.join(", ")}.</td>` : "<td></td>"}
    <td class="acao">
      <button onclick="editItem(${index})"><i class='bx bx-edit' ></i></button>
      <button onclick="openTaskModal(${index})"><i class='bx bx-task'></i></button>
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `
  tbody.appendChild(tr)
}

btnAdd.onclick = e => {
  if (userTasks.value === "" ) {
    return
  }

  e.preventDefault();
  itens[id].tasks.push(userTasks.value);

  setItensBD();
  modalTask.classList.remove('active')
  loadItens();
  id = undefined;
}

btnSalvar.onclick = e => {
  if (userName.value == '' || userLastName.value == '' || userFunc.value == '') {
    return
  }

  e.preventDefault();

  if (id !== undefined) {
    itens[id].name = userName.value
    itens[id].lastName = userLastName.value
    itens[id].setor = userSetor.value
    itens[id].func = userFunc.value
  } else {
    itens.push({ 'name': userName.value, 'lastName': userLastName.value, 'setor': userSetor.value, 'func': userFunc.value, 'tasks': [] })
  }

  setItensBD()

  modal.classList.remove('active')
  loadItens()
  id = undefined
}

function loadItens() {
  itens = getItensBD()

  console.log(itens)

  tbody.innerHTML = ''
  itens.forEach((item, index) => {
    insertItem(item, index)
  })

}

const getItensBD = () => JSON.parse(localStorage.getItem('unifor')) ?? []
const setItensBD = () => localStorage.setItem('unifor', JSON.stringify(itens))

loadItens()

const lista = async () => {
  const cadastro = Parse.Object.extend('cadastro');
  const query = new Parse.Query(cadastro);
  try {
    const results = await query.find();
    vetortarefas = results;
    gerarLista();
  } catch (error) {
    console.error('Error while fetching Tarefa', error);
  }
};

const inserir = async () => {
  const myNewObject = new Parse.Object('');
  myNewObject.set('descricao', inputdescricao.value);
  myNewObject.set('concluida', false);
  inputdescricao.value = "";
  inputdescricao.focus();
  try {
    const result = await myNewObject.save();
    console.log('Tarefa created', result);
    lista();
  } catch (error) {
    console.error('Error while creating Tarefa: ', error);
  }
};

const removertarefa = async (evt2, tarefa) => {
  tarefa.set(evt2.target.remove);
  try {
    const response = await tarefa.destroy();
    console.log('Delet ParseObject', response);
    lista();
  } catch (error) {
    console.error('Error while updating Tarefa', error);
  }
};

const checktarefa = async (evt, tarefa, txt) => {
  tarefa.set('concluida', evt.target.checked);
  try {
    const response = await tarefa.save();
    console.log(response.get('concluida'));
    console.log('Tarefa updated', response)
  } catch (error) {
    console.error('Error while updating Tarefa', error);
  }
};