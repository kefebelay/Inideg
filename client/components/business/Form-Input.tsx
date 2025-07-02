import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  required,
}) => {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id} className="text-[--color-foreground]">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="bg-[--color-input] text-[--color-foreground] border-[--color-border] focus:ring-[--color-ring] rounded-[--radius-md]"
      />
    </div>
  );
};
