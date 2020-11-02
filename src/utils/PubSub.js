import Vue from 'vue';

export default new Vue();

const TopicsEnum = {
  test: 0
};

for (let key in TopicsEnum) {
  TopicsEnum[key] = TopicsEnum[key].toString();
}

export {TopicsEnum};
