module.exports = function(api) {
  const presets = [["@babel/preset-env", { useBuiltIns: "usage", corejs: 3 }]];
  const plugins = [];

  api.cache(true);
  return {
    presets,
    plugins
  };
};
