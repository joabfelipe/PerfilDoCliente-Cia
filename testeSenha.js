const bcrypt = require('bcrypt');

const senhaDigitada = 'meuPainel123';
const hashNoBanco = '$2b$10$DAZ7jntZe27RLnEUkuH6WOLN3RuQzJoMK2Zw0yasqBr7VU3EKmNgm';

bcrypt.compare(senhaDigitada, hashNoBanco).then(resultado => {
  console.log('Resultado da verificação:', resultado);
});
