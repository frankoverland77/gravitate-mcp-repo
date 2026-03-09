/**
 * Upload Step
 *
 * Step 2 of the Edit Bids wizard
 * Handles file upload and initial parsing
 */

import { useState, useCallback } from 'react';
import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr';
import { UploadOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Upload, Alert, Spin } from 'antd';
import type { UploadProps } from 'antd';
import type { ParseResult, ParsedDetailRow } from '../../utils/excelImport';
import { parseExcelUpload } from '../../utils/excelImport';
import styles from './EditBidsDrawer.module.css';

/**
 * Generate simulated parse result for demo purposes
 * Creates 27 bid records (3 suppliers × 3 products × 3 locations)
 * with realistic price adjustments
 */
function generateSimulatedParseResult(): ParseResult {
  const details: ParsedDetailRow[] = [];

  const suppliers = [
    { id: 'supplier-marathon', name: 'Marathon', priceAdj: -0.02 },
    { id: 'supplier-p66', name: 'P66', priceAdj: -0.03 },
    { id: 'supplier-shell', name: 'Shell', priceAdj: 0.01 },
  ];

  const products = ['87 Octane', '93 Octane', 'Diesel'];
  const locations = ['Dallas', 'Beaumont', 'Houston'];

  const basePrices: Record<string, number> = {
    '87 Octane': 2.32,
    '93 Octane': 2.42,
    Diesel: 2.28,
  };

  let rowIndex = 2;
  for (const product of products) {
    for (const location of locations) {
      for (const supplier of suppliers) {
        const basePrice = basePrices[product];
        const newPrice = basePrice + supplier.priceAdj;

        details.push({
          detailId: `detail-${product.toLowerCase().replace(' ', '-')}-${location.toLowerCase()}`,
          product,
          location,
          supplierId: supplier.id,
          supplierName: supplier.name,
          provisionType: 'Fixed',
          fixedValue: Number(newPrice.toFixed(2)),
          formulaId: null,
          rowIndex: rowIndex++,
        });
      }
    }
  }

  return {
    success: true,
    details,
    formulas: new Map(),
    errors: [],
  };
}

interface UploadStepProps {
  onParsed: (result: ParseResult) => void;
  onBack: () => void;
}

type UploadStatus = 'idle' | 'parsing' | 'success' | 'error';

export function UploadStep({ onParsed, onBack }: UploadStepProps) {
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [fileName, setFileName] = useState<string | null>(null);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (file: File) => {
    setStatus('parsing');
    setFileName(file.name);
    setErrorMessage(null);

    try {
      const result = await parseExcelUpload(file);
      setParseResult(result);

      if (result.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(`Found ${result.errors.length} error(s) in the file`);
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to parse file');
    }

    return false; // Prevent default upload
  }, []);

  const uploadProps: UploadProps = {
    accept: '.xlsx,.xls',
    maxCount: 1,
    showUploadList: false,
    beforeUpload: handleFileUpload,
  };

  const handleContinue = () => {
    if (parseResult) {
      onParsed(parseResult);
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setFileName(null);
    setParseResult(null);
    setErrorMessage(null);
  };

  const handleSimulateUpload = useCallback(() => {
    setStatus('parsing');
    setFileName('simulated_bid_changes.xlsx');
    setErrorMessage(null);

    // Brief delay for UX feedback
    setTimeout(() => {
      const result = generateSimulatedParseResult();
      setParseResult(result);
      setStatus('success');
    }, 800);
  }, []);

  return (
    <Vertical className={styles.stepContent}>
      <Texto category="h4" weight="600" className="mb-2">
        Step 2: Upload Modified File
      </Texto>

      <Texto category="p1" appearance="medium" className="mb-4">
        Upload the Excel file after making your edits. The system will validate the structure and
        identify changes.
      </Texto>

      {status === 'idle' && (
        <>
          <Upload.Dragger {...uploadProps} className={styles.uploadArea}>
            <Vertical alignItems="center" gap={12} style={{ padding: '24px' }}>
              <UploadOutlined style={{ fontSize: '48px', color: 'var(--theme-color-2)' }} />
              <Texto category="p1">Drag Excel file here or click to browse</Texto>
              <Texto category="p2" appearance="medium">
                Accepts .xlsx files only
              </Texto>
            </Vertical>
          </Upload.Dragger>

          <Horizontal justifyContent="center" className="mt-4">
            <Texto category="p2" appearance="medium">
              — or —
            </Texto>
          </Horizontal>

          <Horizontal justifyContent="center" className="mt-2">
            <GraviButton
              buttonText="Simulate Upload (Demo)"
              appearance="outlined"
              onClick={handleSimulateUpload}
            />
          </Horizontal>
        </>
      )}

      {status === 'parsing' && (
        <div className={styles.uploadStatus}>
          <Spin size="large" />
          <Texto category="p1" className="mt-2">
            Parsing {fileName}...
          </Texto>
        </div>
      )}

      {status === 'success' && parseResult && (
        <Vertical className={styles.uploadSuccess}>
          <Horizontal gap={12} alignItems="center" className="mb-3">
            <CheckCircleOutlined
              style={{ fontSize: '24px', color: 'var(--theme-success-color)' }}
            />
            <Vertical>
              <Texto category="p1" weight="600">
                File parsed successfully
              </Texto>
              <Texto category="p2" appearance="medium">
                {fileName}
              </Texto>
            </Vertical>
          </Horizontal>

          <Alert
            type="success"
            message="Parse Summary"
            description={
              <Vertical gap={4}>
                <Texto category="p2">
                  <strong>{parseResult.details.length}</strong> bid records found
                </Texto>
                <Texto category="p2">
                  <strong>{parseResult.formulas.size}</strong> formula definitions found
                </Texto>
              </Vertical>
            }
            className="mb-3"
          />

          <Horizontal gap={12}>
            <GraviButton
              buttonText="Choose Different File"
              appearance="outlined"
              onClick={handleReset}
            />
            <GraviButton buttonText="Continue to Validation" success onClick={handleContinue} />
          </Horizontal>
        </Vertical>
      )}

      {status === 'error' && (
        <Vertical className={styles.uploadError}>
          <Horizontal gap={12} alignItems="center" className="mb-3">
            <CloseCircleOutlined style={{ fontSize: '24px', color: 'var(--theme-error-color)' }} />
            <Vertical>
              <Texto category="p1" weight="600">
                Parse errors found
              </Texto>
              <Texto category="p2" appearance="medium">
                {fileName}
              </Texto>
            </Vertical>
          </Horizontal>

          <Alert
            type="error"
            message={errorMessage || 'Unknown error'}
            description={
              parseResult?.errors && parseResult.errors.length > 0 ? (
                <Vertical gap={4} style={{ maxHeight: '200px', overflow: 'auto' }}>
                  {parseResult.errors.slice(0, 10).map((err, idx) => (
                    <Texto key={idx} category="p2">
                      Row {err.row}: {err.message}
                    </Texto>
                  ))}
                  {parseResult.errors.length > 10 && (
                    <Texto category="p2" appearance="medium">
                      ...and {parseResult.errors.length - 10} more errors
                    </Texto>
                  )}
                </Vertical>
              ) : undefined
            }
            className="mb-3"
          />

          <Horizontal gap={12}>
            <GraviButton
              buttonText="Try Different File"
              appearance="outlined"
              onClick={handleReset}
            />
            {parseResult && parseResult.details.length > 0 && (
              <GraviButton
                buttonText="Continue Anyway"
                appearance="warning"
                onClick={handleContinue}
              />
            )}
          </Horizontal>
        </Vertical>
      )}

      <Horizontal justifyContent="flex-start" className="mt-4">
        <GraviButton buttonText="Back to Download" type="text" onClick={onBack} />
      </Horizontal>
    </Vertical>
  );
}
