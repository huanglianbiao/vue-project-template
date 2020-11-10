module.exports = function(api) {
  const presets = [["@babel/preset-env", { useBuiltIns: "usage", corejs: 3 }]];
  const plugins = [
    [
      "component",
      {
        libraryName: "element-ui",
        styleLibraryName: "theme-chalk"
      }
    ],
    [
      "import",
      {
        libraryName: "ant-design-vue",
        style: true
      }
    ]
  ];
  api.cache(true);
  return {
    presets,
    plugins
  };
};
