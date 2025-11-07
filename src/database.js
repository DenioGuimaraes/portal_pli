import SQLite from 'react-native-sqlite-storage';

// Abre (ou cria) o banco local
const db = SQLite.openDatabase(
  {
    name: 'meubanco.db',
    location: 'default',
  },
  () => {
    console.log('✅ Banco aberto com sucesso');
  },
  error => {
    console.log('❌ Erro ao abrir o banco: ', error);
  }
);

// Função para criar tabelas
export const createTables = () => {
  db.transaction(tx => {
    // Pessoal
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS pessoal (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        grupo TEXT,
        nome TEXT,
        matricula TEXT
      );`
    );

    // Telefones
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS telefones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        setor TEXT,
        ramal TEXT,
        descricao TEXT
      );`
    );

    // Canais de Rádio
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS radios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        faixa TEXT,
        canal TEXT,
        descricao TEXT
      );`
    );

    // Instrumentos
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS instrumentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo TEXT,
        nome TEXT,
        descricao TEXT
      );`
    );

    // Válvulas de Controle
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS valvulas_controle (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo TEXT,
        nome TEXT,
        descricao TEXT
      );`
    );

    // Válvulas de Segurança
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS valvulas_seguranca (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        descricao TEXT
      );`
    );

    // Emergências
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS emergencias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT,
        passos TEXT
      );`
    );
  });
};

// Inserir dado de teste na tabela pessoal
export const insertPessoa = (grupo, nome, matricula) => {
  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO pessoal (grupo, nome, matricula) VALUES (?, ?, ?);`,
      [grupo, nome, matricula],
      (_, result) => {
        console.log('✅ Pessoa inserida com sucesso. ID:', result.insertId);
      },
      (_, error) => {
        console.log('❌ Erro ao inserir pessoa:', error);
      }
    );
  });
};

// Listar dados da tabela pessoal
export const getPessoal = () => {
  db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM pessoal;`,
      [],
      (_, result) => {
        console.log('📋 Lista de pessoal:');
        for (let i = 0; i < result.rows.length; i++) {
          console.log(result.rows.item(i));
        }
      },
      (_, error) => {
        console.log('❌ Erro ao buscar pessoal:', error);
      }
    );
  });
};

export const clearPessoal = () => {
  db.transaction(tx => {
    tx.executeSql(
      'DELETE FROM pessoal;',
      [],
      () => console.log('🧹 Tabela pessoal limpa com sucesso'),
      (_, error) => {
        console.log('❌ Erro ao limpar tabela pessoal:', error);
        return false;
      }
    );
  });
};

export const seedPessoal = () => {
  clearPessoal();
  insertPessoa('A', 'Carlos Silva', '1001');
  insertPessoa('A', 'João Pereira', '1002');
  insertPessoa('B', 'Maria Souza', '2001');
  insertPessoa('B', 'Fernanda Lima', '2002');
  insertPessoa('C', 'Pedro Santos', '3001');
};



export default db;
