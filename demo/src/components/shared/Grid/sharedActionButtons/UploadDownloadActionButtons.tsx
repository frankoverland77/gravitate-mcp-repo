import { CloudUploadOutlined, DownloadOutlined, LoadingOutlined } from '@ant-design/icons'
import { UploadResponseData } from '@components/shared/Uploaders/UploadStatusModal/components/types'
import { handleUploadResponse } from '@components/shared/Uploaders/UploadStatusModal/components/uploadStatus'
import { UploadStatusModal } from '@components/shared/Uploaders/UploadStatusModal/UploadStatusModal'
import { GraviButton, Horizontal, NotificationMessage } from '@gravitate-js/excalibrr'
import { useRef, useState } from 'react'

export interface UploadDownloadActionButtonsProps {
  canWrite?: boolean
  downloadEP: () => Promise<any>
  fileName: string
  uploadEP: (formData: FormData) => Promise<any>
  submitUploadData: (data: any) => void
  normalizeFunction?: any
  refreshCallback?: () => void
  getDisplayErrors: (statusResponse: UploadResponseData) => { RowNumber: number; Id: string; Errors: string[] }[]
}

export function UploadDownloadActionButtons({
  canWrite,
  downloadEP,
  fileName,
  uploadEP,
  submitUploadData,
  getDisplayErrors,
}: UploadDownloadActionButtonsProps) {
  const hiddenFileInput = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadStatusModalVisible, setUploadStatusModalVisible] = useState(false)
  const [statusResponse, setStatusResponse] = useState()
  const [canSubmit, setCanSubmit] = useState(false)

  const handleClick = (input: React.RefObject<HTMLInputElement>) => {
    input.current?.click()
  }

  const handleExport = () => {
    setIsLoading(true)
    downloadEP()
      .then((resp) => {
        const url = window.URL.createObjectURL(new Blob([resp]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length !== 0) {
      setIsLoading(true)
      setUploadStatusModalVisible(true)
      const newFile = event.target.files[0]
      const formData = new FormData()
      formData.append('file', newFile)
      try {
        const response = await uploadEP(formData)
        if (response && response.Data) {
          const hasValidations = response.Data?.[0]?.ValidationMessages?.length > 0 || response.Validations?.length > 0
          if (!hasValidations) {
            NotificationMessage('File Processed', 'Your file has been processed', false)
            setStatusResponse(response.Data)
            setCanSubmit(true)
          } else {
            handleUploadResponse?.({
              response,
              setIsUploading: setIsLoading,
              setStatusResponse,
              setUploadStatusModalVisible,
              setCanSubmit,
            })
          }
        }
      } catch (error) {
        NotificationMessage('Error', 'Failed to upload file', true)
        console.error('Upload error:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <Horizontal>
      <GraviButton
        icon={isLoading ? <LoadingOutlined /> : <DownloadOutlined />}
        buttonText='Download Template'
        onClick={handleExport}
        appearance='outline'
      />

      {canWrite && (
        <GraviButton
          icon={<CloudUploadOutlined />}
          buttonText='Upload File'
          onClick={() => handleClick(hiddenFileInput)}
          appearance='outline'
        />
      )}
      <input type='file' onChange={handleUpload} ref={hiddenFileInput} style={{ display: 'none' }} />
      <UploadStatusModal
        uploadStatusModalVisible={uploadStatusModalVisible}
        setUploadStatusModalVisible={setUploadStatusModalVisible}
        statusResponse={statusResponse}
        isUploading={isLoading}
        submitUploadData={submitUploadData}
        canSubmit={canSubmit}
        setCanSubmit={setCanSubmit}
        getDisplayErrors={getDisplayErrors}
      />
    </Horizontal>
  )
}
