module.exports = {
  printWidth: 120,
  overrides: [
    {
      files: ['.prettierrc', '.eslintrc'],
      options: {
        parser: 'json'
      }
    }
  ]
};
