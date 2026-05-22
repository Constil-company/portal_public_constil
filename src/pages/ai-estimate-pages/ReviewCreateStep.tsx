/* eslint-disable @typescript-eslint/no-explicit-any */
interface ReviewCreateStepProps {
  data: any
}

export function ReviewCreateStep({ data }: ReviewCreateStepProps) {
  return (
   <div>
      <h2 className="font-bold mb-4">Preview</h2>

      {data.previewUrl ? (
        <iframe
          src={data.previewUrl}
          className="w-full h-[500px] border rounded"
        />
      ) : (
        <p>No preview available</p>
      )}
    </div>
  )
}
