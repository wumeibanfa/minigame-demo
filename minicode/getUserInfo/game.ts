import {
  hideUserInfoButton,
  createUserInfoButton,
  requirePrivacyAuthorize,
  getAuthWxFriendInteraction,
  scope,
} from "./auth";
import { screenWidth, screenHeight, renderLable } from "./common/render";
import { scene } from "./common/scene";

const userInfoButtonRect = {
  x: screenWidth / 2 - 70,
  y: screenHeight / 2 + 50,
  width: 140,
  height: 40,
};

let userInfo = {
  nickName: "",
};

/**
 * 模拟游戏场景发生变化时
 */
scene.on('sceneChanged', () => {
  hideUserInfoButton();
  renderLable("");
  if (scene.currentIndex === 0) {
    // 当切换到首页场景，需要登录
    if (scope.userInfo) {
      renderLable("昵称: " + userInfo.nickName);
    } else {
      createUserInfoButton("首页-获取信息", userInfoButtonRect, (res) => {
        console.log("用户登录成功", res);
        userInfo = res.userInfo;
        renderLable("昵称: " + userInfo.nickName);
      });
    }
  } else if (scene.currentIndex === 1) {
    // 当切换到其他有需要登录的场景
    if (scope.userInfo) {
      renderLable("昵称: " + userInfo.nickName);
    } else {
      createUserInfoButton("其他-获取信息", userInfoButtonRect, (res) => {
        console.log("用户登录成功", res);
        userInfo = res.userInfo;
        renderLable("昵称: " + userInfo.nickName);
      });
    }
  } else if (scene.currentIndex === 2) {
    // 当需要展示排行榜时，需要好友授权
    if (scope.WxFriendInteraction) {
      renderLable("同意好友授权\n可以使用开放数据域接口");
    } else {
      renderLable("尚未授权\n无法使用开放数据域接口");
      requirePrivacyAuthorize().then(() => {
        getAuthWxFriendInteraction()
          .then(() => {
            renderLable("同意好友授权\n可以使用开放数据域接口");
          })
          .catch(() => {
            renderLable("不同意好友授权\n无法使用开放数据域接口");
          });
      });
    }
  }
})