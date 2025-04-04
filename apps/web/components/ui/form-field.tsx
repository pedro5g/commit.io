import { AlertCircle } from "lucide-react"
import { Input } from "./input"
import { Label } from "./label"

interface FormFieldProps extends React.ComponentProps<"input"> {
  id: string
  name: string
  label: string
  defaultValue: string
  error: boolean
  errors?: string[]
}

export const FormField = ({
  id,
  name,
  label,
  defaultValue,
  error,
  errors = [],
  ...props
}: FormFieldProps) => {
  return (
    <>
      <div className="flex items-center">
        <Label htmlFor={id}>{label}</Label>
      </div>
      <Input
        {...props}
        data-error={error}
        className="data-[error='true']:border-red-500 data-[error='true']:text-red-500 data-[error='true']:focus-visible:ring-red-400"
        id={id}
        name={name}
        defaultValue={defaultValue}
        required
      />
      <div id="name-error" aria-live="polite" aria-atomic="true">
        {error &&
          errors.length &&
          errors.map((error) => (
            <p
              className="mt-2 inline-flex gap-2 text-xs text-red-500"
              key={error}
            >
              <AlertCircle className=" size-4" /> {error}
            </p>
          ))}
      </div>
    </>
  )
}
