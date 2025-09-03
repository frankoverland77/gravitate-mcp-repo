import { LogoutOutlined, MailFilled } from "@ant-design/icons";
// import { useCredential } from '@api/useCredential'
// import { ImpersonationSelect } from "@components/shared/Navigation/ControlPanel/ImpersonationSelect";
// import { useUser } from "@contexts/UserContext";
import {
  ManyTag,
  NothingMessage,
  Texto,
  useThemeContext,
} from "@gravitate-js/excalibrr";
import { Avatar, Button, Drawer, Select } from "antd";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

export function ControlPanel({ onClose, visible }) {
  // const { useUserInfoQuery } = useCredential()
  // const { data: user } = useUserInfoQuery()

  return (
    <Drawer
      title={`Control Panel (v.${import.meta.env.PACKAGE_VERSION})`}
      placement="right"
      width={450}
      onClose={onClose}
      visible={visible}
    >
      <div className="vertical-flex" style={{ height: "43%" }}>
        {/* <UserDetails user={user} />
        <ImpersonationSelect user={user} /> */}
        <ThemeSelect />
      </div>
      <div className="flex-div items-center p-4">
        <Texto appearance="medium" className="flex-1" category="heading-small">
          Recent Alerts
        </Texto>
        {/* <Texto align='right' weight='bold' appearance={alerts?.unresolved_count !== 0 ? 'error' : 'light'}>
          <ExclamationCircleFilled /> {alerts?.unresolved_count} Unresolved Alerts
        </Texto> */}
      </div>
      <div style={{ height: "50%", overflow: "auto" }}>
        <NothingMessage
          title="No Alerts"
          message="You have not received any alerts."
        />
      </div>
    </Drawer>
  );
}

function UserDetails({ user }) {
  const navigate = useNavigate();

  const { securityContext, handleLogout } = useUser();

  const name = `${user?.Data?.First ?? "John"} ${user?.Data?.Last ?? "Doe"}`;

  return (
    <div className="flex-1 vertical-flex pb-3 px-4">
      <div className="flex items-center">
        <Texto category="heading-small" className="flex-1" appearance="medium">
          CURRENT USER
        </Texto>
        <Button onClick={handleLogout} icon={<LogoutOutlined />} type="link">
          Logout
        </Button>
      </div>

      <div className="flex items-center my-4">
        <div className=" vertical-flex-center mr-4">
          <Avatar
            shape="square"
            style={{
              borderRadius: 5,
              background: "var(--primary-gradient)",
              textTransform: "uppercase",
            }}
            size={60}
          >
            {user?.Data?.First?.[0] ?? "J"}
            {user?.Data?.Last?.[0] ?? "D"}
          </Avatar>
        </div>
        <div className="flex-1">
          <Texto weight="bold" category="h5" className="pb-1">
            {name}
          </Texto>
          {securityContext?.Roles && (
            <ManyTag tagItems={securityContext.Roles} maxCount={2} />
          )}
          <Texto appearance="secondary" className="flex items-center mt-2">
            <MailFilled className="pr-3" />
            {user?.Data.Email || "No Email"}
          </Texto>
        </div>
      </div>
      <div className="border-div" />
    </div>
  );
}

function ThemeSelect() {
  const { availableThemes } = useThemeContext();

  return (
    <div className="flex-1 vertical-flex p-4">
      <Texto category="heading-small" className="mb-3" appearance="medium">
        SELECTED THEME
      </Texto>
      <Select
        onChange={(value) => {
          localStorage.setItem("TYPE_OF_THEME", value);
          location.reload();
        }}
        defaultValue={
          localStorage.getItem("TYPE_OF_THEME") ||
          availableThemes.find((theme) => theme.default).key
        }
      >
        {availableThemes.map((theme, i) => (
          <Option key={i} value={theme.key}>
            {theme.display}
          </Option>
        ))}
      </Select>
      <div className="border-div" />
    </div>
  );
}
