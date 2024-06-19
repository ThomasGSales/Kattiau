$(document).ready(function () {
  const apiUrl = "http://localhost:3000";

  const entities = [
    {
      name: "Avaliacao",
      fields: [
        "ID_Avaliacao",
        "Comentario",
        "Avaliacao",
        "ID_Produto",
        "ID_Cliente",
      ],
    },
    { name: "Categoria", fields: ["ID_Categoria", "Nome"] },
    { name: "Cliente", fields: ["ID_Cliente", "Nome", "Email"] },
    { name: "Produto", fields: ["ID_Produto", "Nome", "Preco"] },
    { name: "Pedido", fields: ["ID_Pedido", "DataPedido", "ID_Cliente"] },
    {
      name: "Endereco",
      fields: ["ID_Endereco", "Rua", "Cidade", "ID_Cliente"],
    },
    { name: "Fornecedor", fields: ["ID_Fornecedor", "Nome", "Email"] },
    {
      name: "Detalhespedido",
      fields: ["ID_Pedido", "ID_Produto", "Quantidade", "PrecoUnitario"],
      updateFields: ["Novo_Pedido", "Novo_Produto"],
    },
    {
      name: "Produtocategoria",
      fields: ["ID_Produto", "ID_Categoria"],
      updateFields: ["Novo_Produto", "Novo_Categoria"],
    },
    {
      name: "Produtofornecedor",
      fields: ["ID_Produto", "ID_Fornecedor"],
      updateFields: ["Novo_Produto", "Novo_Fornecedor"],
    },
    {
      name: "Pagamento",
      fields: ["ID_Pagamento", "ID_Pedido", "Metodo", "Valor"],
    },
  ];

  function generateNavLinks() {
    entities.forEach((entity) => {
      $("#navbar-items").append(
        `<li class="nav-item"><a class="nav-link" href="#" data-entity="${
          entity.name
        }">${entity.name.toLowerCase()}</a></li>`
      );
    });
  }

  function loadEntityForm(entity) {
    const entityInfo = entities.find((e) => e.name === entity);
    let formHtml = `<h2>${entity}</h2>
        <div class="btn-group mb-3" role="group">
            <button type="button" class="btn btn-primary" data-action="create">Cadastrar</button>
            <button type="button" class="btn btn-secondary" data-action="read">Listar</button>
        </div>
        <div id="form-container"></div>
        <div id="response"></div>
        <div id="list-container"></div>`;

    $("#content").html(formHtml);
    listEntities(entity);

    $(".btn-group button").click(function () {
      const action = $(this).data("action");
      generateForm(entity, action);
    });
  }

  function generateForm(entity, action) {
    const entityInfo = entities.find((e) => e.name === entity);
    let formHtml = `<form id="crud-form"><div class="form-group">`;

    entityInfo.fields.forEach((field) => {
      if (action === "create" && field.startsWith("ID_")) return;
      formHtml += `<label for="${field}">${field}</label><input type="text" class="form-control" id="${field}" name="${field}">`;
    });

    if (action === "update" && entityInfo.updateFields) {
      entityInfo.updateFields.forEach((field) => {
        formHtml += `<label for="${field}">${field}</label><input type="text" class="form-control" id="${field}" name="${field}">`;
      });
    }

    formHtml += `</div><button type="submit" class="btn btn-primary">Submit</button></form>`;
    $("#form-container").html(formHtml);
    handleFormSubmission(entity, action);
  }

  function handleFormSubmission(entity, action) {
    $("#crud-form").submit(function (e) {
      e.preventDefault();
      const entityInfo = entities.find((e) => e.name === entity);
      const formData = {};
      const idField = entityInfo.fields.find((f) => f.startsWith("ID_"));

      entityInfo.fields.forEach((field) => {
        formData[field] = $(`#${field}`).val();
      });

      if (action === "update" && entityInfo.updateFields) {
        entityInfo.updateFields.forEach((field) => {
          formData[field] = $(`#${field}`).val();
        });
      }

      let settings = {
        url: `${apiUrl}/${action}${entity}`,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(formData),
        success: function (response) {
          $("#response").html(
            `<div class="alert alert-success">Success: ${JSON.stringify(
              response
            )}</div>`
          );
          if (["create", "update", "delete"].includes(action)) {
            listEntities(entity);
          }
        },
        error: function (error) {
          $("#response").html(
            `<div class="alert alert-danger">Error: ${JSON.stringify(
              error
            )}</div>`
          );
        },
      };

      if (action === "read") {
        settings.method = "GET";
        settings.url = `${apiUrl}/getLista${entity}/?${idField}=${formData[idField]}`;
        settings.data = null;
      } else if (action === "update") {
        settings.method = "PUT";
        settings.url = `${apiUrl}/putAtualizar${entity}`;
      } else if (action === "delete") {
        settings.method = "DELETE";
        settings.url = `${apiUrl}/deleteDeletar${entity}/${formData[idField]}`;
        settings.data = null;
      } else if (action === "create") {
        settings.url = `${apiUrl}/postCadastrar${entity}`;
      }

      $.ajax(settings);
    });
  }

  function listEntities(entity) {
    const entityInfo = entities.find((e) => e.name === entity);
    const idField = entityInfo.fields.find((f) => f.startsWith("ID_"));

    $.ajax({
      url: `${apiUrl}/getLista${entity}`,
      method: "GET",
      success: function (response) {
        let listHtml = `<table class="table"><thead><tr>`;

        entityInfo.fields.forEach((field) => {
          listHtml += `<th>${field}</th>`;
        });

        listHtml += `<th>Ações</th></tr></thead><tbody>`;

        response.forEach((item) => {
          listHtml += `<tr>`;
          entityInfo.fields.forEach((field) => {
            listHtml += `<td style="background-color: #fff;">${item[field]}</td>`;
          });

          listHtml += `<td>
                        <button class="btn btn-warning btn-edit" data-id="${item[idField]}">EDITAR</button>
                        <button class="btn btn-danger btn-delete" data-id="${item[idField]}">X</button>
                    </td></tr>`;
        });

        listHtml += `</tbody></table>`;
        $("#list-container").html(listHtml);

        $(".btn-delete").click(function () {
          const id = $(this).data("id");
          if (confirm("Você tem certeza que deseja deletar este item?")) {
            $.ajax({
              url: `${apiUrl}/deleteDeletar${entity}/${id}`,
              method: "DELETE",
              success: function (response) {
                listEntities(entity);
              },
              error: function (error) {
                $("#response").html(
                  `<div class="alert alert-danger">Error: ${JSON.stringify(
                    error
                  )}</div>`
                );
              },
            });
          }
        });

        $(".btn-edit").click(function () {
          const id = $(this).data("id");
          loadEditForm(entity, id);
        });
      },
      error: function (error) {
        $("#response").html(
          `<div class="alert alert-danger">Error: ${JSON.stringify(
            error
          )}</div>`
        );
      },
    });
  }

  function loadEditForm(entity, id) {
    const entityInfo = entities.find((e) => e.name === entity);
    const idField = entityInfo.fields.find((f) => f.startsWith("ID_"));

    $.ajax({
      url: `${apiUrl}/getLista${entity}/?${idField}=${id}`,
      method: "GET",
      success: function (response) {
        const item = response[0];
        generateForm(entity, "update");

        entityInfo.fields.forEach((field) => {
          $(`#${field}`).val(item[field]);
        });
      },
      error: function (error) {
        $("#response").html(
          `<div class="alert alert-danger">Error: ${JSON.stringify(
            error
          )}</div>`
        );
      },
    });
  }

  $("#navbar-items").on("click", "a", function () {
    const entity = $(this).data("entity");
    loadEntityForm(entity);
  });

  generateNavLinks();
});
