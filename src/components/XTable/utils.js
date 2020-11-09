// 驼峰转换下划线
const toLine = name => {
  return name.replace(/([A-Z])/g, '_$1').toLowerCase();
};

const defaultPage = {list: [], pageStart: 1, pageSize: 20, total: 0};

const makePageSizes = () => {
  return [
    defaultPage.pageSize,
    defaultPage.pageSize * 2,
    defaultPage.pageSize * 3,
    defaultPage.pageSize * 4,
    defaultPage.pageSize * 5
  ];
};

const validateValue = value => {
  if (typeof value === 'number' || typeof value === 'boolean') {
    return true;
  }

  return !!value;
};

// 获取字符串的ASCII码
const geCharCode = str => {
  if (typeof str === 'number') {
    return str;
  }
  let count = 0;
  for (let char of str) {
    const code = char.charCodeAt();
    if (isNaN(code)) {
      return 0;
    }

    count += code;
  }
  return count;
};

export {toLine, defaultPage, makePageSizes, validateValue, geCharCode};
