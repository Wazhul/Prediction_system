require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    ganache: {
      url: 'http://ganache:8545',
      accounts: ['ee9c6271c9d193bef48386df43711e138437f21d9a3bbc36d326adba2853cd31']
    }
  }
};