import {
  GraviButton,
  Horizontal,
  Vertical,
  Texto,
} from "@gravitate-js/excalibrr";
import {
  PlusOutlined,
  SaveOutlined,
  DeleteOutlined,
  DownloadOutlined,
  InfoCircleOutlined,
  EditOutlined,
  CheckOutlined,
} from "@ant-design/icons";

export function GraviButtonExample() {
    let x = true
  return (
    <Vertical style={{ maxWidth: "800px", margin: "0 auto" }}>
      <Texto className="mb-3" category="h3">
        Gravi Button Variations
      </Texto>

      {/* Theme Variations */}
      <Texto category="h5">Theme Variations</Texto>
      <Vertical className="mb-3">
        <Horizontal gap={10} verticalCenter>
          <GraviButton buttonText="Theme1" theme1/>
          <GraviButton buttonText="Theme2" theme2 />
          <GraviButton buttonText="Theme3" theme3 />
          <GraviButton buttonText="Theme4" theme4 />
          <GraviButton buttonText="Success" success />
          <GraviButton buttonText="Error" error />
          <GraviButton buttonText="Warning" warning />
        </Horizontal>
      </Vertical>

      {/* Appearance Variations */}
      <Texto category="h5">Appearance Variations</Texto>
      <Vertical className="mb-3">
        <Horizontal gap={10} verticalCenter>
          <GraviButton buttonText="Filled" />
          <GraviButton buttonText="Outline" appearance="outlined" />
        </Horizontal>
      </Vertical>

      {/* Special Classes */}
      <Texto category="h5">Special Classes</Texto>
      <Vertical className="mb-3">
        <Horizontal gap={10} verticalCenter>
          <Texto category="p2">Ghost Button</Texto>
          <GraviButton
            className="ghost-gravi-button"
            size="small"
            icon={<InfoCircleOutlined style={{ color: "var(--gray-500)" }} />}
          />
        </Horizontal>
      </Vertical>

      {/* Size Variations */}
      <Texto category="h5">Size Variations</Texto>
      <Vertical className="mb-3">
        <Horizontal gap={10} verticalCenter>
          <GraviButton buttonText="Small" size="small" />
          <GraviButton buttonText="Middle" />
          <GraviButton buttonText="Large" size="large" />
        </Horizontal>
      </Vertical>

      {/* State Variations */}
      <Texto category="h5">State Variations</Texto>
      <Vertical className="mb-3">
        <Horizontal gap={10} verticalCenter>
          <GraviButton buttonText="Normal" />
          <GraviButton buttonText="Disabled" disabled />
          <GraviButton buttonText="Loading" loading />
        </Horizontal>
      </Vertical>

      {/* Form Actions (v5: use onClick with form.submit() instead of htmlType) */}
      <Texto category="h5">Form Actions</Texto>
      <Vertical className="mb-3">
        <Horizontal gap={10}>
          <GraviButton buttonText="Submit" success onClick={() => console.log('form.submit()')} />
          <GraviButton buttonText="Reset" appearance="outlined" onClick={() => console.log('form.resetFields()')} />
        </Horizontal>
      </Vertical>

      {/* Icon Variations */}
      <Texto category="h5">Icon Variations</Texto>
      <Vertical className="mb-3">
        <Horizontal gap={10} verticalCenter>
          <GraviButton buttonText="Save" icon={<SaveOutlined />} />
          <GraviButton icon={<EditOutlined />} />
          <GraviButton
            buttonText="Download"
            success
            icon={<DownloadOutlined />}
          />
          <GraviButton
            className="ghost-gravi-button"
            icon={<DeleteOutlined style={{ color: "var(--theme-error)" }} />}
          />
        </Horizontal>
      </Vertical>

      {/* Combination Examples */}
      <Texto category="h5">Combination Examples</Texto>
      <Vertical className="mb-3">
        <Horizontal gap={10} verticalCenter>
          <GraviButton
            buttonText="Complete"
            success
            size="large"
            icon={<CheckOutlined />}
          />

          <GraviButton buttonText="Primary Theme2" theme2 />
          <GraviButton buttonText="Processing" warning shape="round" loading />
          <GraviButton
            buttonText="Error"
            error
            size="small"
            appearance="outlined"
          />
        </Horizontal>
      </Vertical>
    </Vertical>
  );
}
