import Mock from "mockjs";
import Logging from './logging';

const rd = Mock.Random;

export class Generator {
  static generateWechat() {
    let nickname = rd.cname();
    return Mock.mock({
      personalid: rd.increment(9661),
      "wechatid|1": /wxid_[0-9A-Za-z]{14}/,
      "wechatno|1": /[0-9A-Za-z]{4,11}/,
      nickname: nickname,
      headimgurl: rd.image("120x120", "#894FC4", "#FFF", "png", nickname),
      remark: rd.cparagraph(),
      "onlinestatus|0-1": 1
    });
  }
}

export default class GeneratorFactory {
  static generateWechatByMock(num) {
    Logging.info("- generateWechatByMock: " + num);
    let wechatInfos = Array.from({ length: num }, () =>
      Generator.generateWechat()
    );
    Logging.info(wechatInfos);
  }
}
