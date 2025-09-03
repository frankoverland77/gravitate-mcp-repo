import { LoadingOutlined, UserOutlined } from "@ant-design/icons";
// import { useCredential } from '@api/useCredential'
// import { useUser } from '@contexts/UserContext'
import { Horizontal, Texto } from "@gravitate-js/excalibrr";
import { Avatar } from "antd";
import React, { useMemo } from "react";

export function UserSummary() {
  // const { useUserInfoQuery } = useCredential()
  // const { data: user } = useUserInfoQuery()

  // const { impersonationCounterparties } = useUser()

  const name = useMemo(() => {
    return `Demo User`;
  }, []);
  // const counterPartyDisplay = user?.Data?.CounterPartyDisplay

  return (
    <div className="flex ml-4">
      <div className="vertical-flex pr-2">
        <Texto align="right" category="p2" weight="bold">
          {name}
        </Texto>
      </div>
      <div className="vertical-flex-center pl-3">
        <Avatar
          shape="square"
          style={{
            borderRadius: 5,
            background: "var(--primary-gradient)",
            textTransform: "uppercase",
          }}
          size={36}
        >
          DE
        </Avatar>
      </div>
    </div>
  );
}
