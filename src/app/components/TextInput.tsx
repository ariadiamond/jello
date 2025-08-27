import { useId } from "react";

type Input_t = {
  formKey: string;
  label: string;
  type: string;
  nullable?: boolean;
};

export default function TextInput(props: Input_t) {
  const { formKey, label, nullable = false, type } = props;
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <br />
      <input id={id} required={!nullable} name={formKey} type={type} />
    </div>
  );
}
