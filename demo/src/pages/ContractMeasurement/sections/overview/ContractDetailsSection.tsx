import { Vertical, Horizontal, Texto, BBDTag } from '@gravitate-js/excalibrr';
import { FileTextOutlined, DashboardOutlined } from '@ant-design/icons';

// Static data for contract details
const CONTRACT_DATA = {
  id: 'CTR-001',
  customer: 'ABC Energy Corp',
  type: 'Buy',
  startDate: 'Jan 01, 2024',
  endDate: 'Dec 31, 2024',
  totalProducts: 8,
  volumeFulfillment: 68.5,
  currentVolume: 1370000,
  totalVolume: 2000000,
  riskLevel: 'HIGH',
  status: 'Active',
};

const cardStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e8e8e8',
  borderRadius: '8px',
  padding: '24px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
};

interface FieldProps {
  label: string;
  value: string;
}

function Field({ label, value }: FieldProps) {
  return (
    <div>
      <Texto
        category="p2"
        appearance="medium"
        style={{ textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px', display: 'block' }}
      >
        {label}
      </Texto>
      <Texto category="p1" weight="600">
        {value}
      </Texto>
    </div>
  );
}

export function ContractDetailsSection() {
  return (
    <Vertical style={{ gap: '16px' }}>
      {/* Section Header */}
      <div>
        <Texto category="h4" weight="600">Contract Details</Texto>
        <Texto category="p2" appearance="medium">Basic contract information and specifications</Texto>
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'stretch' }}>
        {/* Card A: Contract Information */}
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column' }}>
          <Horizontal style={{ alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <FileTextOutlined style={{ fontSize: '18px', color: '#8c8c8c' }} />
            <Texto category="h5" weight="600">Contract Information</Texto>
          </Horizontal>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            {/* Row 1 */}
            <Field label="Contract ID" value={CONTRACT_DATA.id} />
            <Field label="Customer" value={CONTRACT_DATA.customer} />
            <Field label="Start Date" value={CONTRACT_DATA.startDate} />

            {/* Row 2 */}
            <Field label="Contract Type" value={CONTRACT_DATA.type} />
            <Field label="Total Products" value={`${CONTRACT_DATA.totalProducts} product locations`} />
            <Field label="End Date" value={CONTRACT_DATA.endDate} />
          </div>
        </div>

        {/* Card B: Performance Summary */}
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column' }}>
          <Horizontal style={{ alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <DashboardOutlined style={{ fontSize: '18px', color: '#8c8c8c' }} />
            <Texto category="h5" weight="600">Performance Summary</Texto>
          </Horizontal>

          <Vertical style={{ gap: '20px' }}>
            {/* Progress Bar */}
            <div>
              <Horizontal style={{ justifyContent: 'space-between', marginBottom: '8px' }}>
                <Texto category="p2" appearance="medium">Volume Fulfillment</Texto>
                <Texto category="p2" weight="600">{CONTRACT_DATA.volumeFulfillment}%</Texto>
              </Horizontal>
              <div style={{ width: '100%', height: '10px', backgroundColor: '#e8e8e8', borderRadius: '5px' }}>
                <div
                  style={{
                    width: `${CONTRACT_DATA.volumeFulfillment}%`,
                    height: '100%',
                    backgroundColor: '#52c41a',
                    borderRadius: '5px',
                  }}
                />
              </div>
              <Texto category="p2" appearance="medium" style={{ marginTop: '4px' }}>
                {CONTRACT_DATA.currentVolume.toLocaleString()} / {CONTRACT_DATA.totalVolume.toLocaleString()} units
              </Texto>
            </div>

            {/* Status Badges */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <Texto
                  category="p2"
                  appearance="medium"
                  style={{ textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'block' }}
                >
                  Risk Level
                </Texto>
                <BBDTag error style={{ fontSize: '12px', padding: '2px 8px' }}>{CONTRACT_DATA.riskLevel}</BBDTag>
              </div>
              <div>
                <Texto
                  category="p2"
                  appearance="medium"
                  style={{ textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'block' }}
                >
                  Status
                </Texto>
                <BBDTag success style={{ fontSize: '12px', padding: '2px 8px' }}>{CONTRACT_DATA.status}</BBDTag>
              </div>
            </div>
          </Vertical>
        </div>
      </div>
    </Vertical>
  );
}

export default ContractDetailsSection;
