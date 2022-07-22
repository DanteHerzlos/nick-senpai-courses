import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { message, Upload } from 'antd'
import type { UploadChangeParam } from 'antd/es/upload'
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface'
import { UploadRequestOption } from 'rc-upload/lib/interface'
import React, { useEffect, useState } from 'react'

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result as string))
  reader.readAsDataURL(img)
}

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!')
  }
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    message.error('Image must smaller than 5MB!')
  }
  return isJpgOrPng && isLt5M
}

interface ImgInputProps {
  setFile: (file: string | RcFile | Blob) => void
  imgSrcUrl?: string
 }

const ImgInput: React.FC<ImgInputProps> = ({setFile, imgSrcUrl}) => {
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>()

  useEffect(() => {
    if(imgSrcUrl) {
      setImageUrl(imgSrcUrl)
    }
  }, [imgSrcUrl])
  const dummyRequest = ({ file, onSuccess }: UploadRequestOption) => {
    setTimeout(() => {
      onSuccess("ok")
    }, 0)
    setFile(file)
  }

  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }
    if (info.file.status === 'done') {  
      getBase64(info.file.originFileObj as RcFile, url => {
        setLoading(false)
        setImageUrl(url)
      })
    }
  }

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  return (
    <Upload
      customRequest={dummyRequest}
      name="imgCover"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      {imageUrl ? <img src={imageUrl} alt="imgCover" style={{ width: '100%' }} /> : uploadButton}
    </Upload>
  )
}

export default ImgInput