const express = require("express");
const sql = require("mysql2");
const app = express();

app.use(express.json());

const conn = sql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "biblioteca",
  port: 3306,
});

conn.connect((error) => {
  if (error) {
    console.error("nao conectou", error);
  }
  console.log("conectado");

  app.listen(3000);
});

app.get("/livros/:id", (req, res) => {
  const { id } = req.params;
  const buscar = `SELECT * FROM categoria WHERE idcategoria = ?`;
  conn.query(buscar, [id], (error, result) => {
    if (error) {
      res.status(500).json({ message: "erro" });
    }
    if (result.length === 0) {
      res.status(404).json({ message: "categoria nao encontrada" });
    }
    res.status(200).json(result[0]);
  });
});

app.get("/emprestimos", (req, res) => {
  const listar = `SELECT
    aluno.nome AS aluno,
    livros.titulo AS livro,
    categoria.nome AS categoria,
    emprestimo.data_retirada,
    emprestimo.data_prevista
FROM emprestimo
INNER JOIN aluno
    ON emprestimo.idaluno = aluno.idaluno
INNER JOIN livros
    ON emprestimo.idlivros = livros.idlivros
INNER JOIN categoria
    ON livros.id_categoria = categoria.idcategoria;`;

  conn.query(listar, (error, result) => {
    if (error) {
      return res.status(500).json({ message: "erro no server" });
    }
    res.status(200).json(result);
  });
});

app.get("/categorias", (req, res) => {
  const listar = `SELECT * FROM categoria`;
  conn.query(listar, (error, result) => {
    if (error) {
      res.status(500).json({ message: "erro" });
    }
    res.status(200).json(result);
  });
});

app.post("/inserir", (req, res) => {
  const { codigo, nome } = req.body;
  const inserir = `INSERT INTO categoria (codigo,nome) VALUES (?,?)`;

  conn.query(inserir, [codigo, nome], (error, result) => {
    if (error) {
      return res.status(500).json({ message: "erro no banco" });
    }
    res.status(200).json(result);
  });
});

app.put("/atualizar/:id", (req, res) => {
  const { id } = req.params;
  const { codigo, nome } = req.body;

  const atualizar = `UPDATE categoria  SET codigo = ?, nome = ? WHERE idcategoria = ?`;

  conn.query(atualizar, [codigo, nome, id], (error, result) => {
    if (error) {
      return res.status(500).json({ message: "erro ao atualizar" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "categoria nao encontrada" });
    }
    res.status(200).json({ message: "categoria atualizada" });
  });
});

app.delete("/deletar/:id", (req, res) => {
  const { id } = req.params;

  const apagar = `DELETE FROM categoria WHERE idcategoria = ?`;

  conn.query(apagar, (error, result) => {
    if (error) {
      res.status(500).json({ message: "erro ao excluir" });
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "categoria nao encontrada" });
    }
    res.status(200).json({ message: "categoria excluida" });
  });
});
