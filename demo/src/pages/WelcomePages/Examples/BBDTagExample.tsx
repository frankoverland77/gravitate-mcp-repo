import {
  BBDTag,
  Horizontal,
  Vertical,
  Texto,
} from "@gravitate-js/excalibrr";
import {
  CloseOutlined,
  FilterOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Tooltip } from "antd";

export function BBDTagExample() {
  const handleRemoveFilter = (filterName: string) => {
    console.log(`Removing filter: ${filterName}`);
  };

  const tagItems = ["JavaScript", "React", "TypeScript", "Node.js"];
  const validationRules = [
    { type: "length", isValid: true, message: "At least 8 characters" },
    { type: "uppercase", isValid: false, message: "At least 1 uppercase character" },
    { type: "number", isValid: true, message: "At least 1 number" },
  ];

  return (
    <Vertical style={{ maxWidth: "800px", margin: "0 auto" }}>
      <Texto className="mb-3" category="h3">
        BBD Tag Variations
      </Texto>

      {/* Theme Variations */}
      <Texto category="h5">Theme Variations</Texto>
      <Vertical className="mb-3">
        <Horizontal style={{ gap: "10px" }} verticalCenter>
          <BBDTag theme1>Theme 1</BBDTag>
          <BBDTag theme2>Theme 2</BBDTag>
          <BBDTag theme3>Theme 3</BBDTag>
          <BBDTag theme4>Theme 4</BBDTag>
        </Horizontal>
      </Vertical>

      {/* Status Variations */}
      <Texto category="h5">Status Variations</Texto>
      <Vertical className="mb-3">
        <Horizontal style={{ gap: "10px" }} verticalCenter>
          <BBDTag success>Success</BBDTag>
          <BBDTag warning>Warning</BBDTag>
          <BBDTag error>Error</BBDTag>
        </Horizontal>
      </Vertical>

      {/* Text Transform Variations */}
      <Texto category="h5">Text Transform</Texto>
      <Vertical className="mb-3">
        <Horizontal style={{ gap: "10px" }} verticalCenter>
          <BBDTag textTransform="uppercase">uppercase text</BBDTag>
          <BBDTag textTransform="lowercase">LOWERCASE TEXT</BBDTag>
          <BBDTag textTransform="capitalize">capitalize text</BBDTag>
          <BBDTag style={{ textTransform: "capitalize" }}>style capitalize</BBDTag>
        </Horizontal>
      </Vertical>

      {/* Custom Styling */}
      <Texto category="h5">Custom Styling</Texto>
      <Vertical className="mb-3">
        <Horizontal style={{ gap: "10px" }} verticalCenter>
          <BBDTag
            className="font-bold"
            style={{
              letterSpacing: "0.5px",
              margin: "4px",
              padding: "8px 12px"
            }}
            theme2
          >
            Custom Styled
          </BBDTag>
          <BBDTag className="text-ellipsis" style={{ maxWidth: "120px" }}>
            This is a very long tag that will be truncated
          </BBDTag>
        </Horizontal>
      </Vertical>

      {/* Filter Tags (Removable) */}
      <Texto category="h5">Filter Tags</Texto>
      <Vertical className="mb-3">
        <Horizontal style={{ gap: "10px" }} verticalCenter>
          <BBDTag theme2 className="filter-tag my-2">
            <span className="filter-tag-label">
              <FilterOutlined className="mr-1" />
              Category: Tech
            </span>
            <CloseOutlined
              className="filter-tag-close ml-2"
              onClick={() => handleRemoveFilter("category.tech")}
            />
          </BBDTag>
          <BBDTag theme2 className="filter-tag my-2">
            <span className="filter-tag-label">Status: Active</span>
            <CloseOutlined
              className="filter-tag-close ml-2"
              onClick={() => handleRemoveFilter("status.active")}
            />
          </BBDTag>
        </Horizontal>
      </Vertical>

      {/* Validation Tags */}
      <Texto category="h5">Form Validation</Texto>
      <Vertical className="mb-3">
        <Horizontal style={{ gap: "10px", flexWrap: "wrap" }}>
          {validationRules.map((rule) => (
            <BBDTag
              key={rule.type}
              success={rule.isValid}
              error={!rule.isValid}
              style={{ textTransform: "capitalize" }}
            >
              {rule.isValid ? <CheckOutlined className="mr-1" /> : <ExclamationCircleOutlined className="mr-1" />}
              {rule.message}
            </BBDTag>
          ))}
        </Horizontal>
      </Vertical>

      {/* Grid Cell Tags with Tooltip */}
      <Texto category="h5">Grid Cell Tags</Texto>
      <Vertical className="mb-3">
        <Horizontal style={{ gap: "10px" }} verticalCenter>
          <Tooltip title="This is a very long value that needs a tooltip">
            <div>
              <BBDTag
                theme1
                className="text-ellipsis"
                style={{ maxWidth: "150px" }}
              >
                Very Long Cell Value
              </BBDTag>
            </div>
          </Tooltip>

          <div className="flex items-end justify-end">
            <BBDTag success>
              <span className="text-xs font-normal">+15.2%</span>
            </BBDTag>
          </div>

          <div className="flex items-end justify-end">
            <BBDTag error>
              <span className="text-xs font-normal">-8.7%</span>
            </BBDTag>
          </div>
        </Horizontal>
      </Vertical>

      {/* Multiple Tags */}
      <Texto category="h5">Multiple Tags</Texto>
      <Vertical className="mb-3">
        <Horizontal style={{ gap: "8px", flexWrap: "wrap" }}>
          {tagItems.map((item, index) => (
            <BBDTag className="text-ellipsis" key={index} theme3>
              {item}
            </BBDTag>
          ))}
        </Horizontal>
      </Vertical>

      {/* Priority Tags */}
      <Texto category="h5">Priority Indicators</Texto>
      <Vertical className="mb-3">
        <Horizontal style={{ gap: "10px" }} verticalCenter>
          <BBDTag error className="priority-tag">
            <ExclamationCircleOutlined className="mr-1" />
            High Priority
          </BBDTag>
          <BBDTag warning className="priority-tag">
            <WarningOutlined className="mr-1" />
            Medium Priority
          </BBDTag>
          <BBDTag success className="priority-tag">
            <CheckOutlined className="mr-1" />
            Low Priority
          </BBDTag>
        </Horizontal>
      </Vertical>

      {/* Interactive Tags */}
      <Texto category="h5">Interactive Tags</Texto>
      <Vertical className="mb-3">
        <Horizontal style={{ gap: "10px" }} verticalCenter>
          <BBDTag
            theme1
            className="cursor-pointer hover:opacity-80"
            onClick={() => console.log("Tag clicked!")}
          >
            Clickable Tag
          </BBDTag>
          <BBDTag
            theme2
            className="cursor-pointer hover:opacity-80"
            onClick={() => console.log("Filter clicked!")}
          >
            Filter Tag
            <CloseOutlined className="ml-2" onClick={(e) => {
              e.stopPropagation();
              console.log("Remove clicked!");
            }} />
          </BBDTag>
        </Horizontal>
      </Vertical>

      {/* Combination Examples */}
      <Texto category="h5">Combination Examples</Texto>
      <Vertical className="mb-3">
        <Horizontal style={{ gap: "10px", flexWrap: "wrap" }} verticalCenter>
          <BBDTag
            success
            textTransform="uppercase"
            className="font-bold"
            style={{ letterSpacing: "1px" }}
          >
            <CheckOutlined className="mr-1" />
            Validated
          </BBDTag>

          <BBDTag
            theme2
            className="filter-tag"
            style={{ padding: "6px 12px" }}
          >
            <FilterOutlined className="mr-1" />
            Advanced Filter
            <CloseOutlined
              className="ml-2"
              onClick={() => console.log("Advanced filter removed")}
            />
          </BBDTag>

          <BBDTag
            error
            textTransform="capitalize"
            className="text-ellipsis"
            style={{ maxWidth: "200px" }}
          >
            <ExclamationCircleOutlined className="mr-1" />
            This is a very long error message that will truncate
          </BBDTag>

          <Tooltip title="Complex nested content with calculation">
            <BBDTag warning className="text-center">
              <span className="text-xs font-normal">
                <WarningOutlined className="mr-1" />
                Threshold: 85%
              </span>
            </BBDTag>
          </Tooltip>
        </Horizontal>
      </Vertical>
    </Vertical>
  );
}