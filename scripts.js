/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = 'http://127.0.0.1:5000/alunos';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.alunos.forEach(item => insertList(item.nome, item.data_nascimento, item.sexo, item.nome_responsavel))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getList()


/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (inputName, inputBirth, inputGender, inputResponsibleName) => {
  const formData = new FormData();
  formData.append('nome', inputName);
  formData.append('data_nascimento', inputBirth);
  formData.append('sexo', inputGender);
  formData.append('nome_responsavel', inputResponsibleName);

  let url = 'http://127.0.0.1:5000/aluno';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertCloseButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
}

/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Você tem certeza?")) {
        div.remove()
        deleteItem(nomeItem)
        alert("Removido!")
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:5000/aluno?nome=' + item;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo aluno com nome, data de nascimento, sexo e nome do responsável 
  --------------------------------------------------------------------------------------
*/
const newItem = () => {
  let inputName = document.getElementById("newName").value;
  let inputBirth = document.getElementById("newBirth").value;
  let inputGender = document.getElementById("newGender").value;
  let inputResponsibleName = document.getElementById("newResponsibleName").value;

  if (inputName === '' ||inputBirth === '' ||inputGender === '' ||inputResponsibleName === '' ) {
    alert("É necessário preencher todos os campos!");
  } else {
    insertList(inputName, inputBirth, inputGender, inputResponsibleName)
    postItem(inputName, inputBirth, inputGender, inputResponsibleName)
    alert("Aluno adicionado!")
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (inputName, inputBirth, inputGender, inputResponsibleName) => {
  var item = [inputName, inputBirth, inputGender, inputResponsibleName]
  var table = document.getElementById('myTable');
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  insertCloseButton(row.insertCell(-1))
  document.getElementById("newName").value = "";
  document.getElementById("newBirth").value = "";
  document.getElementById("newGender").value = "";
  document.getElementById("newResponsibleName").value = "";

  removeElement()
}


/*
  --------------------------------------------------------------------------------------
  Função para obter informações de um aluno do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getItem = () => {
  let inputName = document.getElementById("newName").value;
  
  let url = 'http://127.0.0.1:5000/aluno?nome=' + inputName;
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("newBirth").value = data.data_nascimento
      document.getElementById("newGender").value = data.sexo
      document.getElementById("newResponsibleName").value = data.nome_responsavel
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para editar informações de um aluno do servidor via requisição PUT
  --------------------------------------------------------------------------------------
*/
const editItem = () => {
  let inputName = document.getElementById("newName").value;
  let inputBirth = document.getElementById("newBirth").value;
  let inputGender = document.getElementById("newGender").value;
  let inputResponsibleName = document.getElementById("newResponsibleName").value;

  if (inputName === '' ||inputBirth === '' ||inputGender === '' ||inputResponsibleName === '' ) {
    alert("É necessário preencher todos os campos!");
  } else {
    const formData = new FormData();
    formData.append('nome', inputBirth);
    formData.append('data_nascimento', inputBirth);
    formData.append('sexo', inputGender);
    formData.append('nome_responsavel', inputResponsibleName);

    let url = `http://127.0.0.1:5000/aluno/${inputName}`;
    fetch(url, {
      method: 'put',
      body: formData
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error:', error);
      });
    
    document.getElementById("newName").value = "";
    document.getElementById("newBirth").value = "";
    document.getElementById("newGender").value = "";
    document.getElementById("newResponsibleName").value = "";

    removeElement()
    location.reload()
    alert("Aluno atualizado!")
  }
}

/*
  --------------------------------------------------------------------------------------
  Função que utiliza uma API EXTERNA para exportar a tabela em formato xlsx
  --------------------------------------------------------------------------------------
*/
const exportSheet = () => {
  document.getElementById("sheetjsexport").addEventListener('click', function() {
    /* Create worksheet from HTML DOM TABLE */
    var wb = XLSX.utils.table_to_book(document.getElementById("myTable"));
    /* Export to file (start a download) */
    XLSX.writeFile(wb, "SheetJSTable.xlsx");
  });
}