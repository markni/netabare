import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import Avatar from "@/components/Avatar.vue";

describe("Avatar.vue", () => {
  it("uses correct image and link", () => {
    const user = {
      id: 2813,
      url: "http://bgm.tv/user/ruocaled",
      username: "ruocaled",
      nickname: "若卡",
      avatar: {
        large: "http://lain.bgm.tv/pic/user/l/000/00/28/2813.jpg?r=1453602884",
        medium: "http://lain.bgm.tv/pic/user/m/000/00/28/2813.jpg?r=1453602884",
        small: "http://lain.bgm.tv/pic/user/s/000/00/28/2813.jpg?r=1453602884",
      },
      sign: "✨️VIP 8✨️",
      usergroup: 11,
    };
    const wrapper = shallowMount(Avatar, {
      props: { user },
    });
    expect(wrapper.get("img").attributes("src")).to.equal(
      "https://lain.bgm.tv/pic/user/l/000/00/28/2813.jpg?r=1453602884"
    );
    expect(wrapper.get("a").attributes("href")).to.equal(
      "https://bgm.tv/user/ruocaled"
    );
  });
});
