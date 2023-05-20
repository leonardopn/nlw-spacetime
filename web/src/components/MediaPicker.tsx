'use client'

import { ChangeEvent, useState } from 'react'

export function MediaPicker() {
  const [preview, setPreview] = useState<string | null>(null)

  function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target

    if (files && files.length > 0) {
      const previewURL = URL.createObjectURL(files[0])
      setPreview(previewURL)
    }
  }

  return (
    <>
      <input
        type="file"
        id="media"
        name="coverUrl"
        className="invisible h-0 w-0"
        accept="image/*"
        onChange={onFileSelected}
      />
      {preview && (
        // eslint-disable-next-line
        <img
          src={preview}
          alt="preview"
          className="aspect-video w-full rounded-lg object-cover"
        />
      )}
    </>
  )
}
