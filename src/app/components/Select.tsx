import { useId } from "react";

type SelectProps = {
  label: string;
  formKey: string;
  options: {
    id: string | number;
    label: string;
  }[];
};

export default function Select(props: SelectProps) {
  const { label, formKey, options } = props;
  const id = useId();

  return (
    <div className="my-[0.5em]">
      <label htmlFor={id}>{label}</label>
      <br />
      <select id={id} name={formKey}>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
