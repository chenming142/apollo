export default class ExtraInfo {
  constructor() {
    this.attributes = new Set();
  }
  setExtraInfo(extraInfo = {}) {
    const self = this;
    for (var k in extraInfo) {
      if (self.attributes.has(k)) {
        self[k] = extraInfo[k];
      }
    }
  }
  setAttributes(attributes) {
    this.attributes = new Set(attributes);
  }
  getExtraInfoByKey(key) {
    const self = this;
    if (!self.attributes.has(key)) {
      throw Error("ExtraInfo 不含有该 " + key + "的属性");
    }
    let extraInfo = self[key];
    return extraInfo ? extraInfo : null;
  }
  setExtraInfoByKey(key, val) {
    if (!this.attributes.has(key)) {
      throw Error("ExtraInfo 不含有该 " + key + "的属性, 无法设置值：" + val);
    } else {
      this[key] = val;
    }
  }
}

// console.log("--- ExtraInfo");
// console.log(ExtraInfo);
