import { Tabs } from "antd";
import { WelcomeHomePage } from "./WelcomeHomePage";
import { GraviButtonExample } from "./Examples/GraviButtonExample";
import { BBDTagExample } from "./Examples/BBDTagExample";
import { ManyTagExample } from "./Examples/ManyTagExample";
import { NotificationNothingExample } from "./Examples/NotificationNothingExample";
import { OverlayComponentsExample } from "./Examples/OverlayComponentsExample";
import { TextoExample } from "./Examples/TextoExample";
import { Horizontal } from "@gravitate-js/excalibrr";
import {
  HomeOutlined,
  TabletOutlined,
  TagOutlined,
  TagsOutlined,
  BellOutlined,
  WindowsOutlined,
  FontSizeOutlined
} from "@ant-design/icons";

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
    {
      label: "Many-Tag",
      key: "many-tag",
      component: <ManyTagExample />,
      icon: <TagsOutlined />,
    },
    {
      label: "Notifications",
      key: "notifications",
      component: <NotificationNothingExample />,
      icon: <BellOutlined />,
    },
    {
      label: "Overlays",
      key: "overlays",
      component: <OverlayComponentsExample />,
      icon: <WindowsOutlined />,
    },
    {
      label: "Typography",
      key: "typography",
      component: <TextoExample />,
      icon: <FontSizeOutlined />,
    },
  ];

  return (
    <Tabs style={{ minWidth: "100%" }} items={tabs?.map((tab) => ({
      key: tab.key,
      label: <span>{tab.icon} {tab.label}</span>,
      children: <Horizontal>{tab.component}</Horizontal>,
    }))} />
  );
}
