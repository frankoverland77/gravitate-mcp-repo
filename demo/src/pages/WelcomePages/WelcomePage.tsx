import { Tabs } from "antd";
import { WelcomeHomePage } from "./WelcomeHomePage";
import { GraviButtonExample } from "./Examples/GraviButtonExample";
import { BBDTagExample } from "./Examples/BBDTagExample";
import { Horizontal } from "@gravitate-js/excalibrr";
import { HomeOutlined, TabletOutlined, TagOutlined } from "@ant-design/icons";

export function WelcomePage() {
  const tabs = [
    {
      label: "Home",
      key: "home",
      component: <WelcomeHomePage />,
      icon: <HomeOutlined />,
    },
    {
      label: "Gravi-Button",
      key: "gravi-button",
      component: <GraviButtonExample />,
      icon: <TabletOutlined />,
    },
    {
      label: "BBD-Tag",
      key: "bbd-tag",
      component: <BBDTagExample />,
      icon: <TagOutlined />,
    },
  ];

  return (
    <Tabs style={{ minWidth: "100%" }}>
      {tabs?.map((tab) => {
        return (
          <Tabs.TabPane
            tab={
              <span>
                {tab.icon} {tab.label}
              </span>
            }
            key={tab.key}
          >
            <Horizontal>{tab.component}</Horizontal>
          </Tabs.TabPane>
        );
      })}
    </Tabs>
  );
}
